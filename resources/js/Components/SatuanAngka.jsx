import { useModeRibuan } from '@/lib/modeAngka';

/** Keterangan satuan angka yang ikut saklar header (ribuan / rupiah penuh). */
export default function SatuanAngka({ pendek = false, kecil = false, titik = true }) {
  const ribuan = useModeRibuan();
  if (pendek) return ribuan ? 'ribuan' : 'rupiah';
  const teks = ribuan ? 'Angka dalam ribuan' : 'Angka dalam rupiah penuh';
  return (kecil ? teks.charAt(0).toLowerCase() + teks.slice(1) : teks) + (titik ? '.' : '');
}
