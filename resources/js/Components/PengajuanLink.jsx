import React from 'react';
import { Link, usePage } from '@inertiajs/react';

// Link menu "Pengajuan" yang sadar akses. Kalau auth.can_create false (user
// tidak punya kelompok di cabang aktif), render disabled dan tidak menavigasi —
// mencerminkan guard server di mobile_apps.create / store. Dibungkus forwardRef
// dan meneruskan props supaya tetap bekerja di dalam <Button asChild> (Radix
// Slot mengkloning anak tunggalnya dengan props + ref).
const PengajuanLink = React.forwardRef(function PengajuanLink(
  { className = '', children, ...rest },
  ref,
) {
  const { auth } = usePage().props;

  if (!auth?.can_create) {
    return (
      <span
        ref={ref}
        aria-disabled="true"
        title="Tidak ada kelompok di cabang aktif ini — tidak bisa input pengajuan"
        className={`${className} pointer-events-none cursor-not-allowed opacity-50`}
        {...rest}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      ref={ref}
      href={route('mobile_apps.create')}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default PengajuanLink;
