import{r as s,j as e,a as r,b as g}from"./app-5028f0e4.js";import{S as d}from"./SearchComponent-96d0c5d1.js";import{A as v}from"./AuthenticatedLayout-906ca364.js";import{B as o}from"./button-6e474809.js";import{P as x,a as T,F as N,b as C}from"./popover-cf820f90.js";import P from"./TableRekap-bb583a35.js";import{T as S,a as y,b as t,c as l}from"./tabs-732a1a9c.js";import j from"./TableRekapKasir-2b4d37ff.js";import _ from"./TunaiMantri-79053b70.js";import O from"./Action-cda43ed9.js";import{C as u}from"./circle-plus-921f42d0.js";import"./SelectComponent-07d0d69a.js";import"./input-f97b10c2.js";import"./utils-46f1eee5.js";import"./react-icons.esm-56e80eae.js";import"./index-9b12ee5b.js";import"./Loading-ae45eac5.js";import"./transition-3db9c4e8.js";import"./label-ab7ee009.js";import"./index-439e0ca6.js";import"./index-f96983da.js";import"./Navbar-636b4c95.js";import"./index-017eb41a.js";import"./createLucideIcon-fb5440a1.js";import"./SweetAlert-2f990cf7.js";import"./index-7d67727e.js";import"./FormatNumbering-0b29fe26.js";import"./react-number-format.es-feaff000.js";import"./index-412f5a40.js";import"./BargeStatus-4cd49e26.js";import"./Checkbox-9c1f2e8a.js";import"./InputLabel-8b13b054.js";import"./BadgeStatus-7169995a.js";import"./badge-eaee1f51.js";import"./dialog-7572127c.js";import"./index-5baec94d.js";import"./index.esm-bc8b360e.js";const kr=({datas:i,auth:a,...B})=>{const[k,n]=s.useState(!1),[f,p]=s.useState(),m=w=>{n(!0)},b=w=>{n(!1),p()},[c,h]=s.useState(null);return e(v,{header:r(g,{children:"Buku Transaksi"}),children:[r(O,{show:k,onClosed:b,triggeredData:f}),e("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Rekap Data Harian"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(d,{urlLink:route("kasir.rekap.rekap_permantri"),localState:"kasir_rekap_rekap_permantri",searchMonth:!0,searchKelompok:a.permissions.includes("can show kelompok"),searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:c,setNexOrPrevious:h,children:a.permissions.includes("can create")&&e(o,{type:"button",onClick:m,children:[r(u,{className:"h-3.5 w-3.5"}),r("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),e("div",{className:"flex justify-end gap-3 lg:hidden",children:[e(x,{children:[r(T,{asChild:!0,children:e(o,{variant:"outline",children:[r(N,{className:"h-4"}),"Filter"]})}),r(C,{children:r(d,{urlLink:route("kasir.rekap.rekap_permantri"),localState:"kasir_rekap_rekap_permantri",searchDate:!0,searchKelompok:a.permissions.includes("can show kelompok"),searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:c,setNexOrPrevious:h})})]}),e(o,{type:"button",onClick:m,children:[r(u,{className:"h-3.5 w-3.5"}),r("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),r("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(S,{defaultValue:"rekappimpinan",className:"w-full",children:[e(y,{children:[r(t,{value:"rekappimpinan",children:"Rekap Pinpinan"}),r(t,{value:"rekapkasir",children:"Rekap Kasir"}),r(t,{value:"tunaimantri",children:"Tunai Mantri"})]}),r(l,{value:"rekappimpinan",children:r(P,{setOnShowModal:n,setTriggeredData:p,datas:i})}),r(l,{value:"rekapkasir",children:r(j,{datas:i})}),r(l,{value:"tunaimantri",children:r(_,{datas:i})})]})})]})};export{kr as default};