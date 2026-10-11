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
 *  - mantri     : boleh jika drop_date ATAU request_date pinjaman ini adalah
 *                 HARI INI, atau pengajuan yang belum di-ACC KM (status open,
 *                 drop belum lewat). Dibandingkan di klien, sumber kebenarannya
 *                 tetap server - ini murni supaya tombol tidak menyesatkan.
 *  - terkunci   : `recap_approved` (hari drop dikunci kasir / di-ACC kepala)
 *                 - blokir semua peran, termasuk mantri dan superuser.
 *  - can-approve: boleh.
 *  - lainnya    : tidak boleh sama sekali.
 */
const rp = (n) => new Intl.NumberFormat('id-ID').format(n ?? 0);

/**
 * Apa yang terjadi kalau pinjaman ini dihapus, dalam bahasa sederhana:
 *  - sukses + pelunasan : angsuran pelunasan pinjaman lama ikut terhapus,
 *                         storting tanggal itu berkurang
 *  - sukses biasa       : pinjaman & angsurannya hilang dari buku angsuran
 *  - pengajuan pelunasan: target keluar nasabah di buku angsuran batal
 *  - pengajuan biasa    : hilang dari rencana drop
 */
const Penjelasan = ({ d }) => {
  if (!d) return null;
  let nada = 'border-slate-200 bg-slate-50 text-slate-700';
  let isi;

  if (d.status === 'success' && d.dari_pelunasan) {
    nada = 'border-amber-300 bg-amber-50 text-amber-900';
    isi = d.pelunasan ? (
      <>
        Drop ini <b>pelunasan pinjaman lama</b>. Jika dihapus, angsuran pelunasan <b>Rp {rp(d.pelunasan.nominal)}</b> tanggal{' '}
        <b>{dayjs(d.pelunasan.tanggal).format('DD-MM-YYYY')}</b> ikut terhapus: storting tanggal itu berkurang Rp{' '}
        {rp(d.pelunasan.nominal)} dan pinjaman lama kembali belum lunas.
      </>
    ) : (
      <>
        Drop ini <b>pelunasan pinjaman lama</b>. Jika dihapus, pelunasan pinjaman lama ikut batal.
      </>
    );
  } else if (d.status === 'success') {
    isi = <>Pinjaman ini dan angsurannya (kalau ada) akan hilang dari buku angsuran.</>;
  } else if (['open', 'acc'].includes(d.status) && d.dari_pelunasan) {
    nada = 'border-amber-300 bg-amber-50 text-amber-900';
    isi = (
      <>
        Ini <b>pengajuan pelunasan</b>. Menghapusnya akan <b>membatalkan target keluar</b> nasabah ini di buku angsuran.
      </>
    );
  } else if (['open', 'acc'].includes(d.status)) {
    isi = <>Pengajuan ini akan dihapus dari rencana drop.</>;
  } else {
    isi = <>Pengajuan {d.status} ini hanya akan dirapikan dari daftar.</>;
  }

  return <div className={`mb-2 p-2 text-xs text-left border rounded-md leading-relaxed ${nada}`}>{isi}</div>;
};

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
    triggeredData?.request_date === todayStr ||
    (triggeredData?.status === 'open' && triggeredData?.tanggal_drop >= todayStr);

  let bolehHapus = false;
  let pesanTerkunci = null;
  let severity = 'amber'; // 'amber' = keterbatasan wajar; 'destructive' = terkunci data

  if (sudahDiajukanPengganti) {
    bolehHapus = false;
    pesanTerkunci =
      'Transaksi ini sudah diajukan (jadi dasar pengajuan/Tundaan lain yang masih berjalan), tidak bisa dihapus.';
    severity = 'destructive';
  } else if (recapApproved) {
    // Hari drop sudah dikunci: semua peran, termasuk mantri.
    bolehHapus = false;
    pesanTerkunci = 'Hari drop pinjaman ini sudah dikunci, pinjaman tidak bisa dihapus.';
    severity = 'destructive';
  } else if (isMantri && triggeredData?.status === 'acc') {
    bolehHapus = false;
    pesanTerkunci = 'Pengajuan sudah di-ACC oleh KM, hanya KM yang bisa menghapus.';
  } else if (isMantri) {
    bolehHapus = bisaHapusMantri;
    pesanTerkunci =
      'Mantri hanya bisa menghapus pinjaman hari ini, atau pengajuan yang belum di-ACC KM. Hubungi KM / Pimpinan untuk yang lain.';
  } else if (canApprove) {
    bolehHapus = true;
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
      // Jangan lompat ke atas daftar sesudah hapus.
      preserveScroll: true,
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
        <Penjelasan d={triggeredData} />
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
      <Penjelasan d={triggeredData} />
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
