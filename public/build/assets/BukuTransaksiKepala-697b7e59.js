import{r as d,j as a,F as w,a as e,c as x}from"./app-e784aa14.js";import{T as C,a as N,b as c,c as p,d as T,e as t,F as l,f as y}from"./FormatNumbering-64ac0656.js";import{B as S}from"./BargeStatus-06ec1b37.js";import{B as D}from"./BadgeStatus-c28b2b02.js";import _ from"./Action-07200000.js";import"./utils-36e2ef84.js";import"./react-number-format.es-09d6ac52.js";import"./button-bbb9af53.js";import"./badge-de4e1817.js";import"./dialog-a4b9c005.js";import"./index-b3af1ac2.js";import"./index-cbf91c23.js";import"./react-icons.esm-d7142f31.js";import"./index-054343f7.js";import"./index-24d9aa67.js";import"./card-505d06a0.js";import"./tabs-1613f34f.js";import"./RiwayatPengajuan-bbdc5739.js";import"./index-88f5ca5c.js";import"./Acc-9c0bdfec.js";import"./Loading-6279b149.js";import"./transition-890b9c0c.js";import"./label-85a71ee3.js";import"./index-b4847f61.js";import"./index.esm-bd669949.js";import"./ActionTable-57ddc72e.js";import"./RemoveLoan-684128b2.js";import"./ChangeDetail-3f8550ee.js";import"./input-6eba2c92.js";const ie=({datas:m})=>{var f;const[i,v]=d.useState([]);d.useEffect(()=>{v(m)},[m]);const n=(r=>r.reduce((s,o)=>(s.request+=o.request||0,s.drop+=o.drop||0,s.drop_jadi+=o.drop_jadi||0,s.acc+=o.acc||0,s),{request:0,drop:0,acc:0,drop_jadi:0}))(i),[b,h]=d.useState(!1),[g,u]=d.useState(),j=r=>{h(!0),u(r)};return a(w,{children:[e(_,{show:b,onClosed:r=>{h(!1),u()},triggeredData:g}),a(C,{className:"w-full mb-3 text-xs table-auto",children:[e(N,{className:"sticky top-0 z-10 bg-gray-100",children:a(c,{children:[a(p,{className:"font-semibold text-black whitespace-nowrap",children:[x((f=i[0])==null?void 0:f.tanggal_drop).format("DD-MM-YYYY")," "]}),e(p,{children:"Nasabah"}),e(p,{})]})}),e(T,{children:i&&i.map(r=>a(c,{children:[e(t,{className:"w-0",children:e("div",{className:"flex items-center justify-center gap-2",children:e(S,{value:r.status,onClick:()=>j(r)})})}),e(t,{children:a("div",{children:[a("div",{className:"text-base font-semibold",children:[a("span",{children:[" ",r.nama]})," ",e(D,{value:r.drop_langsung})]}),e("div",{children:r.nik}),e("div",{children:r.alamat})]})}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(l,{value:r.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(l,{value:r.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(l,{value:r.drop_jadi})]})]})]},r.id))}),e(y,{children:a(c,{children:[e(t,{}),e(t,{children:"Total"}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(l,{value:n.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(l,{value:n.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(l,{value:n.drop_jadi})]})]})]})})]})]})};export{ie as default};