import{r as d,j as a,F as w,a as e,d as x}from"./app-ea40b5cc.js";import{T as C,a as N,b as c,c as p,d as T,e as t,f as y}from"./table-1fbfb401.js";import{F as i}from"./FormatNumbering-d99b4d97.js";import{B as S}from"./BargeStatus-82dd7928.js";import{B as D}from"./BadgeStatus-d44a8daa.js";import _ from"./Action-2e52343d.js";import"./utils-450acc22.js";import"./react-number-format.es-ea2b65de.js";import"./button-bb453505.js";import"./badge-e0e565ac.js";import"./dialog-4bd5cdd1.js";import"./index-89c52b50.js";import"./index-0f520a92.js";import"./react-icons.esm-5de91a74.js";import"./index-56b34f8f.js";import"./accordion-0f8b13c3.js";import"./index-86950388.js";import"./card-63e95ef3.js";import"./tabs-53b624dd.js";import"./RiwayatPengajuan-a4626e17.js";import"./index-8a315e89.js";import"./Acc-ddbf68db.js";import"./Loading-f1fa4628.js";import"./transition-5f488c71.js";import"./NoEditOverlay-f81cb5c7.js";import"./useFrontEndPermission-fefe01a7.js";import"./label-0fe9aa52.js";import"./index-8279430f.js";import"./index.esm-5199308d.js";import"./ActionTable-73a5ff04.js";import"./RemoveLoan-fa9676e4.js";import"./ChangeDetail-17c75f93.js";import"./input-48c76437.js";const ce=({datas:m})=>{var f;const[s,v]=d.useState([]);d.useEffect(()=>{v(m)},[m]);const n=(r=>r.reduce((l,o)=>(l.request+=o.request||0,l.drop+=o.drop||0,l.drop_jadi+=o.drop_jadi||0,l.acc+=o.acc||0,l),{request:0,drop:0,acc:0,drop_jadi:0}))(s),[b,h]=d.useState(!1),[g,u]=d.useState(),j=r=>{h(!0),u(r)};return a(w,{children:[e(_,{show:b,onClosed:r=>{h(!1),u()},triggeredData:g}),a(C,{className:"w-full mb-3 text-xs table-auto",children:[e(N,{className:"sticky top-0 z-10 bg-gray-100",children:a(c,{children:[a(p,{className:"font-semibold text-black whitespace-nowrap",children:[x((f=s[0])==null?void 0:f.tanggal_drop).format("DD-MM-YYYY")," "]}),e(p,{children:"Nasabah"}),e(p,{})]})}),e(T,{children:s&&s.map(r=>a(c,{children:[e(t,{className:"w-0",children:e("div",{className:"flex items-center justify-center gap-2",children:e(S,{value:r.status,onClick:()=>j(r)})})}),e(t,{children:a("div",{children:[a("div",{className:"text-base font-semibold",children:[a("span",{children:[" ",r.nama]})," ",e(D,{value:r.drop_langsung})]}),e("div",{children:r.nik}),e("div",{children:r.alamat})]})}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(i,{value:r.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(i,{value:r.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(i,{value:r.drop_jadi})]})]})]},r.id))}),e(y,{children:a(c,{children:[e(t,{}),e(t,{children:"Total"}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(i,{value:n.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(i,{value:n.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(i,{value:n.drop_jadi})]})]})]})})]})]})};export{ce as default};