import { a as jsx, F as Fragment, j as jsxs } from "../ssr.mjs";
import { router } from "@inertiajs/react";
import "lodash";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
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
      }
    });
  };
  const onClickCancel = () => {
    setShow();
  };
  return /* @__PURE__ */ jsx(Fragment, { children: show && /* @__PURE__ */ jsxs(
    "div",
    {
      className: `bg-white border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow rounded`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 text-center font-semibold text-lg", children: "Serius Hapus?" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-3 p-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClickCancel,
              className: "px-3 py-1.5 rounded bg-white text-black border text-3xl font-semibold",
              children: "Tidak"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onSubmitDelete,
              className: "px-3 py-1.5 rounded bg-red-500 text-white text-3xl font-semibold",
              children: "YA"
            }
          )
        ] })
      ]
    }
  ) });
};
export {
  ModalHapus as default
};
