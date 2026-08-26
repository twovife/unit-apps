import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
const simpanan = { libur: {}, rentang: /* @__PURE__ */ new Set(), tahun: { min: 2015, maks: 2035 } };
function useHariLibur(sekitar) {
  const [libur, setLibur] = useState(simpanan.libur);
  const [tahun, setTahun] = useState(simpanan.tahun);
  const [siap, setSiap] = useState(simpanan.rentang.size > 0);
  const dibatalkan = useRef(false);
  useEffect(() => {
    dibatalkan.current = false;
    return () => {
      dibatalkan.current = true;
    };
  }, []);
  useEffect(() => {
    const acuan = sekitar ? dayjs(sekitar) : dayjs();
    if (!acuan.isValid()) return;
    const dari = acuan.subtract(2, "month").startOf("month");
    const sampai = acuan.add(2, "month").endOf("month");
    const kunci = `${dari.format("YYYY-MM")}..${sampai.format("YYYY-MM")}`;
    if (simpanan.rentang.has(kunci)) {
      setSiap(true);
      return;
    }
    simpanan.rentang.add(kunci);
    axios.get(route("kalender.libur"), {
      params: {
        dari: dari.format("YYYY-MM-DD"),
        sampai: sampai.format("YYYY-MM-DD")
      }
    }).then(({ data }) => {
      simpanan.libur = { ...simpanan.libur, ...data.libur ?? {} };
      simpanan.tahun = {
        min: data.tahun_min ?? 2015,
        maks: data.tahun_maks ?? 2035
      };
      if (dibatalkan.current) return;
      setLibur(simpanan.libur);
      setTahun(simpanan.tahun);
      setSiap(true);
    }).catch(() => {
      simpanan.rentang.delete(kunci);
      if (!dibatalkan.current) setSiap(true);
    });
  }, [sekitar ? dayjs(sekitar).format("YYYY-MM") : null]);
  const alasanLibur = useCallback(
    (tgl) => tgl ? libur[dayjs(tgl).format("YYYY-MM-DD")] ?? null : null,
    [libur]
  );
  const hariKerja = useCallback(
    (tgl) => {
      const d = dayjs(tgl);
      if (!d.isValid()) return false;
      if (d.year() < tahun.min || d.year() > tahun.maks) return false;
      if (d.day() === 0) return false;
      return !alasanLibur(tgl);
    },
    [alasanLibur, tahun]
  );
  const mundurKeHariKerja = useCallback(
    (tgl) => {
      if (!tgl) return tgl;
      if (dayjs(tgl).day() === 0) return dayjs(tgl).format("YYYY-MM-DD");
      let calon = dayjs(tgl);
      for (let i = 0; i < 8; i++) {
        if (hariKerja(calon)) return calon.format("YYYY-MM-DD");
        calon = calon.subtract(1, "week");
      }
      return dayjs(tgl).format("YYYY-MM-DD");
    },
    [hariKerja]
  );
  return { libur, tahun, siap, alasanLibur, hariKerja, mundurKeHariKerja };
}
export {
  useHariLibur as u
};
