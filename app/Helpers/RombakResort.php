<?php

namespace App\Helpers;

use App\Http\Controllers\MigrasiController;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoan;
use App\Models\TransactionResortRombak;
use App\Models\TransactionSaldoAdjustment;
use App\Models\WorkDay;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Rombak resort — layanan di atas draf peta (resort asal -> resort tujuan).
 *
 * periksa()   galat yang memblokir terapkan.
 * pratinjau() hanya baca: apa yang akan terjadi kalau draf diterapkan.
 * Fungsi pembentuk rencana (pinjaman, rekening, macetLama, hariDibuka, target)
 * dipakai pratinjau DAN terapkan, supaya pratinjau = yang benar-benar terjadi.
 *
 * Semua perpindahan dihitung dari susunan SEBELUM rombak (K4): kolom pinjaman
 * sekarang, karena berlaku_bulan = bulan berjalan.
 * Rancangan: .agents/rombak_resort.md §3, §6, §7.
 */
class RombakResort
{
    public const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    /** Carbon dayOfWeek (Senin = 1) — sama dengan kolom `day` rekening. */
    public static function nomorHari(string $hari): int
    {
        return array_search($hari, self::HARI, true) + 1;
    }

    private static function idKelompok(int $branchId): array
    {
        return DB::table('transaction_loan_officer_groupings')->where('branch_id', $branchId)->pluck('id')->map(fn($i) => (int) $i)->all();
    }

    /**
     * Blok papan per resort asal: saldo & pecahan = saldo AWAL bulan M (akhir M-1,
     * ember relatif M, sama dengan Rekap M), nasabah/open/acc = kolom pinjaman.
     *
     * @return array<int,array<string,mixed>>
     */
    public static function blok(int $branchId, Carbon $bulan): array
    {
        $kelompok = DB::table('transaction_loan_officer_groupings')->where('branch_id', $branchId)->orderBy('kelompok')->pluck('kelompok', 'id');
        $gIds = $kelompok->keys()->all();
        $porto = HitungAgregat::portofolio($gIds, $bulan->copy()->subDay(), $bulan);

        $hitung = empty($gIds) ? collect() : DB::table('transaction_loans')
            ->whereIn('transaction_loan_officer_grouping_id', $gIds)
            ->whereIn(DB::raw('LOWER(hari)'), self::HARI)
            ->groupBy('transaction_loan_officer_grouping_id', DB::raw('LOWER(hari)'))
            ->get([
                'transaction_loan_officer_grouping_id AS g',
                DB::raw('LOWER(hari) AS hari'),
                DB::raw("SUM(status = 'success' AND pay_off_date IS NULL) AS nasabah"),
                DB::raw("SUM(status = 'open') AS open"),
                DB::raw("SUM(status = 'acc') AS acc"),
            ])
            ->keyBy(fn($r) => $r->g . '|' . $r->hari);

        $blok = [];
        foreach ($gIds as $g) {
            foreach (self::HARI as $h) {
                $k = "$g|$h";
                $e = $porto[$k] ?? [];
                $c = $hitung[$k] ?? null;
                $b = [
                    'grouping_id' => (int) $g,
                    'kelompok' => $kelompok[$g],
                    'hari' => $h,
                    'nasabah' => (int) ($c->nasabah ?? 0),
                    'saldo' => array_sum($e),
                    'open' => (int) ($c->open ?? 0),
                    'acc' => (int) ($c->acc ?? 0),
                ];
                foreach (Ember::KATEGORI as $kat => $ember) {
                    $b[$kat] = array_sum(array_intersect_key($e, array_flip($ember)));
                }
                if ($b['nasabah'] || $b['saldo'] || $b['open'] || $b['acc']) {
                    $blok[] = $b;
                }
            }
        }

        return $blok;
    }

