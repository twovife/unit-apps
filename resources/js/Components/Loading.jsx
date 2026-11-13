import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Loader2 } from 'lucide-react';

// Pengunci layar selama proses: ketukan langsung tertahan, kartu "Memuat…"
// baru tampil sesudah 300 ms supaya proses cepat tidak berkedip.
const Loading = ({ show, pesan = 'Memuat…' }) => {
  const [kartu, setKartu] = useState(false);
  useEffect(() => {
    if (!show) return setKartu(false);
    const t = setTimeout(() => setKartu(true), 300);
    return () => clearTimeout(t);
  }, [show]);

  const loadingRoot = document.getElementById('loading');
  if (!loadingRoot || !show) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center cursor-wait transition-colors duration-200 ${kartu ? 'bg-slate-900/10' : 'bg-transparent'}`}
      aria-busy="true"
      aria-live="polite"
    >
      {kartu && (
        <div className="flex items-center gap-3 rounded-lg border-[1.5px] border-slate-300 bg-white px-5 py-3 text-[15px] font-medium text-slate-700 shadow-lg">
          <Loader2 className="size-5 animate-spin text-slate-500" />
          {pesan}
        </div>
      )}
    </div>,
    loadingRoot
  );
};

export default Loading;
