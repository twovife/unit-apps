import React, { useState } from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';

const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const pad = (n) => String(n).padStart(2, '0');

/**
 * Pemilih bulan bergaya sama dengan TanggalKerja - pengganti <input
 * type="month"> yang tampilannya tergantung browser (Firefox/Safari desktop
 * malah cuma kotak teks). onChange menerima { target: { name, value } },
 * value = 'YYYY-MM'. `max` ('YYYY-MM', opsional) mematikan bulan sesudahnya.
 */
const PilihBulan = ({ name, value, onChange, disabled, max, placeholder = 'Pilih bulan', className }) => {
  const sekarang = new Date();
  const [tahunBatas, bulanBatas] = max ? max.split('-').map(Number) : [Infinity, 12];
  const tahunIni = sekarang.getFullYear();
  const [tahunNilai, bulanNilai] = value ? value.split('-').map(Number) : [];

  const [buka, setBuka] = useState(false);
  const [tahun, setTahun] = useState(tahunNilai || tahunIni);

  const pilih = (b) => {
    setBuka(false);
    onChange?.({ target: { name, value: `${tahun}-${pad(b)}` } });
  };

  return (
    <div className={className}>
      <Popover
        open={buka}
        onOpenChange={(o) => {
          if (disabled) return;
          if (o) setTahun(tahunNilai || tahunIni);
          setBuka(o);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn('w-full justify-between font-normal', !value && 'text-muted-foreground')}
          >
            {value ? `${NAMA_BULAN[bulanNilai - 1]} ${tahunNilai}` : <span>{placeholder}</span>}
            <CalendarIcon className="w-4 h-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[18rem] p-3" align="start">
          <div className="flex items-center justify-between mb-2">
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTahun(tahun - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold tabular-nums">{tahun}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={tahun >= tahunBatas}
              onClick={() => setTahun(tahun + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {BULAN_PENDEK.map((label, i) => {
              const b = i + 1;
              const terpilih = tahun === tahunNilai && b === bulanNilai;
              const lewatBatas = tahun > tahunBatas || (tahun === tahunBatas && b > bulanBatas);
              return (
                <Button
                  key={label}
                  type="button"
                  size="sm"
                  variant={terpilih ? 'default' : 'ghost'}
                  disabled={lewatBatas}
                  onClick={() => pilih(b)}
                  className="font-normal"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PilihBulan;
