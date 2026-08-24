<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Bulan migrasi
    |--------------------------------------------------------------------------
    |
    | Bulan pertama yang dijalankan dengan alur agregasi baru, format YYYY-MM.
    |
    | Kantor mendaftar ke alur baru dengan cara MENUTUP BUKU bulan sebelumnya.
    | Setelan ini yang menentukan sejak kapan tutup buku itu berlaku sebagai
    | pendaftaran — tanpa dia, tutup buku bulanan biasa akan mendaftarkan semua
    | kantor kapan saja tanpa ada yang memutuskan.
    |
    | NULL = belum ada bulan migrasi. Tutup buku berjalan seperti biasa dan
    | tidak ada kantor yang berpindah. Ini keadaan aman bawaannya.
    |
    | Mengubahnya: set AGREGASI_BULAN_MIGRASI di .env lalu `php artisan config:clear`.
    |
    | Lihat .agents/agregasi_rekap.md §13.
    |
    */

    'bulan_migrasi' => env('AGREGASI_BULAN_MIGRASI'),

];
