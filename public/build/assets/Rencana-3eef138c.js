import{r as l,j as s,F as S,a as e,c as k}from"./app-dd5d88de.js";import{T as D,a as A,b as h,c as t,d as w,e as r}from"./table-d54f704d.js";import{F as n}from"./FormatNumbering-d6810bb2.js";import{B as T}from"./BargeStatus-7cd1c1c1.js";import j from"./Approval-bd4f74a1.js";import{u as C}from"./useFrontEndPermission-93dca647.js";import"./utils-36e2ef84.js";import"./react-number-format.es-3a1d10c2.js";import"./button-cc368867.js";import"./Checkbox-03cbf325.js";import"./InputLabel-68455e86.js";import"./Loading-7f25859b.js";import"./transition-7dacb077.js";import"./dialog-2d9e111f.js";import"./index-60452824.js";import"./index-c4845c96.js";import"./react-icons.esm-370ad885.js";import"./index-4a15253f.js";import"./input-b4c964f5.js";import"./index-aa4e1d5d.js";import"./index.esm-c9659912.js";const X=({datas:o,dataTransaksi:c})=>{const[i,u]=l.useState([]),[g,x]=l.useState([]),{isUnit:d}=C();l.useEffect(()=>{u(o),x(c)},[o,c]);const[b,p]=l.useState(!1),[v,m]=l.useState(),N=a=>{p(!0),m(a)};return s(S,{children:[e(j,{show:b,onClosed:a=>{p(!1),m()},staticData:g,triggeredDate:v,datas:i}),s(D,{className:"w-full table-auto",children:[e(A,{className:"sticky top-0 z-10 bg-gray-100",children:s(h,{children:[d&&e(t,{className:"text-center",children:"Action"}),e(t,{className:"text-center",children:"Tanggal"}),e(t,{className:"text-center",children:"Kasbon"}),e(t,{className:"text-center",children:"Target"}),e(t,{className:"text-center",children:"Masuk"}),e(t,{className:"text-center",children:"Keluar"}),e(t,{className:"text-center",children:"Storting"}),e(t,{className:"text-center",children:"Drop"}),e(t,{className:"text-center",children:"Baru"}),e(t,{className:"text-center",children:"Lama"}),e(t,{className:"text-center",children:"Rencana"})]})}),e(w,{children:i.map((a,f)=>s(h,{className:"text-center",children:[d&&e(r,{children:a.is_generated&&e(T,{value:a.is_closed,onClick:()=>N(a.tanggal),size:"xs",children:"Action"})}),e(r,{children:k(a.tanggal).format("DD-MM-YYYY")}),e(r,{children:e(n,{value:a.kasbon})}),e(r,{children:e(n,{value:a.target})}),e(r,{children:e(n,{value:a.masuk})}),e(r,{children:e(n,{value:a.keluar})}),e(r,{className:"text-blue-600 hover:bg-blue-100",children:e("a",{target:"_blank",href:route("pinjaman.index_pinjaman",{date:a.tanggal,kelompok:a.kelompok}),children:e(n,{value:a.storting})})}),e(r,{children:e(n,{value:a.drop})}),e(r,{children:e(n,{value:a.baru})}),e(r,{children:e(n,{value:a.lama})}),e(r,{children:e(n,{value:a.rencana})})]},f))})]})]})};export{X as default};
