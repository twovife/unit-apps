import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import useHariLibur from '@/Hooks/useHariLibur';
import { CalendarIcon, CalendarOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Calendar } from '@/shadcn/ui/calendar';
import { id as localeId } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';

/**
 * Pemilih tanggal yang tidak menyediakan hari libur.
 *
 * Pengganti langsung <Input type="date">: onChange menerima bentuk yang sama
 * ({ target: { name, value } }) supaya penanganan di layar tidak perlu diubah.
 *
 * KENAPA MEMATIKAN TANGGALNYA, BUKAN CUMA MENOLAK SESUDAHNYA
 * ----------------------------------------------------------
 * Server sudah menolak tanggal libur (App\Rules\HariKerja), dan itu tetap jadi
 * penjaga sebenarnya — layar bisa dilewati, permintaan bisa dikarang. Tapi
 * penolakan setelah tombol simpan ditekan artinya user mengisi seluruh
 * formulir dulu baru diberi tahu. Tanggal yang tidak bisa diklik memberi tahu
 * hal yang sama sebelum ada yang diketik.
 *
 * Dua lapis ini bukan duplikasi: yang satu mencegah, yang satu menjamin.
 *
 * DAFTAR LIBURNYA DIAMBIL PER RENTANG YANG DILIHAT
 * ------------------------------------------------
 * Bukan sekali di awal untuk semua tahun. Yang dibutuhkan cuma bulan yang
 * sedang dibuka; rentang yang sudah pernah diambil disimpan supaya membuka-
 * tutup kalender tidak memanggil server berulang kali.
 */
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const HARI_KE_ANGKA = {
  minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6,
};

const NAMA_HARI = [
  'minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu',
];

const TanggalKerja = ({
  name = 'date',
  value,
  onChange,
  min,
  max,
  disabled = false,
  required = false,
  placeholder = 'Pilih tanggal',
  /**
   * Kunci ke satu hari tagih. Boleh nama ("sabtu") atau angka dayjs 0-6.
   * Angka lebih aman dipakai pemanggil: nama hari bergantung locale dayjs yang
   * belum tentu terpasang, dan kalau meleset penguncian harinya diam-diam mati.
   * Kosong = hari kerja apa saja.
   */
  hariTagih = null,
  className,
}) => {
  const [buka, setBuka] = useState(false);

  const terpilih = value ? dayjs(value).toDate() : null;
  const [bulanTampil, setBulanTampil] = useState(
    terpilih ?? (min ? dayjs(min).toDate() : new Date()),
  );

  const { libur, tahun, alasanLibur, hariKerja } = useHariLibur(bulanTampil);

  // Ikut pindah kalau nilainya diganti dari luar (mis. tanggal drop otomatis
  // menyesuaikan tanggal pengajuan).
  useEffect(() => {
    if (value) setBulanTampil(dayjs(value).toDate());
  }, [value]);

  const hariTagihAngka =
    hariTagih === null || hariTagih === undefined || hariTagih === ''
      ? null
      : typeof hariTagih === 'number'
        ? hariTagih
        : (HARI_KE_ANGKA[String(hariTagih).toLowerCase()] ?? null);

  const tidakBoleh = (tgl) => {
    const d = dayjs(tgl);

    if (min && d.isBefore(dayjs(min), 'day')) return true;
    if (max && d.isAfter(dayjs(max), 'day')) return true;
    if (hariTagihAngka !== null && tgl.getDay() !== hariTagihAngka) return true;

    // Minggu, tanggal bertanda libur, dan tahun di luar rentang wajar semuanya
    // dijawab satu fungsi yang sama dengan yang dipakai layar lain.
    return !hariKerja(tgl);
  };

  const pilih = (tgl) => {
    if (!tgl || tidakBoleh(tgl)) return;
    onChange({ target: { name, value: dayjs(tgl).format('YYYY-MM-DD') } });
    setBuka(false);
  };

  const tanggalLibur = useMemo(
    () => Object.keys(libur).map((t) => dayjs(t).toDate()),
    [libur],
  );

  const alasanTerpilih = terpilih ? alasanLibur(terpilih) : null;

  return (
    <div className={className}>
      <Popover open={buka} onOpenChange={disabled ? undefined : setBuka}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            {value
              ? dayjs(value).format('DD MMMM YYYY')
              : <span>{placeholder}</span>}
            <CalendarIcon className="w-4 h-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center gap-2 px-3 pt-3">
            <select
              className="flex-1 px-2 py-1 text-sm border rounded-md bg-background"
              value={dayjs(bulanTampil).month()}
              onChange={(e) =>
                setBulanTampil(
                  dayjs(bulanTampil).month(Number(e.target.value)).toDate(),
                )
              }
            >
              {NAMA_BULAN.map((b, i) => (
                <option key={b} value={i}>
                  {b}
                </option>
              ))}
            </select>
            <select
              className="px-2 py-1 text-sm border rounded-md bg-background tabular-nums"
              value={dayjs(bulanTampil).year()}
              onChange={(e) =>
                setBulanTampil(
                  dayjs(bulanTampil).year(Number(e.target.value)).toDate(),
                )
              }
            >
              {Array.from(
                { length: tahun.maks - tahun.min + 1 },
                (_, i) => tahun.min + i,
              ).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <Calendar
            mode="single"
            // Tanpa ini kapsinya "August 2026" sementara dropdown di atas
            // "Agustus" - satu kalender bicara dua bahasa sekaligus.
            locale={localeId}
            selected={terpilih ?? undefined}
            onSelect={pilih}
            month={bulanTampil}
            onMonthChange={setBulanTampil}
            disabled={tidakBoleh}
            modifiers={{ libur: tanggalLibur }}
            modifiersClassNames={{
              libur: 'text-red-600 line-through opacity-70',
            }}
            // Nama bulannya sudah ada di dropdown; menampilkannya lagi di
            // kapsi cuma judul dobel. Panah geser bulan tetap dipakai.
            classNames={{ caption_label: 'sr-only' }}
          />

          <div className="px-3 pt-1 pb-3 space-y-1 text-xs border-t text-muted-foreground">
            <div className="flex items-center gap-1.5 pt-2">
              <CalendarOff className="w-3 h-3 text-red-600" />
              <span>Tanggal bercoret = hari libur, tidak bisa dipilih</span>
            </div>
            {hariTagihAngka !== null && (
              <div>
                Hanya hari{' '}
                <b className="capitalize">{NAMA_HARI[hariTagihAngka]}</b> — hari
                tagih kelompok tidak berubah
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Input tersembunyi supaya `required` bawaan browser & submit form tetap
          bekerja seperti waktu masih memakai <Input type="date">. */}
      <input
        type="hidden"
        name={name}
        value={value ?? ''}
        required={required}
        readOnly
      />

      {alasanTerpilih && (
        <p className="mt-1 text-xs text-red-600">
          Tanggal ini libur ({alasanTerpilih}) — pilih tanggal lain.
        </p>
      )}
    </div>
  );
};

export default TanggalKerja;