    /**
     * Galat yang memblokir terapkan (kosong = boleh).
     *
     * @return string[]
     */
    public static function periksa(TransactionResortRombak $r): array
    {
        $galat = [];
        $M = $r->berlaku_bulan->copy()->startOfMonth();
        $gIds = self::idKelompok($r->branch_id);

        if ($r->status !== 'draf') {
            $galat[] = "Rombak #{$r->id} berstatus {$r->status}, bukan draf.";
        }
        if (!AgregasiScope::sudahMigrasi($r->branch_id)) {
            $galat[] = 'Kantor belum migrasi ke alur baru (K16).';
        }
        if (!$M->isSameMonth(Carbon::now())) {
            $galat[] = 'Bulan berlaku ' . $M->format('Y-m') . ' bukan bulan berjalan (' . Carbon::now()->format('Y-m') . ').';
        }
        if ($gIds && DB::table('transaction_monthly_closings')->whereIn('transaction_loan_officer_grouping_id', $gIds)
            ->whereDate('periode', $M->toDateString())->whereNotNull('kasir_lock_at')->exists()) {
            $galat[] = 'Bulan ' . $M->format('Y-m') . ' sudah ditutup (closing bulanan terkunci).';
        }
        $lain = TransactionResortRombak::where('branch_id', $r->branch_id)->whereDate('berlaku_bulan', $M->toDateString())
            ->where('status', 'diterapkan')->whereKeyNot($r->id)->value('id');
        if ($lain) {
            $galat[] = "Sudah ada rombak #$lain yang diterapkan untuk kantor & bulan ini.";
        }
        $peta = $r->peta;
        $stash = $peta->whereNull('ke_grouping_id')->count() + $peta->whereNotNull('ke_grouping_id')->whereNull('ke_hari')->count();
        if ($stash) {
            $galat[] = "Masih ada $stash blok di stash (belum punya resort tujuan).";
        }
        $asing = $peta->flatMap(fn($p) => [$p->dari_grouping_id, $p->ke_grouping_id])->filter()
            ->map(fn($i) => (int) $i)->unique()->diff($gIds);
        if ($asing->isNotEmpty()) {
            $galat[] = 'Kelompok bukan milik kantor ini: id ' . $asing->implode(', ') . '.';
        }
        $dobel = $peta->map(fn($p) => $p->dari_grouping_id . '|' . $p->dari_hari)->duplicates();
        if ($dobel->isNotEmpty()) {
            $galat[] = 'Resort asal muncul lebih dari sekali: ' . $dobel->unique()->implode(', ') . '.';
        }

        return $galat;
    }

    /** "g|hari" asal -> "g|hari" tujuan, hanya yang pindah (stash dilewati). */
    public static function peta(TransactionResortRombak $r): array
    {
        return $r->peta->whereNotNull('ke_grouping_id')->whereNotNull('ke_hari')
            ->mapWithKeys(fn($p) => [$p->dari_grouping_id . '|' . $p->dari_hari => $p->ke_grouping_id . '|' . $p->ke_hari])->all();
    }

    /**
     * Pinjaman kantor yang masih menghuni resort pada bulan M, dengan resort
     * sesudah rombak (`ke`): success yang belum lunas atau lunasnya di bulan M
     * (masih ada di saldo awal M -> blok papan), open, acc (K17). `pindah` =
     * resortnya berubah. Lunas sebelum M, gagal, tolak tidak ikut.
     */
    public static function pinjaman(TransactionResortRombak $r): Collection
    {
        $M = $r->berlaku_bulan->copy()->startOfMonth()->toDateString();
        $peta = self::peta($r);
        $gIds = self::idKelompok($r->branch_id);
        if (!$gIds) {
            return collect();
        }

        return DB::table('transaction_loans as l')
            ->leftJoin('transaction_manage_customers as m', 'm.id', '=', 'l.transaction_manage_customer_id')
            ->leftJoin('transaction_customers as c', 'c.id', '=', 'm.transaction_customer_id')
            ->whereIn('l.transaction_loan_officer_grouping_id', $gIds)
            ->whereIn(DB::raw('LOWER(l.hari)'), self::HARI)
            ->where(fn($q) => $q->whereIn('l.status', ['open', 'acc'])
                ->orWhere(fn($q) => $q->where('l.status', 'success')
                    ->where(fn($q) => $q->whereNull('l.pay_off_date')->orWhere('l.pay_off_date', '>=', $M))))
            ->orderBy('l.id')
            ->get([
                'l.id', 'l.status', 'l.transaction_loan_officer_grouping_id as g', DB::raw('LOWER(l.hari) as hari'),
                'l.drop_date', 'l.pay_off_date', 'l.out_date', 'l.nominal_drop', 'l.transaction_manage_customer_id as rekening_id',
                'm.transaction_customer_id as customer_id', 'c.nama',
                DB::raw("(c.nik = '" . MigrasiController::NIK_MACET_LAMA . "') as ml"),
            ])
            ->map(function ($l) use ($peta) {
                $l->asal = $l->g . '|' . $l->hari;
                $l->ke = $peta[$l->asal] ?? $l->asal;
                $l->pindah = $l->ke !== $l->asal;
                $l->ml = (bool) $l->ml;
                return $l;
            });
    }

