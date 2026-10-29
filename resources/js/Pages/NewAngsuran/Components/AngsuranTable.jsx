import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import FormatNumbering from "@/Components/shadcn/FormatNumbering";
import dayjs from "dayjs";
import { Button } from "@/shadcn/ui/button";
import Action from "./Action";
import { router, usePage } from "@inertiajs/react";
import { useFilterAngsuran } from "../FilterAngsuran";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useModeRibuan } from '@/lib/modeAngka';
import { KoreksiBekuContext } from '@/Pages/Migrasi/Components/DialogKoreksi';

/**
 * Buku angsuran bulanan (desktop Angsuran Lancar & Pinjaman Macet).
 *
 * Kolom dibagi BLOK per bulan: [Sisa awal | tanggal tagih... | Angs | MD].
 * Blok bulan terpilih selalu tampil; tombol < di judul blok membuka satu
 * bulan lagi ke belakang (lancar s/d MB saja - ML tidak dirinci karena bisa
 * punya penyesuaian). Saldo akhir berdiri sendiri di paling kanan.
 * Sisa awal blok = pinjaman - angsuran - MD sebelum bulan itu.
 */
const HARI_KE = { minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6 };
const MAKS_BULAN = 12;
const namaPanjang = (b) => b.toDate().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

// Warna lembut per jenis kolom; awal blok diberi garis tebal.
const WARNA = { sisa: "bg-sky-200", tgl: "", angs: "bg-amber-200", md: "bg-slate-100", saldo: "bg-emerald-200" };

const Angka = ({ v, kelas = "" }) => (
  <TableCell className={`px-2 py-1.5 text-right tabular-nums ${kelas}`}>
    {v ? <FormatNumbering ribuan value={v} /> : <span className="text-slate-300">–</span>}
  </TableCell>
);

/**
 * Urutan baris dalam grup:
 * 1. Tanggal drop
 * 2. Nasabah lama dulu / pelunasan
 * 3. Urutkan per nomor anggota (punya nomor anggota duluan, urut numerik)
 * 4. Nasabah baru
 * 5. Urutkan per nomor anggota
 * Seri pemutus: nama A-Z.
 */
const urutBaris = (a, b) => {
  const cmpDrop = String(a.tanggal_drop ?? '').localeCompare(String(b.tanggal_drop ?? ''));
  if (cmpDrop !== 0) return cmpDrop;

  const isLamaA = Boolean(a.is_nasabah_lama || a.dari_pelunasan || (a.pinjaman_ke > 1));
  const isLamaB = Boolean(b.is_nasabah_lama || b.dari_pelunasan || (b.pinjaman_ke > 1));
  if (isLamaA !== isLamaB) {
    return isLamaA ? -1 : 1;
  }

  const punyaNoA = Boolean(a.nomor_anggota);
  const punyaNoB = Boolean(b.nomor_anggota);
  if (punyaNoA !== punyaNoB) {
    return punyaNoA ? -1 : 1;
  }

  if (punyaNoA && punyaNoB) {
    const cmpNo = String(a.nomor_anggota).localeCompare(String(b.nomor_anggota), 'id', { numeric: true });
    if (cmpNo !== 0) return cmpNo;
  }

  return String(a.nama ?? '').localeCompare(String(b.nama ?? ''), 'id');
};

/**
 * Sel nomor anggota yang bisa diisi langsung: klik -> ketik -> Enter / klik
 * di luar menyimpan, Esc batal. Hanya untuk pemegang can-create.
 */
