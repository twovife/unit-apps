import{r as d,j as a,F as w,a as e,c as x}from"./app-1dba9351.js";import{T as C,a as N,b as c,c as p,d as T,e as t,F as l,f as y}from"./FormatNumbering-d3eb1c6d.js";import{B as S}from"./BargeStatus-00d2bed5.js";import{B as D}from"./BadgeStatus-be8d1a73.js";import _ from"./Action-5d8bd1c4.js";import"./utils-36e2ef84.js";import"./react-number-format.es-08d37f9d.js";import"./button-f157f404.js";import"./badge-bcbfa6d6.js";import"./dialog-54f4b0aa.js";import"./index-c0dd9ecd.js";import"./index-fde572c1.js";import"./react-icons.esm-f4f0808a.js";import"./index-8e703f61.js";import"./index-5649da3f.js";import"./card-89e16e77.js";import"./tabs-0c3e9642.js";import"./RiwayatPengajuan-30748ebc.js";import"./index-5c4228d0.js";import"./Acc-2cdf4e40.js";import"./Loading-e8037743.js";import"./transition-35d14a90.js";import"./label-a4aeba48.js";import"./index-a2f41169.js";import"./index.esm-5a1b3ab9.js";import"./ActionTable-479bd30e.js";import"./RemoveLoan-c02b7cc4.js";import"./ChangeDetail-187ce52a.js";import"./input-eaed37ea.js";const ie=({datas:m})=>{var f;const[i,v]=d.useState([]);d.useEffect(()=>{v(m)},[m]);const n=(r=>r.reduce((s,o)=>(s.request+=o.request||0,s.drop+=o.drop||0,s.drop_jadi+=o.drop_jadi||0,s.acc+=o.acc||0,s),{request:0,drop:0,acc:0,drop_jadi:0}))(i),[b,h]=d.useState(!1),[g,u]=d.useState(),j=r=>{h(!0),u(r)};return a(w,{children:[e(_,{show:b,onClosed:r=>{h(!1),u()},triggeredData:g}),a(C,{className:"w-full mb-3 text-xs table-auto",children:[e(N,{className:"sticky top-0 z-10 bg-gray-100",children:a(c,{children:[a(p,{className:"font-semibold text-black whitespace-nowrap",children:[x((f=i[0])==null?void 0:f.tanggal_drop).format("DD-MM-YYYY")," "]}),e(p,{children:"Nasabah"}),e(p,{})]})}),e(T,{children:i&&i.map(r=>a(c,{children:[e(t,{className:"w-0",children:e("div",{className:"flex items-center justify-center gap-2",children:e(S,{value:r.status,onClick:()=>j(r)})})}),e(t,{children:a("div",{children:[a("div",{className:"text-base font-semibold",children:[a("span",{children:[" ",r.nama]})," ",e(D,{value:r.drop_langsung})]}),e("div",{children:r.nik}),e("div",{children:r.alamat})]})}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(l,{value:r.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(l,{value:r.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(l,{value:r.drop_jadi})]})]})]},r.id))}),e(y,{children:a(c,{children:[e(t,{}),e(t,{children:"Total"}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(l,{value:n.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(l,{value:n.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(l,{value:n.drop_jadi})]})]})]})})]})]})};export{ie as default};