import{r as o,j as i,a as r,b as l}from"./app-01dbd2ca.js";import{S as t,P as m,a as c,F as u,b as h}from"./popover-c2744ca3.js";import{B as d}from"./button-e594156b.js";import{M as k}from"./MobileLayout-51620276.js";import b from"./BukuTransaksiKepala-31f02256.js";import"./createLucideIcon-72decb57.js";import"./SelectComponent-41d65774.js";import"./input-2f9dcac5.js";import"./utils-36e2ef84.js";import"./react-icons.esm-e69bb1a2.js";import"./index-0257f697.js";import"./index-e96bcad6.js";import"./Loading-bacf33e9.js";import"./transition-37508b69.js";import"./label-a59e5876.js";import"./index-be647e53.js";import"./index-1a5a975e.js";import"./SweetAlert-bc29475f.js";import"./index-9c33a239.js";import"./index-4d3b6f23.js";import"./FormatNumbering-750d2fb1.js";import"./react-number-format.es-7ab5d1fe.js";import"./BargeStatus-71fa1036.js";import"./BadgeStatus-5eefca01.js";import"./badge-61cfb712.js";import"./Action-cfb5643c.js";import"./dialog-e5ae602b.js";import"./card-7ec1f0b3.js";import"./tabs-187fcb4b.js";import"./RiwayatPengajuan-aa121312.js";import"./index-758bbc06.js";import"./Acc-de65c6b2.js";import"./NoEditOverlay-5ca8dba7.js";import"./useFrontEndPermission-7736c5f3.js";import"./index.esm-eff4be9d.js";import"./ActionTable-dd98cf4e.js";import"./RemoveLoan-15ce4d30.js";import"./ChangeDetail-763bcfdb.js";const or=({datas:a,buku_rencana:f,auth:e,...x})=>{const[_,s]=o.useState([]);return o.useEffect(()=>{s(a.flat())},[a]),i(k,{header:r(l,{children:"Buku Transaksi"}),children:[i("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(t,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:i(m,{children:[r(c,{asChild:!0,children:i(d,{variant:"outline",children:[r(u,{className:"h-4"}),"Filter"]})}),r(h,{children:r(t,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})})]})})]}),r("div",{className:"max-h-[80vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:a&&a.map((p,n)=>r(b,{datas:p},n))})]})};export{or as default};