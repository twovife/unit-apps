import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import { useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

/**
 * Gerbang tampilan HARUS sejalan dengan `AppHelper::canDeleteLoan()` di
 * server (destroy_loan) - dua-duanya menerapkan aturan yang sama:
 *
 *  - sudah_diajukan_pengganti: pinjaman ini sudah dijadikan dasar pengajuan
 *                 lain yang masih aktif (top-up ATAU Tundaan) - blokir total,
 *                 TIDAK ADA pengecualian role apa pun (dicek PALING AWAL,
 *                 sebelum aturan mantri/can-approve di bawah).
 *  - mantri     : boleh hanya jika drop_date ATAU request_date pinjaman ini
 *                 adalah HARI INI (dibandingkan di klien, sumber kebenarannya
 *                 tetap server - ini murni supaya tombol tidak menyesatkan).
 *  - can-approve: boleh selama `recap_approved` masih false (rekap harian
 *                 tanggal drop belum di-ACC kepala). TIDAK ADA pengecualian
 *                 superuser di sini - beda dengan Reset Pinjaman.
 *  - lainnya    : tidak boleh sama sekali.
 */
const RemoveLoan = ({ triggeredId, onClosed, triggeredData }) => {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef();

  const { auth } = usePage().props;
  const isMantri = auth?.roles?.includes('mantri');
  const canApprove = auth?.permissions?.includes('can-approve');
  const recapApproved = triggeredData?.recap_approved;
  const sudahDiajukanPengganti = triggeredData?.sudah_diajukan_pengganti;

  const todayStr = dayjs().format('YYYY-MM-DD');
  const bisaHapusMantri =
    triggeredData?.tanggal_drop === todayStr ||
    triggeredData?.request_date === todayStr;

  let bolehHapus = false;
  let pesanTerkunci = null;
  let severity = 'amber'; // 'amber' = keterbatasan wajar; 'destructive' = terkunci data

  if (sudahDiajukanPengganti) {
    bolehHapus = false;
    pesanTerkunci =
      'Transaksi ini sudah diajukan (jadi dasar pengajuan/Tundaan lain yang masih berjalan), tidak bisa dihapus.';
    severity = 'destructive';
  } else if (isMantri) {
    bolehHapus = bisaHapusMantri;
    pesanTerkunci =
      'Mantri hanya bisa menghapus pinjaman dengan tanggal pengajuan atau tanggal drop hari ini. Hubungi KM / Pimpinan untuk tanggal lain.';
  } else if (canApprove) {
    bolehHapus = !recapApproved;
    pesanTerkunci =
      'Rekap harian tanggal drop ini sudah di-ACC pimpinan, pinjaman tidak bisa dihapus.';
    severity = 'destructive';
  } else {
    bolehHapus = false;
    pesanTerkunci = 'Hubungi KM / Pimpinan untuk menghapus pinjaman.';
  }

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm();

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const cancelUserDeletion = () => {
    setTimeout(() => {
      setConfirmingUserDeletion(false);
    }, 200);
  };

  const buttonArea = useRef(null);

  const deleteUser = (e) => {
    e.preventDefault();
    if (!bolehHapus) return;

    destroy(route('pinjaman.destroy_loan', triggeredId), {
      onSuccess: () => {
        reset();
        onClosed();
      },
    });
  };

  // Elemen tetap ditampilkan (bukan disembunyikan) supaya user tahu fitur ini
  // ada dan kenapa tombolnya mati - hanya interaksinya yang dimatikan.
  if (!bolehHapus) {
    return (
      <div className="text-right">
        <Button variant="destructiveoutline2" type="button" disabled>
          Hapus
        </Button>
        <p
          className={`mt-1 text-xs font-medium leading-relaxed ${
            severity === 'destructive' ? 'text-destructive' : 'text-amber-600'
          }`}
        >
          {pesanTerkunci}
        </p>
      </div>
    );
  }

  return (
    <div ref={buttonArea} onMouseLeave={cancelUserDeletion}>
      <Loading show={processing} />
      <form onSubmit={deleteUser}>
        <div className="flex flex-col overflow-hidden h-9">
          <div
            className={`inline transition-all duration-300
            ${confirmingUserDeletion ? 'translate-y-full' : 'translate-y-0'}
            `}
          >
            <Button
              variant="destructiveoutline2"
              type="button"
              onClick={confirmUserDeletion}
            >
              Hapus
            </Button>
          </div>
          <div
            className={`inline transition-all duration-300
            ${confirmingUserDeletion ? '-translate-y-full' : 'translate-y-0'}`}
          >
            <Button
              type="submit"
              variant="destructive"
              onClick={confirmUserDeletion}
            >
              Yakin?
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RemoveLoan;
