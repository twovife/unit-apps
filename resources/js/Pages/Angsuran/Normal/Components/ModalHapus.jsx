import { router, useForm } from "@inertiajs/react";
import { replace } from "lodash";
import React from "react";

const ModalHapus = ({ url, show, setShow, loading, setLoading }) => {
    const onSubmitDelete = () => {
        router.delete(url, {
            onStart: (visit) => {
                setLoading(true);
            },
            // onSuccess: (page) => {
            //     console.log(page);
            // },
            // onError: (errors) => {
            //     console.log(errors);
            // },
            onFinish: (visit) => {
                setLoading(false);
                setShow();
            },
        });
    };
    const onClickCancel = () => {
        setShow();
    };
    return (
        <>
            {show && (
                <div
                    className={`bg-white border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow rounded`}
                >
                    <div className="p-3 text-center font-semibold text-lg">
                        Serius Hapus?
                    </div>
                    <div className="flex justify-between gap-3 p-3">
                        <button
                            onClick={onClickCancel}
                            className="px-3 py-1.5 rounded bg-white text-black border text-3xl font-semibold"
                        >
                            Tidak
                        </button>
                        <button
                            onClick={onSubmitDelete}
                            className="px-3 py-1.5 rounded bg-red-500 text-white text-3xl font-semibold"
                        >
                            YA
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalHapus;
