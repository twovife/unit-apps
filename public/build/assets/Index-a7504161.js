import{r as t,j as r,a as e,b as g}from"./app-d0c32e8e.js";import{S as d}from"./SearchComponent-7d3b6770.js";import{A as x}from"./AuthenticatedLayout-7177ab0a.js";import{B as o}from"./button-17a62d66.js";import{P as v,a as T,F as N,b as C}from"./popover-1bb6fe89.js";import S from"./TableRekap-44b0ca9d.js";import{T as y,a as P,b as l,c as p}from"./tabs-1a88696e.js";import _ from"./TableRekapKasir-400879c6.js";import j from"./TunaiMantri-ce52ffcc.js";import O from"./Action-0be47cff.js";import{C as u}from"./circle-plus-470c02c0.js";import"./SelectComponent-13a31218.js";import"./input-487391ce.js";import"./utils-36e2ef84.js";import"./react-icons.esm-a170a26c.js";import"./index-264e9adc.js";import"./Loading-caf0f109.js";import"./transition-d4981844.js";import"./label-34e21a78.js";import"./index-3eee53bf.js";import"./index-a513186f.js";import"./createLucideIcon-77eac10f.js";import"./SweetAlert-fa33e04a.js";import"./index-4c8be267.js";import"./FormatNumbering-3cbd1803.js";import"./react-number-format.es-7dbd39b4.js";import"./index-7fbc92b8.js";import"./BargeStatus-f3b142d2.js";import"./Checkbox-b418702d.js";import"./InputLabel-c617985f.js";import"./dialog-be485039.js";import"./index-6c1863b9.js";import"./index.esm-74ce0c76.js";const me=({datas:s,auth:i,...B})=>{const[k,a]=t.useState(!1),[f,n]=t.useState(),c=w=>{a(!0)},b=w=>{a(!1),n()},[m,h]=t.useState(null);return r(x,{header:e(g,{children:"Buku Transaksi"}),children:[e(O,{show:k,onClosed:b,triggeredData:f}),r("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[e("div",{className:"flex-none shrink-0 whitespace-nowrap",children:e("h1",{className:"text-xl font-semibold tracking-tight ",children:"Rekap Data Harian"})}),e("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:e(d,{urlLink:route("kasir.rekap.rekap_index"),localState:"kasir_rekap_rekap_index",searchDate:!0,searchGroupingBranch:i.permissions.includes("can show branch"),nexOrPrevious:m,setNexOrPrevious:h,children:i.permissions.includes("can create")&&r(o,{type:"button",onClick:c,children:[e(u,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:[r(v,{children:[e(T,{asChild:!0,children:r(o,{variant:"outline",children:[e(N,{className:"h-4"}),"Filter"]})}),e(C,{children:e(d,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchDate:!0,searchKelompok:i.permissions.includes("can show kelompok"),searchGroupingBranch:i.permissions.includes("can show branch"),nexOrPrevious:m,setNexOrPrevious:h})})]}),r(o,{type:"button",onClick:c,children:[e(u,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),e("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:r(y,{defaultValue:"rekappimpinan",className:"w-full",children:[r(P,{children:[e(l,{value:"rekappimpinan",children:"Rekap Pinpinan"}),e(l,{value:"rekapkasir",children:"Rekap Kasir"}),e(l,{value:"tunaimantri",children:"Tunai Mantri"})]}),e(p,{value:"rekappimpinan",children:e(S,{setOnShowModal:a,setTriggeredData:n,datas:s})}),e(p,{value:"rekapkasir",children:e(_,{setOnShowModal:a,setTriggeredData:n,datas:s})}),e(p,{value:"tunaimantri",children:e(j,{setOnShowModal:a,setTriggeredData:n,datas:s})})]})})]})};export{me as default};
