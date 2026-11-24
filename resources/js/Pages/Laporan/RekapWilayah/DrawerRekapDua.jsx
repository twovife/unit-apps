/**
 * Rekap 2 satu kantor, ditumpangkan di dalam drawer.
 *
 * Isinya halaman Rekap 2 yang SEBENARNYA, dimuat lewat <iframe> dengan
 * ?polos=1 supaya sidebar & navbar tidak ikut. Bukan tiruan: tidak ada tabel
 * kedua yang perlu dijaga supaya tetap sama dengan aslinya.
 *
 * Cabang aktif pengguna tidak ikut berpindah — rutenya mengembalikannya
 * sesudah data dihitung.
 */
export default function DrawerRekapDua({ kantor, onTutup }) {
  if (!kantor) {
    return null;
  }

  const url =
    route('laporan.rekap_wilayah.rekap_dua', kantor.branch_id) +
    `?bulan=${kantor.bulan}&polos=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40 p-4" onClick={onTutup}>
      <div
        className="flex w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-4 py-2">
          <h2 className="text-sm font-semibold">
            Rekap 2 · {kantor.unit}
            <span className="ml-2 font-normal text-slate-400">{kantor.bulan}</span>
          </h2>
          <a
            href={url.replace('&polos=1', '')}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-sky-600 underline"
            title="Cabang aktif Anda akan berpindah ke kantor ini"
          >
            buka di tab baru
          </a>
          <button type="button" onClick={onTutup} className="ml-auto rounded border px-2 py-0.5 text-xs hover:bg-slate-100">
            Tutup
          </button>
        </div>

        <iframe src={url} title={`Rekap 2 ${kantor.unit}`} className="h-full w-full flex-1 border-0" />
      </div>
    </div>
  );
}
