import{r as d,j as t,a as e,R as S,d as C}from"./app-467b6a76.js";import{T as B,a as D,b as c,c as m,d as A,e as r,F as s}from"./FormatNumbering-635d6d81.js";import{B as I}from"./button-4900b3ad.js";import F from"./Action-4d8ec781.js";import{B as O}from"./badge-e5f5a2f7.js";import"./utils-46f1eee5.js";import"./react-number-format.es-1310d9cd.js";import"./index-f96983da.js";import"./dialog-31b51e22.js";import"./index-cc972492.js";import"./react-icons.esm-503b848c.js";import"./index-e954674d.js";import"./card-92fabe96.js";import"./StatusPinjaman-531db8b1.js";import"./BayarAngsuran-c1fbf2c5.js";import"./label-a93fee94.js";import"./index-ad336fc1.js";import"./input-b44e9a14.js";import"./index.esm-f30daa57.js";import"./Checkbox-4916f951.js";import"./Loading-c9fb64a7.js";import"./transition-37914111.js";import"./JenisNasabah-365fe271.js";import"./InputError-c2b8e2e9.js";import"./InputLabel-a18420f9.js";import"./PrimaryButton-68c87650.js";import"./SelectList-829a35d7.js";import"./DeleteAngsuran-5e29e515.js";import"./TextInput-07c30d56.js";import"./DeleteLoan-7151fde9.js";const me=({dateOfWeek:f,datas:p})=>{const[h,N]=d.useState([]);d.useEffect(()=>{if(p){const n=(a=>a.map(i=>({...i,data:i.data.filter(o=>!(o.lunas&&!o.is_paid))})))(p);N(n)}},[p]);const x=(l,n)=>l.reduce((i,o)=>i+parseInt(o[n]??0),0),[v,g]=d.useState(null),[b,u]=d.useState(!1),j=l=>{g(l),u(!0)},y=()=>{u(!1),g(null)},[T,_]=d.useState([]),k=l=>{_(n=>n.includes(l)?n.filter(a=>a!==l):[...n,l])};return t("div",{className:"relative overflow-auto h-[70vh] lg:h-[85vh] scrollbar-thin",children:[t(B,{className:"text-xs rounded-lg",children:[e(D,{className:"sticky top-0 left-0 z-10",children:t(c,{className:"bg-gray-200",children:[e(m,{className:"text-center",children:"No"}),e(m,{className:"text-center",children:"Tanggal"}),e(m,{className:"text-center",children:"Nasabah"}),e(m,{className:"text-center",children:"Note"}),e(m,{className:"text-center border-x border-x-black",children:"Nominal"})]})}),e(A,{children:h?h.map((l,n)=>t(S.Fragment,{children:[e(c,{children:e(r,{colSpan:17+(f.length??0),children:l.month})}),l.data.map((a,i)=>t(c,{className:`${T.includes(a.id)?"bg-green-200 hover:bg-green-50":""}}`,children:[e(r,{onClick:()=>k(a.id),children:i+1}),e(r,{children:t("div",{className:"space-y-2 text-center",children:[e("div",{children:C(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(I,{size:"xs",variant:a.lunas?"green":a.is_paid?"blue":"default",onClick:()=>j(a.id),children:a.lunas?"Lunas":a.is_paid?"Dibayar":"Bayar"})})]})}),t(r,{children:[e("div",{className:"font-semibold",children:a.nama}),e("div",{children:a.nik}),e("div",{children:a.alamat})]}),t(r,{className:"text-center",children:[a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(O,{children:a.notes}):""]}),t(r,{className:"border-x border-x-black",children:[t("div",{className:"flex justify-between gap-6",children:[e("div",{children:"P"}),e(s,{value:a.pinjaman})]}),t("div",{className:"flex justify-between gap-6 border-b-2 border-b-black ",children:[e("div",{children:"A"}),e(s,{value:a.angsuran})]}),t("div",{className:"flex justify-between gap-6",children:[e("div",{children:"S"}),e(s,{value:a.saldo})]})]})]},i)),t(c,{className:"bg-gray-100",children:[e(r,{className:"py-3",colSpan:4,children:"TOTAL"}),t(r,{className:"border-x border-x-black",children:[t("div",{className:"flex justify-between gap-6",children:[e("div",{children:"P"}),e(s,{value:x(l.data,"pinjaman")})]}),t("div",{className:"flex justify-between gap-6 border-b-2 border-b-black ",children:[e("div",{children:"A"}),e(s,{value:x(l.data,"angsuran")})]}),t("div",{className:"flex justify-between gap-6",children:[e("div",{children:"S"}),e(s,{value:x(l.data,"saldo")})]})]})]})]},n)):e(c,{children:e(r,{children:"a"})})})]}),e(F,{datas:h,show:b,onClosed:y,triggeredId:v})]})};export{me as default};
