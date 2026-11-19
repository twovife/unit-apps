import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const EditableRow = ({ row, columns, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempRow, setTempRow] = useState({ ...row });
  useEffect(() => {
    setTempRow({ ...row });
  }, [row]);
  const handleSave = () => {
    onSave(tempRow);
    setIsEditing(false);
  };
  return /* @__PURE__ */ jsxs(
    "tr",
    {
      className: `${row._isInvalid ? "bg-red-50" : "hover:bg-yellow-50"} border-b border-gray-100 transition-colors font-mono italic`,
      children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2 border-r sticky left-0 bg-white z-10 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          isEditing ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleSave,
              className: "bg-green-600 text-white px-2 py-1 rounded text-[9px] font-bold shadow-sm",
              children: "SAVE"
            }
          ) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsEditing(true),
              className: "bg-indigo-600 text-white px-2 py-1 rounded text-[9px] font-bold shadow-sm",
              children: "EDIT"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onDelete(row),
              className: "bg-black text-white px-2 py-1 rounded text-[9px] font-bold shadow-sm",
              children: "HAPUS"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2 border-r min-w-[140px]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          row._isInvalid && row._errors.map((err, idx) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-bold leading-tight animate-bounce shadow-sm",
              children: err
            },
            `fe-${idx}`
          )),
          row._serverErrors && row._serverErrors.map((err, idx) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: "bg-orange-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black leading-tight border border-orange-700 shadow-sm",
              children: [
                "SERVER: ",
                err
              ]
            },
            `be-${idx}`
          )),
          row._isVerified && !row._isInvalid && /* @__PURE__ */ jsxs("span", { className: "text-green-600 font-black text-[10px] flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-3 w-3",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                    clipRule: "evenodd"
                  }
                )
              }
            ),
            "VERIFIED"
          ] }),
          !row._isInvalid && !row._isVerified && !row._serverErrors && /* @__PURE__ */ jsx("span", { className: "text-blue-500 font-bold text-[10px]", children: "✓ READY" })
        ] }) }),
        columns.map((col) => {
          var _a;
          return /* @__PURE__ */ jsx(
            "td",
            {
              className: "px-4 py-2 border-r whitespace-nowrap text-[11px]",
              children: isEditing ? /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: tempRow[col] || "",
                  onChange: (e) => setTempRow({ ...tempRow, [col]: e.target.value }),
                  className: "p-0.5 border border-blue-400 rounded w-full text-[11px] outline-none"
                }
              ) : /* @__PURE__ */ jsx(
                "span",
                {
                  className: ((_a = row._errors) == null ? void 0 : _a.some(
                    (e) => col.toUpperCase().includes(e.split("_")[0].toUpperCase())
                  )) ? "text-red-600 font-black underline decoration-double" : "text-gray-700",
                  children: row[col]
                }
              )
            },
            col
          );
        })
      ]
    }
  );
};
export {
  EditableRow as default
};
