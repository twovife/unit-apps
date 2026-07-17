import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import EditableRow from '@/Pages/Administrasi/BatchInput/EditableRow';
import axios from 'axios';
// import EditableRow from './Partials/EditableRow';

const Index = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  // States Control
  const [selectedHari, setSelectedHari] = useState('SENIN');
  const [monthInput, setMonthInput] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [branchId, setBranchId] = useState('78');

  const listHari = [
    'SENIN',
    'SELASA',
    'RABU',
    'KAMIS',
    'JUMAT',
    'SABTU',
    'MINGGU',
  ];

  // --- Helpers ---
  const cleanNum = (val) => {
    if (!val) return 0;
    const sanitized = String(val)
      .replace(/[^0-9,.-]/g, '')
      .replace(',', '.');
    return parseFloat(sanitized) || 0;
  };

  const getWeekOfMonth = (dateStr) => {
    const d = new Date(dateStr);
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return Math.ceil((d.getDate() + firstDay) / 7);
  };

  // --- Handlers ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const dataWithId = results.data.map((item, index) => ({
            _uida: `${Date.now()}-${index}-${Math.random()}`, // ID Unik Permanen
            nik: item['NIK NASABAH'] || item['NIK'] || item.NASABAH || '',
            no: item['NO ANGGOTA'] || item['NO'] || item.NOMOR || '',
            nama: item['NAMA NASABAH'] || '',
            alamat: item.DOMISILI || '',
            kelompok: item.KLP || '',
            drop_date: item['TANGGAL DROP'] || '',
            nominal: cleanNum(item.PINJAMAN || item.NOMINAL),
            saldo: cleanNum(item['SISA SALDO'] || item.SALDO),
            hari: String(item.HARI2 || item.HARI || '').toUpperCase(),
            type: 's',
            branch_id: branchId,
            angs_1: cleanNum(item.ANGS_1 || item.ANGS1),
            angs_2: cleanNum(item.ANGS_2 || item.ANGS2),
            angs_3: cleanNum(item.ANGS_3 || item.ANGS3),
            angs_4: cleanNum(item.ANGS_4 || item.ANGS4),
            angs_5: cleanNum(item.ANGS_5 || item.ANGS5),
            angs_6: cleanNum(item.ANGS_6 || item.ANGS6),
            angs_7: cleanNum(item.ANGS_7 || item.ANGS7),
            angs_8: cleanNum(item.ANGS_8 || item.ANGS8),
          }));

          setColumns(
            Object.keys(dataWithId[0]).filter((k) => !k.startsWith('_')),
          );
          setData(dataWithId);
          setActiveTab(dataWithId[0].kelompok);
        }
      },
    });
  };

  const handleReset = () => {
    if (confirm('Kosongkan semua data di tabel?')) {
      setData([]);
      setColumns([]);
      setActiveTab('');
      if (document.getElementById('csv-upload'))
        document.getElementById('csv-upload').value = '';
    }
  };

  // const processedData = useMemo(() => {
  //   const processed = data.map((item, index) => {
  //     let row = { ...item };
  //     let errors = [];

  //     if (!row.nik || row.nik.trim() === '' || row.nik === 'null') {
  //       const mmyy = monthInput.replace('-', '').split('').reverse().join(''); // Simple MMYY dari YYYY-MM
  //       // Ambil 2 digit terakhir tahun dan bulan
  //       const datePart = monthInput.split('-'); // ["2026", "04"]
  //       const mmyyFixed = datePart[1] + datePart[0].substring(2); // "0426"

  //       const prefix = `000${branchId}${row.kelompok}${mmyyFixed}`;
  //       // Tambahkan padding angka dari index + random agar pas 16 digit
  //       const suffix = (index + Math.floor(Math.random() * 1000))
  //         .toString()
  //         .padStart(16 - prefix.length, '0');

  //       row.nik = (prefix + suffix).substring(0, 16);
  //     }

  //     // 1. FORMAT TANGGAL & HITUNG HARI (DAY OF WEEK)
  //     if (row.drop_date) {
  //       const parts = row.drop_date.split(/[/ -]/);
  //       if (parts.length === 3) {
  //         let d, m, y;
  //         if (parts[0].length === 4) {
  //           [y, m, d] = parts;
  //         } else {
  //           [d, m, y] = parts;
  //         }

  //         // Format standar YYYY-MM-DD
  //         const isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  //         row.drop_date = isoDate;

  //         // --- LOGIKA TAMBAHAN DAY OF WEEK ---
  //         const dateObj = new Date(isoDate);
  //         if (!isNaN(dateObj.getTime())) {
  //           const dayNum = dateObj.getDay(); // 0 (Minggu) sampai 6 (Sabtu)
  //           // Ubah ke format ISO (Senin=1, ..., Minggu=7) agar cocok dengan Laravel
  //           row.day = dayNum === 0 ? 7 : dayNum;
  //         }
  //       }
  //     }

  //     // 2. Auto-Zeroing Rules (Mingguan)
  //     if (row.drop_date && row.drop_date.startsWith(monthInput)) {
  //       const week = getWeekOfMonth(row.drop_date);
  //       if (week >= 1) row.angs_1 = 0;
  //       if (week >= 2) row.angs_2 = 0;
  //       if (week >= 3) row.angs_3 = 0;
  //       if (week >= 4) row.angs_4 = 0;
  //       if (week >= 5) row.angs_5 = 0;
  //     }

  //     // 3. Validasi
  //     if (row.nominal * 1.3 < row.saldo) errors.push('SALDO SALAH');
  //     if (row.hari !== selectedHari) errors.push('HARI SALAH');
  //     if (!row.drop_date || row.drop_date.includes('undefined'))
  //       errors.push('TGL SALAH');

  //     return {
  //       ...row,
  //       _errors: errors,
  //       _isInvalid: errors.length > 0,
  //       branch_id: branchId,
  //     };
  //   });

  //   // 4. SORTING BERTINGKAT
  //   return processed.sort((a, b) => {
  //     if (a.drop_date !== b.drop_date) {
  //       return a.drop_date.localeCompare(b.drop_date);
  //     }
  //     const noA = parseInt(a.no) || 0;
  //     const noB = parseInt(b.no) || 0;
  //     return noA - noB;
  //   });
  // }, [data, selectedHari, monthInput, branchId]);

  const processedData = useMemo(() => {
    const processed = data.map((item, index) => {
      let row = { ...item };
      let errors = [];

      // 1. FORMAT TANGGAL TERLEBIH DAHULU (Penting untuk NIK)
      if (row.drop_date) {
        const parts = row.drop_date.split(/[/ -]/);
        if (parts.length === 3) {
          let d, m, y;
          parts[0].length === 4 ? ([y, m, d] = parts) : ([d, m, y] = parts);
          const isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          row.drop_date = isoDate;

          // Hitung Day of Week (1-7)
          const dateObj = new Date(isoDate);
          if (!isNaN(dateObj.getTime())) {
            const dayNum = dateObj.getDay();
            row.day = dayNum === 0 ? 7 : dayNum;
          }
        }
      }

      // 2. NIK DUMMY STABIL (Berdasarkan drop_date & index)
      if (!row.nik || row.nik.trim() === '' || row.nik === 'null') {
        if (row.drop_date && !row.drop_date.includes('undefined')) {
          const datePart = row.drop_date.split('-');
          const mmyy = datePart[1] + datePart[0].substring(2);
          const prefix = `000${branchId}${row.kelompok}${mmyy}`;
          // Pakai index agar stabil, bukan Math.random
          const suffix = (index + 1)
            .toString()
            .padStart(16 - prefix.length, '0');
          row.nik = (prefix + suffix).substring(0, 16);
        }
      }

      // 3. Auto-Zeroing Rules
      // if (row.drop_date && row.drop_date.startsWith(monthInput)) {
      //   const week = getWeekOfMonth(row.drop_date);
      //   if (week >= 1) row.angs_1 = 0;
      //   if (week >= 2) row.angs_2 = 0;
      //   if (week >= 3) row.angs_3 = 0;
      //   if (week >= 4) row.angs_4 = 0;
      //   if (week >= 5) row.angs_5 = 0;
      // }

      // 4. Validasi
      if (cleanNum(row.nominal) * 1.3 < cleanNum(row.saldo))
        errors.push('SALDO SALAH');
      if (row.hari !== selectedHari) errors.push('HARI SALAH');
      if (!row.drop_date || row.drop_date.includes('undefined'))
        errors.push('TGL SALAH');

      return {
        ...row,
        _errors: errors,
        _isInvalid: errors.length > 0,
        branch_id: branchId,
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
      const k = item.kelompok || 'TANPA_KLP';
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    }, {});
  }, [processedData]);

  const listKLP = Object.keys(groupedData);

  const [isProcessing, setIsProcessing] = useState(false);

  // FUNGSI TRY (SIMULASI)
  const handleTry = async () => {
    const hasFrontendError = processedData.some((item) => item._isInvalid);
    if (hasFrontendError) {
      alert(
        'Perbaiki error (warna merah) di tabel dulu sebelum cek ke server!',
      );
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(route('batch_input.validateData'), {
        data: processedData,
        branch_id: branchId,
      });

      const serverResults = response.data.results;

      // UPDATE DI SINI: Map dari processedData, bukan dari data
      const verifiedData = processedData.map((item) => {
        const feedback = serverResults.find((r) => r._uida === item._uida);

        if (feedback) {
          return {
            ...item,
            _isVerified: feedback.status === 'ok',
            _serverErrors: feedback.errors || [],
          };
        }
        return item;
      });

      // Update state utama dengan data yang sudah diproses & diverifikasi
      setData(verifiedData);

      if (response.data.all_ok) {
        alert('✅ Verifikasi Berhasil! Semua data aman diupload.');
      } else {
        alert('⚠️ Beberapa data ditolak oleh sistem. Cek kolom status!');
      }
    } catch (error) {
      console.error('Validation Error:', error.response?.data || error.message);
      alert(
        'Gagal terhubung ke server untuk validasi. Cek console untuk detail.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // FUNGSI SAVE (EKSEKUSI FINAL)
  const handleFinalSave = async () => {
    const unverified = processedData.some(
      (i) => !i._isVerified || i._isInvalid,
    );
    if (unverified) {
      alert('Ada data yang belum diverifikasi (TRY) atau masih error.');
      return;
    }

    if (!confirm(`Simpan ${processedData.length} data?`)) return;

    setIsProcessing(true);
    const chunkSize = 50;
    let successCount = 0;

    try {
      for (let i = 0; i < processedData.length; i += chunkSize) {
        const chunk = processedData.slice(i, i + chunkSize);

        await axios.post(route('batch_input.store'), {
          data: chunk,
          branch_id: branchId,
          input_month: monthInput,
          input_hari: selectedHari,
        });

        successCount += chunk.length;

        // Jeda 300ms antar chunk untuk kestabilan database
        if (i + chunkSize < processedData.length) {
          await new Promise((res) => setTimeout(res, 300));
        }
      }

      alert(`🎉 Berhasil! ${successCount} data tersimpan.`);
      setData([]);
    } catch (error) {
      // Tangkap pesan error asli dari Laravel (hasil try-catch di controller)
      const errorMsg =
        error.response?.data?.message || 'Terjadi kesalahan server.';
      console.error('Upload Error:', error.response?.data);
      alert(`❌ Gagal: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Authenticated>
      <div className="p-6">
        {/* Panel Kontrol Atas */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
              1. Pilih File CSV
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
              2. Bulan Input
            </label>
            <input
              type="month"
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              className="text-xs rounded-lg border-gray-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
              3. Branch & Hari
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-16 text-xs rounded-lg border-gray-200 font-bold"
              />
              <select
                value={selectedHari}
                onChange={(e) => setSelectedHari(e.target.value)}
                className="text-xs rounded-lg border-gray-200 font-black text-indigo-700"
              >
                {listHari.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            {data.length > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black border border-red-100 hover:bg-red-600 hover:text-white transition-all"
              >
                RESET
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleTry}
                disabled={isProcessing || data.length === 0}
                className={`px-6 py-2 rounded-full text-xs font-black border-2 ${isProcessing ? 'bg-gray-200' : 'bg-yellow-400 border-yellow-500 hover:bg-yellow-500'}`}
              >
                {isProcessing ? 'CHECKING...' : 'TRY (VALIDASI)'}
              </button>

              <button
                onClick={handleFinalSave}
                disabled={isProcessing || data.length === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black shadow-lg hover:bg-indigo-700"
              >
                SAVE (INSERT)
              </button>
            </div>
          </div>
        </div>

        {listKLP.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
              {listKLP.map((klp) => {
                const hasError = groupedData[klp].some((i) => i._isInvalid);
                return (
                  <button
                    key={klp}
                    onClick={() => setActiveTab(klp)}
                    className={`px-4 py-2 text-sm font-black transition-all flex items-center gap-2 ${activeTab === klp ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}
                  >
                    KLP: {klp}
                    {hasError && (
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-20">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-600 uppercase border-r sticky left-0 bg-gray-100">
                      Aksi
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-600 uppercase border-r">
                      Status
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-[10px] font-black text-gray-600 uppercase border-r whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedData[activeTab]?.map((row) => (
                    <EditableRow
                      key={row._uida}
                      row={row}
                      columns={columns}
                      onSave={(upd) =>
                        setData((prev) =>
                          prev.map((d) => (d._uida === upd._uida ? upd : d)),
                        )
                      }
                      onDelete={(trg) =>
                        setData((prev) =>
                          prev.filter((d) => d._uida !== trg._uida),
                        )
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Authenticated>
  );
};

export default Index;
