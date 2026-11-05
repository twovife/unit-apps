import { Head } from '@inertiajs/react';
import PembayaranKantor from '@/Components/PembayaranKantor';
import PengumumanPembaruan from '@/Components/PengumumanPembaruan';

/** Dashboard Kasir: sapaan + profil, tugas harian, pembayaran kantor (PembayaranKantorController), pengumuman. */
export default function DashboardKasir({ videos, video, profil }) {
  return (
    <>
      <Head title="Dashboard Kasir" />
      <div className="max-w-7xl">
        <PembayaranKantor videos={videos} profil={profil} samping={<PengumumanPembaruan video={video ?? {}} lipat />} />
      </div>
    </>
  );
}
