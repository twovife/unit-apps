import{r as l,a as e,j as c,d as s}from"./app-c852447f.js";import{T as m,a as o,b as i,c as t,d as h,e as r,F as u}from"./FormatNumbering-697f2e7e.js";import{B as N}from"./badge-f9279f6f.js";import"./utils-36e2ef84.js";import"./react-number-format.es-0ad3a443.js";import"./index-f96983da.js";const f=({datas:n})=>{const[a,d]=l.useState({});return l.useEffect(()=>{d(n)},[n]),e("div",{children:c(m,{children:[e(o,{children:c(i,{children:[e(t,{className:"text-center",children:"Tanggal Pengajuan"}),e(t,{className:"text-center",children:"Nomor Pengajuan"}),e(t,{className:"text-center",children:"Status"}),e(t,{className:"text-center",children:"Nama Nasabah"}),e(t,{className:"text-center",children:"NIK"}),e(t,{className:"text-center",children:"Alamat"}),e(t,{className:"text-center",children:"Unit"}),e(t,{className:"text-center",children:"Kelompok"}),e(t,{className:"text-center",children:"Pengajuan"}),e(t,{className:"text-center",children:"Tgl Drop"}),e(t,{className:"text-center",children:"Kelompok"}),e(t,{className:"text-center",children:"Pinj Ke"}),e(t,{className:"text-center",children:"Acc"}),e(t,{className:"text-center",children:"Drop Jadi"})]})}),a&&e(h,{children:c(i,{className:"text-center",children:[e(r,{children:s(a.request_date).format("DD/MM")}),e(r,{children:a.nomor_pengajuan}),e(r,{children:e(N,{variant:a.status=="open"?"green":a.status=="acc"?"yellow":a.status=="success"?"default":"destructive",children:a.status})}),e(r,{children:a.nama}),e(r,{children:a.nik}),e(r,{children:a.alamat}),e(r,{children:a.unit}),e(r,{children:a.kelompok}),e(r,{children:e(u,{value:a.request})}),e(r,{children:s(a.tanggal_drop).format("DD/MM")}),e(r,{children:a.kelompok}),e(r,{children:a.pinjaman_ke}),e(r,{children:a.acc}),e(r,{children:a.drop_jadi})]})})]})})};export{f as default};
