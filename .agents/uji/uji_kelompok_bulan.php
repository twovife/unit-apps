<?php
// Rincian per kelompok harus berjumlah sama dengan baris kantornya, tiap
// tanggal. Keduanya dari alurBaru/alurLama yang sama; uji ini menjaga supaya
// tetap begitu kalau salah satu diubah.
//
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_kelompok_bulan.php
use App\Models\Branch;
use App\Services\AngkaRekapWilayah;

$periode = '2026-11-01';
$peta = ['drop' => 'drop', 'storting' => 'storting', 'cm' => 'angsuran_cm', 'mb' => 'angsuran_mb', 'ml' => 'angsuran_ml'];

$beda = 0;
$diperiksa = 0;
$berisi = 0;

foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->orderBy('id')->take(4)->get(['id', 'wilayah']) as $b) {
    $per = AngkaRekapWilayah::perKelompokBulan($b->id, $periode);
    $baris = AngkaRekapWilayah::untukBulan((int) $b->wilayah, $periode, $b->id);

    foreach ($baris as $tanggal => $perKantor) {
        foreach ($peta as $pendek => $panjang) {
            $jumlah = 0;
            foreach ($per as $hari) {
                $jumlah += (int) ($hari[$tanggal][$pendek] ?? 0);
            }

            $acuan = (int) ($perKantor[$b->id][$panjang] ?? 0);
            $diperiksa++;
            $berisi += $acuan !== 0 ? 1 : 0;

            if ($jumlah !== $acuan) {
                $beda++;
                printf("BEDA kantor %d %s %s: kelompok=%d baris=%d\n", $b->id, $tanggal, $pendek, $jumlah, $acuan);
            }
        }
    }
}

// Saldo awal & kumulatif per kelompok harus berjumlah sama dengan kantornya.
// Toleransi sebesar jumlah kelompok: sirkulasi memakai round() per kelompok,
// jadi pembulatannya bisa meleset beberapa rupiah dari hitungan kantor.
foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->orderBy('id')->take(4)->get(['id', 'wilayah']) as $b) {
    $awal = AngkaRekapWilayah::awalPerKelompok($b->id, $periode);
    $baris = AngkaRekapWilayah::untukBulan((int) $b->wilayah, $periode, $b->id);
    $pertama = reset($baris)[$b->id] ?? [];

    foreach (['sirkulasi' => 'awal_sirkulasi', 'cm' => 'awal_cm', 'mb' => 'awal_mb', 'ml' => 'awal_ml'] as $pendek => $panjang) {
        $jumlah = array_sum(array_column($awal, $pendek));
        $diperiksa++;
        if ($jumlah !== (int) ($pertama[$panjang] ?? 0)) {
            $beda++;
            printf("BEDA kantor %d %s: kelompok=%d kantor=%d\n", $b->id, $panjang, $jumlah, $pertama[$panjang] ?? 0);
        }
    }
}

printf("diperiksa=%d (bukan nol: %d) beda=%d\n", $diperiksa, $berisi, $beda);

if ($berisi === 0) {
    echo "PERINGATAN: semua angkanya nol, uji ini tidak membuktikan apa pun.\n";
}
