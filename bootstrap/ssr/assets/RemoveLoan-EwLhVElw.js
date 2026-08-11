import { jsxs, jsx } from "react/jsx-runtime";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { B as Button } from "./button-StO46bLt.js";
import { usePage, useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState, useRef } from "react";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const RemoveLoan = ({ triggeredId, onClosed, triggeredData }) => {
  var _a, _b;
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  useRef();
  const { auth } = usePage().props;
  const isMantri = (_a = auth == null ? void 0 : auth.roles) == null ? void 0 : _a.includes("mantri");
  const canApprove = (_b = auth == null ? void 0 : auth.permissions) == null ? void 0 : _b.includes("can-approve");
  const recapApproved = triggeredData == null ? void 0 : triggeredData.recap_approved;
  const todayStr = dayjs().format("YYYY-MM-DD");
  const bisaHapusMantri = (triggeredData == null ? void 0 : triggeredData.tanggal_drop) === todayStr || (triggeredData == null ? void 0 : triggeredData.request_date) === todayStr;
  let bolehHapus = false;
  let pesanTerkunci = null;
  let severity = "amber";
  if (isMantri) {
    bolehHapus = bisaHapusMantri;
    pesanTerkunci = "Mantri hanya bisa menghapus pinjaman dengan tanggal pengajuan atau tanggal drop hari ini. Hubungi KM / Pimpinan untuk tanggal lain.";
  } else if (canApprove) {
    bolehHapus = !recapApproved;
    pesanTerkunci = "Rekap harian tanggal drop ini sudah di-ACC pimpinan, pinjaman tidak bisa dihapus.";
    severity = "destructive";
  } else {
    bolehHapus = false;
    pesanTerkunci = "Hubungi KM / Pimpinan untuk menghapus pinjaman.";
  }
  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors
  } = useForm();
  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };
  const cancelUserDeletion = () => {
    setTimeout(() => {
      setConfirmingUserDeletion(false);
    }, 200);
  };
  const buttonArea = useRef(null);
  const deleteUser = (e) => {
    e.preventDefault();
    if (!bolehHapus) return;
    destroy(route("pinjaman.destroy_loan", triggeredId), {
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  if (!bolehHapus) {
    return /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsx(Button, { variant: "destructiveoutline2", type: "button", disabled: true, children: "Hapus" }),
      /* @__PURE__ */ jsx(
        "p",
        {
          className: `mt-1 text-xs font-medium leading-relaxed ${severity === "destructive" ? "text-destructive" : "text-amber-600"}`,
          children: pesanTerkunci
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { ref: buttonArea, onMouseLeave: cancelUserDeletion, children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx("form", { onSubmit: deleteUser, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col overflow-hidden h-9", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `inline transition-all duration-300
            ${confirmingUserDeletion ? "translate-y-full" : "translate-y-0"}
            `,
          children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "destructiveoutline2",
              type: "button",
              onClick: confirmUserDeletion,
              children: "Hapus"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `inline transition-all duration-300
            ${confirmingUserDeletion ? "-translate-y-full" : "translate-y-0"}`,
          children: /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              variant: "destructive",
              onClick: confirmUserDeletion,
              children: "Yakin?"
            }
          )
        }
      )
    ] }) })
  ] });
};
export {
  RemoveLoan as default
};
