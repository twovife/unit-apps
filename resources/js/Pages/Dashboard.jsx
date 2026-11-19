import { Head } from '@inertiajs/react';
import PengumumanPembaruan from '@/Components/PengumumanPembaruan';

export default function Dashboard({ video }) {
  return (
    <>
      <Head title="Home" />
      <PengumumanPembaruan video={video ?? {}} />
    </>
  );
}
