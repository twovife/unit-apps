import{r as i,q as u,j as e,a as r,b as h}from"./app-35d31ed9.js";import{S as o,P as d,a as k,F as f,b}from"./popover-c111436e.js";import{B as g}from"./button-1aa3a58c.js";import{T as v,a as T,b as s,c as n}from"./tabs-d27c9ef9.js";import{M as w}from"./MobileLayout-5acfae98.js";import x from"./BukuTransaksiKepala-0adb5f74.js";import B from"./Rencana-4f3ca93b.js";import"./createLucideIcon-e2a25d74.js";import"./SelectComponent-97521685.js";import"./input-68668017.js";import"./utils-36e2ef84.js";import"./react-icons.esm-2b559b63.js";import"./index-30fd9ee9.js";import"./index-4dbb77c9.js";import"./Loading-4c55c56e.js";import"./transition-e7b86cd0.js";import"./label-abe714e5.js";import"./index-c504300c.js";import"./index-fd31a729.js";import"./index-2b75c312.js";import"./SweetAlert-77e0aa69.js";import"./index-d3423716.js";import"./table-06e53020.js";import"./FormatNumbering-7d539e15.js";import"./react-number-format.es-d26c8058.js";import"./BargeStatus-8ccd377a.js";import"./BadgeStatus-dd3c5d72.js";import"./badge-a296b71f.js";import"./Action-efc7307d.js";import"./dialog-5923ce6e.js";import"./card-201f9aba.js";import"./RiwayatPengajuan-e98b5a16.js";import"./index-1469b9f7.js";import"./Acc-64600fbe.js";import"./NoEditOverlay-19559f6f.js";import"./useFrontEndPermission-35e96759.js";import"./index.esm-afbbfe1e.js";import"./ActionTable-7f494273.js";import"./RemoveLoan-9f8962d4.js";import"./ChangeDetail-1ccbc071.js";import"./Approval-885bce9d.js";import"./Checkbox-c284e770.js";import"./InputLabel-c3c1a497.js";const fr=({datas:t,buku_rencana:l,auth:_,...S})=>{const[N,p]=i.useState([]),{server_filter:a}=u().props;return i.useEffect(()=>{p(t.flat())},[t]),e(w,{header:r(h,{children:"Buku Transaksi"}),children:[e("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaki"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(o,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:a.userAuthorized.canShowKelompok,searchBranch:a.userAuthorized.canShowBranch,searchGroupingBranch:a.userAuthorized.canShowGroupingBranch})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:e(d,{children:[r(k,{asChild:!0,children:e(g,{variant:"outline",children:[r(f,{className:"h-4"}),"Filter"]})}),r(b,{children:r(o,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:a.userAuthorized.canShowKelompok,searchBranch:a.userAuthorized.canShowBranch,searchGroupingBranch:a.userAuthorized.canShowGroupingBranch})})]})})]}),r("div",{className:"max-h-[80vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(v,{defaultValue:"bukutransaksi",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:e(T,{children:[r(s,{value:"bukutransaksi",children:"Buku Transaksi"}),r(s,{value:"dailyTarget",children:"Rencana Drop"})]})}),r(n,{value:"bukutransaksi",children:t&&t.map((m,c)=>r(x,{datas:m},c))}),r(n,{value:"dailyTarget",children:r(B,{datas:l,dataTransaksi:t})})]})})]})};export{fr as default};
