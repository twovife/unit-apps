import{r as n,j as s,F as f,a as e,c as S}from"./app-56003dbd.js";import{T as k,a as D,b as h,c as t,d as A,e as r,F as l}from"./FormatNumbering-282bcd25.js";import{B as w}from"./BargeStatus-67dc4063.js";import T from"./Approval-4221ce22.js";import"./utils-36e2ef84.js";import"./react-number-format.es-91c0eacb.js";import"./button-d6854775.js";import"./Checkbox-f59cb081.js";import"./InputLabel-972db734.js";import"./Loading-af3e5f59.js";import"./transition-f631a278.js";import"./dialog-589a6b3e.js";import"./index-40691837.js";import"./index-b8f03138.js";import"./react-icons.esm-8128ce5a.js";import"./index-93b08933.js";import"./input-bdff776e.js";import"./index-fdbfcc18.js";import"./index.esm-676018da.js";const Q=({datas:c,dataTransaksi:o})=>{const[i,m]=n.useState([]),[u,g]=n.useState([]);n.useEffect(()=>{m(c),g(o)},[c,o]);const[x,d]=n.useState(!1),[b,p]=n.useState(),v=a=>{d(!0),p(a)};return s(f,{children:[e(T,{show:x,onClosed:a=>{d(!1),p()},staticData:u,triggeredDate:b,datas:i}),s(k,{className:"w-full table-auto",children:[e(D,{className:"sticky top-0 z-10 bg-gray-100",children:s(h,{children:[e(t,{className:"text-center",children:"Action"}),e(t,{className:"text-center",children:"Tanggal"}),e(t,{className:"text-center",children:"Kasbon"}),e(t,{className:"text-center",children:"Target"}),e(t,{className:"text-center",children:"Masuk"}),e(t,{className:"text-center",children:"Keluar"}),e(t,{className:"text-center",children:"Storting"}),e(t,{className:"text-center",children:"Drop"}),e(t,{className:"text-center",children:"Baru"}),e(t,{className:"text-center",children:"Lama"}),e(t,{className:"text-center",children:"Rencana"})]})}),e(A,{children:i.map((a,N)=>s(h,{className:"text-center",children:[e(r,{children:a.is_generated&&e(w,{value:a.is_closed,onClick:()=>v(a.tanggal),size:"xs",children:"Action"})}),e(r,{children:S(a.tanggal).format("DD-MM-YYYY")}),e(r,{children:e(l,{value:a.kasbon})}),e(r,{children:e(l,{value:a.target})}),e(r,{children:e(l,{value:a.masuk})}),e(r,{children:e(l,{value:a.keluar})}),e(r,{className:"text-blue-600 hover:bg-blue-100",children:e("a",{target:"_blank",href:route("pinjaman.index_pinjaman",{date:a.tanggal,kelompok:a.kelompok}),children:e(l,{value:a.storting})})}),e(r,{children:e(l,{value:a.drop})}),e(r,{children:e(l,{value:a.baru})}),e(r,{children:e(l,{value:a.lama})}),e(r,{children:e(l,{value:a.rencana})})]},N))})]})]})};export{Q as default};