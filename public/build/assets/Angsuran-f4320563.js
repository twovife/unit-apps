import{q as u,j as i,F as h,a as r}from"./app-01dbd2ca.js";import{P as d,a as g,F as f,b,S as m}from"./popover-c2744ca3.js";import{T as k,a as x,b as l,c as p}from"./tabs-187fcb4b.js";import v from"./AngsuranTable-033c6a3f.js";import w from"./BukuStorting-dcd784a9.js";import{B as T}from"./button-e594156b.js";import j from"./AngsuranTableMobile-d8756700.js";import"./createLucideIcon-72decb57.js";import"./SelectComponent-41d65774.js";import"./input-2f9dcac5.js";import"./utils-36e2ef84.js";import"./react-icons.esm-e69bb1a2.js";import"./index-0257f697.js";import"./index-e96bcad6.js";import"./Loading-bacf33e9.js";import"./transition-37508b69.js";import"./label-a59e5876.js";import"./index-be647e53.js";import"./index-1a5a975e.js";import"./index-9c33a239.js";import"./FormatNumbering-750d2fb1.js";import"./react-number-format.es-7ab5d1fe.js";import"./Action-60649a58.js";import"./dialog-e5ae602b.js";import"./index-4d3b6f23.js";import"./card-7ec1f0b3.js";import"./badge-61cfb712.js";import"./BayarAngsuran-95d47900.js";import"./index.esm-eff4be9d.js";import"./Checkbox-b0b6d04c.js";import"./JenisNasabah-d348251b.js";import"./InputError-95ccc56c.js";import"./InputLabel-2f797a2a.js";import"./PrimaryButton-bb92d023.js";import"./SelectList-36b0d6d1.js";import"./DeleteAngsuran-a9ee9f9a.js";import"./TextInput-9ea5dd41.js";import"./DeleteLoan-8e3f9411.js";import"./useFrontEndPermission-7736c5f3.js";import"./NoEditOverlay-5ca8dba7.js";import"./ApprovalAkhir-c3f4ce00.js";import"./BargeStatus-71fa1036.js";const ur=({datas:o,dateOfWeek:t,sirkulasi:c,urlLink:s,localState:n,type:a="desktop"})=>{const{auth:e}=u().props;return i(h,{children:[i("div",{className:"flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center",children:[i("div",{className:"flex justify-between flex-none shrink-0 whitespace-nowrap",children:[r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Angsuran Lancar"}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:i(d,{children:[r(g,{asChild:!0,children:i(T,{variant:"outline",children:[r(f,{className:"h-4"}),"Filter"]})}),r(b,{children:r(m,{urlLink:s,localState:n,searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})})]})})]}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(m,{urlLink:s,localState:n,searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})})]}),i(k,{defaultValue:"bukuangsuran",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:i(x,{children:[r(l,{value:"bukuangsuran",children:"Buku Angsuran"}),r(l,{value:"bukustorting",children:"Buku Storting"})]})}),i(p,{value:"bukuangsuran",children:[a==="mobile"&&r(j,{dateOfWeek:t,datas:o}),a==="desktop"&&r(v,{dateOfWeek:t,datas:o})]}),r(p,{value:"bukustorting",children:r(w,{dateOfWeek:t,datas:o,sirkulasi:c})})]})]})};export{ur as default};
