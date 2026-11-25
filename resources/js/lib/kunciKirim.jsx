import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/Components/Loading';

// Kunci kirim global: selama POST/PUT/PATCH/DELETE berjalan, layar dikunci
// (<Loading>) dan tombol yang memicunya tampil "memuat" (data-memuat). Mencegah kirim
// ganda (ketuk berkali-kali). Inertia v1 memakai instance axios bawaan, jadi satu
// interceptor menangkap router.post/form.post dan axios.post sekaligus.
//
// Permintaan Inertia selalu dikunci. axios biasa hanya bila dipicu klik/submit
// <= 1 detik sebelumnya: pencarian sambil mengetik (NIK) atau pratinjau
// otomatis tidak boleh mengunci layar.

let aktif = 0;
let dengar = null;
let tombol = null; // { el, waktu } klik/submit terakhir
const dikunci = new Map(); // tombol -> jumlah permintaan yang memakainya

const tandai = (el) => {
  if (!(el instanceof HTMLElement)) return;
  tombol = { el, waktu: Date.now() };
};
// Selama terkunci, klik & submit apa pun ditolak (termasuk Enter dari keyboard,
// yang lolos dari overlay). `disabled` tidak disentuh: itu milik React.
const tolak = (e) => {
  if (aktif === 0) return false;
  e.preventDefault();
  e.stopImmediatePropagation();
  return true;
};
document.addEventListener('click', (e) => tolak(e) || tandai(e.target.closest?.('button, [type=submit]')), true);
document.addEventListener('submit', (e) => tolak(e) || tandai(e.submitter ?? e.target.querySelector('[type=submit]')), true);

const ubah = (n) => {
  aktif += n;
  dengar?.(aktif > 0);
};

axios.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toLowerCase();
  const baruDiklik = tombol && Date.now() - tombol.waktu < 1000 && tombol.el.isConnected;
  if (method === 'get' || !(config.headers?.['X-Inertia'] || baruDiklik)) return config;

  config.__kunci = true;
  ubah(1);
  if (baruDiklik) {
    const el = tombol.el;
    config.__tombol = el;
    dikunci.set(el, (dikunci.get(el) ?? 0) + 1);
    el.setAttribute('data-memuat', '');
    el.setAttribute('aria-disabled', 'true');
  }
  return config;
});

const lepas = (config) => {
  if (!config?.__kunci) return;
  config.__kunci = false;
  ubah(-1);
  const el = config.__tombol;
  if (!el) return;
  const sisa = (dikunci.get(el) ?? 1) - 1;
  if (sisa > 0) return dikunci.set(el, sisa);
  dikunci.delete(el);
  el.removeAttribute('data-memuat');
  el.removeAttribute('aria-disabled');
};

axios.interceptors.response.use(
  (res) => {
    lepas(res.config);
    return res;
  },
  (err) => {
    lepas(err.config);
    return Promise.reject(err);
  },
);

export function KunciKirim() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    dengar = setShow;
    return () => {
      dengar = null;
    };
  }, []);
  return <Loading show={show} pesan="Menyimpan…" />;
}
