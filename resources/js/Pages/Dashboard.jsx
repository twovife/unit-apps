import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';

// Pengumuman pembaruan aplikasi. `penting` = ditampilkan merah.
const PENGUMUMAN = [
  { teks: 'Update tampilan aplikasi.' },
  { teks: 'Pengajuan nasabah lama bisa diajukan lewat menu Angsuran.' },
  { teks: 'Input Nomor Anggota, agar nasabah urut sesuai nomor anggota.' },
  { teks: 'Perubahan tampilan menu Angsuran agar lebih mudah dibaca.' },
  { teks: 'Perubahan tombol menu agar perpindahan halaman lebih efisien.' },
  {
    teks: 'Angsuran dan drop tidak bisa dihapus jika KM & staf telah selesai melakukan pengecekan (berlaku untuk semua akun).',
    penting: true,
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
          <ol className="px-4 py-3 space-y-2 text-sm">
            {PENGUMUMAN.map((p, i) => (
              <li
                key={i}
                className={`flex gap-2 ${p.penting ? 'p-2 -mx-2 rounded-md bg-red-50 text-red-700 font-semibold' : 'text-slate-700'}`}
              >
                <span className="w-5 text-right shrink-0 tabular-nums">{i + 1}.</span>
                <span>{p.teks}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