const SelNomorAnggota = ({ r, boleh, className = "" }) => {
  const [ubah, setUbah] = useState(false);
  const [nilai, setNilai] = useState(r.nomor_anggota ?? "");
  const [simpan, setSimpan] = useState(false);
  useEffect(() => setNilai(r.nomor_anggota ?? ""), [r.nomor_anggota]);

  const kirim = () => {
    setUbah(false);
    if (String(nilai).trim() === String(r.nomor_anggota ?? "")) return;
    router.post(
      route("pinjaman.simpan_nomor_anggota", r.id),
      { nomor_anggota: nilai },
      { preserveScroll: true, preserveState: true, onStart: () => setSimpan(true), onFinish: () => setSimpan(false) },
    );
  };

  return (
    <TableCell
      className={`px-1 py-1 text-center tabular-nums ${className} ${boleh && !ubah ? "cursor-text hover:bg-sky-50" : ""}`}
      onClick={() => boleh && !ubah && setUbah(true)}
    >
      {ubah ? (
        <input
          autoFocus
          className="w-full h-6 px-1 text-xs text-center border rounded border-sky-400 outline-none"
          value={nilai}
          inputMode="numeric"
          // Nomor anggota hanya angka.
          onChange={(e) => setNilai(e.target.value.replace(/\D/g, ''))}
          onBlur={kirim}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur(); // blur -> kirim, sekali saja
            if (e.key === "Escape") {
              setNilai(r.nomor_anggota ?? "");
              setUbah(false);
            }
          }}
        />
      ) : (
        // Sama dengan daftar HP: keluar target = nomor dilingkari merah,
        // masih target = "TG" kecil di bawahnya.
        <div className="flex flex-col items-center leading-none">
          <span
            className={`${simpan ? "text-slate-400" : ""} ${
              r.keluar_target
                ? "inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-full border-2 border-red-600 text-red-600 font-semibold"
                : ""
            }`}
          >
            {nilai || "–"}
          </span>
          {!r.keluar_target && <span className="mt-0.5 text-[9px] font-bold text-blue-700">TG</span>}
        </div>
      )}
    </TableCell>
  );
};

/**
 * Sel tanggal sebelum migrasi di Buku Angsuran Beku (superuser): klik -> ketik ->
 * Enter / klik di luar langsung tersimpan lewat Koreksi Beku (tanpa pratinjau,
 * bucket ikut). Kosong = tambah, berisi = ubah, 0 = hapus. Esc batal.
 */
const SelBeku = ({ r, d, v, kelas }) => {
  const [ubah, setUbah] = useState(false);
  const [nilai, setNilai] = useState(String(v || ""));
  const [simpan, setSimpan] = useState(false);
  useEffect(() => setNilai(String(v || "")), [v]);

  const kirim = () => {
    setUbah(false);
    const baru = Number(String(nilai).replace(/\D/g, "") || 0);
    if (baru === Number(v || 0)) return;
    router.post(
      route("migrasi.koreksi_beku_sel"),
      { loan_id: r.id, tanggal: d, nominal: baru },
      {
        preserveScroll: true,
        preserveState: true,
        onStart: () => setSimpan(true),
        onFinish: () => setSimpan(false),
        onError: () => setNilai(String(v || "")),
      },
    );
  };

  return (
    <TableCell
      className={`px-1 py-1 text-right tabular-nums cursor-text ring-inset hover:ring-1 hover:ring-sky-400 ${kelas}`}
      title="Data beku - klik untuk koreksi langsung"
      onClick={() => !ubah && !simpan && setUbah(true)}
    >
      {ubah ? (
        <input
          autoFocus
          inputMode="numeric"
          className="w-full h-6 px-1 text-xs text-right border rounded outline-none border-sky-400"
          value={nilai}
          onChange={(e) => setNilai(e.target.value.replace(/\D/g, ""))}
          onFocus={(e) => e.target.select()}
          onBlur={kirim}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setNilai(String(v || ""));
              setUbah(false);
            }
          }}
        />
      ) : simpan ? (
        <span className="text-slate-400">…</span>
      ) : v ? (
        <FormatNumbering ribuan value={v} />
      ) : (
        <span className="text-slate-300">–</span>
      )}
    </TableCell>
  );
};

const JENIS_SESUAI = { saldo_awal: "saldo awal", duplikat: "duplikat", lebih_input: "lebih input", kurang_input: "kurang input" };

