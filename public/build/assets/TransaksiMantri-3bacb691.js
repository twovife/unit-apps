import{r as t,j as o,a as r,b as l}from"./app-2fa7c2a6.js";import{S as i,P as m,a as c,F as h,b as u}from"./popover-8468ee7a.js";import{B as d}from"./button-efb50510.js";import{M as k}from"./MobileLayout-fe301f0e.js";import f from"./BukuTransaksiKepala-7457a3d7.js";import"./createLucideIcon-e9ce867a.js";import"./SelectComponent-1c3e898c.js";import"./input-ad8a6d1d.js";import"./utils-36e2ef84.js";import"./react-icons.esm-ff33900b.js";import"./index-cc5a7e3f.js";import"./index-1a81e09c.js";import"./Loading-e8849bd6.js";import"./transition-502bb836.js";import"./label-2d1774de.js";import"./index-47ec68c5.js";import"./index-39d6ad3e.js";import"./SweetAlert-b11e6e3c.js";import"./index-1d40199c.js";import"./index-ac79c01f.js";import"./table-5c0ea22f.js";import"./FormatNumbering-4b718a1c.js";import"./react-number-format.es-6c273788.js";import"./BargeStatus-4390bf32.js";import"./BadgeStatus-71cbb23e.js";import"./badge-5fdccc18.js";import"./Action-d597332d.js";import"./dialog-5253ff1d.js";import"./card-1438b2aa.js";import"./tabs-056fe36f.js";import"./RiwayatPengajuan-28f671da.js";import"./index-996f1ebb.js";import"./Acc-45e5eef6.js";import"./NoEditOverlay-8029b7d5.js";import"./useFrontEndPermission-a6b160d7.js";import"./index.esm-0365c025.js";import"./ActionTable-c0fb62c1.js";import"./RemoveLoan-76242569.js";import"./ChangeDetail-70d73fe5.js";const sr=({datas:e,buku_rencana:b,auth:g,..._})=>{const[x,s]=t.useState([]),{server_filter:a}=usePage().props;return t.useEffect(()=>{s(e.flat())},[e]),o(k,{header:r(l,{children:"Buku Transaksi"}),children:[o("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(i,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:a.userAuthorized.canShowKelompok,searchBranch:a.userAuthorized.canShowBranch,searchGroupingBranch:a.userAuthorized.canShowGroupingBranch})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:o(m,{children:[r(c,{asChild:!0,children:o(d,{variant:"outline",children:[r(h,{className:"h-4"}),"Filter"]})}),r(u,{children:r(i,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:a.userAuthorized.canShowKelompok,searchBranch:a.userAuthorized.canShowBranch,searchGroupingBranch:a.userAuthorized.canShowGroupingBranch})})]})})]}),r("div",{className:"max-h-[80vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e&&e.map((p,n)=>r(f,{datas:p},n))})]})};export{sr as default};
