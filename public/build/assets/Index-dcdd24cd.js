import{j as i,a as r,b as p}from"./app-306d2aa1.js";import{S as t}from"./SearchComponent-331e7067.js";import{T as u,a as c,b as n,c as s}from"./tabs-a1ae8e86.js";import h from"./AngsuranTable-63857fae.js";import d from"./BukuStorting-3626bd74.js";import{M as g}from"./MobileLayout-a6dadbe4.js";import{P as b,a as f,F as k,b as v}from"./popover-040d0e43.js";import{B as x}from"./button-5e70ffc6.js";import"./SelectComponent-364a5f24.js";import"./input-35d260d5.js";import"./utils-36e2ef84.js";import"./react-icons.esm-315302c1.js";import"./index-9beea882.js";import"./index-0fb34254.js";import"./Loading-5d256d83.js";import"./transition-b9545d2b.js";import"./label-85dd95c1.js";import"./index-540c0f7f.js";import"./index-a18aa3b8.js";import"./FormatNumbering-61e1a592.js";import"./react-number-format.es-73937593.js";import"./Action-a6ae2901.js";import"./dialog-03bb592f.js";import"./index-11c24e0a.js";import"./card-0d082b21.js";import"./StatusPinjaman-638633d0.js";import"./badge-b2fc05ce.js";import"./BayarAngsuran-73e4e3ef.js";import"./index.esm-42fc6967.js";import"./Checkbox-6252612e.js";import"./JenisNasabah-4253528c.js";import"./InputError-08a64d83.js";import"./InputLabel-53a356ec.js";import"./PrimaryButton-a759f095.js";import"./SelectList-445fc1bb.js";import"./DeleteAngsuran-1a27f12d.js";import"./TextInput-8025979e.js";import"./DeleteLoan-eaecf1a1.js";import"./ApprovalAkhir-b9d21120.js";import"./SweetAlert-38cfd92f.js";import"./index-e01dd8e8.js";import"./createLucideIcon-68449580.js";const lr=({datas:a,dateOfWeek:o,sirkulasi:m,...l})=>{const{auth:e}=l;return i(g,{header:r(p,{children:"Angsuran Lancar"}),children:[i("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Angsuran Lancar"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(t,{urlLink:route("mobile_apps.angsuran"),localState:"mobile_apps_angsuran",searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:i(b,{children:[r(f,{asChild:!0,children:i(x,{variant:"outline",children:[r(k,{className:"h-4"}),"Filter"]})}),r(v,{children:r(t,{urlLink:route("mobile_apps.angsuran"),localState:"mobile_apps_angsuran",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})})]})})]}),i(u,{defaultValue:"bukuangsuran",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:i(c,{children:[r(n,{value:"bukuangsuran",children:"Buku Angsuran"}),r(n,{value:"bukustorting",children:"Buku Storting"})]})}),r(s,{value:"bukuangsuran",children:r(h,{dateOfWeek:o,datas:a})}),r(s,{value:"bukustorting",children:r(d,{dateOfWeek:o,datas:a,sirkulasi:m})})]})]})};export{lr as default};
