import{r as s,j as r,a as e,b as B}from"./app-894fb644.js";import{S as u}from"./SearchComponent-c8a7ca8b.js";import{A as O}from"./AuthenticatedLayout-55c47614.js";import{B as t}from"./button-9da4f797.js";import j from"./Create-20fdcb54.js";import A from"./BukuTransaksiTable-df166488.js";import{P,a as _,F as D,b as F}from"./popover-0d900f70.js";import{T as L,a as z,b as d,c as k}from"./tabs-72060df1.js";import R from"./Rencana-5312506f.js";import"./FormatNumbering-1c98251f.js";import"./dialog-a5dfac83.js";import"./card-e75d9471.js";import"./Loading-b2556a0b.js";import"./label-b28b47d1.js";import"./index.esm-481f5ba8.js";import"./input-0ac0cdb0.js";import E from"./Approval-73a0e7f1.js";import{C as f}from"./circle-plus-1e265165.js";import{A as G,a as H}from"./arrow-big-right-3465ff0e.js";import"./SelectComponent-2a477649.js";import"./react-icons.esm-bacaa70f.js";import"./index-1ee04d40.js";import"./Navbar-ab0dec55.js";import"./index-f9bf1c67.js";import"./createLucideIcon-fdae9c18.js";import"./SweetAlert-02741e5d.js";import"./index-b32be6a7.js";import"./utils-46f1eee5.js";import"./index-f96983da.js";import"./InputError-aa33e7fd.js";import"./RiwayatPengajuan-8ae04c1a.js";import"./index-32ba0184.js";import"./DetailRiwayat-106c7ab4.js";import"./play-1f63a44c.js";import"./search-b8ecaf08.js";import"./Action-f37d5a16.js";import"./DropJadi-dd749eb1.js";import"./Gagal-0520d9e7.js";import"./DetailTableOnAction-52d9476e.js";import"./badge-9ff1b0cb.js";import"./RemoveLoan-b0eb124c.js";import"./ReStatus-fb9a4142.js";import"./SelectList-b22ee93b.js";import"./ChangeDetail-ccd928f9.js";import"./BargeStatus-7bcc4f2b.js";import"./react-number-format.es-fde60237.js";import"./index-b8da1699.js";import"./transition-dd2a41ee.js";import"./index-b4346aa2.js";import"./Checkbox-767b89a8.js";import"./InputLabel-4b35f36f.js";import"./postcss-c548550e.js";const Ke=({datas:o,buku_rencana:w,auth:i,...K})=>{const[b,g]=s.useState([]);s.useEffect(()=>{g(o.flat())},[o]);const[v,l]=s.useState(!1),c=a=>{l(!0)},x=a=>{l(!1)},[C,m]=s.useState(!1),[T,M]=s.useState(!1),N=a=>{m(!0)},S=a=>{m(!1)},[p,n]=s.useState(null),h=a=>{n(a)};return r(O,{header:e(B,{children:"Buku Transaksi"}),children:[e(E,{show:C,onClosed:S,triggeredData:b,triggeredDate:T}),r("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[e("div",{className:"flex-none shrink-0 whitespace-nowrap",children:e("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),e("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:e(u,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:i.permissions.includes("can show kelompok"),searchGroupingBranch:i.permissions.includes("can show branch"),nexOrPrevious:p,setNexOrPrevious:n,children:i.permissions.includes("can create")&&r(t,{type:"button",onClick:c,children:[e(f,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:[r(P,{children:[e(_,{asChild:!0,children:r(t,{variant:"outline",children:[e(D,{className:"h-4"}),"Filter"]})}),e(F,{children:e(u,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:i.permissions.includes("can show kelompok"),searchGroupingBranch:i.permissions.includes("can show branch"),nexOrPrevious:p,setNexOrPrevious:n})})]}),r(t,{type:"button",onClick:c,children:[e(f,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),e(j,{show:v,onClosed:x}),e("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:r(L,{defaultValue:"bukutransaksi",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:[r(z,{children:[e(d,{value:"bukutransaksi",children:"Buku Transaksi"}),e(d,{value:"dailyTarget",children:"Rencana Drop"})]}),e(t,{onClick:N,size:"sm",className:"mr-3",children:"Cek Transaksi"})]}),e(k,{value:"bukutransaksi",children:o&&o.map((a,y)=>e(A,{datas:a},y))}),e(k,{value:"dailyTarget",children:e(R,{datas:w,dataTransaksi:o})})]})}),r("div",{className:"flex justify-between w-full mt-3",children:[e(t,{onClick:()=>h("previous"),size:"icon",children:e(G,{})}),e(t,{onClick:()=>h("next"),size:"icon",children:e(H,{})})]})]})};export{Ke as default};
