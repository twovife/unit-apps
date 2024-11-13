import{r as i,j as l,a as e,R as v,c as y}from"./app-b2e3bcc2.js";import{T,a as _,b as s,c as r,d as S,e as t,F as c}from"./FormatNumbering-4fa82f0d.js";import{B}from"./button-225b58b4.js";import A from"./Action-d50b453e.js";import{B as C}from"./badge-404ffddc.js";import"./utils-36e2ef84.js";import"./react-number-format.es-82351cdf.js";import"./dialog-f04741af.js";import"./index-7b077439.js";import"./index-c5f589e9.js";import"./react-icons.esm-0e6c2f2a.js";import"./index-0db32300.js";import"./card-80859391.js";import"./BayarAngsuran-4ecb5b18.js";import"./label-4e6a82af.js";import"./index-a2c4b0b3.js";import"./input-8f5cd5a1.js";import"./index.esm-20a73dff.js";import"./Checkbox-94cae1fd.js";import"./Loading-69a20464.js";import"./transition-ec8a3a4b.js";import"./JenisNasabah-18eb6778.js";import"./InputError-913d29fe.js";import"./InputLabel-fe0192f0.js";import"./PrimaryButton-c0f6aad6.js";import"./SelectList-a92b418e.js";import"./DeleteAngsuran-525c3a61.js";import"./TextInput-917912b8.js";import"./DeleteLoan-684d66e2.js";import"./useFrontEndPermission-2e693e49.js";import"./NoEditOverlay-cdde09d6.js";const se=({datas:h})=>{const[d,g]=i.useState([]);i.useEffect(()=>{g(h)},[h]);const m=(n,o)=>n.reduce((p,f)=>p+parseInt(f[o]??0),0),[b,x]=i.useState(null),[u,N]=i.useState(!1),j=n=>{x(n),N(!0)},k=()=>{N(!1),x(null)};return l("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh]",children:[l(T,{className:"text-xs rounded-lg",children:[e(_,{className:"sticky top-0 left-0 z-10",children:l(s,{className:"bg-gray-200",children:[e(r,{className:"text-center",children:"Tanggal"}),e(r,{className:"text-center",children:"Nama Nasabah"}),e(r,{className:"text-center",children:"NIK"}),e(r,{className:"text-center",children:"Note"}),e(r,{className:"text-center",children:"Alamat"}),e(r,{className:"text-center",children:"Kelompok"}),e(r,{className:"text-center",children:"Hari"}),e(r,{className:"text-center",children:"Pnj Ke"}),e(r,{className:"text-center",children:"X Angs"}),e(r,{className:"text-center border-x border-x-black",children:"Pinjaman"}),e(r,{className:"text-center border-x border-x-black",children:"Angsuran"}),e(r,{className:"text-center border-x border-x-black",children:"Saldo"}),e(r,{className:"text-center",children:"Note"})]})}),e(S,{children:d?d.map((n,o)=>l(v.Fragment,{children:[e(s,{children:e(t,{colSpan:16,children:n.month})}),n.data.map((a,p)=>l(s,{children:[e(t,{children:l("div",{className:"flex items-center justify-between gap-2",children:[e("div",{children:y(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(B,{size:"xs",onClick:()=>j(a.id),children:"Pay"})})]})}),e(t,{children:a.nama}),e(t,{className:"text-center",children:a.nik}),l(t,{className:"text-center",children:[a.lunas?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(C,{children:a.notes}):""]}),e(t,{children:a.alamat}),e(t,{className:"text-center",children:a.kelompok}),e(t,{className:"text-center",children:a.hari}),e(t,{className:"text-center",children:a.pinjaman_ke}),e(t,{className:"text-center",children:a.x_angs}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.pinjaman})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.angsuran})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.saldo})}),e(t,{children:a.notes})]},p)),l(s,{className:"bg-gray-100",children:[e(t,{className:"py-3",colSpan:9,children:e("b",{children:"Total"})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"pinjaman")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"angsuran")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"saldo")})})]})]},o)):e(s,{children:e(t,{children:"a"})})})]}),e(A,{datas:d,show:u,onClosed:k,triggeredId:b})]})};export{se as default};