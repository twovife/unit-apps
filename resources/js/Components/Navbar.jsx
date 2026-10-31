import React from 'react';
import { SidebarTrigger } from '@/shadcn/ui/sidebar';
import GlobalBranchFilter from './GlobalBranchFilter';
import SaklarRibuan from './SaklarRibuan';
import VideoTutorialButton from './VideoTutorialButton';

// Nama route => kode menu video (VideoTutorial::MENU). Menu yang tombolnya sudah
// ada di halamannya sendiri (aset, lamaran, sksw, kasir, angsuran) tidak diulang.
const MENU_VIDEO = {
  home: 'home',
  'mobile_apps.create': 'pengajuan',
  'transaction.index_buku_transaksi': 'buku_transaksi',
  'transaction.fastcreate': 'fastcreate',
  'transaction.inputmacet': 'input_macet',
  'pinjaman.index_pinjaman_macet': 'macet',
  'pinjaman.index_pinjaman_search': 'cari_angsuran',
  'kasir.rekap.rekap_satu': 'rekap_satu',
  'kasir.rekap.rekap_dua': 'rekap_dua',
  'kasir.rekap.rencana_drop': 'rencana_drop',
  'kasir.rekap.rekap_permantri': 'rekap_permantri',
  'administrasi.manpower.index': 'manpower',
  'tabungan.contributions': 'tabungan',
  'bop.contributions': 'bop',
  'dashboard.kasir.goro_umrah': 'goro_umrah',
  'dashboard.kasir.pinjaman_modal': 'pinjaman_modal',
};

const Navbar = ({ header }) => {
  const menuVideo = MENU_VIDEO[route().current()];
  return (
    <header className="sticky top-0 z-30 flex items-center h-14 gap-4 px-4 bg-white border-b shrink-0 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <span className="font-semibold text-slate-800 text-sm hidden sm:inline-block">
          UBMI DIGITAL
        </span>
        <SaklarRibuan />
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        {menuVideo && <VideoTutorialButton menu={menuVideo} buttonText="Video" />}
        <GlobalBranchFilter compact />
      </div>
    </header>
  );
};

export default Navbar;
