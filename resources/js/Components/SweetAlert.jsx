import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SweetAlert = ({ type, message }) => {
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        if (type === "error") {
            MySwal.fire({
                position: "top-end",
                icon: "error",
                title: message || "Terjadi Kesalahan Silahkan hub IT.",
                showConfirmButton: false,
                timer: 1500,
            });
        } else if (type === "success") {
            MySwal.fire({
                position: "top-end",
                icon: "success",
                title: message || "Anda Telah Melakukan Perubahan",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }, [type, message]);

    return null;
};
export default SweetAlert;