/**
 * Penyesuaian saldo (migrasi) satu pinjaman di Buku Angsuran Beku: klik nominal ->
 * ketik -> Enter langsung tersimpan (0 = hapus), bucket ikut. Oper saldo hanya tampil.
 */
const Penyesuaian = ({ a }) => {
  const [ubah, setUbah] = useState(false);
  const [nilai, setNilai] = useState(String(a.nominal));
  useEffect(() => setNilai(String(a.nominal)), [a.nominal]);
  const kirim = () => {
    setUbah(false);
    const baru = Number(nilai || 0);
    if (baru === a.nominal) return;
    router.post(
      route("migrasi.koreksi_beku_penyesuaian"),
      { penyesuaian_id: a.id, nominal: baru },
      { preserveScroll: true, preserveState: true, onError: () => setNilai(String(a.nominal)) },
    );
  };
  return (
    <span
      className={`block mt-0.5 text-[10px] whitespace-nowrap ${a.efek < 0 ? "text-violet-700" : "text-emerald-700"}`}
      title={a.oper ? "Bagian dari oper saldo - tidak diubah di sini" : "Klik nominal untuk koreksi (0 = hapus)"}
    >
      {JENIS_SESUAI[a.jenis] ?? a.jenis} {a.efek < 0 ? "−" : "+"}
      {ubah ? (
        <input
          autoFocus
          inputMode="numeric"
          className="w-16 h-5 px-1 ml-0.5 text-right border rounded outline-none border-sky-400"
          value={nilai}
          onChange={(e) => setNilai(e.target.value.replace(/\D/g, ""))}
          onFocus={(e) => e.target.select()}
          onBlur={kirim}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setNilai(String(a.nominal));
              setUbah(false);
            }
          }}
        />
      ) : (
        <button type="button" disabled={a.oper} className="ml-0.5 font-semibold underline decoration-dotted disabled:no-underline" onClick={() => setUbah(true)}>
          <FormatNumbering ribuan value={a.nominal} className="inline" />
        </button>
      )}
    </span>
  );
};

// Kolom yang dibekukan saat tabel digeser ke samping, dengan posisi kirinya
// (jumlah lebar kolom sebelumnya). Nama diberi bayangan sebagai batas.
const BEKU = {
  No: "sticky left-0",
  Tgl: "sticky left-10",
  "No Ang": "sticky left-[136px]",
  Nama: "sticky left-[200px] shadow-[inset_-1px_0_0_#cbd5e1]",
};

