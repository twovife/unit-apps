import{r as o,j as i,a as r,b as l}from"./app-1dba9351.js";import{S as t,P as m,a as c,F as u,b as h}from"./popover-7bb9d70c.js";import{B as d}from"./button-f157f404.js";import{M as k}from"./MobileLayout-d8abf63f.js";import b from"./BukuTransaksiKepala-b6fea5c5.js";import"./createLucideIcon-682d5847.js";import"./SelectComponent-457af974.js";import"./input-eaed37ea.js";import"./utils-36e2ef84.js";import"./react-icons.esm-f4f0808a.js";import"./index-fde572c1.js";import"./index-8e703f61.js";import"./Loading-e8037743.js";import"./transition-35d14a90.js";import"./label-a4aeba48.js";import"./index-a2f41169.js";import"./index-40708aa7.js";import"./SweetAlert-db636ac6.js";import"./index-5649da3f.js";import"./index-c0dd9ecd.js";import"./FormatNumbering-d3eb1c6d.js";import"./react-number-format.es-08d37f9d.js";import"./BargeStatus-00d2bed5.js";import"./BadgeStatus-be8d1a73.js";import"./badge-bcbfa6d6.js";import"./Action-5d8bd1c4.js";import"./dialog-54f4b0aa.js";import"./card-89e16e77.js";import"./tabs-0c3e9642.js";import"./RiwayatPengajuan-30748ebc.js";import"./index-5c4228d0.js";import"./Acc-2cdf4e40.js";import"./index.esm-5a1b3ab9.js";import"./ActionTable-479bd30e.js";import"./RemoveLoan-c02b7cc4.js";import"./ChangeDetail-187ce52a.js";const er=({datas:a,buku_rencana:f,auth:e,...x})=>{const[_,s]=o.useState([]);return o.useEffect(()=>{s(a.flat())},[a]),i(k,{header:r(l,{children:"Buku Transaksi"}),children:[i("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(t,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:i(m,{children:[r(c,{asChild:!0,children:i(d,{variant:"outline",children:[r(u,{className:"h-4"}),"Filter"]})}),r(h,{children:r(t,{urlLink:route("mobile_apps.buku_transaksi_kepala"),localState:"mobile_apps.buku_transaksi_kepala",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})})]})})]}),r("div",{className:"max-h-[80vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:a&&a.map((p,n)=>r(b,{datas:p},n))})]})};export{er as default};