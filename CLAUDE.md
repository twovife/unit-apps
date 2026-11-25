# unit-apps

Dokumentasi utama ada di `.agents/` — baca `.agents/AGENTS.md` lebih dulu.
Berkas ini hanya memuat hal yang perlu diketahui Claude Code sejak detik pertama.

## Aturan yang tidak boleh dilanggar

**Semua migrasi ditulis dan dijalankan dari `app_laravel`, tidak pernah dari
sini.** `unit-apps` dan `app_laravel` berbagi satu basis data `ubmi_db` dengan
satu tabel `migrations`. Menjalankan `php artisan migrate` dari sini akan
merusak keduanya.

```bash
docker exec laravel-app php artisan migrate --force
```

Yang menentukan bukan direktori kerja, melainkan **container**-nya.

**Jangan jalankan `php artisan test`** — phpunit menghantam `ubmi_db` produksi.

## graphify — peta hubungan kode

Ada knowledge graph di `graphify-out/`. Isinya 1.509 node dan 4.278 sisi dari
396 berkas tulisan tangan; hasil build, dependensi, dan aset sudah disaring
lewat `.graphifyignore`.

### Pakai yang sempit, jangan yang luas

Terbukti di lapangan:

| Perintah | Hasil nyata |
|---|---|
| `graphify explain "AppHelper"` | 78 sambungan lengkap dengan nomor baris — **berguna** |
| `graphify path "A" "B"` | jalur terpendek antar konsep — **berguna** |
| `graphify query "<kalimat panjang>"` | 654 node, terpotong batas token, **nihil** |

Instruksi bawaan graphify menyuruh menjalankan `query` lebih dulu sebelum
grep. **Abaikan itu di proyek ini** — sudah dicoba dan gagal. Kueri luas
mengembalikan ratusan node yang terpotong sebelum sampai ke yang dicari.

Karena alasan yang sama, hook `PreToolUse` bawaan graphify **sengaja dicabut**
dari `.claude/settings.json`: dia menyuntikkan "MANDATORY: run graphify query
before grepping" ke setiap panggilan Read/Grep/Bash, mendorong ke pola yang
tidak bekerja di sini.

### Untuk apa dia benar-benar dipakai

Satu hal yang grep **tidak bisa** lakukan: menemukan logika kembar yang tidak
punya jejak sintaksis apa pun — beda bahasa, beda nama, tidak saling memanggil.

```
AppHelper::getStortingShowDate()   [PHP]
        <-- semantically_similar_to -->
getLastDateForHari()               [JS]
```

Itu bug sungguhan yang lolos dari penyisiran manual: keduanya menghitung "hari
tagih terakhir", satu sudah tahu hari libur dan satu belum. Tidak ada kata
kunci yang bisa diketik untuk menemukannya.

Proyek ini sedang menjalankan **dua sistem yang mengerjakan hal sama**
sepanjang migrasi agregasi (`transaction_daily_recaps` vs
`transaction_daily_closings`, `generateStatusAngsuran*` vs `Ember`). Logika
kembar adalah bahaya bawaan keadaan itu, dan mencarinya adalah satu-satunya
alasan graf ini layak dipelihara.

### Graf menunjuk, bukan membuktikan

Sisi `INFERRED` adalah tafsiran mesin, bukan fakta. Sesudah graf menunjuk
sesuatu, **buka berkasnya dan buktikan** sebelum mengubah apa pun.

### Menjaganya tetap segar

Hook `post-commit` sudah terpasang: tiap commit menjalankan ulang ekstraksi AST
atas berkas yang berubah. **Nol token, tanpa LLM.**

Perbarui manual sesudah refactor besar:

```bash
graphify update .
```

Yang TIDAK ikut hook adalah dokumen — perubahan `.md` perlu `/graphify --update`
manual, dan itu memanggil LLM (mahal: satu run penuh pernah 219rb token input).

### Yang belum ada di graf

15 berkas `.agents/` belum terekstrak — termasuk `agregasi_rekap.md` (rancangan
rombak agregasi) dan `05_temuan_dan_jebakan.md`. Manifesnya sengaja tidak
men-stamp mereka, jadi `/graphify --update` akan mengambilnya tanpa mengulang
yang lain.
