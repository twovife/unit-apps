<?php

namespace App\Helpers;

use App\Models\TransactionCustomer;
use App\Models\TransactionKoreksiBeku;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use App\Models\TransactionWhiteOff;
use App\Models\WorkDay;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Koreksi angsuran bertanggal SEBELUM migrasi kantor (data beku).
 *
 * Data sebelum `branches.mulai_pendataan_baru` dibekukan trigger tanpa
 * pengecualian. Kesalahan lama yang baru ketahuan sesudah migrasi (angsuran
 * tercatat ke nasabah yang salah, angsuran ditambah sesudah bucket ditutup)
 * dibetulkan di sini - superuser saja, alasan wajib, dan:
 *
 *   1. trigger beku dibuka lewat `@koreksi_beku = 1` hanya selama satu aksi
 *      (migrasi app_laravel 2026_10_11_100000);
 *   2. baris bulanan dihitung ulang dari bulan migrasi s/d bulan depan,
 *      TERMASUK saldo awal yang sudah diserahterimakan (keputusan mas
 *      2026-10-11, opsi a) - baris yang sudah diteken ditulis ulang dengan
 *      jejak di riwayat kunci;
 *   3. satu baris log di transaction_koreksi_beku: sebelum/sesudah angsuran
 *      dan dampak ke saldo awal/akhir per ember per bulan;
 *   4. opsional ($ikutBucket): bucket serah terima bulan migrasi ikut digeser
 *      (geserBucket), jejaknya kolom bucket_* di dampak.
 *
 * Pratinjau ($simpan = false) menjalankan koreksi yang sama persis lalu
 * rollback - angka dampaknya pasti sama dengan hasil sesudah disimpan.
 */
class KoreksiBeku
{
    // hapus_pemutihan: pemutihan sebelum migrasi yang ternyata salah (nasabah tidak
    // meninggal / masih bayar), mas 2026-10-28.
    // tambah_pinjaman: nasabah drop sebelum migrasi yang belum terinput (fastcreate
    // ditolak trigger beku), mas 2026-10-28.
    public const AKSI = ['ubah', 'hapus', 'tambah', 'hapus_pemutihan', 'tambah_pinjaman'];

    private const KOLOM = [
        'awal_month1', 'awal_month2', 'awal_ccm', 'awal_cm', 'awal_mb', 'awal_ml',
        'awal_total', 'akhir_total',
    ];

