import{r as s,j as r,a as e,b as d}from"./app-96bf9012.js";import{S as c}from"./SearchComponent-2b8a138d.js";import{A as u}from"./AuthenticatedLayout-b2b43cc1.js";import{B as n}from"./button-db28f379.js";import{P as k,a as f,F as x,b}from"./popover-f20c1dbf.js";import"./tabs-e1a5cb90.js";import w from"./TableRekap-9a0d73f4.js";import{C as m}from"./circle-plus-ba2019e7.js";import"./SelectComponent-e45dc193.js";import"./input-63990582.js";import"./utils-36e2ef84.js";import"./react-icons.esm-9f904700.js";import"./index-7e0f76bd.js";import"./Loading-26a37045.js";import"./transition-370f079c.js";import"./label-73fce06a.js";import"./index-6f7aeba7.js";import"./index-9866f6ae.js";import"./createLucideIcon-a3088983.js";import"./SweetAlert-97d020c9.js";import"./index-a15ca73e.js";import"./FormatNumbering-260991c3.js";import"./react-number-format.es-103496b8.js";import"./index-911770b2.js";import"./BargeStatus-284658db.js";const U=({datas:p,auth:a,...g})=>{const[v,h]=s.useState(!1);s.useState();const t=l=>{h(!0)},[o,i]=s.useState(null);return r(u,{header:e(d,{children:"Buku Transaksi"}),children:[r("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[e("div",{className:"flex-none shrink-0 whitespace-nowrap",children:e("h1",{className:"text-xl font-semibold tracking-tight ",children:"Rekap Data Harian"})}),e("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:e(c,{urlLink:route("kasir.rekap.rekap_index"),localState:"kasir_rekap_rekap_index",searchDate:!0,searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:o,setNexOrPrevious:i,children:a.permissions.includes("can create")&&r(n,{type:"button",onClick:t,children:[e(m,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:[r(k,{children:[e(f,{asChild:!0,children:r(n,{variant:"outline",children:[e(x,{className:"h-4"}),"Filter"]})}),e(b,{children:e(c,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchDate:!0,searchKelompok:a.permissions.includes("can show kelompok"),searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:o,setNexOrPrevious:i})})]}),r(n,{type:"button",onClick:t,children:[e(m,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),e("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:p.map(l=>e(w,{datas:l}))})]})};export{U as default};