    /**
     * Rencana rekening (transaction_manage_customers) pinjaman yang pindah:
     * ditimpa ke (kelompok, day) tujuan, kecuali BENTROK — nasabah sudah punya
     * rekening lain di tujuan itu sesudah rombak (rekening yang tetap, atau
     * rekening pindah ber-id lebih kecil ke tujuan yang sama), atau pinjaman
     * satu rekening menuju lebih dari satu tujuan. Rekening bentrok tidak diubah.
     *
     * @return array<int,array{id:int,nama:?string,dari:string,ke:string,ke_g:int,ke_day:int,bentrok:?string}>
     */
    public static function rekening(Collection $pinjaman): array
    {
        $pindah = $pinjaman->where('pindah', true)->whereNotNull('rekening_id')->groupBy('rekening_id');
        if ($pindah->isEmpty()) {
            return [];
        }
        $rek = DB::table('transaction_manage_customers')
            ->whereIn('transaction_customer_id', DB::table('transaction_manage_customers')->whereIn('id', $pindah->keys())->select('transaction_customer_id'))
            ->orderBy('id')->get(['id', 'transaction_customer_id as c', 'transaction_loan_officer_grouping_id as g', 'day']);

        // Kunci akhir tiap rekening nasabah terkait: yang pindah ke tujuan (kalau tunggal), lainnya tetap.
        $tujuan = $pindah->map(fn($ls) => $ls->pluck('ke')->unique()->values());
        $tetap = [];
        foreach ($rek as $x) {
            if (!isset($tujuan[$x->id])) {
                $tetap[$x->c . '|' . $x->g . '|' . $x->day] = $x->id;
            }
        }
        $hasil = [];
        $dipakai = [];
        foreach ($rek as $x) {
            if (!isset($tujuan[$x->id])) {
                continue;
            }
            [$g, $h] = explode('|', $tujuan[$x->id][0]);
            $day = self::nomorHari($h);
            $kunci = $x->c . '|' . $g . '|' . $day;
            $bentrok = match (true) {
                $tujuan[$x->id]->count() > 1 => 'pinjaman rekening ini menuju ' . $tujuan[$x->id]->count() . ' resort',
                isset($tetap[$kunci]) => 'nasabah sudah punya rekening #' . $tetap[$kunci] . ' di tujuan',
                isset($dipakai[$kunci]) => 'rekening #' . $dipakai[$kunci] . ' nasabah ini juga pindah ke tujuan yang sama',
                default => null,
            };
            if (!$bentrok) {
                $dipakai[$kunci] = $x->id;
            }
            if ($bentrok || (int) $x->g !== (int) $g || (int) $x->day !== $day) {
                $hasil[] = [
                    'id' => $x->id, 'nama' => $pindah[$x->id]->first()->nama, 'dari' => $x->g . '|' . $x->day,
                    'ke' => $tujuan[$x->id][0], 'ke_g' => (int) $g, 'ke_day' => $day, 'bentrok' => $bentrok,
                ];
            }
        }

        return $hasil;
    }