    /**
     * @param array $data ubah: angsuran_id, nominal | hapus: angsuran_id |
     *                    tambah: loan_id, tanggal, nominal | hapus_pemutihan: pemutihan_id |
     *                    tambah_pinjaman: grouping_id, tanggal (drop), nominal, nik, nama, alamat, nomor_anggota
     * @return array{dampak:array, log_id:?int}
     * @throws \RuntimeException pesan untuk ditampilkan ke user
     */
    public static function jalankan(string $aksi, array $data, string $alasan, bool $simpan = true, bool $ikutBucket = false): array
    {
        $user = auth()->user();
        if (!$user?->hasRole('superuser')) {
            throw new \RuntimeException('Koreksi data beku hanya untuk superuser.');
        }
        if (!in_array($aksi, self::AKSI, true)) {
            throw new \RuntimeException('Aksi tidak dikenal.');
        }
        // Alasan boleh kosong (mas 2026-10-23): diisi bawaan.
        $alasan = trim($alasan) ?: 'selisih penyesuaian';

        $angsuran = in_array($aksi, ['ubah', 'hapus'], true)
            ? TransactionLoanInstalment::findOrFail($data['angsuran_id'] ?? 0)
            : null;
        $pemutihan = $aksi === 'hapus_pemutihan' ? TransactionWhiteOff::findOrFail($data['pemutihan_id'] ?? 0) : null;
        $baru = $aksi === 'tambah_pinjaman';
        $loan = $baru ? null : ($angsuran ? $angsuran->loan
            : ($pemutihan ? TransactionLoan::findOrFail($pemutihan->transaction_loan_id) : TransactionLoan::findOrFail($data['loan_id'] ?? 0)));
        $grouping = TransactionLoanOfficerGrouping::findOrFail($baru ? ($data['grouping_id'] ?? 0) : $loan->transaction_loan_officer_grouping_id);
        $branchId = (int) $grouping->branch_id;
        $mulai = AgregasiScope::tanggalMulai($branchId);

        if (!$mulai) {
            throw new \RuntimeException('Kantor ini belum migrasi - datanya tidak beku, ubah lewat menu biasa.');
        }

        $tanggal = Carbon::parse(($angsuran ?? $pemutihan)?->transaction_date ?? ($data['tanggal'] ?? ''));
        if (!$tanggal->lt($mulai)) {
            throw new \RuntimeException('Hanya data bertanggal sebelum migrasi (' . $mulai->toDateString() . '). Sesudahnya ubah lewat menu biasa.');
        }
        if ($angsuran?->settled_by_loan_id) {
            throw new \RuntimeException('Angsuran ini pelunasan otomatis topup - tidak bisa dikoreksi di sini.');
        }

        $nominal = null;
        if (in_array($aksi, ['ubah', 'tambah', 'tambah_pinjaman'], true)) {
            $nominal = (int) ($data['nominal'] ?? -1);
            if ($nominal < ['ubah' => 0, 'tambah' => 1, 'tambah_pinjaman' => 100000][$aksi]) {
                throw new \RuntimeException($baru ? 'Nominal pinjaman minimal 100.000.' : 'Nominal tidak valid.');
            }
        }
        if ($baru) {
            self::cekPinjamanBaru($data, $tanggal);
        }
        if ($aksi === 'tambah' && $tanggal->lt(Carbon::parse($loan->drop_date)->startOfDay())) {
            throw new \RuntimeException('Tanggal angsuran sebelum tanggal drop pinjaman.');
        }

        // Hanya kelompok pinjaman ini (mas 2026-10-24): kelompok lain tidak berubah oleh koreksi.
        $ids = [(int) $grouping->id];
        $bulan = [];
        for ($b = $mulai->copy()->startOfMonth(); $b->lte(Carbon::now()->startOfMonth()->addMonthNoOverflow()); $b->addMonthNoOverflow()) {
            $bulan[] = $b->copy();
        }

        DB::beginTransaction();
        try {
            $potretAwal = self::potret($ids, $bulan);
            $sebelum = $angsuran ? self::isi($angsuran) : ($pemutihan ? self::isiPemutihan($pemutihan, $loan) : null);
            // Dampak = hitungan SESUDAH - SEBELUM koreksi, keduanya dari data sekarang.
            // Angka tersimpan yang belum mengikuti data (hari belum dikunci) tidak ikut
            // terbawa: yang ditulis hanya selisih akibat koreksi (mas 2026-10-24).
            $hitungSemua = fn() => array_map(fn($b) => TutupBulanan::hitung($ids, $b), $bulan);
            $hitungSebelum = $hitungSemua();

            DB::statement('SET @koreksi_beku = 1');
            try {
                if ($baru) {
                    $loan = self::buatPinjaman($data, $grouping, $tanggal, $nominal, $user);
                    $sesudah = self::isiPinjaman($loan);
                } else {
                    $sesudah = $pemutihan
                        ? self::hapusPemutihan($pemutihan, $loan)
                        : self::kerjakan($aksi, $angsuran, $loan, $tanggal, $nominal, $user);
                }
            } finally {
                DB::statement('SET @koreksi_beku = NULL');
            }

            $hitungSesudah = $hitungSemua();
            $perbarui = [
                'employee_id' => $user->employee?->id,
                'sumber' => 'koreksi data beku (' . $aksi . '): ' . trim($alasan),
            ];
            foreach ($bulan as $i => $b) {
                foreach (array_unique(array_merge(array_keys($hitungSebelum[$i]), array_keys($hitungSesudah[$i]))) as $k) {
                    $selisih = [];
                    foreach (array_diff_key($hitungSesudah[$i][$k] ?? $hitungSebelum[$i][$k], ['hari_kerja' => 0, 'hari_terkunci' => 0]) as $kolom => $_) {
                        $d = ($hitungSesudah[$i][$k][$kolom] ?? 0) - ($hitungSebelum[$i][$k][$kolom] ?? 0);
                        if ($d !== 0) {
                            $selisih[$kolom] = $d;
                        }
                    }
                    if (!$selisih) {
                        continue;
                    }
                    [$g, $hari] = explode('|', $k);
                    $baris = TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $g)
                        ->where('hari', $hari)->whereDate('periode', $b->toDateString())->first();
                    if ($baris) {
                        TutupBulanan::tambahkan($baris, $selisih, $perbarui);
                    } else {
                        TransactionMonthlyClosing::create(array_merge($hitungSesudah[$i][$k], [
                            'transaction_loan_officer_grouping_id' => $g, 'hari' => $hari, 'periode' => $b->toDateString(),
                        ]));
                    }
                }
            }

            $dampak = self::selisih($potretAwal, self::potret($ids, $bulan));
            if ($ikutBucket) {
                array_push($dampak, ...self::geserBucket($mulai->copy()->startOfMonth(), $hitungSebelum[0], $hitungSesudah[0]));
            }
            $logId = null;

            if ($simpan) {
                $logId = TransactionKoreksiBeku::create([
                    'branch_id' => $branchId,
                    'transaction_loan_id' => $loan->id,
                    'transaction_loan_instalment_id' => $angsuran?->id ?? ($baru ? null : ($sesudah['id'] ?? null)),
                    'aksi' => $aksi,
                    'sebelum' => $sebelum,
                    'sesudah' => in_array($aksi, ['hapus', 'hapus_pemutihan'], true) ? null : $sesudah,
                    'dampak' => $dampak,
                    'alasan' => trim($alasan),
                    'user_id' => $user->id,
                ])->id;
                DB::commit();
            } else {
                DB::rollBack();
            }
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        return ['dampak' => $dampak, 'log_id' => $logId, 'sesudah' => $sesudah];
    }

