import{r as i,j as l,a as e,R as y,c as v}from"./app-dd5d88de.js";import{T,a as _,b as s,c as r,d as S,e as t}from"./table-d54f704d.js";import{F as c}from"./FormatNumbering-d6810bb2.js";import{B}from"./button-cc368867.js";import A from"./Action-c8971b63.js";import{B as C}from"./badge-d25c8798.js";import"./utils-36e2ef84.js";import"./react-number-format.es-3a1d10c2.js";import"./dialog-2d9e111f.js";import"./index-60452824.js";import"./index-c4845c96.js";import"./react-icons.esm-370ad885.js";import"./index-4a15253f.js";import"./card-74aeb78f.js";import"./BayarAngsuran-82830ebb.js";import"./label-b1b09a72.js";import"./index-aa4e1d5d.js";import"./input-b4c964f5.js";import"./index.esm-c9659912.js";import"./Checkbox-03cbf325.js";import"./Loading-7f25859b.js";import"./transition-7dacb077.js";import"./JenisNasabah-63b7688d.js";import"./InputError-92d76e14.js";import"./InputLabel-68455e86.js";import"./PrimaryButton-47d9da49.js";import"./SelectList-30ff88d4.js";import"./DeleteAngsuran-7ce9e339.js";import"./TextInput-132c6f54.js";import"./DeleteLoan-2e21069c.js";import"./useFrontEndPermission-93dca647.js";import"./NoEditOverlay-1769054d.js";const ie=({datas:h})=>{const[d,g]=i.useState([]);i.useEffect(()=>{g(h)},[h]);const m=(n,o)=>n.reduce((p,f)=>p+parseInt(f[o]??0),0),[b,x]=i.useState(null),[u,N]=i.useState(!1),j=n=>{x(n),N(!0)},k=()=>{N(!1),x(null)};return l("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh]",children:[l(T,{className:"text-xs rounded-lg",children:[e(_,{className:"sticky top-0 left-0 z-10",children:l(s,{className:"bg-gray-200",children:[e(r,{className:"text-center",children:"Tanggal"}),e(r,{className:"text-center",children:"Nama Nasabah"}),e(r,{className:"text-center",children:"NIK"}),e(r,{className:"text-center",children:"Note"}),e(r,{className:"text-center",children:"Alamat"}),e(r,{className:"text-center",children:"Kelompok"}),e(r,{className:"text-center",children:"Hari"}),e(r,{className:"text-center",children:"Pnj Ke"}),e(r,{className:"text-center",children:"X Angs"}),e(r,{className:"text-center border-x border-x-black",children:"Pinjaman"}),e(r,{className:"text-center border-x border-x-black",children:"Angsuran"}),e(r,{className:"text-center border-x border-x-black",children:"Saldo"}),e(r,{className:"text-center",children:"Note"})]})}),e(S,{children:d?d.map((n,o)=>l(y.Fragment,{children:[e(s,{children:e(t,{colSpan:16,children:n.month})}),n.data.map((a,p)=>l(s,{children:[e(t,{children:l("div",{className:"flex items-center justify-between gap-2",children:[e("div",{children:v(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(B,{size:"xs",onClick:()=>j(a.id),children:"Pay"})})]})}),e(t,{children:a.nama}),e(t,{className:"text-center",children:a.nik}),l(t,{className:"text-center",children:[a.lunas?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(C,{children:a.notes}):""]}),e(t,{children:a.alamat}),e(t,{className:"text-center",children:a.kelompok}),e(t,{className:"text-center",children:a.hari}),e(t,{className:"text-center",children:a.pinjaman_ke}),e(t,{className:"text-center",children:a.x_angs}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.pinjaman})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.angsuran})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.saldo})}),e(t,{children:a.notes})]},p)),l(s,{className:"bg-gray-100",children:[e(t,{className:"py-3",colSpan:9,children:e("b",{children:"Total"})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"pinjaman")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"angsuran")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"saldo")})}),e(t,{className:"py-3"})]})]},o)):e(s,{children:e(t,{children:"a"})})})]}),e(A,{datas:d,show:u,onClosed:k,triggeredId:b})]})};export{ie as default};
