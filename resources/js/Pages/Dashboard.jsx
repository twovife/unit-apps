import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';

// Pengumuman pembaruan aplikasi, per bagian. `judul` null = tanpa judul.
// `penting` = ditampilkan merah.
const PENGUMUMAN = [
  {
    judul: null,
    isi: [
      { teks: 'Update tampilan aplikasi.' },
      { teks: 'Pengajuan nasabah lama lewat menu Angsuran.' },
      { teks: 'Perubahan tampilan menu Angsuran.' },
      { teks: 'Input Nomor Anggota (agar nama nasabah urut berdasarkan nomor anggota).' },
      { teks: 'Perubahan pemilihan Tanggal Drop (agar tidak salah input tanggal libur).' },
      { teks: 'Perubahan tampilan menu Drop & input Target.' },
      { teks: 'Perubahan tampilan menu Buku Angsuran.' },
    ],
  },
  {
    judul: 'KM, Kasir, Staf dan Pimpinan',
    isi: [
      { teks: 'Perubahan tampilan menu Rekap 1 & Tunai Mantri.' },
      { teks: 'Perubahan tampilan menu Rekap 2 (bisa input target & input tunai mantri dari sini).' },
    ],
  },
  {
    judul: 'Perubahan Sistem',
    isi: [
      {
        teks: 'Kunci Hari (hari yang sudah dikunci oleh KM & Staf tidak bisa diedit / dihapus lagi).',
        penting: true,
      },
      {
        teks: 'Sistem pengajuan dari menu Angsuran (jika pengajuan diinput dari sini dan drop sudah sukses / diklik drop, angsuran otomatis melunasi).',
      },
      { teks: 'TD (otomatis input TD untuk yang gagal drop).' },
    ],
  },
];

export default function Dashboard(props) {
  return (
    <AuthenticatedLayout auth={props.auth} errors={props.errors} header="Home">
      <Head title="Home" />

      <div className="max-w-3xl space-y-4">
        <section className="overflow-hidden bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-slate-50">
            <Megaphone className="w-5 h-5 text-sky-600 shrink-0" aria-hidden="true" />
            <h2 className="font-semibold text-slate-900">Pengumuman Pembaruan</h2>
          </div>
          <div className="px-4 py-3 space-y-4 text-sm">
            {PENGUMUMAN.map((bagian, b) => (
              <div key={b}>
                {bagian.judul && <h3 className="mb-1.5 font-semibold text-slate-900">{bagian.judul}</h3>}
                <ol className="space-y-2">
                  {bagian.isi.map((p, i) => (
                    <li
                      key={i}
                      className={`flex gap-2 ${p.penting ? 'p-2 -mx-2 rounded-md bg-red-50 text-red-700 font-semibold' : 'text-slate-700'}`}
                    >
                      <span className="w-5 text-right shrink-0 tabular-nums">{i + 1}.</span>
                      <span>{p.teks}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
