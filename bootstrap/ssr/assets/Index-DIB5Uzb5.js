import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-C3znwcHI.js";
import { useState, useMemo } from "react";
import Papa from "papaparse";
import EditableRow from "./EditableRow-DFKXrTC7.js";
import axios from "axios";
import "@inertiajs/react";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./button-MTjEwktD.js";
import "./input-BHD-__le.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-8a8NNlps.js";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
const Index = () => {
  var _a;
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedHari, setSelectedHari] = useState("SENIN");
  const [monthInput, setMonthInput] = useState(
    (/* @__PURE__ */ new Date()).toISOString().slice(0, 7)
  );
  const [branchId, setBranchId] = useState("78");
  const listHari = [
    "SENIN",
    "SELASA",
    "RABU",
    "KAMIS",
    "JUMAT",
    "SABTU",
    "MINGGU"
  ];
  const cleanNum = (val) => {
    if (!val) return 0;
    const sanitized = String(val).replace(/[^0-9,.-]/g, "").replace(",", ".");
    return parseFloat(sanitized) || 0;
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const dataWithId = results.data.map((item, index) => ({
            _uida: `${Date.now()}-${index}-${Math.random()}`,
            // ID Unik Permanen
            nik: item["NIK NASABAH"] || item["NIK"] || item.NASABAH || "",
            no: item["NO ANGGOTA"] || item["NO"] || item.NOMOR || "",
            nama: item["NAMA NASABAH"] || "",
            alamat: item.DOMISILI || "",
            kelompok: item.KLP || "",
            drop_date: item["TANGGAL DROP"] || "",
            nominal: cleanNum(item.PINJAMAN || item.NOMINAL),
            saldo: cleanNum(item["SISA SALDO"] || item.SALDO),
            hari: String(item.HARI2 || item.HARI || "").toUpperCase(),
            type: "s",
            branch_id: branchId,
            angs_1: cleanNum(item.ANGS_1 || item.ANGS1),
            angs_2: cleanNum(item.ANGS_2 || item.ANGS2),
            angs_3: cleanNum(item.ANGS_3 || item.ANGS3),
            angs_4: cleanNum(item.ANGS_4 || item.ANGS4),
            angs_5: cleanNum(item.ANGS_5 || item.ANGS5),
            angs_6: cleanNum(item.ANGS_6 || item.ANGS6),
            angs_7: cleanNum(item.ANGS_7 || item.ANGS7),
            angs_8: cleanNum(item.ANGS_8 || item.ANGS8)
          }));
          setColumns(
            Object.keys(dataWithId[0]).filter((k) => !k.startsWith("_"))
          );
          setData(dataWithId);
          setActiveTab(dataWithId[0].kelompok);
        }
      }
    });
  };
  const handleReset = () => {
    if (confirm("Kosongkan semua data di tabel?")) {
      setData([]);
      setColumns([]);
      setActiveTab("");
      if (document.getElementById("csv-upload"))
        document.getElementById("csv-upload").value = "";
    }
  };
  const processedData = useMemo(() => {
    const processed = data.map((item, index) => {
      let row = { ...item };
      let errors = [];
      if (row.drop_date) {
        const parts = row.drop_date.split(/[/ -]/);
        if (parts.length === 3) {
          let d, m, y;
          parts[0].length === 4 ? [y, m, d] = parts : [d, m, y] = parts;
          const isoDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
          row.drop_date = isoDate;
          const dateObj = new Date(isoDate);
          if (!isNaN(dateObj.getTime())) {
            const dayNum = dateObj.getDay();
            row.day = dayNum === 0 ? 7 : dayNum;
          }
        }
      }
      if (!row.nik || row.nik.trim() === "" || row.nik === "null") {
        if (row.drop_date && !row.drop_date.includes("undefined")) {
          const datePart = row.drop_date.split("-");
          const mmyy = datePart[1] + datePart[0].substring(2);
          const prefix = `000${branchId}${row.kelompok}${mmyy}`;
          const suffix = (index + 1).toString().padStart(16 - prefix.length, "0");
          row.nik = (prefix + suffix).substring(0, 16);
        }
      }
      if (cleanNum(row.nominal) * 1.3 < cleanNum(row.saldo))
        errors.push("SALDO SALAH");
      if (row.hari !== selectedHari) errors.push("HARI SALAH");
      if (!row.drop_date || row.drop_date.includes("undefined"))
        errors.push("TGL SALAH");
      return {
        ...row,
        _errors: errors,
        _isInvalid: errors.length > 0,
        branch_id: branchId
      };
    });
    return processed.sort((a, b) => {
      if (a.drop_date !== b.drop_date)
        return a.drop_date.localeCompare(b.drop_date);
      return (parseInt(a.no) || 0) - (parseInt(b.no) || 0);
    });
  }, [data, selectedHari, monthInput, branchId]);
  const groupedData = useMemo(() => {
    return processedData.reduce((acc, item) => {
      const k = item.kelompok || "TANPA_KLP";
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    }, {});
  }, [processedData]);
  const listKLP = Object.keys(groupedData);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleTry = async () => {
    var _a2;
    const hasFrontendError = processedData.some((item) => item._isInvalid);
    if (hasFrontendError) {
      alert(
        "Perbaiki error (warna merah) di tabel dulu sebelum cek ke server!"
      );
      return;
    }
    setIsProcessing(true);
    try {
      const response = await axios.post(route("batch_input.validateData"), {
        data: processedData,
        branch_id: branchId
      });
      const serverResults = response.data.results;
      const verifiedData = processedData.map((item) => {
        const feedback = serverResults.find((r) => r._uida === item._uida);
        if (feedback) {
          return {
            ...item,
            _isVerified: feedback.status === "ok",
            _serverErrors: feedback.errors || []
          };
        }
        return item;
      });
      setData(verifiedData);
      if (response.data.all_ok) {
        alert("✅ Verifikasi Berhasil! Semua data aman diupload.");
      } else {
        alert("⚠️ Beberapa data ditolak oleh sistem. Cek kolom status!");
      }
    } catch (error) {
      console.error("Validation Error:", ((_a2 = error.response) == null ? void 0 : _a2.data) || error.message);
      alert(
        "Gagal terhubung ke server untuk validasi. Cek console untuk detail."
      );
    } finally {
      setIsProcessing(false);
    }
  };
  const handleFinalSave = async () => {
    var _a2, _b, _c;
    const unverified = processedData.some(
      (i) => !i._isVerified || i._isInvalid
    );
    if (unverified) {
      alert("Ada data yang belum diverifikasi (TRY) atau masih error.");
      return;
    }
    if (!confirm(`Simpan ${processedData.length} data?`)) return;
    setIsProcessing(true);
    const chunkSize = 50;
    let successCount = 0;
    try {
      for (let i = 0; i < processedData.length; i += chunkSize) {
        const chunk = processedData.slice(i, i + chunkSize);
        await axios.post(route("batch_input.store"), {
          data: chunk,
          branch_id: branchId,
          input_month: monthInput,
          input_hari: selectedHari
        });
        successCount += chunk.length;
        if (i + chunkSize < processedData.length) {
          await new Promise((res) => setTimeout(res, 300));
        }
      }
      alert(`🎉 Berhasil! ${successCount} data tersimpan.`);
      setData([]);
    } catch (error) {
      const errorMsg = ((_b = (_a2 = error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || "Terjadi kesalahan server.";
      console.error("Upload Error:", (_c = error.response) == null ? void 0 : _c.data);
      alert(`❌ Gagal: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx(Authenticated, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 bg-white rounded-lg shadow-sm border flex flex-wrap items-end gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-1 text-[10px] font-black text-gray-500 uppercase tracking-widest italic", children: "1. Pilih File CSV" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "csv-upload",
            type: "file",
            accept: ".csv",
            onChange: handleFileUpload,
            className: "block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-1 text-[10px] font-black text-gray-500 uppercase tracking-widest italic", children: "2. Bulan Input" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "month",
            value: monthInput,
            onChange: (e) => setMonthInput(e.target.value),
            className: "text-xs rounded-lg border-gray-200"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-1 text-[10px] font-black text-gray-500 uppercase tracking-widest italic", children: "3. Branch & Hari" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: branchId,
              onChange: (e) => setBranchId(e.target.value),
              className: "w-16 text-xs rounded-lg border-gray-200 font-bold"
            }
          ),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: selectedHari,
              onChange: (e) => setSelectedHari(e.target.value),
              className: "text-xs rounded-lg border-gray-200 font-black text-indigo-700",
              children: listHari.map((h) => /* @__PURE__ */ jsx("option", { value: h, children: h }, h))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        data.length > 0 && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleReset,
            className: "px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black border border-red-100 hover:bg-red-600 hover:text-white transition-all",
            children: "RESET"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleTry,
              disabled: isProcessing || data.length === 0,
              className: `px-6 py-2 rounded-full text-xs font-black border-2 ${isProcessing ? "bg-gray-200" : "bg-yellow-400 border-yellow-500 hover:bg-yellow-500"}`,
              children: isProcessing ? "CHECKING..." : "TRY (VALIDASI)"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleFinalSave,
              disabled: isProcessing || data.length === 0,
              className: "px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black shadow-lg hover:bg-indigo-700",
              children: "SAVE (INSERT)"
            }
          )
        ] })
      ] })
    ] }),
    listKLP.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4 border-b border-gray-200", children: listKLP.map((klp) => {
        const hasError = groupedData[klp].some((i) => i._isInvalid);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab(klp),
            className: `px-4 py-2 text-sm font-black transition-all flex items-center gap-2 ${activeTab === klp ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-400"}`,
            children: [
              "KLP: ",
              klp,
              hasError && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" })
            ]
          },
          klp
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white rounded-lg shadow border border-gray-200 max-h-[600px] overflow-y-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-100 sticky top-0 z-20", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-[10px] font-black text-gray-600 uppercase border-r sticky left-0 bg-gray-100", children: "Aksi" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-[10px] font-black text-gray-600 uppercase border-r", children: "Status" }),
          columns.map((col) => /* @__PURE__ */ jsx(
            "th",
            {
              className: "px-4 py-3 text-left text-[10px] font-black text-gray-600 uppercase border-r whitespace-nowrap",
              children: col
            },
            col
          ))
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: (_a = groupedData[activeTab]) == null ? void 0 : _a.map((row) => /* @__PURE__ */ jsx(
          EditableRow,
          {
            row,
            columns,
            onSave: (upd) => setData(
              (prev) => prev.map((d) => d._uida === upd._uida ? upd : d)
            ),
            onDelete: (trg) => setData(
              (prev) => prev.filter((d) => d._uida !== trg._uida)
            )
          },
          row._uida
        )) })
      ] }) })
    ] })
  ] }) });
};
export {
  Index as default
};
