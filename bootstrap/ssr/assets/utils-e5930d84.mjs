import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function showNominalByStatus(params, status) {
  if (params == "acc") {
    switch (status) {
      case "acc":
        return true;
      case "success":
        return true;
      case "gagal":
        return true;
    }
  }
  if (params == "nominal_drop") {
    switch (status) {
      case "success":
        return true;
    }
  }
}
export {
  cn as c,
  showNominalByStatus as s
};
