import{r as t,X as b,j as a,F as k,a as r}from"./app-5eeea420.js";import{S as h,P as S,a as x,F as T,b as B}from"./popover-ffe8d724.js";import"./Navbar-4651a5a2.js";import"./SweetAlert-bbca2198.js";import"./Loading-c4737e9d.js";import{B as M}from"./button-e2a0104f.js";import"./table-94527c2e.js";import"./accordion-3f33d4a5.js";import{T as N,a as A,b as i,c as n}from"./tabs-5ca41f46.js";import C from"./TableRekapKasir-017a8174.js";import j from"./TunaiMantri-7a01a317.js";import z from"./Action-8a381c5f.js";import K from"./TableRekapPerMantri-447a50b0.js";import"./createLucideIcon-1b0e5372.js";import"./SelectComponent-ce288244.js";import"./input-722b6b4e.js";import"./utils-3f044a58.js";import"./react-icons.esm-74782f46.js";import"./label-4c08b0de.js";import"./index-0a2ae204.js";import"./index-ab77748e.js";import"./index-2f1470d8.js";import"./index-89a89683.js";import"./Combination-c509d3eb.js";import"./index-828d29fc.js";import"./index-958d76c0.js";import"./index-3fae266e.js";import"./transition-c9ac40d5.js";import"./index-1df26b95.js";import"./FormatNumbering-6b637a42.js";import"./react-number-format.es-5528281f.js";import"./BargeStatus-ac14415b.js";import"./Checkbox-a5ba6691.js";import"./InputLabel-f6d2acb5.js";import"./BadgeStatus-381ec9c4.js";import"./badge-7db12edd.js";import"./dialog-0e7748bc.js";import"./index-f0f96044.js";import"./index.esm-ea7c83bb.js";import"./circle-x-ecb6e7e7.js";const kr=({rekapData:s,saldoAwalBulan:d,auth:P,urlLink:l,localState:p,title:u})=>{const[o,f]=t.useState([]),{server_filter:e}=b().props;t.useEffect(()=>{f(s)},[s]);const[g,m]=t.useState(!1),[v,c]=t.useState(),w=F=>{m(!1),c()};return t.useState(null),a(k,{children:[r(z,{show:g,onClosed:w,triggeredData:v}),a("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:u})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(h,{urlLink:l,localState:p,searchMonth:!0,searchKelompok:e.userAuthorized.canShowKelompok,searchBranch:e.userAuthorized.canShowBranch,searchGroupingBranch:e.userAuthorized.canShowGroupingBranch})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:a(S,{children:[r(x,{asChild:!0,children:a(M,{variant:"outline",children:[r(T,{className:"h-4"}),"Filter"]})}),r(B,{children:r(h,{urlLink:l,localState:p,searchMonth:!0,searchKelompok:e.userAuthorized.canShowKelompok,searchBranch:e.userAuthorized.canShowBranch,searchGroupingBranch:e.userAuthorized.canShowGroupingBranch})})]})})]}),r("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-none",children:a(N,{defaultValue:"rekappimpinan",className:"w-full",children:[a(A,{children:[r(i,{value:"rekappimpinan",children:"Rekap Mantri"}),r(i,{value:"rekapkasir",children:"Rekap Kasir Mantri"}),r(i,{value:"tunaimantri",children:"Tunai Mantri"})]}),r(n,{value:"rekappimpinan",children:r(K,{setOnShowModal:m,setTriggeredData:c,saldoAwalBulan:d,datas:o})}),r(n,{value:"rekapkasir",children:r(C,{datas:o})}),r(n,{value:"tunaimantri",children:r(j,{datas:o})})]})})]})};export{kr as default};