    private static function kerjakan(string $aksi, ?TransactionLoanInstalment $angsuran, TransactionLoan $loan, Carbon $tanggal, ?int $nominal, $user): ?array
    {
        switch ($aksi) {
            case 'ubah':
                $angsuran->update(['nominal' => $nominal]);
                $loan->hitungUlangPelunasan();
                return self::isi($angsuran->fresh());

            case 'hapus':
                $angsuran->delete();
                return null;

            case 'tambah':
                $baru = TransactionLoanInstalment::create([
                    'transaction_loan_id' => $loan->id,
                    'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
                    'transaction_date' => $tanggal->toDateString(),
                    'nominal' => $nominal,
                    'status' => AppHelper::generateStatusAngsuran($loan->drop_date, $tanggal->toDateString()),
                    'danatitipan' => 0,
                    'is_transfer' => false,
                    'user_input' => $user->employee?->id,
                    'user_mantri' => $loan->user_mantri,
                ]);
                return self::isi($baru);
        }

        return null;
    }

    /**
     * Bucket serah terima (transaction_sirculations bulan migrasi) ikut digeser sebesar
     * dampak koreksi ke saldo awal bulan migrasi (mas 2026-10-27): koreksi yang membetulkan
     * kenyataan tidak muncul sebagai selisih di Cek Selisih Migrasi. Bucket tanpa baris
     * tunggal dilewati. Angka sebelum/sesudah masuk dampak (log koreksi) sebagai jejak.
     */
    private static function geserBucket(Carbon $periode, array $sebelum, array $sesudah): array
    {
        $hasil = [];
        foreach (array_unique(array_merge(array_keys($sebelum), array_keys($sesudah))) as $k) {
            $d = fn(string $e) => ($sesudah[$k]['awal_' . $e] ?? 0) - ($sebelum[$k]['awal_' . $e] ?? 0);
            $geser = [
                'amount' => array_sum(array_map($d, Ember::SEMUA)),
                'cm_amount' => $d('cm'), 'mb_amount' => $d('mb'), 'ml_amount' => $d('ml'),
            ];
            if (!array_filter($geser)) {
                continue;
            }
            [$g, $hari] = explode('|', $k);
            $rows = DB::table('transaction_sirculations')->where('transaction_loan_officer_grouping_id', $g)
                ->whereDate('date', $periode->toDateString())->whereRaw('LOWER(TRIM(day)) = ?', [$hari])->get();
            if ($rows->count() !== 1) {
                continue;
            }
            $r = $rows->first();
            $kolom = $isi = [];
            foreach ($geser as $c => $n) {
                if ($n !== 0) {
                    $isi[$c] = (int) $r->$c + $n;
                    $kolom['bucket_' . $c] = [(int) $r->$c, $isi[$c]];
                }
            }
            DB::table('transaction_sirculations')->where('id', $r->id)->update($isi + ['updated_at' => now()]);
            $hasil[] = [
                'periode' => $periode->format('Y-m'),
                'kelompok' => (string) DB::table('transaction_loan_officer_groupings')->where('id', $g)->value('kelompok'),
                'hari' => $hari, 'kolom' => $kolom,
            ];
        }

        return $hasil;
    }

    /** Syarat pinjaman baru sebelum migrasi: NIK, nama (nasabah baru), hari kerja, hari tagih filter. */
    private static function cekPinjamanBaru(array $data, Carbon $tanggal): void
    {
        if (!preg_match('/^\d{16}$/', (string) ($data['nik'] ?? ''))) {
            throw new \RuntimeException('NIK harus 16 digit angka.');
        }
        if (!TransactionCustomer::where('nik', $data['nik'])->exists() && (!trim($data['nama'] ?? '') || !trim($data['alamat'] ?? ''))) {
            throw new \RuntimeException('NIK belum terdaftar: nama dan alamat wajib diisi.');
        }
        if (!WorkDay::hariKerja($tanggal)) {
            throw new \RuntimeException('Tanggal drop jatuh di hari libur.');
        }
        if (!empty($data['hari']) && AppHelper::dateName($tanggal) !== $data['hari']) {
            throw new \RuntimeException('Tanggal drop harus hari ' . $data['hari'] . '.');
        }
    }

