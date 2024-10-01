import{r as s,j as e,a as r,b as g}from"./app-894fb644.js";import{S as d}from"./SearchComponent-c8a7ca8b.js";import{A as v}from"./AuthenticatedLayout-55c47614.js";import{B as o}from"./button-9da4f797.js";import{P as x,a as T,F as N,b as C}from"./popover-0d900f70.js";import P from"./TableRekap-27344af7.js";import{T as S,a as y,b as t,c as l}from"./tabs-72060df1.js";import _ from"./TableRekapKasir-f34121b3.js";import j from"./TunaiMantri-4c242cbe.js";import O from"./Action-7796503e.js";import{C as u}from"./circle-plus-1e265165.js";import"./SelectComponent-2a477649.js";import"./input-0ac0cdb0.js";import"./utils-46f1eee5.js";import"./react-icons.esm-bacaa70f.js";import"./index-1ee04d40.js";import"./Loading-b2556a0b.js";import"./transition-dd2a41ee.js";import"./label-b28b47d1.js";import"./index-b4346aa2.js";import"./index-f96983da.js";import"./Navbar-ab0dec55.js";import"./index-f9bf1c67.js";import"./createLucideIcon-fdae9c18.js";import"./SweetAlert-02741e5d.js";import"./index-b32be6a7.js";import"./FormatNumbering-1c98251f.js";import"./react-number-format.es-fde60237.js";import"./index-32ba0184.js";import"./BargeStatus-7bcc4f2b.js";import"./Checkbox-767b89a8.js";import"./InputLabel-4b35f36f.js";import"./BadgeStatus-dfc17f1e.js";import"./badge-9ff1b0cb.js";import"./dialog-a5dfac83.js";import"./index-b8da1699.js";import"./index.esm-481f5ba8.js";const kr=({datas:i,auth:a,...B})=>{const[k,n]=s.useState(!1),[f,p]=s.useState(),m=w=>{n(!0)},b=w=>{n(!1),p()},[c,h]=s.useState(null);return e(v,{header:r(g,{children:"Buku Transaksi"}),children:[r(O,{show:k,onClosed:b,triggeredData:f}),e("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Rekap Data Harian"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(d,{urlLink:route("kasir.rekap.rekap_permantri"),localState:"kasir_rekap_rekap_permantri",searchMonth:!0,searchKelompok:a.permissions.includes("can show kelompok"),searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:c,setNexOrPrevious:h,children:a.permissions.includes("can create")&&e(o,{type:"button",onClick:m,children:[r(u,{className:"h-3.5 w-3.5"}),r("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),e("div",{className:"flex justify-end gap-3 lg:hidden",children:[e(x,{children:[r(T,{asChild:!0,children:e(o,{variant:"outline",children:[r(N,{className:"h-4"}),"Filter"]})}),r(C,{children:r(d,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchDate:!0,searchKelompok:a.permissions.includes("can show kelompok"),searchGroupingBranch:a.permissions.includes("can show branch"),nexOrPrevious:c,setNexOrPrevious:h})})]}),e(o,{type:"button",onClick:m,children:[r(u,{className:"h-3.5 w-3.5"}),r("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),r("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(S,{defaultValue:"rekappimpinan",className:"w-full",children:[e(y,{children:[r(t,{value:"rekappimpinan",children:"Rekap Pinpinan"}),r(t,{value:"rekapkasir",children:"Rekap Kasir"}),r(t,{value:"tunaimantri",children:"Tunai Mantri"})]}),r(l,{value:"rekappimpinan",children:r(P,{setOnShowModal:n,setTriggeredData:p,datas:i})}),r(l,{value:"rekapkasir",children:r(_,{datas:i})}),r(l,{value:"tunaimantri",children:r(j,{datas:i})})]})})]})};export{kr as default};
