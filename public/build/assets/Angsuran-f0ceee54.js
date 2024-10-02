import{r as d,j as l,a as e,R as v,d as y}from"./app-dd703d36.js";import{T as _,a as T,b as s,c as r,d as S,e as t,F as c}from"./FormatNumbering-a1b5b3e8.js";import{B as A}from"./button-0531b15f.js";import B from"./Action-9f96d996.js";import{B as C}from"./badge-f1a6c860.js";import"./utils-46f1eee5.js";import"./react-number-format.es-187c3d75.js";import"./index-f96983da.js";import"./dialog-6933ad00.js";import"./index-58d5f23b.js";import"./react-icons.esm-ebe08aab.js";import"./index-a6b89dd4.js";import"./card-eba11d8d.js";import"./StatusPinjaman-b513b2a9.js";import"./BayarAngsuran-25f80e83.js";import"./label-59250f55.js";import"./index-cc4b3dfc.js";import"./input-51d8455d.js";import"./index.esm-80bfea83.js";import"./Checkbox-c6732507.js";import"./Loading-28c0fbaf.js";import"./transition-d2326ba1.js";import"./JenisNasabah-73d4d989.js";import"./InputError-4427b819.js";import"./InputLabel-c73aeeca.js";import"./PrimaryButton-1085cb04.js";import"./SelectList-1d63972e.js";import"./DeleteAngsuran-0257df66.js";import"./TextInput-fd5f3fa2.js";import"./DeleteLoan-397e1d33.js";const ce=({datas:h})=>{const[i,g]=d.useState([]);d.useEffect(()=>{g(h)},[h]);const m=(n,o)=>n.reduce((p,f)=>p+parseInt(f[o]??0),0),[b,x]=d.useState(null),[u,N]=d.useState(!1),j=n=>{x(n),N(!0)},k=()=>{N(!1),x(null)};return l("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh]",children:[l(_,{className:"text-xs rounded-lg",children:[e(T,{className:"sticky top-0 left-0 z-10",children:l(s,{className:"bg-gray-200",children:[e(r,{className:"text-center",children:"Tanggal"}),e(r,{className:"text-center",children:"Nama Nasabah"}),e(r,{className:"text-center",children:"NIK"}),e(r,{className:"text-center",children:"Note"}),e(r,{className:"text-center",children:"Alamat"}),e(r,{className:"text-center",children:"Kelompok"}),e(r,{className:"text-center",children:"Hari"}),e(r,{className:"text-center",children:"Pnj Ke"}),e(r,{className:"text-center",children:"X Angs"}),e(r,{className:"text-center border-x border-x-black",children:"Pinjaman"}),e(r,{className:"text-center border-x border-x-black",children:"Angsuran"}),e(r,{className:"text-center border-x border-x-black",children:"Saldo"}),e(r,{className:"text-center",children:"Note"})]})}),e(S,{children:i?i.map((n,o)=>l(v.Fragment,{children:[e(s,{children:e(t,{colSpan:16,children:n.month})}),n.data.map((a,p)=>l(s,{children:[e(t,{children:l("div",{className:"flex items-center justify-between gap-2",children:[e("div",{children:y(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(A,{size:"xs",onClick:()=>j(a.id),children:"Pay"})})]})}),e(t,{children:a.nama}),e(t,{className:"text-center",children:a.nik}),l(t,{className:"text-center",children:[a.lunas?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(C,{children:a.notes}):""]}),e(t,{children:a.alamat}),e(t,{className:"text-center",children:a.kelompok}),e(t,{className:"text-center",children:a.hari}),e(t,{className:"text-center",children:a.pinjaman_ke}),e(t,{className:"text-center",children:a.x_angs}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.pinjaman})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.angsuran})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.saldo})}),e(t,{children:a.notes})]},p)),l(s,{className:"bg-gray-100",children:[e(t,{className:"py-3",colSpan:9,children:e("b",{children:"Total"})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"pinjaman")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"angsuran")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"saldo")})})]})]},o)):e(s,{children:e(t,{children:"a"})})})]}),e(B,{datas:i,show:u,onClosed:k,triggeredId:b})]})};export{ce as default};