import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const HARI_TO_DOW = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6
};
function getLastDateForHari(hari) {
  const today = dayjs();
  const targetDow = HARI_TO_DOW[hari == null ? void 0 : hari.toLowerCase()] ?? today.day();
  if (today.day() === targetDow) return today.format("YYYY-MM-DD");
  let diff = today.day() - targetDow;
  if (diff <= 0) diff += 7;
  return today.subtract(diff, "day").format("YYYY-MM-DD");
}
export {
  cn as c,
  getLastDateForHari as g
};
