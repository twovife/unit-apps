import{r as l,j as s,F as S,a as e,c as k}from"./app-4ddc3bbc.js";import{T as D,a as A,b as h,c as t,d as w,e as r}from"./table-939796ee.js";import{F as n}from"./FormatNumbering-b197cb8c.js";import{B as T}from"./BargeStatus-b17fd0f4.js";import j from"./Approval-235c6220.js";import{u as C}from"./useFrontEndPermission-c9894289.js";import"./utils-36e2ef84.js";import"./react-number-format.es-afb65d6f.js";import"./button-abfd5106.js";import"./Checkbox-42f9c9f7.js";import"./InputLabel-4725cb61.js";import"./Loading-3fa3d93b.js";import"./transition-4c9649e7.js";import"./dialog-8423e5f2.js";import"./index-eb65bd5e.js";import"./index-d13eaa91.js";import"./react-icons.esm-ec4b821d.js";import"./index-b1957622.js";import"./input-81ef4f3b.js";import"./index-69b212db.js";import"./index.esm-50ffb201.js";const X=({datas:o,dataTransaksi:c})=>{const[i,u]=l.useState([]),[g,x]=l.useState([]),{isUnit:d}=C();l.useEffect(()=>{u(o),x(c)},[o,c]);const[b,p]=l.useState(!1),[v,m]=l.useState(),N=a=>{p(!0),m(a)};return s(S,{children:[e(j,{show:b,onClosed:a=>{p(!1),m()},staticData:g,triggeredDate:v,datas:i}),s(D,{className:"w-full table-auto",children:[e(A,{className:"sticky top-0 z-10 bg-gray-100",children:s(h,{children:[d&&e(t,{className:"text-center",children:"Action"}),e(t,{className:"text-center",children:"Tanggal"}),e(t,{className:"text-center",children:"Kasbon"}),e(t,{className:"text-center",children:"Target"}),e(t,{className:"text-center",children:"Masuk"}),e(t,{className:"text-center",children:"Keluar"}),e(t,{className:"text-center",children:"Storting"}),e(t,{className:"text-center",children:"Drop"}),e(t,{className:"text-center",children:"Baru"}),e(t,{className:"text-center",children:"Lama"}),e(t,{className:"text-center",children:"Rencana"})]})}),e(w,{children:i.map((a,f)=>s(h,{className:"text-center",children:[d&&e(r,{children:a.is_generated&&e(T,{value:a.is_closed,onClick:()=>N(a.tanggal),size:"xs",children:"Action"})}),e(r,{children:k(a.tanggal).format("DD-MM-YYYY")}),e(r,{children:e(n,{value:a.kasbon})}),e(r,{children:e(n,{value:a.target})}),e(r,{children:e(n,{value:a.masuk})}),e(r,{children:e(n,{value:a.keluar})}),e(r,{className:"text-blue-600 hover:bg-blue-100",children:e("a",{target:"_blank",href:route("pinjaman.index_pinjaman",{date:a.tanggal,kelompok:a.kelompok}),children:e(n,{value:a.storting})})}),e(r,{children:e(n,{value:a.drop})}),e(r,{children:e(n,{value:a.baru})}),e(r,{children:e(n,{value:a.lama})}),e(r,{children:e(n,{value:a.rencana})})]},f))})]})]})};export{X as default};