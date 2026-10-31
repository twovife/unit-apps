import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const HARI_TO_DOW = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6,
};

/**
 * Tanggal terakhir yang jatuh pada `hari` tertentu (termasuk hari ini kalau
 * memang cocok) - meniru persis `AppHelper::getStortingShowDate()` di server.
 * Dipakai di mana pun form perlu default tanggal yang harus sehari dengan
 * hari koleksi pinjaman (server menolak kalau nama harinya beda).
 */
export function getLastDateForHari(hari) {
  const today = dayjs();
  const targetDow = HARI_TO_DOW[hari?.toLowerCase()] ?? today.day();
  if (today.day() === targetDow) return today.format('YYYY-MM-DD');
  let diff = today.day() - targetDow;
  if (diff <= 0) diff += 7;
  return today.subtract(diff, 'day').format('YYYY-MM-DD');
}

export function showNominalByStatus(params, status) {
  if (params == 'acc') {
    switch (status) {
      case 'acc':
        return true;
        break;
      case 'success':
        return true;
        break;
      case 'gagal':
        return true;
        break;
      default:
        false;
        break;
    }
  }
  if (params == 'nominal_drop') {
    switch (status) {
      case 'success':
        return true;
        break;
      default:
        false;
        break;
    }
  }
}
