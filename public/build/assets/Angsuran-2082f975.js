import{r as d,j as l,a as e,R as v,d as y}from"./app-c852447f.js";import{T as _,a as T,b as s,c as r,d as S,e as t,F as c}from"./FormatNumbering-697f2e7e.js";import{B as A}from"./button-f1d79983.js";import B from"./Action-d548e8ff.js";import{B as C}from"./badge-f9279f6f.js";import"./utils-36e2ef84.js";import"./react-number-format.es-0ad3a443.js";import"./index-f96983da.js";import"./dialog-37297b03.js";import"./index-e9664f0b.js";import"./react-icons.esm-26840eb3.js";import"./index-71acb7a6.js";import"./card-f9a33d03.js";import"./BayarAngsuran-09ce0500.js";import"./label-d7b82de4.js";import"./index-14a993ee.js";import"./input-02d3423f.js";import"./index.esm-0dcdc36d.js";import"./Checkbox-5c49bc1f.js";import"./Loading-3cde90b0.js";import"./transition-bebf8616.js";import"./JenisNasabah-40d355b6.js";import"./InputError-e408823b.js";import"./InputLabel-cfe10492.js";import"./PrimaryButton-0dec68f2.js";import"./SelectList-abb4228a.js";import"./DeleteAngsuran-8e30c26b.js";import"./TextInput-d72b0805.js";import"./DeleteLoan-165239c3.js";const le=({datas:h})=>{const[i,g]=d.useState([]);d.useEffect(()=>{g(h)},[h]);const m=(n,o)=>n.reduce((p,f)=>p+parseInt(f[o]??0),0),[b,x]=d.useState(null),[u,N]=d.useState(!1),j=n=>{x(n),N(!0)},k=()=>{N(!1),x(null)};return l("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh]",children:[l(_,{className:"text-xs rounded-lg",children:[e(T,{className:"sticky top-0 left-0 z-10",children:l(s,{className:"bg-gray-200",children:[e(r,{className:"text-center",children:"Tanggal"}),e(r,{className:"text-center",children:"Nama Nasabah"}),e(r,{className:"text-center",children:"NIK"}),e(r,{className:"text-center",children:"Note"}),e(r,{className:"text-center",children:"Alamat"}),e(r,{className:"text-center",children:"Kelompok"}),e(r,{className:"text-center",children:"Hari"}),e(r,{className:"text-center",children:"Pnj Ke"}),e(r,{className:"text-center",children:"X Angs"}),e(r,{className:"text-center border-x border-x-black",children:"Pinjaman"}),e(r,{className:"text-center border-x border-x-black",children:"Angsuran"}),e(r,{className:"text-center border-x border-x-black",children:"Saldo"}),e(r,{className:"text-center",children:"Note"})]})}),e(S,{children:i?i.map((n,o)=>l(v.Fragment,{children:[e(s,{children:e(t,{colSpan:16,children:n.month})}),n.data.map((a,p)=>l(s,{children:[e(t,{children:l("div",{className:"flex items-center justify-between gap-2",children:[e("div",{children:y(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(A,{size:"xs",onClick:()=>j(a.id),children:"Pay"})})]})}),e(t,{children:a.nama}),e(t,{className:"text-center",children:a.nik}),l(t,{className:"text-center",children:[a.lunas?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(C,{children:a.notes}):""]}),e(t,{children:a.alamat}),e(t,{className:"text-center",children:a.kelompok}),e(t,{className:"text-center",children:a.hari}),e(t,{className:"text-center",children:a.pinjaman_ke}),e(t,{className:"text-center",children:a.x_angs}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.pinjaman})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.angsuran})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.saldo})}),e(t,{children:a.notes})]},p)),l(s,{className:"bg-gray-100",children:[e(t,{className:"py-3",colSpan:9,children:e("b",{children:"Total"})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"pinjaman")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"angsuran")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:m(n.data,"saldo")})})]})]},o)):e(s,{children:e(t,{children:"a"})})})]}),e(B,{datas:i,show:u,onClosed:k,triggeredId:b})]})};export{le as default};