    /**
     * MACET LAMA aktif ganda di satu resort tujuan sesudah rombak: yang id
     * terkecil dipertahankan, saldo lainnya dilebur ke sana (keputusan mas
     * 2026-11-03). Hanya resort yang menerima blok.
     *
     * @return array<int,array{resort:string,pertahankan:array,lebur:array,saldo:int}>
     */
    public static function macetLama(TransactionResortRombak $r, Collection $pinjaman): array
    {
        $tujuan = array_flip(array_values(self::peta($r)));
        $ml = $pinjaman->filter(fn($l) => $l->ml && $l->status === 'success' && $l->pay_off_date === null && isset($tujuan[$l->ke]))
            ->groupBy('ke')->filter(fn($ls) => $ls->count() > 1);
        if ($ml->isEmpty()) {
            return [];
        }
        $saldo = PenyesuaianSaldo::saldoBanyak($ml->flatten()->pluck('id')->all());
        $baris = fn($l) => ['id' => $l->id, 'asal' => $l->asal, 'saldo' => (int) ($saldo[$l->id]['saldo'] ?? 0)];

        return $ml->map(function ($ls, $ke) use ($baris) {
            $ls = $ls->sortBy('id')->values();
            $lebur = $ls->slice(1)->map($baris)->values()->all();
            return ['resort' => $ke, 'pertahankan' => $baris($ls[0]), 'lebur' => $lebur, 'saldo' => array_sum(array_column($lebur, 'saldo'))];
        })->sortKeys()->values()->all();
    }

    /** Kelompok asal & tujuan (selain stash). */
    public static function kelompokTerkait(TransactionResortRombak $r): array
    {
        $g = [];
        foreach (self::peta($r) as $dari => $ke) {
            $g[] = (int) explode('|', $dari)[0];
            $g[] = (int) explode('|', $ke)[0];
        }

        return array_values(array_unique($g));
    }

    /** Hari bulan M s/d hari ini yang terkunci kasir di kelompok asal & tujuan. */
    public static function hariDibuka(TransactionResortRombak $r): Collection
    {
        $M = $r->berlaku_bulan->copy()->startOfMonth();

        return TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', self::kelompokTerkait($r))
            ->whereBetween('date', [$M->toDateString(), Carbon::today()->toDateString()])
            ->whereNotNull('kasir_lock_at')
            ->orderBy('date')->orderBy('transaction_loan_officer_grouping_id')
            ->get(['id', 'transaction_loan_officer_grouping_id', 'date']);
    }

    /** Hari tagih pertama bulan M untuk hari $hari, lompat libur. */
    public static function tanggalPertama(Carbon $M, string $hari): ?Carbon
    {
        $d = $M->copy()->startOfMonth();
        while ($d->dayOfWeek !== self::nomorHari($hari)) {
            $d->addDay();
        }
        for (; $d->isSameMonth($M); $d->addWeek()) {
            if (WorkDay::hariKerja($d)) {
                return $d;
            }
        }

        return null;
    }

