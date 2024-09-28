import{r as s,j as r,a as e,b as g}from"./app-c852447f.js";import{S as d}from"./SearchComponent-e8fb8d35.js";import{A as v}from"./AuthenticatedLayout-b09b1afa.js";import{B as o}from"./button-f1d79983.js";import{P as x,a as T,F as N,b as C}from"./popover-5206033c.js";import P from"./TableRekap-16c13aeb.js";import{T as S,a as y,b as t,c as l}from"./tabs-fa800c98.js";import _ from"./TableRekapKasir-e973c13a.js";import j from"./TunaiMantri-dc2e9c12.js";import O from"./Action-8dec23b0.js";import{C as u}from"./circle-plus-51db9b31.js";import"./SelectComponent-25f4b12b.js";import"./input-02d3423f.js";import"./utils-36e2ef84.js";import"./react-icons.esm-26840eb3.js";import"./index-71acb7a6.js";import"./Loading-3cde90b0.js";import"./transition-bebf8616.js";import"./label-d7b82de4.js";import"./index-14a993ee.js";import"./index-f96983da.js";import"./index-3beca8f3.js";import"./createLucideIcon-88b2e6a4.js";import"./SweetAlert-32246a70.js";import"./index-4a6df377.js";import"./FormatNumbering-697f2e7e.js";import"./react-number-format.es-0ad3a443.js";import"./index-c09943f8.js";import"./BargeStatus-c5a730b0.js";import"./Checkbox-5c49bc1f.js";import"./InputLabel-cfe10492.js";import"./dialog-37297b03.js";import"./index-e9664f0b.js";import"./index.esm-0dcdc36d.js";const he=({datas:i,auth:a,...B})=>{const[k,n]=s.useState(!1),[f,p]=s.useState(),m=w=>{n(!0)},b=w=>{n(!1),p()},[c,h]=s.useState(null);return r(v,{header:e(g,{children:"Buku Transaksi"}),children:[e(O,{show:k,onClosed:b,triggeredData:f}),r("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[e("div",{className:"flex-none shrink-0 whitespace-nowrap",children:e("h1",{className:"text-xl font-semibold tracking-tight ",children:"Rekap Data Harian"})}),e("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:e(d,{urlLink:route("kasir.rekap.rekap_permantri"),localState:"kasir_rekap_rekap_permantri",searchMonth:!0,searchKelompok:a.permissions.includes("can show kelompok"),searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:c,setNexOrPrevious:h,children:a.permissions.includes("can create")&&r(o,{type:"button",onClick:m,children:[e(u,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:[r(x,{children:[e(T,{asChild:!0,children:r(o,{variant:"outline",children:[e(N,{className:"h-4"}),"Filter"]})}),e(C,{children:e(d,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchDate:!0,searchKelompok:a.permissions.includes("can show kelompok"),searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:c,setNexOrPrevious:h})})]}),r(o,{type:"button",onClick:m,children:[e(u,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),e("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:r(S,{defaultValue:"rekappimpinan",className:"w-full",children:[r(y,{children:[e(t,{value:"rekappimpinan",children:"Rekap Pinpinan"}),e(t,{value:"rekapkasir",children:"Rekap Kasir"}),e(t,{value:"tunaimantri",children:"Tunai Mantri"})]}),e(l,{value:"rekappimpinan",children:e(P,{setOnShowModal:n,setTriggeredData:p,datas:i})}),e(l,{value:"rekapkasir",children:e(_,{datas:i})}),e(l,{value:"tunaimantri",children:e(j,{datas:i})})]})})]})};export{he as default};
