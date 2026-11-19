import React from 'react';
import dayjs from 'dayjs';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';

/**
 * Riwayat perjalanan satu pengajuan: Diajukan -> ACC -> Drop.
 *
 * Setiap tahap menampilkan nominal, siapa pelakunya, dan kapan terjadi.
 * Kolom sumbernya di `transaction_loans`:
 *   diajukan : request_nominal | user_mantri | request_date
 *   acc      : approved_nominal | user_check  | check_date
 *   drop     : nominal_drop     | user_drop   | drop_date
 *
 * Catatan data: pengajuan drop langsung (`drop_langsung = baru`) melompati
 * tahap ACC, sehingga user_check & check_date memang NULL - ditampilkan
 * sebagai "dilewati", bukan dianggap data hilang.
 */

const tanggal = (value) => (value ? dayjs(value).format('DD MMM YYYY') : null);

const Tahap = ({ label, aktif, dilewati, nominal, oleh, pada }) => {
  const warna = dilewati
    ? 'bg-muted text-muted-foreground border-muted-foreground/30'
    : aktif
      ? 'bg-primary text-primary-foreground border-primary'
      : 'bg-background text-muted-foreground border-input';

  return (
    <div className="flex gap-3">
      {/* Rel penanda tahap */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${warna}`}
        >
          {dilewati ? '–' : aktif ? '✓' : '•'}
        </div>
        <div className="flex-1 w-px my-1 bg-border" />
      </div>

      <div className="flex-1 min-w-0 pb-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {label}
          </span>
          {nominal ? (
            <FormatNumbering
              value={nominal}
              className="text-sm font-bold tabular-nums text-foreground"
            />
          ) : (
            <span className="text-sm text-muted-foreground">&mdash;</span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
          {dilewati ? (
            <span className="italic">Dilewati (drop langsung)</span>
          ) : aktif ? (
            <>
              oleh{' '}
              <span className="font-medium text-foreground">
                {oleh || 'tidak tercatat'}
              </span>
              {pada ? (
                <>
                  {' · '}
                  <span className="tabular-nums">{pada}</span>
                </>
              ) : (
                ' · tanggal tidak tercatat'
              )}
            </>
          ) : (
            <span className="italic">Belum</span>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusPengajuan = ({ data }) => {
  if (!data) return null;

  const status = data.status ?? 'open';
  const dropLangsung = data.drop_langsung === 'baru';

  // Urutan status: open -> acc -> success. `tolak` & `gagal` menghentikan alur.
  const sudahAcc = ['acc', 'success'].includes(status);
  const sudahDrop = status === 'success';
  const ditolak = status === 'tolak';
  const gagal = status === 'gagal';

  return (
    <div>
      <Tahap
        label="Diajukan"
        aktif={true}
        nominal={data.request}
        oleh={data.diajukan_oleh}
        pada={tanggal(data.request_date)}
      />
      <Tahap
        label={ditolak ? 'Ditolak' : 'ACC'}
        aktif={sudahAcc || ditolak}
        dilewati={dropLangsung && !sudahAcc && !ditolak}
        nominal={data.acc}
        oleh={data.acc_oleh}
        pada={tanggal(data.check_date)}
      />
      <Tahap
        label={gagal ? 'Gagal Drop' : 'Drop Jadi'}
        aktif={sudahDrop || gagal}
        nominal={data.drop_jadi}
        oleh={data.drop_oleh}
        pada={tanggal(data.tanggal_drop)}
      />

      {data.diinput_oleh && (
        <div className="pt-2 mt-1 text-[11px] border-t text-muted-foreground">
          Diinput oleh{' '}
          <span className="font-medium text-foreground">
            {data.diinput_oleh}
          </span>
          {data.diinput_pada
            ? ` · ${dayjs(data.diinput_pada).format('DD MMM YYYY HH:mm')}`
            : ''}
        </div>
      )}
    </div>
  );
};

export default StatusPengajuan;
