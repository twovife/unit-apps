import{r as f,j as r,a as e}from"./app-d484a7d2.js";import{L as v}from"./Loading-8de321b5.js";import{B as s}from"./button-8c0bc7cc.js";import{C,a as g,b,d as A}from"./card-983e7773.js";import{A as P,a as c,c as d}from"./accordion-9cdb9c8b.js";import j from"./WhiteOff-65a9c825.js";import x from"./PengajuanLama-7413ca65.js";import"./transition-34aa8e6f.js";import"./index-98ca6607.js";import"./utils-3f044a58.js";import"./index-5c259ab6.js";import"./index-285c6289.js";import"./index-73a971cd.js";import"./react-icons.esm-9d6503eb.js";import"./input-9db99b79.js";import"./label-adfb4101.js";import"./index-46c17673.js";import"./InputError-9c72daac.js";import"./index.esm-1326f15a.js";const J=({triggeredId:o,triggeredPinjaman:p,instalment:u})=>{var m;const[t,n]=f.useState(null),l=i=>{n(a=>a===i?null:i)},h=((m=u.sort((i,a)=>i.saldo-a.saldo)[0])==null?void 0:m.saldo)??0;return r(C,{className:"relative w-full mb-3",children:[e(v,{show:!1}),e(g,{children:e(b,{children:"Action"})}),r(A,{className:"relative",children:[r("div",{className:"flex gap-3 mb-3",children:[e(s,{variant:t=="item-1"?"green":"outline",onClick:()=>l("item-1"),disabled:!0,children:"Pengajuan"}),e(s,{variant:t=="item-2"?"green":"outline",onClick:()=>l("item-2"),children:"Pemutihan"})]}),r(P,{type:"single",collapsible:!0,value:t,onValueChange:n,children:[e(c,{borderless:!0,value:"item-1",children:e(d,{children:t=="item-1"&&e(x,{isActive:t=="item-1",triggeredId:o,triggeredPinjaman:p})})}),e(c,{borderless:!0,value:"item-2",children:e(d,{children:t=="item-2"&&e(j,{triggeredId:o,nominalWhiteOff:h??0})})})]})]})]})};export{J as default};
