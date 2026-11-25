import { Head } from '@inertiajs/react';
import AngsuranMotor from '@/Components/Assets/AngsuranMotor';

/** Menu Angsuran Motor: bayar batch / per unit, daftar kontrak, input awal (kantor aktif). */
export default function Angsuran() {
  return (
    <>
      <Head title="Angsuran Motor" />
      <div className="space-y-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Angsuran Motor</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tagihan tiap awal bulan, dibayar sesuai tanggal transfer. Catatan saja, tidak masuk pembukuan kas.</p>
        </div>
        <AngsuranMotor />
      </div>
    </>
  );
}
