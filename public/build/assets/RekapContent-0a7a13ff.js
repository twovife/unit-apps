import{q as w,r as a,j as e,F as x,a as r}from"./app-35d31ed9.js";import{S as h,P as S,a as B,F as C,b as N}from"./popover-c111436e.js";import{B as y}from"./button-1aa3a58c.js";import j from"./TableRekap-7242b93f.js";import{T as A,a as F,b as d,c as u}from"./tabs-d27c9ef9.js";import z from"./TableRekapKasir-e26e7df9.js";import D from"./TunaiMantri-faa6f760.js";import G from"./Action-ea70d168.js";import"./createLucideIcon-e2a25d74.js";import"./SelectComponent-97521685.js";import"./input-68668017.js";import"./utils-36e2ef84.js";import"./react-icons.esm-2b559b63.js";import"./index-30fd9ee9.js";import"./index-4dbb77c9.js";import"./Loading-4c55c56e.js";import"./transition-e7b86cd0.js";import"./label-abe714e5.js";import"./index-c504300c.js";import"./index-fd31a729.js";import"./table-06e53020.js";import"./index-1469b9f7.js";import"./FormatNumbering-7d539e15.js";import"./react-number-format.es-d26c8058.js";import"./BargeStatus-8ccd377a.js";import"./index-2b75c312.js";import"./Checkbox-c284e770.js";import"./InputLabel-c3c1a497.js";import"./BadgeStatus-dd3c5d72.js";import"./badge-a296b71f.js";import"./dialog-5923ce6e.js";import"./index-d3423716.js";import"./index.esm-afbbfe1e.js";const fr=({rekapData:n,show:l,title:f,urlLink:c,localState:p})=>{const{auth:M,server_filter:t}=w().props,[s,g]=a.useState([]);a.useEffect(()=>{g(n)},[n]);const[b,i]=a.useState(!1),[v,o]=a.useState(),[T,m]=a.useState(),k=P=>{i(!1),o()};return a.useState(null),e(x,{children:[r(G,{show:b,onClosed:k,triggeredData:v,type:T}),e("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:f})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(h,{urlLink:c,localState:p,searchDate:!0,searchBranch:t.userAuthorized.canShowBranch,searchGroupingBranch:t.userAuthorized.canShowGroupingBranch})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:e(S,{children:[r(B,{asChild:!0,children:e(y,{variant:"outline",children:[r(C,{className:"h-4"}),"Filter"]})}),r(N,{children:r(h,{urlLink:c,localState:p,searchDate:!0,searchBranch:t.userAuthorized.canShowBranch,searchGroupingBranch:t.userAuthorized.canShowGroupingBranch})})]})})]}),e("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[l=="rekap2"&&r(j,{setOnShowModal:i,setTriggeredData:o,datas:s}),l=="rekapkasir"&&e(A,{defaultValue:"rekapkasir",className:"w-full",children:[e(F,{children:[r(d,{value:"rekapkasir",children:"Rekap 1"}),r(d,{value:"tunaimantri",children:"Tunai Mantri"})]}),r(u,{value:"rekapkasir",children:r(z,{setOnShowModal:i,setTriggeredData:o,setTriggeredType:m,datas:s})}),r(u,{value:"tunaimantri",children:r(D,{setOnShowModal:i,setTriggeredData:o,setTriggeredType:m,datas:s})})]})]})]})};export{fr as default};
