import{r as d,j as l,a as e,R as v,d as y}from"./app-6f41ea55.js";import{T as _,a as T,b as s,c as r,d as S,e as t}from"./table-e5a48510.js";import{F as c}from"./FormatNumbering-9ee1b047.js";import{B as A}from"./button-c3c23cc6.js";import B from"./Action-cf5626ab.js";import{B as C}from"./badge-4d6b0252.js";import"./utils-36e2ef84.js";import"./react-number-format.es-e3a92009.js";import"./dialog-9a2a1bd6.js";import"./index-4127c4c4.js";import"./react-icons.esm-1bb75465.js";import"./index-6fff1c53.js";import"./card-fe7125ef.js";import"./BayarAngsuran-f8fd1013.js";import"./label-20ddd90c.js";import"./index-cd17374b.js";import"./input-f7765aff.js";import"./index.esm-ea129bf0.js";import"./Checkbox-d7e2dac8.js";import"./Loading-8a7dd92c.js";import"./transition-31f369b9.js";import"./JenisNasabah-4e0113d4.js";import"./InputError-b4e0c872.js";import"./InputLabel-52ec6bce.js";import"./PrimaryButton-48a8ef32.js";import"./SelectList-2c850a5f.js";import"./DeleteAngsuran-28477ede.js";import"./TextInput-5e359523.js";const ne=({datas:h})=>{const[i,g]=d.useState([]);d.useEffect(()=>{g(h)},[h]);const m=(n,o)=>n.reduce((p,f)=>p+parseInt(f[o]??0),0),[b,x]=d.useState(null),[u,N]=d.useState(!1),j=n=>{x(n),N(!0)},k=()=>{N(!1),x(null)};return l("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh]",children:[l(_,{className:"text-xs rounded-lg",children:[e(T,{className:"sticky top-0 left-0 z-10",children:l(s,{className:"bg-gray-200",children:[e(r,{className:"text-center",children:"Tanggal"}),e(r,{className:"text-center",children:"Nama Nasabah"}),e(r,{className:"text-center",children:"NIK"}),e(r,{className:"text-center",children:"Note"}),e(r,{className:"text-center",children:"Alamat"}),e(r,{className:"text-center",children:"Kelompok"}),e(r,{className:"text-center",children:"Hari"}),e(r,{className:"text-center",children:"Pnj Ke"}),e(r,{className:"text-center",children:"X Angs"}),e(r,{className:"text-center border-x border-x-black",children:"Pinjaman"}),e(r,{className:"text-center border-x border-x-black",children:"Angsuran"}),e(r,{className:"text-center border-x border-x-black",children:"Saldo"}),e(r,{className:"text-center",children:"Note"})]})}),e(S,{children:i?i.map((n,o)=>l(v.Fragment,{children:[e(s,{children:e(t,{colSpan:16,children:n.month})}),n.data.map((a,p)=>l(s,{children:[e(t,{children:l("div",{className:"flex items-center justify-between gap-2",children:[e("div",{children:y(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(A,{size:"xs",onClick:()=>j(a.id),children:"Pay"})})]})}),e(t,{children:a.nama}),e(t,{className:"text-center",children:a.nik}),l(t,{className:"text-center",children:[a.lunas?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(C,{children:a.notes}):""]}),e(t,{children:a.alamat}),e(t,{className:"text-center",children:a.kelompok}),e(t,{className:"text-center",children:a.hari}),e(t,{className:"text-center",children:a.pinjaman_ke}),e(t,{className:"text-center",children:a.x_angs}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.pinjaman})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.angsuran})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.saldo})}),e(t,{children:a.notes})]},p)),l(s,{className:"bg-gray-100",children:[e(t,{className:"py-3",colSpan:9,children:e("b",{children:"Total"})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"pinjaman")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"angsuran")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"saldo")})})]})]},o)):e(s,{children:e(t,{children:"a"})})})]}),e(B,{datas:i,show:u,onClosed:k,triggeredId:b})]})};export{ne as default};