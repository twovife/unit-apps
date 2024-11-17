import{r as o,j as d,a as e,c as j,R as B}from"./app-01dbd2ca.js";import{T as D,a as M,b as h,c as l,d as F,e as t,F as c}from"./FormatNumbering-750d2fb1.js";import{B as H}from"./button-e594156b.js";import K from"./Action-60649a58.js";import{B as P}from"./badge-61cfb712.js";import"./utils-36e2ef84.js";import"./react-number-format.es-7ab5d1fe.js";import"./dialog-e5ae602b.js";import"./index-4d3b6f23.js";import"./index-0257f697.js";import"./react-icons.esm-e69bb1a2.js";import"./index-e96bcad6.js";import"./card-7ec1f0b3.js";import"./BayarAngsuran-95d47900.js";import"./label-a59e5876.js";import"./index-be647e53.js";import"./input-2f9dcac5.js";import"./index.esm-eff4be9d.js";import"./Checkbox-b0b6d04c.js";import"./Loading-bacf33e9.js";import"./transition-37508b69.js";import"./JenisNasabah-d348251b.js";import"./InputError-95ccc56c.js";import"./InputLabel-2f797a2a.js";import"./PrimaryButton-bb92d023.js";import"./SelectList-36b0d6d1.js";import"./DeleteAngsuran-a9ee9f9a.js";import"./TextInput-9ea5dd41.js";import"./DeleteLoan-8e3f9411.js";import"./useFrontEndPermission-7736c5f3.js";import"./NoEditOverlay-5ca8dba7.js";const be=({dateOfWeek:x,datas:N})=>{const[g,_]=o.useState([]);o.useEffect(()=>{_(N)},[N]);const f=(r,n)=>r.reduce((s,i)=>{var b;return s+parseInt(((b=i.instalment[n])==null?void 0:b.total_nominal)??0)},0),p=(r,n)=>r.reduce((s,i)=>s+parseInt(i[n]??0),0),[S,u]=o.useState(null),[T,v]=o.useState(!1),I=r=>{u(r),v(!0)},C=()=>{v(!1),u(null)},[m,$]=o.useState([]),A=r=>{$(n=>n.includes(r)?n.filter(a=>a!==r):[...n,r])};return d("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin",children:[d(D,{className:"text-xs rounded-lg",children:[e(M,{className:"sticky top-0 left-0 z-10",children:d(h,{className:"bg-gray-200",children:[e(l,{className:"text-center",children:"No"}),e(l,{className:"text-center",children:"Tanggal"}),e(l,{className:"text-center",children:"Nama Nasabah"}),e(l,{className:"text-center",children:"NIK"}),e(l,{className:"text-center",children:"Note"}),e(l,{className:"text-center",children:"Alamat"}),e(l,{className:"text-center",children:"Kelompok"}),e(l,{className:"text-center",children:"Hari"}),e(l,{className:"text-center",children:"Pnj Ke"}),e(l,{className:"text-center",children:"X Angs"}),e(l,{className:"text-center border-x border-x-black",children:"Pinjaman"}),e(l,{className:"text-center border-x border-x-black",children:"Saldo Sebelumnya"}),x.map((r,n)=>e(l,{className:"text-center border-x border-x-black",children:j(r).format("DD-MM-YY")},n)),e(l,{className:"text-center border-x border-x-black",children:"Angsuran"}),e(l,{className:"text-center border-x border-x-black",children:"Saldo"}),e(l,{className:"text-center",children:"Note"})]})}),e(F,{children:g?g.map((r,n)=>d(B.Fragment,{children:[e(h,{children:e(t,{colSpan:17+(x.length??0),children:r.month})}),r.data.map((a,s)=>d(h,{className:`${m.includes(a.id)?"bg-green-200 hover:bg-green-50":""}}`,children:[e(t,{onClick:()=>A(a.id),children:s+1}),e(t,{children:d("div",{className:"flex items-center justify-between gap-2",children:[e("div",{children:j(a.tanggal_drop).format("DD-MM")}),e("div",{children:e(H,{size:"xs",onClick:()=>I(a.id),children:"Pay"})})]})}),e(t,{children:a.nama}),e(t,{className:"text-center",children:a.nik}),d(t,{className:"text-center",children:[a.lunas?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status_pinjaman=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status_pinjaman}):a.status_pinjaman=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status_pinjaman}):a.status_pinjaman=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status_pinjaman}):e("div",{children:a.status_pinjaman}),a.notes!==null?e(P,{children:a.notes}):""]}),e(t,{children:a.alamat}),e(t,{className:"text-center",children:a.kelompok}),e(t,{className:"text-center",children:a.hari}),e(t,{className:"text-center",children:a.pinjaman_ke}),e(t,{className:"text-center",children:a.x_angs}),e(t,{className:`bg-slate-200 hover:bg-slate-100 border-x border-x-black ${m.includes(a.id)?"bg-green-200 hover:bg-green-50":""}`,children:e(c,{value:a.pinjaman})}),e(t,{className:`bg-blue-300 hover:bg-blue-100 border-x border-x-black ${m.includes(a.id)?"bg-green-200 hover:bg-green-50":""}`,children:e(c,{value:a.saldo_sebelumnya})}),x.map((i,b)=>{var k,y;return e(t,{className:`border-x border-x-black ${(k=a.instalment[i])!=null&&k.is_active?"text-red-500 font-semibold":""}`,children:e(c,{value:(y=a.instalment[i])==null?void 0:y.total_nominal})},b)}),e(t,{className:`bg-yellow-200 hover:bg-yellow-100 border-x border-x-black ${m.includes(a.id)?"bg-green-200 hover:bg-green-50":""}`,children:e(c,{value:a.angsuran})}),e(t,{className:`bg-green-300 hover:bg-green-100 border-x border-x-black ${m.includes(a.id)?"bg-green-200 hover:bg-green-50":""}`,children:e(c,{value:a.saldo})}),e(t,{children:a.notes})]},s)),d(h,{className:"bg-gray-100",children:[e(t,{className:"py-3",colSpan:10,children:"ini nanti total"}),e(t,{className:"bg-slate-200 hover:bg-slate-100 border-x border-x-black",children:e(c,{value:p(r.data,"pinjaman")})}),e(t,{className:"bg-blue-300 hover:bg-blue-100 border-x border-x-black",children:e(c,{value:p(r.data,"saldo_sebelumnya")})}),x.map((a,s)=>e(t,{className:"border-x border-x-black",children:e(c,{value:f(r.data,a)})},s)),e(t,{className:"bg-yellow-200 hover:bg-yellow-100 border-x border-x-black ",children:e(c,{value:p(r.data,"angsuran")})}),e(t,{className:"bg-green-300 hover:bg-green-100 border-x border-x-black ",children:e(c,{value:p(r.data,"saldo")})}),e(t,{})]})]},n)):e(h,{children:e(t,{children:"a"})})})]}),e(K,{datas:g,show:T,onClosed:C,triggeredId:S})]})};export{be as default};