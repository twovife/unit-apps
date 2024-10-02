import{r as m,j as d,a as e,d as g,R as A}from"./app-552ba341.js";import{T as B,a as D,b as o,c as l,d as M,e as t,F as c}from"./FormatNumbering-30edbba2.js";import{B as F}from"./button-cf90efef.js";import H from"./Action-374c5643.js";import{B as K}from"./badge-dc42e7d5.js";import"./utils-46f1eee5.js";import"./react-number-format.es-ca79cd05.js";import"./index-f96983da.js";import"./dialog-519cf14f.js";import"./index-4bcaf027.js";import"./react-icons.esm-ae5a9f62.js";import"./index-2f2ef86a.js";import"./card-c88b2014.js";import"./StatusPinjaman-e451e731.js";import"./BayarAngsuran-ecaa1f1a.js";import"./label-349cabf1.js";import"./index-0c1f6582.js";import"./input-503fc35e.js";import"./index.esm-2a720079.js";import"./Checkbox-42c9461f.js";import"./Loading-722582b2.js";import"./transition-d86d4832.js";import"./JenisNasabah-10dc638a.js";import"./InputError-3f29f82d.js";import"./InputLabel-db15cd5b.js";import"./PrimaryButton-045a3e6b.js";import"./SelectList-57aab712.js";import"./DeleteAngsuran-f9960e35.js";import"./TextInput-50ab2857.js";import"./DeleteLoan-620611df.js";const he=({dateOfWeek:h,datas:N})=>{const[p,k]=m.useState([]);m.useEffect(()=>{k(N)},[N]);const j=(r,n)=>r.reduce((s,i)=>s+parseInt(i.instalment[n]??0),0),x=(r,n)=>r.reduce((s,i)=>s+parseInt(i[n]??0),0),[v,b]=m.useState(null),[y,u]=m.useState(!1),f=r=>{b(r),u(!0)},_=()=>{u(!1),b(null)},[S,T]=m.useState([]),I=r=>{T(n=>n.includes(r)?n.filter(a=>a!==r):[...n,r])};return d("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin",children:[d(B,{className:"text-xs rounded-lg",children:[e(D,{className:"sticky top-0 left-0 z-10",children:d(o,{className:"bg-gray-200",children:[e(l,{className:"text-center",children:"No"}),e(l,{className:"text-center",children:"Tanggal"}),e(l,{className:"text-center",children:"Nama Nasabah"}),e(l,{className:"text-center",children:"NIK"}),e(l,{className:"text-center",children:"Note"}),e(l,{className:"text-center",children:"Alamat"}),e(l,{className:"text-center",children:"Kelompok"}),e(l,{className:"text-center",children:"Hari"}),e(l,{className:"text-center",children:"Pnj Ke"}),e(l,{className:"text-center",children:"X Angs"}),e(l,{className:"text-center border-x border-x-black",children:"Pinjaman"}),e(l,{className:"text-center border-x border-x-black",children:"Saldo Sebelumnya"}),h.map((r,n)=>e(l,{className:"text-center border-x border-x-black",children:g(r).format("DD-MM-YY")},n)),e(l,{className:"text-center border-x border-x-black",children:"Angsuran"}),e(l,{className:"text-center border-x border-x-black",children:"Saldo"}),e(l,{className:"text-center",children:"Note"})]})}),e(M,{children:p?p.map((r,n)=>d(A.Fragment,{children:[e(o,{children:e(t,{colSpan:17+(h.length??0),children:r.month})}),r.data.map((a,s)=>d(o,{className:`${S.includes(a.id)?"bg-green-200 hover:bg-green-50":""}}`,children:[e(t,{onClick:()=>I(a.id),children:s+1}),e(t,{children:d("div",{className:"flex items-center justify-between gap-2",children:[e("div",{children:g(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(F,{size:"xs",onClick:()=>f(a.id),children:"Pay"})})]})}),e(t,{children:a.nama}),e(t,{className:"text-center",children:a.nik}),d(t,{className:"text-center",children:[a.lunas?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(K,{children:a.notes}):""]}),e(t,{children:a.alamat}),e(t,{className:"text-center",children:a.kelompok}),e(t,{className:"text-center",children:a.hari}),e(t,{className:"text-center",children:a.pinjaman_ke}),e(t,{className:"text-center",children:a.x_angs}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.pinjaman})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.saldo_sebelumnya})}),h.map((i,C)=>e(t,{className:"border-x border-x-black",children:e(c,{value:a.instalment[i]})},C)),e(t,{className:"border-x border-x-black",children:e(c,{value:a.angsuran})}),e(t,{className:"border-x border-x-black",children:e(c,{value:a.saldo})}),e(t,{children:a.notes})]},s)),d(o,{className:"bg-gray-100",children:[e(t,{className:"py-3",colSpan:10,children:"ini nanti total"}),e(t,{className:"border-x border-x-black",children:e(c,{value:x(r.data,"pinjaman")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:x(r.data,"saldo_sebelumnya")})}),h.map((a,s)=>e(t,{className:"border-x border-x-black",children:e(c,{value:j(r.data,a)})},s)),e(t,{className:"border-x border-x-black",children:e(c,{value:x(r.data,"angsuran")})}),e(t,{className:"border-x border-x-black",children:e(c,{value:x(r.data,"saldo")})}),e(t,{})]})]},n)):e(o,{children:e(t,{children:"a"})})})]}),e(H,{datas:p,show:y,onClosed:_,triggeredId:v})]})};export{he as default};
