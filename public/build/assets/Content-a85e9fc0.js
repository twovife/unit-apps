import{q as h,r as s,j as e,F as d,a as r}from"./app-dd5d88de.js";import u from"./TableRekap-cb7fb77f.js";import{S as n,P as f,a as x,F as b,b as g}from"./popover-c77f3712.js";import"./Navbar-5c4bd189.js";import"./SweetAlert-950fd116.js";import"./Loading-7f25859b.js";import{B as v}from"./button-cc368867.js";import"./tabs-b542c6d3.js";import"./table-d54f704d.js";import"./utils-36e2ef84.js";import"./index-cabbab55.js";import"./FormatNumbering-d6810bb2.js";import"./react-number-format.es-3a1d10c2.js";import"./BargeStatus-7cd1c1c1.js";import"./createLucideIcon-19dc708a.js";import"./SelectComponent-d1e750f0.js";import"./input-b4c964f5.js";import"./react-icons.esm-370ad885.js";import"./index-c4845c96.js";import"./index-4a15253f.js";import"./label-b1b09a72.js";import"./index-aa4e1d5d.js";import"./index-3d6fdcc5.js";import"./index-71703707.js";import"./transition-7dacb077.js";const U=({urlLink:t,localState:a,triggeredData:o})=>{const{auth:i}=h().props,[m,c]=s.useState([]);return s.useEffect(()=>{c(o)},[o]),e(d,{children:[e("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Rekap Data Harian"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(n,{urlLink:t,localState:a,searchMonth:!0,searchGroupingBranch:i.permissions.includes("can show branch")})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:e(f,{children:[r(x,{asChild:!0,children:e(v,{variant:"outline",children:[r(b,{className:"h-4"}),"Filter"]})}),r(g,{children:r(n,{urlLink:t,localState:a,searchMonth:!0,searchGroupingBranch:i.permissions.includes("can show branch")})})]})})]}),r("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:m.map((p,l)=>r(u,{datas:p},l))})]})};export{U as default};
