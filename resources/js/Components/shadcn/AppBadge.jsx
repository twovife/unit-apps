import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * AppBadge - lencana bergaya seragam dengan `app_laravel`.
 *
 * DUA KELUARGA WARNA:
 *
 *  1. PEKAT (bawaan) - `from-*-500 to-*-600` + teks putih, gradasinya sedaftar
 *     dengan AppButton. Dipakai untuk status yang harus langsung terbaca dari
 *     kejauhan (status pengajuan di kartu nasabah).
 *     Nada dinaikkan satu tingkat dari tombol (500->600, bukan 400->500) supaya
 *     teks putih tetap kontras pada lencana yang ukurannya kecil.
 *
 *  2. LEMBUT (`*Soft`) - gaya ASLI app_laravel: `from-*-50 to-*-50` + teks
 *     `*-700`. Disalin dari `app_laravel/resources/js/components/ui/badge.tsx`.
 *     Dipakai untuk label sekunder yang tidak boleh mencuri perhatian.
 *
 * Awalnya keluarga lembut dijadikan bawaan agar persis app_laravel, tapi di
 * kartu nasabah hasilnya kurang menonjol - jadi yang pekat dinaikkan jadi bawaan
 * dan yang lembut tetap tersedia lewat akhiran `Soft`.
 *
 * `black` pekat di kedua keluarga: kalau ikut pola *-50 dia cuma jadi abu-abu
 * muda dan tidak terbaca sebagai "hitam".
 *
 * Selektor `[a&]:hover:` hanya aktif kalau badge dirender sebagai <a> lewat
 * `asChild` - badge diam tidak ikut berubah saat disentuh kursor.
 *
 * CATATAN: `@/shadcn/ui/badge` yang lama TIDAK diubah, masih dipakai
 * `BadgeStatus`/`BargeStatus` dengan nama varian berbeda. AppBadge untuk kode baru.
 */

const appBadgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-md border font-semibold uppercase tracking-wide whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        /* ---------- PEKAT (bawaan) - gradasi & teks putih, sama seperti
           AppButton supaya status langsung menonjol dari kejauhan. Warna
           gradasinya identik dengan tombol, jadi bahasa warnanya satu. ---------- */
        primary:
          'border-transparent bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-sm focus-visible:ring-blue-500/20 [a&]:hover:from-blue-600 [a&]:hover:to-indigo-700',
        submission:
          'border-transparent bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-sm focus-visible:ring-emerald-500/20 [a&]:hover:from-emerald-600 [a&]:hover:to-teal-700',
        warning:
          'border-transparent bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-sm focus-visible:ring-amber-500/20 [a&]:hover:from-amber-600 [a&]:hover:to-orange-700',
        danger:
          'border-transparent bg-linear-to-r from-red-500 to-rose-600 text-white shadow-sm focus-visible:ring-red-500/20 [a&]:hover:from-red-600 [a&]:hover:to-rose-700',
        black:
          'border-transparent bg-linear-to-r from-zinc-700 to-zinc-900 text-white shadow-sm focus-visible:ring-zinc-500/20 dark:from-zinc-200 dark:to-white dark:text-zinc-900 [a&]:hover:from-zinc-800 [a&]:hover:to-zinc-950',

        /* ---------- LEMBUT - gaya asli app_laravel (`from-*-50` + teks `*-700`).
           Dipertahankan untuk tempat yang butuh lencana kalem, misal chip filter
           atau label sekunder yang tidak boleh mencuri perhatian. ---------- */
        primarySoft:
          'border-transparent bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 focus-visible:ring-blue-500/20 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 [a&]:hover:from-blue-100 [a&]:hover:to-indigo-100',
        submissionSoft:
          'border-transparent bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 focus-visible:ring-emerald-500/20 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-300 [a&]:hover:from-emerald-100 [a&]:hover:to-teal-100',
        warningSoft:
          'border-transparent bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 focus-visible:ring-amber-500/20 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-300 [a&]:hover:from-amber-100 [a&]:hover:to-orange-100',
        dangerSoft:
          'border-transparent bg-linear-to-r from-red-50 to-rose-50 text-red-700 focus-visible:ring-red-500/20 dark:from-red-900/40 dark:to-rose-900/40 dark:text-red-300 [a&]:hover:from-red-100 [a&]:hover:to-rose-100',
        blackSoft:
          'border-transparent bg-zinc-100 text-zinc-800 focus-visible:ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-200 [a&]:hover:bg-zinc-200',

        /* ---------- OUTLINE ---------- */
        primaryOutline:
          'border-blue-500 bg-transparent text-blue-600 focus-visible:ring-blue-500/20 dark:border-blue-500 dark:text-blue-400 [a&]:hover:bg-blue-50 dark:[a&]:hover:bg-blue-950/50',
        submissionOutline:
          'border-emerald-500 bg-transparent text-emerald-600 focus-visible:ring-emerald-500/20 dark:border-emerald-500 dark:text-emerald-400 [a&]:hover:bg-emerald-50 dark:[a&]:hover:bg-emerald-950/50',
        warningOutline:
          'border-amber-500 bg-transparent text-amber-600 focus-visible:ring-amber-500/20 dark:border-amber-500 dark:text-amber-400 [a&]:hover:bg-amber-50 dark:[a&]:hover:bg-amber-950/50',
        dangerOutline:
          'border-red-500 bg-transparent text-red-600 focus-visible:ring-red-500/20 dark:border-red-500 dark:text-red-400 [a&]:hover:bg-red-50 dark:[a&]:hover:bg-red-950/50',
        blackOutline:
          'border-zinc-800 bg-transparent text-zinc-800 focus-visible:ring-zinc-500/20 dark:border-zinc-300 dark:text-zinc-200 [a&]:hover:bg-zinc-100 dark:[a&]:hover:bg-zinc-800',

        /* ---------- GHOST: tanpa border, tanpa latar ---------- */
        ghost:
          'border-transparent bg-transparent text-zinc-600 focus-visible:ring-zinc-500/20 dark:text-zinc-400 [a&]:hover:bg-zinc-100 dark:[a&]:hover:bg-zinc-800',
      },

      size: {
        xs: 'gap-1 px-1.5 py-0 text-[10px] leading-4 [&>svg]:size-2.5',
        sm: 'gap-1 px-2 py-0.5 text-xs [&>svg]:size-3',
        base: 'gap-1.5 px-2.5 py-0.5 text-xs [&>svg]:size-3',
        lg: 'gap-1.5 px-3 py-1 text-sm [&>svg]:size-3.5',
        xl: 'gap-2 px-4 py-1.5 text-base [&>svg]:size-4',

        /* ---------- IKON / TITIK (bujur sangkar, tanpa teks) ---------- */
        iconXs: 'size-4 p-0 [&>svg]:size-2.5',
        iconSm: 'size-5 p-0 [&>svg]:size-3',
        icon: 'size-6 p-0 [&>svg]:size-3.5',
        iconLg: 'size-7 p-0 [&>svg]:size-4',
        iconXl: 'size-8 p-0 [&>svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
    },
  },
);

const AppBadge = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span';
    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(appBadgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

AppBadge.displayName = 'AppBadge';

export { AppBadge, appBadgeVariants };
export default AppBadge;
