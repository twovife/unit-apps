import{r as l,a as e,j as c,c as s}from"./app-35d31ed9.js";import{T as m,a as o,b as i,c as t,d as h,e as r}from"./table-06e53020.js";import{F as p}from"./FormatNumbering-7d539e15.js";import"./button-1aa3a58c.js";import{B as N}from"./BadgeStatus-dd3c5d72.js";import"./utils-36e2ef84.js";import"./react-number-format.es-d26c8058.js";import"./badge-a296b71f.js";const D=({datas:n})=>{const[a,d]=l.useState({});return l.useEffect(()=>{d(n)},[n]),e("div",{children:c(m,{children:[e(o,{children:c(i,{children:[e(t,{className:"text-center",children:"Tanggal Pengajuan"}),e(t,{className:"text-center",children:"Nomor Pengajuan"}),e(t,{className:"text-center",children:"Status"}),e(t,{className:"text-center",children:"Nama Nasabah"}),e(t,{className:"text-center",children:"NIK"}),e(t,{className:"text-center",children:"Alamat"}),e(t,{className:"text-center",children:"Unit"}),e(t,{className:"text-center",children:"Kelompok"}),e(t,{className:"text-center",children:"Pengajuan"}),e(t,{className:"text-center",children:"Tgl Drop"}),e(t,{className:"text-center",children:"Kelompok"}),e(t,{className:"text-center",children:"Pinj Ke"}),e(t,{className:"text-center",children:"Acc"}),e(t,{className:"text-center",children:"Drop Jadi"})]})}),a&&e(h,{children:c(i,{className:"text-center",children:[e(r,{children:s(a.request_date).format("DD/MM")}),e(r,{children:a.nomor_pengajuan}),e(r,{children:e(N,{value:a.status})}),e(r,{children:a.nama}),e(r,{children:a.nik}),e(r,{children:a.alamat}),e(r,{children:a.unit}),e(r,{children:a.kelompok}),e(r,{children:e(p,{value:a.request})}),e(r,{children:s(a.tanggal_drop).format("DD/MM")}),e(r,{children:a.kelompok}),e(r,{children:a.pinjaman_ke}),e(r,{children:a.acc}),e(r,{children:a.drop_jadi})]})})]})})};export{D as default};
