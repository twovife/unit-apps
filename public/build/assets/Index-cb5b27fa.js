import{j as t,a as r,b as s}from"./app-a9febf18.js";import{A as l}from"./AuthenticatedLayout-c79e28d5.js";import{S as p}from"./SearchComponent-b4a38787.js";import{T as u,a as c,b as n,c as o}from"./tabs-bdbb734d.js";import h from"./AngsuranTable-a0c60f21.js";import d from"./BukuStorting-f70eebb6.js";import"./button-39798a32.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-5f15221a.js";import"./createLucideIcon-6d24afd3.js";import"./SweetAlert-e09e43fb.js";import"./react-icons.esm-9384b23e.js";import"./index-72cc0d84.js";import"./index-2280e0a5.js";import"./Loading-9de60e5b.js";import"./transition-e71ec9e2.js";import"./SelectComponent-6612da5e.js";import"./input-7a08eb79.js";import"./label-f9a8419c.js";import"./index-fe18a35b.js";import"./FormatNumbering-097230ac.js";import"./react-number-format.es-8a8dc976.js";import"./Action-f6032579.js";import"./dialog-a1ac7cd8.js";import"./index-76487620.js";import"./card-05f01e5a.js";import"./badge-3ac099c7.js";import"./BayarAngsuran-fcdfc7f4.js";import"./index.esm-986b1a77.js";import"./Checkbox-c2ce7f2e.js";import"./JenisNasabah-720eeb1a.js";import"./InputError-ea99c749.js";import"./InputLabel-39f87391.js";import"./PrimaryButton-5668c4bd.js";import"./SelectList-ded2b274.js";import"./DeleteAngsuran-e3b06455.js";import"./TextInput-4cc0f38e.js";import"./DeleteLoan-89d53c03.js";const rr=({datas:i,dateOfWeek:e,sirkulasi:m,...a})=>t(l,{header:r(s,{children:"Angsuran Lancar"}),children:[t("div",{className:"flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Angsuran Lancar"})}),r("div",{className:"flex items-center justify-end flex-auto w-full",children:r(p,{urlLink:route("pinjaman.index_pinjaman"),localState:"pinjaman_index_pinjaman",searchMonth:!0,searchHari:!0,searchKelompok:a.select_kelompok,searchGroupingBranch:a.select_branch})})]}),t(u,{defaultValue:"bukuangsuran",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:t(c,{children:[r(n,{value:"bukuangsuran",children:"Buku Angsuran"}),r(n,{value:"bukustorting",children:"Buku Storting"})]})}),r(o,{value:"bukuangsuran",children:r(h,{dateOfWeek:e,datas:i})}),r(o,{value:"bukustorting",children:r(d,{dateOfWeek:e,datas:i,sirkulasi:m})})]})]});export{rr as default};