    /**
     * Target recount (K14) per resort yang berubah (asal atau tujuan peta) di
     * hari tagih pertama M: Σ round(nominal_drop × 13%) pinjaman success di
     * resort itu sesudah rombak yang sudah drop sebelum D, belum lunas pada D,
     * dan belum keluar target pada D (definisi PinjamanTrait::keluarTarget:
     * out_date <= D atau ember MB/ML).
     *
     * @return array<int,array{resort:string,grouping_id:int,hari:string,tanggal_pertama:?string,lama:?int,baru:int}>
     */
    public static function target(TransactionResortRombak $r, Collection $pinjaman): array
    {
        $M = $r->berlaku_bulan->copy()->startOfMonth();
        $resort = collect(self::peta($r))->flatMap(fn($ke, $dari) => [$dari, $ke])->unique()->sort()->values();
        $perKe = $pinjaman->where('status', 'success')->groupBy('ke');

        return $resort->map(function ($k) use ($M, $perKe) {
            [$g, $h] = explode('|', $k);
            $d = self::tanggalPertama($M, $h);
            $tgl = $d?->toDateString();
            $baru = !$tgl ? 0 : ($perKe[$k] ?? collect())
                ->filter(fn($l) => $l->drop_date < $tgl
                    && ($l->pay_off_date === null || $l->pay_off_date > $tgl)
                    && ($l->out_date === null || $l->out_date > $tgl)
                    && !in_array(Ember::dari($l->drop_date, $tgl), [Ember::MB, Ember::ML], true))
                ->sum(fn($l) => TargetMingguan::masuk((int) $l->nominal_drop));
            $lama = $tgl ? TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $g)->whereDate('date', $tgl)->value('target') : null;

            return ['resort' => $k, 'grouping_id' => (int) $g, 'hari' => $h, 'tanggal_pertama' => $tgl, 'lama' => $lama === null ? null : (int) $lama, 'baru' => (int) $baru];
        })->all();
    }

    /**
     * Terapkan draf (spec §7). Satu transaksi: gagal di langkah mana pun ->
     * tidak ada yang berubah. Rencana (pinjaman, rekening, MACET LAMA, hari
     * dibuka, target) dibentuk SEKALI di awal dengan fungsi yang sama dengan
     * pratinjau, jadi hasilnya = pratinjau. `ringkasan` menyimpan apa yang
     * dibutuhkan batal (Task 5); pinjaman dicatat di transaction_loan_mutations.
     *
     * Baris per-baris bulan M dipindah dengan UPDATE borongan (bukan Eloquent):
     * hook angsuran/pemutihan hanya membuka kunci otomatis (sudah dibuka
     * eksplisit di langkah 3), menyegarkan rekap alur lama (kantor ini alur
     * baru) dan menghitung pelunasan (saldo tidak berubah karena pindah
     * kelompok) - semuanya tidak perlu, dan closing dihitung ulang di langkah 8.
     *
     * @throws \RuntimeException
     */
    public static function terapkan(TransactionResortRombak $r, $user): array
    {
        return DB::transaction(function () use ($r, $user) {
            $r = TransactionResortRombak::with('peta')->lockForUpdate()->findOrFail($r->id);
            // 1. Validasi.
            if ($galat = self::periksa($r)) {
                throw new \RuntimeException($galat[0]);
            }
            $M = $r->berlaku_bulan->copy()->startOfMonth();
            $m = $M->toDateString();
            $alasan = "Rombak resort #{$r->id}";
            $employee = $user->employee->id;

            // 2. Rencana, dari susunan sebelum rombak (K4).
            $pinjaman = self::pinjaman($r);
            $pindah = $pinjaman->where('pindah', true);
            $ids = $pindah->pluck('id')->all();
            $rekening = self::rekening($pinjaman);
            $macet = self::macetLama($r, $pinjaman);
            $target = self::target($r, $pinjaman);
            $gIds = self::kelompokTerkait($r);

            // 3. Buka kunci kasir hari M s/d hari ini (trigger angsuran menolak hari terkunci).
            $dibuka = [];
            foreach (self::hariDibuka($r) as $d) {
                Gembok::buka(TransactionDailyClosing::findOrFail($d->id), $user, $alasan);
                $dibuka[] = ['id' => $d->id, 'grouping_id' => (int) $d->transaction_loan_officer_grouping_id, 'tanggal' => Carbon::parse($d->date)->toDateString()];
            }

            // 4. Timpa pinjaman + catat mutasi.
            $keLoan = $pindah->pluck('ke', 'id');
            TransactionLoan::with('loan_officer_grouping')->whereIn('id', $ids)->get()->each(function ($loan) use ($keLoan, $m, $alasan, $user, $r) {
                [$g, $h] = explode('|', $keLoan[$loan->id]);
                Mutasi::catat($loan, (int) $g, $h, $m, $alasan, $user, $r->id);
            });

            // 5. Baris bulan M ikut kelompok baru pinjamannya (kolom sudah ditimpa di langkah 4).
            // jumlah = semua baris M pinjaman pindah (= pratinjau); ganti_kelompok = yang kelompoknya berubah (pindah hari saja tidak).
            $pindahBaris = function (string $tabel, string $kolom) use ($ids, $m) {
                $q = fn() => DB::table("$tabel as x")->join('transaction_loans as l', 'l.id', '=', 'x.transaction_loan_id')
                    ->whereIn('x.transaction_loan_id', $ids)->where("x.$kolom", '>=', $m);
                return !$ids ? ['jumlah' => 0, 'ganti_kelompok' => 0] : [
                    'jumlah' => $q()->count(),
                    'ganti_kelompok' => $q()->whereColumn('x.transaction_loan_officer_grouping_id', '<>', 'l.transaction_loan_officer_grouping_id')
                        ->update(['x.transaction_loan_officer_grouping_id' => DB::raw('l.transaction_loan_officer_grouping_id')]),
                ];
            };
            $baris = [
                'angsuran' => $pindahBaris('transaction_loan_instalments', 'transaction_date'),
                'pemutihan' => $pindahBaris('transaction_white_offs', 'transaction_date'),
                'penyesuaian' => $pindahBaris('transaction_saldo_adjustments', 'berlaku_bulan'),
            ];

            // 6. Rekening: timpa kecuali bentrok; nilai lama disimpan untuk batal.
            $ditimpa = [];
            $perTujuan = [];
            foreach ($rekening as $x) {
                if ($x['bentrok']) {
                    continue;
                }
                [$g, $day] = explode('|', $x['dari']);
                $ditimpa[] = ['id' => $x['id'], 'grouping_id' => (int) $g, 'day' => (int) $day];
                $perTujuan[$x['ke_g'] . '|' . $x['ke_day']][] = $x['id'];
            }
            foreach ($perTujuan as $k => $rekIds) {
                [$g, $day] = explode('|', $k);
                DB::table('transaction_manage_customers')->whereIn('id', $rekIds)
                    ->update(['transaction_loan_officer_grouping_id' => (int) $g, 'day' => (int) $day]);
            }

            // 7. MACET LAMA ganda: lebur ke yang dipertahankan, berlaku M (varian oper).
            $lebur = [];
            foreach ($macet as $x) {
                $g = (int) explode('|', $x['resort'])[0];
                $ke = TransactionLoan::findOrFail($x['pertahankan']['id']);
                foreach ($x['lebur'] as $l) {
                    if ($l['saldo'] <= 0) {
                        continue;
                    }
                    $dari = TransactionLoan::findOrFail($l['id']);
                    $lama = fn($loan) => $loan->only(['pay_off_date', 'out_date', 'transaction_out_reasons_id']);
                    $catat = ['resort' => $x['resort'], 'dari' => $dari->id, 'ke' => $ke->id, 'nominal' => $l['saldo'],
                        'lama_dari' => $lama($dari), 'lama_ke' => $lama($ke)];
                    foreach ([[$dari, TransactionSaldoAdjustment::JENIS_SALDO_AWAL, 'adj_dari', "oper ke #{$ke->id}"],
                              [$ke, TransactionSaldoAdjustment::JENIS_KURANG_INPUT, 'adj_ke', "oper dari #{$dari->id}"]] as [$loan, $jenis, $kolom, $ket]) {
                        $catat[$kolom] = TransactionSaldoAdjustment::create([
                            'transaction_loan_id' => $loan->id,
                            'transaction_loan_officer_grouping_id' => $g,
                            'jenis' => $jenis,
                            'nominal' => $l['saldo'],
                            'berlaku_bulan' => $m,
                            'user_input' => $employee,
                            'catatan' => "$ket ($alasan)",
                        ])->id;
                        $loan->refresh()->hitungUlangPelunasan();
                    }
                    $lebur[] = $catat;
                }
            }

            // 8. Closing harian M (semua baris belum terkunci; hari tanpa transaksi = nol,
            // jalur Gembok/ClosingHarian hanya menulis hari yang ada angkanya), lalu bulanan.
            $angka = HitungAgregat::harianBanyak($gIds, $M, $M->copy()->endOfMonth());
            $harian = 0;
            foreach (TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $gIds)
                ->whereBetween('date', [$m, $M->copy()->endOfMonth()->toDateString()])->whereNull('kasir_lock_at')
                ->get(['id', 'transaction_loan_officer_grouping_id', 'date']) as $c) {
                $harian += DB::table('transaction_daily_closings')->where('id', $c->id)
                    ->update($angka[$c->transaction_loan_officer_grouping_id . '|' . $c->date->toDateString()] ?? HitungAgregat::kosong());
            }
            // K13: saldo awal M langsung susunan baru, walau serah terima sudah diteken (paksa_awal).
            $perbarui = ['employee_id' => $employee, 'sumber' => $alasan, 'paksa_awal' => true];
            $bulanan = [
                $m => TutupBulanan::susun($gIds, $M, true, $perbarui),
                $M->copy()->addMonthNoOverflow()->toDateString() => TutupBulanan::susun($gIds, $M->copy()->addMonthNoOverflow(), true, $perbarui),
            ];

            // 9. Target recount (K14) di hari tagih pertama + rantai yang sudah lahir sesudahnya di bulan M.
            $targetLama = [];
            foreach ($target as $t) {
                if (!$t['tanggal_pertama']) {
                    continue;
                }
                $row = TransactionDailyClosing::firstOrCreate(['transaction_loan_officer_grouping_id' => $t['grouping_id'], 'date' => $t['tanggal_pertama']]);
                $catat = $t + ['dibuat' => $row->wasRecentlyCreated, 'target_on' => $row->target_on ? Carbon::parse($row->target_on)->toDateString() : null,
                    'target_source' => $row->target_source, 'rantai' => []];
                $row->update(['target' => $t['baru'], 'target_source' => 'recount']);
                for ($tgl = $t['tanggal_pertama'], $nilai = $t['baru'], $prev = $row; ($depan = TargetMingguan::tanggalDepan($tgl)) && Carbon::parse($depan)->isSameMonth($M);) {
                    $next = TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $t['grouping_id'])->whereDate('date', $depan)->first();
                    if (!$next || ($next->target_on ? Carbon::parse($next->target_on)->toDateString() : null) !== $tgl
                        || in_array($next->target_source, TargetMingguan::SUMBER_PUTUS, true)) {
                        break;
                    }
                    $baru = TargetMingguan::hitung($nilai, (int) (HitungAgregat::harian($t['grouping_id'], $tgl)['drop'] ?? 0), (int) $prev->keluar);
                    $catat['rantai'][] = ['id' => $next->id, 'tanggal' => $depan, 'lama' => $next->target === null ? null : (int) $next->target, 'baru' => $baru];
                    $next->update(['target' => $baru]);
                    [$tgl, $nilai, $prev] = [$depan, $baru, $next];
                }
                $targetLama[] = $catat;
            }

            // 10. Status + ringkasan.
            $ringkasan = [
                'berlaku_bulan' => $m,
                'kelompok' => $gIds,
                'hari_dibuka' => $dibuka,
                'pinjaman' => ['jumlah' => count($ids), 'success' => $pindah->where('status', 'success')->count(),
                    'open' => $pindah->where('status', 'open')->count(), 'acc' => $pindah->where('status', 'acc')->count()],
                'baris_m' => $baris,
                'rekening' => ['ditimpa' => $ditimpa, 'bentrok' => array_values(array_filter($rekening, fn($x) => $x['bentrok']))],
                'macet_lama' => $lebur,
                'closing_harian' => $harian,
                'closing_bulanan' => $bulanan,
                'target_lama' => $targetLama,
            ];
            $r->update(['status' => 'diterapkan', 'diterapkan_oleh' => $employee, 'diterapkan_at' => now(), 'ringkasan' => $ringkasan]);

            return $ringkasan;
        });
    }

    /** Hanya baca. Lihat .agents/rombak_resort.md §6 Preview. */
    public static function pratinjau(TransactionResortRombak $r): array
    {
        $r->loadMissing('peta');
        $M = $r->berlaku_bulan->copy()->startOfMonth();
        $peta = self::peta($r);
        $nama = DB::table('transaction_loan_officer_groupings')->where('branch_id', $r->branch_id)->pluck('kelompok', 'id');
        $label = function (string $k) use ($nama) {
            [$g, $h] = explode('|', $k);
            return 'K' . ($nama[$g] ?? "?$g") . ' ' . ucfirst($h);
        };

        // Kotak sesudah rombak = jumlah blok papan menurut peta.
        $kotak = [];
        foreach (self::blok($r->branch_id, $M) as $b) {
            $asal = $b['grouping_id'] . '|' . $b['hari'];
            $ke = $peta[$asal] ?? $asal;
            $kotak[$ke] ??= ['resort' => $ke, 'label' => $label($ke), 'asal' => [], 'nasabah' => 0, 'saldo' => 0, 'lancar' => 0, 'cm' => 0, 'mb' => 0, 'ml' => 0];
            $kotak[$ke]['asal'][] = $label($asal);
            foreach (['nasabah', 'saldo', 'lancar', 'cm', 'mb', 'ml'] as $f) {
                $kotak[$ke][$f] += $b[$f];
            }
        }
        ksort($kotak, SORT_NATURAL);

        $pinjaman = self::pinjaman($r);
        $pindah = $pinjaman->where('pindah', true);
        $ids = $pindah->pluck('id')->all();
        $perAsal = $pindah->groupBy('asal')->map(fn($ls, $asal) => [
            'resort' => $asal, 'label' => $label($asal), 'ke' => $label($ls->first()->ke),
            'aktif' => $ls->where('status', 'success')->count(),
            'open' => $ls->where('status', 'open')->count(),
            'acc' => $ls->where('status', 'acc')->count(),
        ])->sortKeys(SORT_NATURAL)->values()->all();

        $jumlah = fn(string $tabel, string $kolom) => $ids ? DB::table($tabel)->whereIn('transaction_loan_id', $ids)
            ->where($kolom, '>=', $M->toDateString())->selectRaw('COUNT(*) AS jumlah, COALESCE(SUM(nominal),0) AS nominal')->first() : (object) ['jumlah' => 0, 'nominal' => 0];
        $ang = $jumlah('transaction_loan_instalments', 'transaction_date');
        $wo = $jumlah('transaction_white_offs', 'transaction_date');
        $adj = $jumlah('transaction_saldo_adjustments', 'berlaku_bulan');

        $rekening = self::rekening($pinjaman);
        $bentrok = array_values(array_filter($rekening, fn($x) => $x['bentrok']));

        return [
            'galat' => self::periksa($r),
            'berlaku_bulan' => $M->toDateString(),
            'kotak' => array_values(array_map(fn($k) => $k + ['berubah' => $k['asal'] !== [$k['label']]], $kotak)),
            'pindah' => $perAsal,
            'angsuran_m' => [
                'jumlah' => (int) $ang->jumlah, 'nominal' => (int) $ang->nominal,
                'pemutihan_jumlah' => (int) $wo->jumlah, 'pemutihan_nominal' => (int) $wo->nominal,
                'penyesuaian_jumlah' => (int) $adj->jumlah,
            ],
            'hari_dibuka' => self::hariDibuka($r)->map(fn($d) => [
                'grouping_id' => (int) $d->transaction_loan_officer_grouping_id,
                'kelompok' => $nama[$d->transaction_loan_officer_grouping_id] ?? null,
                'tanggal' => Carbon::parse($d->date)->toDateString(),
            ])->all(),
            'target' => array_map(fn($t) => $t + ['label' => $label($t['resort'])], self::target($r, $pinjaman)),
            'macet_lama' => array_map(fn($m) => $m + ['label' => $label($m['resort'])], self::macetLama($r, $pinjaman)),
            'rekening' => ['ditimpa' => count($rekening) - count($bentrok), 'bentrok' => $bentrok],
        ];
    }
}
