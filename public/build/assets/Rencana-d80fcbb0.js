import{r as n,j as o,F as v,a as e,d as N}from"./app-dd703d36.js";import{T as f,a as k,b as d,c as r,d as S,e as t,F as l}from"./FormatNumbering-a1b5b3e8.js";import"./dialog-6933ad00.js";import"./card-eba11d8d.js";import"./tabs-dd1534c5.js";import"./button-0531b15f.js";import"./Loading-28c0fbaf.js";import"./label-59250f55.js";import"./index.esm-80bfea83.js";import"./input-51d8455d.js";import{B as T}from"./BargeStatus-e7a3ab7d.js";import w from"./Approval-20831337.js";import"./utils-46f1eee5.js";import"./react-number-format.es-187c3d75.js";import"./index-58d5f23b.js";import"./react-icons.esm-ebe08aab.js";import"./index-a6b89dd4.js";import"./index-76b9727d.js";import"./index-f96983da.js";import"./transition-d2326ba1.js";import"./index-cc4b3dfc.js";import"./Checkbox-c6732507.js";import"./InputLabel-c73aeeca.js";import"./postcss-404a71ed.js";const V=({datas:c,dataTransaksi:p})=>{const[h,m]=n.useState([]);n.useEffect(()=>{m(c)},[c]);const[u,s]=n.useState(!1),[b,i]=n.useState(),g=a=>{s(!0),i(a)};return o(v,{children:[e(w,{show:u,onClosed:a=>{s(!1),i()},staticData:p,triggeredData:b}),o(f,{className:"w-full table-auto",children:[e(k,{className:"sticky top-0 z-10 bg-gray-100",children:o(d,{children:[e(r,{className:"text-center",children:"Action"}),e(r,{className:"text-center",children:"Tanggal"}),e(r,{className:"text-center",children:"Kasbon"}),e(r,{className:"text-center",children:"Target"}),e(r,{className:"text-center",children:"Masuk"}),e(r,{className:"text-center",children:"Keluar"}),e(r,{className:"text-center",children:"Storting"}),e(r,{className:"text-center",children:"Drop"}),e(r,{className:"text-center",children:"Baru"}),e(r,{className:"text-center",children:"Lama"}),e(r,{className:"text-center",children:"Rencana"})]})}),e(S,{children:h.map((a,x)=>o(d,{className:"text-center",children:[e(t,{children:e(T,{value:a.button_color,onClick:()=>g(a),size:"xs",children:a.button_color=="baru"?"Pending":a.button_color=="open"?`${a.is_generated?"!":""} open`:"closed"})}),e(t,{children:N(a.tanggal).format("DD-MM-YYYY")}),e(t,{children:e(l,{value:a.kasbon})}),e(t,{children:e(l,{value:a.target})}),e(t,{children:e(l,{value:a.masuk})}),e(t,{children:e(l,{value:a.keluar})}),e(t,{className:"text-blue-600 hover:bg-blue-100",children:e("a",{target:"_blank",href:route("pinjaman.index_pinjaman",{date:a.tanggal,kelompok:a.kelompok}),children:e(l,{value:a.storting})})}),e(t,{children:e(l,{value:a.drop})}),e(t,{children:e(l,{value:a.baru})}),e(t,{children:e(l,{value:a.lama})}),e(t,{children:e(l,{value:a.rencana})})]},x))})]})]})};export{V as default};