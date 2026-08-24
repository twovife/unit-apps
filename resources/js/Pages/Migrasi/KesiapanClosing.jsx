import Authenticated from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head, router } from "@inertiajs/react";
import { Input } from "@/shadcn/ui/input";
import { Check, X, Minus } from "lucide-react";
import dayjs from "dayjs";

const rupiah = (n) => new Intl.NumberFormat("id-ID").format(n ?? 0);

const Tanda = ({ ada }) =>
  ada ? (
    <Check className="size-3.5 text-emerald-600" />
  ) : (
    <X className="size-3.5 text-red-500" />
  );

/** Satu kelompok: deret hari dari tanggal 1, berhenti visual di titik putus. */
const Kelompok = ({ k }) => (
  <div className="overflow-hidden bg-white border rounded-lg">
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b bg-slate-50">
      <div className="text-sm font-semibold text-slate-800">
        Kelompok {k.kelompok}
      </div>
      <div className="text-xs text-slate-600">
        {k.utuh_sampai ? (
          <>
            rantai utuh sampai{" "}
            <b className="text-emerald-700">
              {dayjs(k.utuh_sampai).format("DD MMM")}
            </b>
          </>
        ) : (
          <b className="text-red-600">rantai putus sejak hari pertama</b>
        )}
        {k.putus_di && (
          <>
            {" "}
            · putus di{" "}
            <b className="text-red-600">{dayjs(k.putus_di).format("DD MMM")}</b>
          </>
        )}
        <span className="ml-2 text-slate-400">
          ({k.jumlah_lengkap}/{k.jumlah_hari} hari lengkap)
        </span>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-slate-500">
          <tr className="border-b">
            <th className="px-2 py-1 font-medium text-left">Tgl</th>
            <th className="px-2 py-1 font-medium text-right">Drop</th>
            <th className="px-2 py-1 font-medium text-right">Storting</th>
            <th className="px-2 py-1 font-medium text-center">Kepala</th>
            <th className="px-2 py-1 font-medium text-center">Kasir</th>
            <th className="px-2 py-1 font-medium text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {k.hari.map((h) => (
            <tr
              key={h.tanggal}
              className={`border-b last:border-0 ${
                h.di_luar_rantai
                  ? "bg-slate-50 text-slate-400"
                  : h.lengkap
                    ? ""
                    : "bg-red-50"
              }`}
            >
              <td className="px-2 py-1 tabular-nums">
                {dayjs(h.tanggal).format("DD ddd")}
              </td>
              <td className="px-2 py-1 text-right tabular-nums">
                {rupiah(h.drop)}
              </td>
              <td className="px-2 py-1 text-right tabular-nums">
                {rupiah(h.storting)}
              </td>
              <td className="px-2 py-1 text-center">
                <div className="flex justify-center">
                  <Tanda ada={h.kepala} />
                </div>
              </td>
              <td className="px-2 py-1 text-center">
                <div className="flex justify-center">
                  <Tanda ada={h.kasir} />
                </div>
              </td>
              <td className="px-2 py-1">
                {h.lengkap && !h.di_luar_rantai ? (
                  <span className="text-emerald-700">dalam rantai</span>
                ) : h.di_luar_rantai ? (
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Minus className="size-3" /> di luar rantai
                  </span>
                ) : (
                  <span className="font-medium text-red-600">
                    RANTAI PUTUS DI SINI
                  </span>
                )}
              </td>
            </tr>
          ))}
          {k.hari.length === 0 && (
            <tr>
              <td colSpan={6} className="px-2 py-4 text-center text-slate-500">
                Tidak ada baris rekap untuk periode ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const KesiapanClosing = ({ datas = [], server_filter }) => {
  const gantiPeriode = (v) =>
    v &&
    router.get(
      route("migrasi.kesiapan_closing"),
      { periode: `${v}-01` },
      { preserveState: true, preserveScroll: true },
    );

  const siap = datas.filter((d) => !d.putus_di).length;

  return (
    <Authenticated>
      <Head title="Kesiapan Closing" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Kesiapan Closing — {server_filter?.unit}
            </h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Menelusuri rekap harian dari tanggal 1, dan berhenti di hari
              pertama yang approval kepala atau kasirnya belum ada. Yang perlu
              diketahui bukan berapa hari yang lengkap, melainkan{" "}
              <b>sampai hari ke berapa rantainya masih utuh</b>.
            </p>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-slate-600">
              Periode
            </label>
            <Input
              type="month"
              className="w-40"
              defaultValue={dayjs(server_filter?.periode).format("YYYY-MM")}
              onChange={(e) => gantiPeriode(e.target.value)}
            />
          </div>
        </div>

        <div
          className={`rounded-lg border p-3 text-xs ${
            siap === datas.length && datas.length > 0
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-amber-300 bg-amber-50 text-amber-900"
          }`}
        >
          <b>
            {siap} dari {datas.length} kelompok
          </b>{" "}
          rantainya utuh sebulan penuh.
          {siap < datas.length && (
            <>
              {" "}
              Sisanya putus di suatu titik — selama itu belum dibereskan, saldo
              berjalannya tidak bisa ditelusuri lewat rangkaian yang utuh.
            </>
          )}
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {datas.map((k) => (
            <Kelompok key={k.kelompok} k={k} />
          ))}
        </div>

        <div className="p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600">
          <b>Kenapa berhenti, bukan menghitung total.</b> "22 dari 27 hari
          terisi" terdengar bagus, padahal kalau yang bolong justru hari
          pertama, rantainya putus sejak awal. Hari sesudah titik putus ditandai{" "}
          <i>di luar rantai</i> — angkanya belum tentu salah, tapi tidak lagi
          bisa ditelusuri sebagai rangkaian.
        </div>
      </div>
    </Authenticated>
  );
};

export default KesiapanClosing;