    /** Pinjaman drop langsung status success, isian sama dengan fastcreate (store_buku_transaksi_batch). */
    private static function buatPinjaman(array $data, TransactionLoanOfficerGrouping $grouping, Carbon $tanggal, int $nominal, $user): TransactionLoan
    {
        $customer = TransactionCustomer::firstOrCreate(['nik' => $data['nik']], ['nama' => trim($data['nama'] ?? ''), 'alamat' => trim($data['alamat'] ?? '')]);
        $manage = $customer->manage_customer()->firstOrCreate(['transaction_loan_officer_grouping_id' => $grouping->id, 'day' => $tanggal->dayOfWeek]);
        if (!empty($data['nomor_anggota'])) {
            $manage->update(['nomor_anggota' => $data['nomor_anggota']]);
        }
        $mantri = AppHelper::getMantri($grouping);

        return $manage->loan()->create([
            'transaction_loan_officer_grouping_id' => $grouping->id,
            'request_date' => $tanggal->toDateString(),
            'drop_date' => $tanggal->toDateString(),
            'hari' => AppHelper::dateName($tanggal),
            'status' => 'success',
            'user_input' => $user->employee?->id,
            'user_mantri' => $mantri,
            'user_drop' => $mantri,
            'drop_before' => 0,
            'nominal_drop' => $nominal,
        ]);
    }

    private static function isiPinjaman(TransactionLoan $loan): array
    {
        return [
            'transaction_loan_id' => $loan->id,
            'nasabah' => $loan->customer?->nama,
            'nik' => $loan->customer?->nik,
            'drop_date' => Carbon::parse($loan->drop_date)->toDateString(),
            'tanggal' => Carbon::parse($loan->drop_date)->toDateString(),
            'nominal' => (int) $loan->nominal_drop,
            'jenis' => 'pinjaman',
        ];
    }

    /** Hapus satu pemutihan; status lunas / keluar pinjaman dihitung ulang dari saldonya. */
    private static function hapusPemutihan(TransactionWhiteOff $pemutihan, TransactionLoan $loan): ?array
    {
        $pemutihan->delete();
        $loan->refresh()->hitungUlangPelunasan();

        return null;
    }

    private static function isiPemutihan(TransactionWhiteOff $w, TransactionLoan $loan): array
    {
        return [
            'pemutihan_id' => $w->id,
            'transaction_loan_id' => $loan->id,
            'nasabah' => $loan->customer?->nama,
            'drop_date' => Carbon::parse($loan->drop_date)->toDateString(),
            'tanggal' => Carbon::parse($w->transaction_date)->toDateString(),
            'nominal' => (int) $w->nominal,
            'jenis' => 'pemutihan',
        ];
    }

    /** Keadaan satu angsuran untuk log. */
    private static function isi(TransactionLoanInstalment $a): array
    {
        $loan = TransactionLoan::with('customer')->find($a->transaction_loan_id);

        return [
            'id' => $a->id,
            'transaction_loan_id' => $a->transaction_loan_id,
            'nasabah' => $loan?->customer?->nama,
            'drop_date' => $loan ? Carbon::parse($loan->drop_date)->toDateString() : null,
            'tanggal' => Carbon::parse($a->transaction_date)->toDateString(),
            'nominal' => (int) $a->nominal,
        ];
    }

    /** Saldo awal per ember + akhir total, per "Y-m|kelompok|hari". */
    private static function potret(array $ids, array $bulan): array
    {
        return TransactionMonthlyClosing::with('loan_officer_grouping:id,kelompok')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereIn('periode', array_map(fn($b) => $b->toDateString(), $bulan))
            ->get()
            ->mapWithKeys(fn($r) => [
                Carbon::parse($r->periode)->format('Y-m') . '|' . $r->loan_officer_grouping?->kelompok . '|' . $r->hari
                    => collect(self::KOLOM)->mapWithKeys(fn($k) => [$k => (int) $r->$k])->all(),
            ])->all();
    }

    /** Hanya baris & kolom yang berubah: [{periode, kelompok, hari, kolom: {k: [sebelum, sesudah]}}]. */
    private static function selisih(array $sebelum, array $sesudah): array
    {
        $hasil = [];
        foreach (array_unique(array_merge(array_keys($sebelum), array_keys($sesudah))) as $k) {
            $kolom = [];
            foreach (self::KOLOM as $c) {
                $a = $sebelum[$k][$c] ?? 0;
                $b = $sesudah[$k][$c] ?? 0;
                if ($a !== $b) {
                    $kolom[$c] = [$a, $b];
                }
            }
            if ($kolom) {
                [$periode, $kelompok, $hari] = explode('|', $k);
                $hasil[] = compact('periode', 'kelompok', 'hari', 'kolom');
            }
        }
        usort($hasil, fn($x, $y) => [$x['periode'], (int) $x['kelompok'], $x['hari']] <=> [$y['periode'], (int) $y['kelompok'], $y['hari']]);

        return $hasil;
    }
}
