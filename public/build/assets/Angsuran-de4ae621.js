import{q as c,j as e,F as h,a as r}from"./app-9f0c20ba.js";import{P as d,a as g,F as f,b,S as m}from"./popover-fe7362ad.js";import{T as v,a as w,b as p,c as l}from"./tabs-04a9a8b8.js";import x from"./AngsuranTable-db1f80f1.js";import k from"./BukuStorting-940ab2d3.js";import{B}from"./button-4d2c16c2.js";import A from"./AngsuranTableMobile-ca67e766.js";import"./createLucideIcon-baeb41fa.js";import"./SelectComponent-d8400a6f.js";import"./input-8fa00c8e.js";import"./utils-aa679991.js";import"./react-icons.esm-bc6cca11.js";import"./index-ba8f6734.js";import"./Loading-4684ca26.js";import"./transition-9b556442.js";import"./label-9a31c979.js";import"./index-ed8129d8.js";import"./index-598efb9f.js";import"./index-1dedb023.js";import"./Combination-f4771544.js";import"./index-c62517c3.js";import"./table-10c9d57c.js";import"./FormatNumbering-e421a0ec.js";import"./react-number-format.es-e08b783c.js";import"./Action-3360f2fc.js";import"./dialog-e09d88a4.js";import"./index-c4a5b7b2.js";import"./card-12a3d3a1.js";import"./badge-b629424d.js";import"./BayarAngsuran-5ba871ca.js";import"./index.esm-fdc0f4ba.js";import"./Checkbox-0e3f17dc.js";import"./JenisNasabah-e9566be3.js";import"./InputError-a7129d09.js";import"./InputLabel-f6538996.js";import"./PrimaryButton-2c90b327.js";import"./SelectList-3633940e.js";import"./DeleteAngsuran-4e4e8499.js";import"./TextInput-8c80c45c.js";import"./DeleteLoan-84e8ac92.js";import"./useFrontEndPermission-24b0ff10.js";import"./NoEditOverlay-734d27a1.js";import"./ApprovalAkhir-fc3ae131.js";import"./BargeStatus-d02baf28.js";const gr=({datas:o,dateOfWeek:t,sirkulasi:u,urlLink:a,localState:n,type:s="desktop"})=>{const{auth:S,server_filter:i}=c().props;return e(h,{children:[e("div",{className:"flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center",children:[e("div",{className:"flex justify-between flex-none shrink-0 whitespace-nowrap",children:[r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Angsuran Lancar"}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:e(d,{children:[r(g,{asChild:!0,children:e(B,{variant:"outline",children:[r(f,{className:"h-4"}),"Filter"]})}),r(b,{children:r(m,{urlLink:a,localState:n,searchMonth:!0,searchHari:!0,searchKelompok:i.userAuthorized.canShowKelompok,searchBranch:i.userAuthorized.canShowBranch,searchGroupingBranch:i.userAuthorized.canShowGroupingBranch})})]})})]}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(m,{urlLink:a,localState:n,searchMonth:!0,searchHari:!0,searchKelompok:i.userAuthorized.canShowKelompok,searchBranch:i.userAuthorized.canShowBranch,searchGroupingBranch:i.userAuthorized.canShowGroupingBranch})})]}),e(v,{defaultValue:"bukuangsuran",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:e(w,{children:[r(p,{value:"bukuangsuran",children:"Buku Angsuran"}),r(p,{value:"bukustorting",children:"Buku Storting"})]})}),e(l,{value:"bukuangsuran",children:[s==="mobile"&&r(A,{dateOfWeek:t,datas:o}),s==="desktop"&&r(x,{dateOfWeek:t,datas:o})]}),r(l,{value:"bukustorting",children:r(k,{dateOfWeek:t,datas:o,sirkulasi:u})})]})]})};export{gr as default};
