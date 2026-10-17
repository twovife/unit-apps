import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SweetAlert = ({ type, message, keys }) => {
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const alertInstance = MySwal.fire({
      // warning: dialog di tengah yang harus ditutup sendiri, bukan toast 2 detik.
      position: type === 'warning' ? 'center' : 'top-end',
      icon: type,
      title:
        message ||
        (type === 'error'
          ? 'Terjadi Kesalahan Silahkan hub IT.'
          : 'Anda Telah Melakukan Perubahan'),
      showConfirmButton: type === 'warning',
      confirmButtonText: 'Mengerti',
      timer: type === 'warning' ? undefined : 2000,
    });
  }, [type, message, keys]);

  return null;
};
export default SweetAlert;
