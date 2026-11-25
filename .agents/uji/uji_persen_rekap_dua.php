<?php
// Penyebut persen CM/MB di Rekap 2 (per kelompok) harus berjumlah sama dengan
// penyebut di Rekap Sirkulasi Wilayah (per kantor). Kalau tidak, satu menu
// bilang 40% dan menu lain bilang 38% untuk pinjaman yang sama.
//
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_persen_rekap_dua.php
use App\Helpers\RekapWilayah;
use App\Models\Branch;
use App\Models\TransactionLoanOfficerGrouping;
use App\Services\AngkaRekapWilayah;

// Bulan yang persennya sudah ditampilkan. Sebelum MULAI_PERSEN, Rekap 2
// tidak menghitung penyebutnya sama sekali.
$periode = RekapWilayah::MULAI_PERSEN;
$beda = 0;
$diperiksa = 0;
$berisi = 0;

foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->orderBy('id')->take(8)->get() as $b) {
    $gid = TransactionLoanOfficerGrouping::where('branch_id', $b->id)->pluck('id')->all();
    if (! $gid) {
        continue;
    }

    $sebulan = AngkaRekapWilayah::untukBulan((int) $b->wilayah, $periode, $b->id);
    if (! $sebulan) {
        continue;
    }

    foreach (['cm', 'mb'] as $ember) {
        $bulan = RekapWilayah::bulanRujukan($periode, $ember);
        $kelompok = array_sum(AngkaRekapWilayah::dropKelompok($gid, $bulan));
        $kantor = (int) (reset($sebulan)[$b->id]['drop_' . $ember] ?? 0);

        $diperiksa++;
        $berisi += $kantor !== 0 ? 1 : 0;

        if ($kelompok !== $kantor) {
            $beda++;
            printf("BEDA kantor %d drop_%s: jumlah kelompok=%d, per kantor=%d\n", $b->id, $ember, $kelompok, $kantor);
        }
    }
}

printf("periode=%s diperiksa=%d (bukan nol: %d) beda=%d\n", $periode, $diperiksa, $berisi, $beda);

if ($berisi === 0) {
    echo "PERINGATAN: semua penyebutnya nol, uji ini tidak membuktikan apa pun.\n";
}
