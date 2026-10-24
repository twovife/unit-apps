import React, { useState, useEffect } from 'react';

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

  return (
    <tr
      className={`${row._isInvalid ? 'bg-red-50' : 'hover:bg-yellow-50'} border-b border-gray-100 transition-colors font-mono italic`}
    >
      <td className="px-4 py-2 border-r sticky left-0 bg-white z-10 shadow-sm">
        <div className="flex gap-1">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-2 py-1 rounded text-[9px] font-bold shadow-sm"
            >
              SAVE
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-2 py-1 rounded text-[9px] font-bold shadow-sm"
            >
              EDIT
            </button>
          )}
          <button
            onClick={() => onDelete(row)}
            className="bg-black text-white px-2 py-1 rounded text-[9px] font-bold shadow-sm"
          >
            HAPUS
          </button>
        </div>
      </td>

      <td className="px-4 py-2 border-r min-w-[140px]">
        <div className="flex flex-col gap-1">
          {/* 1. TAMPILKAN ERROR FRONTEND (LOGIKA JS) */}
          {row._isInvalid &&
            row._errors.map((err, idx) => (
              <span
                key={`fe-${idx}`}
                className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-bold leading-tight animate-bounce shadow-sm"
              >
                {err}
              </span>
            ))}

          {/* 2. TAMPILKAN ERROR BACKEND (HASIL KLIK 'TRY') */}
          {row._serverErrors &&
            row._serverErrors.map((err, idx) => (
              <span
                key={`be-${idx}`}
                className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black leading-tight border border-orange-700 shadow-sm"
              >
                SERVER: {err}
              </span>
            ))}

          {/* 3. JIKA BERHASIL DIVALIDASI OLEH SERVER */}
          {row._isVerified && !row._isInvalid && (
            <span className="text-green-600 font-black text-[10px] flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              VERIFIED
            </span>
          )}

          {/* 4. DEFAULT OK JIKA BELUM ADA ERROR TAPI BELUM KLIK TRY */}
          {!row._isInvalid && !row._isVerified && !row._serverErrors && (
            <span className="text-blue-500 font-bold text-[10px]">✓ READY</span>
          )}
        </div>
      </td>

      {columns.map((col) => (
        <td
          key={col}
          className="px-4 py-2 border-r whitespace-nowrap text-[11px]"
        >
          {isEditing ? (
            <input
              type="text"
              value={tempRow[col] || ''}
              onChange={(e) =>
                setTempRow({ ...tempRow, [col]: e.target.value })
              }
              className="p-0.5 border border-blue-400 rounded w-full text-[11px] outline-none"
            />
          ) : (
            <span
              className={
                row._errors?.some((e) =>
                  col.toUpperCase().includes(e.split('_')[0].toUpperCase()),
                )
                  ? 'text-red-600 font-black underline decoration-double'
                  : 'text-gray-700'
              }
            >
              {row[col]}
            </span>
          )}
        </td>
      ))}
    </tr>
  );
};

export default EditableRow;