// tanpaDrop: menu Pinjaman Macet tanpa kolom Drop & Pinjaman, langsung Sisa Awal (mas 2026-10-26).
const AngsuranTable = ({ dateOfWeek, datas, sorot: sorotProp = null, diDrawer = false, tanpaDrop = false }) => {
  const { auth } = usePage().props;
  // Filter dari halaman, atau dari drawer (FilterAngsuranContext).
  const server_filter = useFilterAngsuran();
  // HP tegak: 4 kolom beku (360px) menghabiskan layar, tidak ada sisa untuk
  // digeser. Di HP cuma Nama yang beku (dan lebih sempit); No/Tgl/No Ang ikut
  // tergeser, Nama menempel di kiri begitu terlewati.
  const isMobile = useIsMobile();
  const ribuan = useModeRibuan();
  const beku = isMobile ? { Nama: "sticky left-0 shadow-[inset_-1px_0_0_#cbd5e1]" } : BEKU;
  const bolehUbah = auth?.permissions?.includes("can-create");
  // Buku Angsuran Beku: sel tanggal sebelum migrasi bisa diisi langsung.
  const kb = useContext(KoreksiBekuContext);
  const [data, setData] = useState([]);
  useEffect(() => setData(datas), [datas]);

  const [jumlahBulan, setJumlahBulan] = useState(0);
  const bulanIni = dayjs(server_filter?.month);
  const hariKe = HARI_KE[String(server_filter?.hari).toLowerCase()];
  // Buku Angsuran Beku: ML ikut dirinci per bulan supaya bisa dikoreksi per sel.
  const dirinci = (grup) => !!kb || grup.type !== "ml";
  const adaYangDirinci = data?.some(dirinci);

  const tanggalTagih = (b) => {
    const hasil = [];
    for (let d = b.startOf("month"); d.month() === b.month(); d = d.add(1, "day")) {
      if (d.day() === hariKe) hasil.push(d.format("YYYY-MM-DD"));
    }
    return hasil;
  };

  const jumlahSebelum = (peta, kunci) =>
    Object.entries(peta ?? {}).reduce((t, [k, v]) => (k < kunci ? t + Number(v) : t), 0);

  // Blok bulan lalu (paling lama di kiri), lalu blok bulan terpilih.
  const blokLalu = Array.from({ length: jumlahBulan }, (_, i) => bulanIni.subtract(jumlahBulan - i, "month")).map(
    (b) => {
      const kunci = b.format("YYYY-MM");
      return {
        nama: namaPanjang(b),
        lalu: true,
        kolom: [
          {
            jenis: "sisa",
            label: "Sisa awal",
            nilai: (r) => r.pinjaman - jumlahSebelum(r.per_bulan, kunci) - jumlahSebelum(r.md_per_bulan, kunci),
          },
          ...tanggalTagih(b).map((d) => ({
            jenis: "tgl",
            label: dayjs(d).format("DD-MM"),
            d,
            nilai: (r) => r.instalment?.[d]?.total_nominal ?? 0,
          })),
          { jenis: "angs", label: "Angs", nilai: (r) => Number(r.per_bulan?.[kunci] ?? 0) },
          { jenis: "md", label: "MD", nilai: (r) => Number(r.md_per_bulan?.[kunci] ?? 0) },
        ],
      };
    },
  );
  const blokIni = {
    nama: namaPanjang(bulanIni),
    lalu: false,
    kolom: [
      { jenis: "sisa", label: "Sisa awal", nilai: (r) => r.saldo_sebelumnya },
      ...dateOfWeek.map((d) => ({
        jenis: "tgl",
        label: dayjs(d).format("DD-MM"),
        d,
        nilai: (r) => r.instalment?.[d]?.total_nominal ?? 0,
      })),
      { jenis: "angs", label: "Angs", nilai: (r) => r.angsuran },
      { jenis: "md", label: "MD", nilai: (r) => r.pemutihanThisMonth },
    ],
  };
  const blok = [...blokLalu, blokIni];
  const kolomBlok = blok.flatMap((b) => b.kolom.map((k, i) => ({ ...k, awal: i === 0, lalu: b.lalu })));
  const KOLOM_TETAP = [
    ["No", "w-10"],
    ["Tgl", "w-24"],
    ["No Ang", "w-16"],
    ["Nama", isMobile ? "w-28" : "w-40"],
    ["NIK", "w-36"],
    ["Note", "w-20"],
    ["Alamat", "w-44"],
    ["Kel", "w-10"],
    ["Hari", "w-14"],
    ["Pnj", "w-10"],
    ["X", "w-10"],
    ["Drop", `${ribuan ? "w-20" : "w-24"} text-right`],
    ["Pinjaman", `${ribuan ? "w-20" : "w-24"} text-right`],
  ].filter(([label]) => !(tanpaDrop && (label === "Drop" || label === "Pinjaman")));
  const totalKolom = KOLOM_TETAP.length + kolomBlok.length + 1;
  // Lebar minimum = jumlah lebar kolom (kelas w-N = N x 4px). Kalau layar
  // lebih lebar, tabel mengisi penuh; kalau tidak muat, tabel tetap selebar
  // ini dan bisa digeser ke samping - kolom tidak pernah dipepetkan.
  const px = (kelas) => Number(/w-(\d+)/.exec(kelas)?.[1] ?? 0) * 4;
  // Rupiah penuh (saklar 000): jutaan butuh kolom lebih lebar, kalau tidak mepet.
  const LEBAR_BLOK = ribuan ? { sisa: 80, tgl: 56, angs: 80, md: 56 } : { sisa: 104, tgl: 88, angs: 104, md: 88 };
  // Lebar tiap kolom (px) - dipakai <colgroup> di DUA tabel (header & isi)
  // supaya kolomnya selalu sejajar.
  const lebarKolom = [...KOLOM_TETAP.map(([, kelas]) => px(kelas)), ...kolomBlok.map((k) => LEBAR_BLOK[k.jenis]), ribuan ? 80 : 104];
  const lebarMin = lebarKolom.reduce((t, w) => t + w, 0);
  const colgroup = (
    <colgroup>
      {lebarKolom.map((w, i) => (
        <col key={i} style={{ width: w }} />
      ))}
    </colgroup>
  );

  // Header dibekukan ke HALAMAN (sticky di bawah navbar) dalam tabel sendiri,
  // karena kotak isi yang bisa digeser ke samping tidak bisa jadi tempat
  // sticky top. Posisi gesernya disamakan dengan kotak isi.
  const kepala = useRef(null);
  const badan = useRef(null);
  const samakanGeser = () => {
    if (kepala.current && badan.current) kepala.current.scrollLeft = badan.current.scrollLeft;
  };

  // ?sorot=YYYY-MM-DD (dari storting Rekap 1): kolom tanggal itu disorot dan
  // digeser ke tengah layar, supaya kasir langsung tahu storting mana yang dicek.
  const sorot = sorotProp ?? new URLSearchParams(window.location.search).get('sorot');
  useEffect(() => {
    if (!sorot || !kepala.current || !badan.current) return;
    const el = kepala.current.querySelector('[data-sorot="1"]');
    if (el) badan.current.scrollLeft = Math.max(0, el.offsetLeft - badan.current.clientWidth / 2);
    samakanGeser();
  }, [sorot, dateOfWeek]);
  const kelasSorot = (k) => (sorot && k.jenis === 'tgl' && k.d === sorot ? 'bg-yellow-200 ring-1 ring-inset ring-yellow-400' : '');

  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const pilih = (id) => setSelectedId((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const garis = (k) => (k.awal ? "border-l-2 border-l-slate-300" : "border-l border-l-slate-100");
  const th = "px-2 py-2 text-[11px] font-semibold text-slate-600 whitespace-nowrap";

  return (
    // Gulir atas-bawah ikut HALAMAN (seperti daftar angsuran HP) - tidak ada
    // gulir kedua. Header = tabel terpisah yang sticky di bawah navbar; isi =
    // kotak yang hanya menggulir ke samping, gesernya disalin ke header.
    // Kolom kiri beku di keduanya.
    <div className="relative border rounded-lg">
      <div ref={kepala} className={`sticky z-20 overflow-hidden rounded-t-lg ${diDrawer ? 'top-0' : 'top-14'} bg-slate-100`}>
        <Table className="w-full text-xs table-fixed" style={{ minWidth: lebarMin }}>
          {colgroup}
        <TableHeader className="bg-slate-100">
          <TableRow className="border-b-0 hover:bg-transparent">
            {KOLOM_TETAP.map(([label, kelas]) => (
              <TableHead
                key={label}
                rowSpan={2}
                className={`${th} ${kelas} align-bottom ${beku[label] ? `${beku[label]} z-20 bg-slate-100` : ""}`}
              >
                {label}
              </TableHead>
            ))}
            {blok.map((b, i) => (
              <TableHead key={b.nama} colSpan={b.kolom.length} className={`${th} text-center border-l-2 border-l-slate-300`}>
                <div className="flex items-center justify-center gap-1">
                  {i === 0 && adaYangDirinci && jumlahBulan < MAKS_BULAN && (
                    <button
                      type="button"
                      title="Buka satu bulan lagi ke belakang"
                      className="p-0.5 rounded hover:bg-slate-200"
                      onClick={() => setJumlahBulan((n) => n + 1)}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {b.nama}
                  {i === 0 && jumlahBulan > 0 && (
                    <button
                      type="button"
                      title="Tutup bulan-bulan lalu"
                      className="p-0.5 rounded hover:bg-slate-200"
                      onClick={() => setJumlahBulan(0)}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead rowSpan={2} className={`${th} w-20 text-right align-bottom border-l-2 border-l-slate-300`}>
              Saldo
            </TableHead>
          </TableRow>
          <TableRow className="hover:bg-transparent">
            {kolomBlok.map((k, i) => (
              <TableHead
                key={i}
                data-sorot={kelasSorot(k) ? '1' : undefined}
                className={`${th} text-right ${k.jenis === "tgl" ? "w-14 font-normal" : k.jenis === "md" ? "w-14" : "w-20"} ${garis(k)} ${
                  kelasSorot(k) ? 'bg-yellow-300 text-yellow-950 font-bold' : ''
                }`}
              >
                {k.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        </Table>
      </div>

      <div ref={badan} onScroll={samakanGeser} className="overflow-x-auto scrollbar-thin">
        <Table className="w-full text-xs table-fixed" style={{ minWidth: lebarMin }}>
          {colgroup}

        <TableBody>
          {data?.map((grup, g) => {
            const rinci = dirinci(grup);
            // Blok bulan lalu untuk grup ML dikosongkan (null).
            const isi = (k, r) => (k.lalu && !rinci ? null : k.nilai(r));
            return (
              <React.Fragment key={g}>
                <TableRow className="bg-slate-200/70 hover:bg-slate-200/70">
                  <TableCell colSpan={totalKolom} className="px-2 py-1.5 text-xs font-semibold text-slate-700">
                    <span className="sticky left-2">{grup.month}</span>
                  </TableCell>
                </TableRow>

                {[...grup.data].sort(urutBaris).map((r, i) => {
                  const dipilih = selectedId.includes(r.id);
                  return (
                    <TableRow key={r.id} className={dipilih ? "bg-green-100 hover:bg-green-100" : "bg-white even:bg-slate-50 hover:bg-sky-50"}>
                      <TableCell className={`px-2 py-1.5 cursor-pointer text-slate-500 ${beku.No ?? ""} bg-inherit z-[1]`} onClick={() => pilih(r.id)}>
                        {i + 1}
                      </TableCell>
                      <TableCell className={`px-2 py-1.5 ${beku.Tgl ?? ""} bg-inherit z-[1]`}>
                        <div className="flex items-center justify-between gap-1">
                          <span className="whitespace-nowrap">{dayjs(r.tanggal_drop).format("DD-MM")}</span>
                          <Button
                            size="xs"
                            onClick={() => {
                              setTriggeredId(r.id);
                              setShow(true);
                            }}
                          >
                            Pay
                          </Button>
                        </div>
                      </TableCell>
                      <SelNomorAnggota r={r} boleh={bolehUbah} className={`${beku["No Ang"] ?? ""} bg-inherit z-[1]`} />
                      <TableCell
                        className={`px-2 py-1.5 font-medium truncate ${beku.Nama} bg-inherit z-[1] ${isMobile ? "cursor-pointer text-sky-700" : ""}`}
                        title={r.nama}
                        // Di HP tombol Pay ikut tergeser keluar layar: ketuk nama untuk bayar.
                        onClick={() => {
                          if (!isMobile) return;
                          setTriggeredId(r.id);
                          setShow(true);
                        }}
                      >
                        {r.nama}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap tabular-nums text-slate-500">{r.nik}</TableCell>
                      <TableCell className="px-2 py-1.5">
                        {r.lunas && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold text-white bg-emerald-500 rounded">Lunas</span>
                        )}
                        {/* Catatan "PECAHAN MACET LAMA #id" hanya penanda sistem, tidak ditampilkan. */}
                        {kb && (r.penyesuaian ?? []).map((a) => <Penyesuaian key={a.id} a={a} />)}
                        {r.notes && !r.pecahan_ml && (
                          <span className="block mt-0.5 text-[10px] truncate text-slate-500" title={r.notes}>
                            {r.notes}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 truncate text-slate-500" title={r.alamat}>
                        {r.alamat}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 text-center">{r.kelompok}</TableCell>
                      <TableCell className="px-2 py-1.5 capitalize">{r.hari}</TableCell>
                      <TableCell className="px-2 py-1.5 text-center">{r.pinjaman_ke}</TableCell>
                      <TableCell className="px-2 py-1.5 text-center">{r.x_angs}</TableCell>
                      {/* Pecahan MACET LAMA (Input ML): drop & pinjaman tidak diketahui, tidak ditampilkan. */}
                      {!tanpaDrop && <Angka v={r.pecahan_ml ? null : r.drop} />}
                      {!tanpaDrop && <Angka v={r.pecahan_ml ? null : r.pinjaman} kelas="font-medium" />}
                      {kolomBlok.map((k, j) => {
                        const v = isi(k, r);
                        if (v === null) return <TableCell key={j} className={`bg-slate-100/70 ${garis(k)}`} />;
                        const katrol = k.jenis === "tgl" && r.instalment?.[k.d]?.is_active;
                        if (kb && k.jenis === "tgl" && k.d < kb.mulai && !r.pecahan_ml && k.d >= String(r.tanggal_drop).slice(0, 10)) {
                          return (
                            <SelBeku
                              key={j}
                              r={r}
                              d={k.d}
                              v={v}
                              kelas={`${kelasSorot(k) || "bg-sky-50/60"} ${garis(k)} ${katrol ? "text-red-600 font-semibold" : ""}`}
                            />
                          );
                        }
                        return (
                          <Angka
                            key={j}
                            v={v}
                            kelas={`${kelasSorot(k) || WARNA[k.jenis]} ${garis(k)} ${k.jenis === "tgl" ? "" : "font-medium"} ${
                              katrol || (k.jenis === "md" && v) ? "text-red-600 font-semibold" : ""
                            }`}
                          />
                        );
                      })}
                      <Angka v={r.saldo} kelas={`${WARNA.saldo} font-semibold border-l-2 border-l-slate-300`} />
                    </TableRow>
                  );
                })}

                {/* Baris total: hijau muda (sama dengan buku HP); sel angka hijau
                    lebih pudar supaya kontras, sisa sangat tebal. */}
                <TableRow className="font-semibold border-t-2 border-t-emerald-500 border-b-2 border-b-slate-300 bg-emerald-100 text-emerald-950 hover:bg-emerald-100">
                  <TableCell colSpan={4} className={`px-2 py-2 truncate bg-emerald-100 ${isMobile ? "" : "sticky left-0 z-[1] shadow-[inset_-1px_0_0_#cbd5e1]"}`}>
                    Total {grup.month} · {grup.data.length} nasabah
                  </TableCell>
                  <TableCell colSpan={7} />
                  {!tanpaDrop && <Angka v={grup.data.reduce((t, r) => t + (r.pecahan_ml ? 0 : Number(r.drop || 0)), 0)} />}
                  {!tanpaDrop && <Angka v={grup.data.reduce((t, r) => t + (r.pecahan_ml ? 0 : Number(r.pinjaman || 0)), 0)} />}
                  {kolomBlok.map((k, j) =>
                    k.lalu && !rinci ? (
                      <TableCell key={j} className={garis(k)} />
                    ) : (
                      <Angka
                        key={j}
                        v={grup.data.reduce((t, r) => t + Number(k.nilai(r) || 0), 0)}
                        kelas={`bg-emerald-50 ${garis(k)}`}
                      />
                    ),
                  )}
                  <Angka
                    v={grup.data.reduce((t, r) => t + Number(r.saldo || 0), 0)}
                    kelas="bg-emerald-50 font-extrabold text-gray-900 border-l-2 border-l-slate-300"
                  />
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
        </Table>
      </div>

      <Action
        datas={data}
        show={show}
        onClosed={() => {
          setShow(false);
          setTriggeredId(null);
        }}
        triggeredId={triggeredId}
      />
    </div>
  );
};

export default AngsuranTable;
