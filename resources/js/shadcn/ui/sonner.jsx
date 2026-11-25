import { Toaster as Sonner } from "sonner"

// Gaya outline: latar putih, garis tepi + teks berwarna (warna lewat variabel
// richColors sonner). classNames shadcn lama (group-[.toaster]:bg-background)
// sengaja dibuang: dia menimpa richColors sehingga semua toast jadi putih polos.
const warna = {
  "--success-bg": "#fff", "--success-border": "#16a34a", "--success-text": "#166534",
  "--error-bg": "#fff", "--error-border": "#dc2626", "--error-text": "#991b1b",
  "--warning-bg": "#fff", "--warning-border": "#d97706", "--warning-text": "#92400e",
  "--info-bg": "#fff", "--info-border": "#2563eb", "--info-text": "#1e40af",
  "--normal-bg": "#fff", "--normal-border": "#cbd5e1", "--normal-text": "#0f172a",
}

const Toaster = (props) => (
  <Sonner
    richColors
    closeButton
    position="top-center"
    duration={2000}
    style={warna}
    toastOptions={{
      classNames: {
        toast: "!border-[1.5px] !text-[15px] shadow-lg",
        title: "font-semibold",
        description: "!text-slate-600",
        actionButton: "!bg-transparent !border !border-current !text-current",
      },
    }}
    {...props} />
)

export { Toaster }
