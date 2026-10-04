import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import FormatNumbering from "@/Components/shadcn/FormatNumbering";
import dayjs from "dayjs";
import { Button } from "@/shadcn/ui/button";
import Action from "./Action";
import { usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
const WARNA = { sisa: "bg-sky-50", tgl: "", angs: "bg-amber-50", md: "bg-slate-50", saldo: "bg-emerald-50" };

const Angka = ({ v, kelas = "" }) => (
  <TableCell className={`px-2 py-1.5 text-right tabular-nums ${kelas}`}>
    {v ? <FormatNumbering ribuan value={v} /> : <span className="text-slate-300">–</span>}
  </TableCell>
);

const AngsuranTable = ({ dateOfWeek, datas }) => {
  const { server_filter } = usePage().props;
  const [data, setData] = useState([]);
  useEffect(() => setData(datas), [datas]);

  const [jumlahBulan, setJumlahBulan] = useState(0);
  const bulanIni = dayjs(server_filter?.month);
  const hariKe = HARI_KE[String(server_filter?.hari).toLowerCase()];
  const dirinci = (grup) => grup.type !== "ml";
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
    ["Nama", "w-40"],
    ["NIK", "w-36"],
    ["Note", "w-20"],
    ["Alamat", "w-44"],
    ["Kel", "w-10"],
    ["Hari", "w-14"],
    ["Pnj", "w-10"],
    ["X", "w-10"],
    ["Drop", "w-20 text-right"],
    ["Pinjaman", "w-20 text-right"],
  ];
  const totalKolom = KOLOM_TETAP.length + kolomBlok.length + 1;
  // Lebar minimum = jumlah lebar kolom (kelas w-N = N x 4px). Kalau layar
  // lebih lebar, tabel mengisi penuh; kalau tidak muat, tabel tetap selebar
  // ini dan bisa digeser ke samping - kolom tidak pernah dipepetkan.
  const px = (kelas) => Number(/w-(\d+)/.exec(kelas)?.[1] ?? 0) * 4;
  const LEBAR_BLOK = { sisa: 80, tgl: 56, angs: 80, md: 56 };
  const lebarMin =
    KOLOM_TETAP.reduce((t, [, kelas]) => t + px(kelas), 0) + kolomBlok.reduce((t, k) => t + LEBAR_BLOK[k.jenis], 0) + 80;

  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const pilih = (id) => setSelectedId((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const garis = (k) => (k.awal ? "border-l-2 border-l-slate-300" : "border-l border-l-slate-100");
  const th = "px-2 py-2 text-[11px] font-semibold text-slate-600 whitespace-nowrap";

  return (
    <div className="relative overflow-auto border rounded-lg h-[60vh] lg:h-[85vh] scrollbar-thin">
      {/* table-fixed + w-full: muat = penuh layar; bulan lalu dibuka = melebar & bisa digeser. */}
      <Table className="w-full text-xs table-fixed" style={{ minWidth: lebarMin }}>
        <TableHeader className="sticky top-0 z-10 bg-slate-100">
          <TableRow className="border-b-0 hover:bg-transparent">
            {KOLOM_TETAP.map(([label, kelas]) => (
              <TableHead key={label} rowSpan={2} className={`${th} ${kelas} align-bottom`}>
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
                className={`${th} text-right ${k.jenis === "tgl" ? "w-14 font-normal" : k.jenis === "md" ? "w-14" : "w-20"} ${garis(k)}`}
              >
                {k.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((grup, g) => {
            const rinci = dirinci(grup);
            // Blok bulan lalu untuk grup ML dikosongkan (null).
            const isi = (k, r) => (k.lalu && !rinci ? null : k.nilai(r));
            return (
              <React.Fragment key={g}>
                <TableRow className="bg-slate-200/70 hover:bg-slate-200/70">
                  <TableCell colSpan={totalKolom} className="px-2 py-1.5 text-xs font-semibold text-slate-700">
                    {grup.month}
                  </TableCell>
                </TableRow>

                {grup.data.map((r, i) => {
                  const dipilih = selectedId.includes(r.id);
                  return (
                    <TableRow key={r.id} className={dipilih ? "bg-green-100 hover:bg-green-100" : "even:bg-slate-50/60"}>
                      <TableCell className="px-2 py-1.5 cursor-pointer text-slate-500" onClick={() => pilih(r.id)}>
                        {i + 1}
                      </TableCell>
                      <TableCell className="px-2 py-1.5">
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
                      <TableCell className="px-2 py-1.5 font-medium truncate" title={r.nama}>
                        {r.nama}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap tabular-nums text-slate-500">{r.nik}</TableCell>
                      <TableCell className="px-2 py-1.5">
                        {r.lunas && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold text-white bg-emerald-500 rounded">Lunas</span>
                        )}
                        {r.notes && (
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
                      <Angka v={r.drop} />
                      <Angka v={r.pinjaman} kelas="font-medium" />
                      {kolomBlok.map((k, j) => {
                        const v = isi(k, r);
                        if (v === null) return <TableCell key={j} className={`bg-slate-100/70 ${garis(k)}`} />;
                        const katrol = k.jenis === "tgl" && r.instalment?.[k.d]?.is_active;
                        return (
                          <Angka
                            key={j}
                            v={v}
                            kelas={`${WARNA[k.jenis]} ${garis(k)} ${k.jenis === "tgl" ? "" : "font-medium"} ${
                              katrol || (k.jenis === "md" && v) ? "text-red-600 font-semibold" : ""
                            }`}
                          />
                        );
                      })}
                      <Angka v={r.saldo} kelas={`${WARNA.saldo} font-semibold border-l-2 border-l-slate-300`} />
                    </TableRow>
                  );
                })}

                <TableRow className="font-semibold border-b-2 border-b-slate-300 bg-slate-100 hover:bg-slate-100">
                  <TableCell colSpan={10} className="px-2 py-2 text-slate-700">
                    Total {grup.month} · {grup.data.length} nasabah
                  </TableCell>
                  <Angka v={grup.data.reduce((t, r) => t + Number(r.drop || 0), 0)} />
                  <Angka v={grup.data.reduce((t, r) => t + Number(r.pinjaman || 0), 0)} />
                  {kolomBlok.map((k, j) =>
                    k.lalu && !rinci ? (
                      <TableCell key={j} className={garis(k)} />
                    ) : (
                      <Angka
                        key={j}
                        v={grup.data.reduce((t, r) => t + Number(k.nilai(r) || 0), 0)}
                        kelas={`${WARNA[k.jenis]} ${garis(k)}`}
                      />
                    ),
                  )}
                  <Angka
                    v={grup.data.reduce((t, r) => t + Number(r.saldo || 0), 0)}
                    kelas={`${WARNA.saldo} border-l-2 border-l-slate-300`}
                  />
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

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
