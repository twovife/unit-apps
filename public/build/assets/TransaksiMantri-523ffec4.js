import{r as o,j as i,a as r,b as l}from"./app-0631cbdd.js";import{S as t,P as m,a as c,F as u,b as h}from"./popover-2356860a.js";import{B as d}from"./button-ae4b2def.js";import{M as k}from"./MobileLayout-fb0b1f71.js";import b from"./BukuTransaksiKepala-d631503a.js";import"./createLucideIcon-1879e9ec.js";import"./SelectComponent-23fdf4c6.js";import"./input-a37a9a88.js";import"./utils-36e2ef84.js";import"./react-icons.esm-0c0f5c7a.js";import"./index-5942732c.js";import"./index-9a945636.js";import"./Loading-a0ce524c.js";import"./transition-d2d78fb4.js";import"./label-406d1b82.js";import"./index-165a61d9.js";import"./index-dc9664da.js";import"./SweetAlert-de25fc1c.js";import"./index-3d04072e.js";import"./index-495b9d19.js";import"./FormatNumbering-86167479.js";import"./react-number-format.es-99fa56f1.js";import"./BargeStatus-2f0a2303.js";import"./BadgeStatus-a532e679.js";import"./badge-6b9ccbfd.js";import"./Action-9e26d94b.js";import"./dialog-ff9caeb6.js";import"./card-96dbf117.js";import"./tabs-580bc5cf.js";import"./RiwayatPengajuan-4af75319.js";import"./index-7d1d3c46.js";import"./Acc-7753bc68.js";import"./NoEditOverlay-344b9bbf.js";import"./useFrontEndPermission-bf04bc52.js";import"./index.esm-91c2ffd7.js";import"./ActionTable-06d22ca4.js";import"./RemoveLoan-7fb77429.js";import"./ChangeDetail-c82d9543.js";const or=({datas:a,buku_rencana:f,auth:e,...x})=>{const[_,s]=o.useState([]);return o.useEffect(()=>{s(a.flat())},[a]),i(k,{header:r(l,{children:"Buku Transaksi"}),children:[i("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(t,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:i(m,{children:[r(c,{asChild:!0,children:i(d,{variant:"outline",children:[r(u,{className:"h-4"}),"Filter"]})}),r(h,{children:r(t,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})})]})})]}),r("div",{className:"max-h-[80vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:a&&a.map((p,n)=>r(b,{datas:p},n))})]})};export{or as default};
