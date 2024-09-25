import{r as x,j as d,a as e,d as R,R as H}from"./app-6f41ea55.js";import{T as Y,a as z,b as f,c as g,d as q,e as n,f as G}from"./table-e5a48510.js";import{F as i}from"./FormatNumbering-9ee1b047.js";import"./button-c3c23cc6.js";import J from"./Action-cf5626ab.js";import"./utils-36e2ef84.js";import"./react-number-format.es-e3a92009.js";import"./dialog-9a2a1bd6.js";import"./index-4127c4c4.js";import"./react-icons.esm-1bb75465.js";import"./index-6fff1c53.js";import"./card-fe7125ef.js";import"./badge-4d6b0252.js";import"./BayarAngsuran-f8fd1013.js";import"./label-20ddd90c.js";import"./index-cd17374b.js";import"./input-f7765aff.js";import"./index.esm-ea129bf0.js";import"./Checkbox-d7e2dac8.js";import"./Loading-8a7dd92c.js";import"./transition-31f369b9.js";import"./JenisNasabah-4e0113d4.js";import"./InputError-b4e0c872.js";import"./InputLabel-52ec6bce.js";import"./PrimaryButton-48a8ef32.js";import"./SelectList-2c850a5f.js";import"./DeleteAngsuran-28477ede.js";import"./TextInput-5e359523.js";const be=({dateOfWeek:p,datas:k,sirkulasi:y})=>{const[l,I]=x.useState([]),[S,j]=x.useState(0);x.useEffect(()=>{if(k){const a=k.map((r,b)=>(()=>{var T;const c={},N=(t=>Array.isArray(t)?t.length===0?{max:{},min:{}}:t.length===1?{max:{},min:t[0]}:t.reduce((s,u)=>{const h=new Date(u.date),D=new Date(s.min.date),w=new Date(s.max.date);return h<D&&(s.min=u),h>w&&(s.max=u),s},{max:t[0],min:t[0]}):{max:{},min:{}})(y);j(((T=N.max)==null?void 0:T.amount)??0);const A=(t=>{var s,u,h;switch(t.type){case"ml":return((s=N.min)==null?void 0:s.ml_amount)??0;case"mb":return((u=N.min)==null?void 0:u.mb_amount)??0;case"cm":return((h=N.min)==null?void 0:h.cm_amount)??0;default:return t.data.reduce((D,w)=>D+w.saldo_sebelumnya,0)}})(r);p.forEach(t=>{c[t]=0});let v=0;return r.data.forEach(t=>{p.forEach(s=>{t.instalment[s]!==void 0&&(v+=t.instalment[s],c[s]+=t.instalment[s])})}),{key:r.month,instalment:{...c},sirkulasi:A,totalInstalment:v,sirkulasiAfter:A-v}})());I(a)}},[k]);const M=(a,r)=>a.reduce((o,c)=>o+parseInt(c.instalment[r]??0),0),m=(a,r)=>a.reduce((o,c)=>o+parseInt(c[r]??0),0),[B,E]=x.useState(null),[F,_]=x.useState(!1),C=()=>{_(!1),E(null)};return d("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin",children:[d(Y,{className:"text-xs rounded-lg",children:[e(z,{className:"sticky top-0 left-0 z-10",children:d(f,{className:"bg-gray-200",children:[e(g,{className:"text-center",children:"Bulan"}),e(g,{className:"text-center",children:"Sirkulasi"}),p.map((a,r)=>e(g,{className:"text-center",children:R(a).format("DD-MM-YY")},r)),e(g,{className:"text-center",children:"Angsuran"}),e(g,{className:"text-center",children:"Saldo"})]})}),e(q,{children:l?l.map((a,r)=>e(H.Fragment,{children:d(f,{children:[e(n,{children:a.key}),e(n,{children:e(i,{value:a.sirkulasi})}),p.map((b,o)=>e(n,{className:"text-center",children:e(i,{value:a.instalment[b]})},o)),e(n,{children:e(i,{value:a.totalInstalment})}),e(n,{children:e(i,{value:a.sirkulasiAfter})})]})},r)):e(f,{children:e(n,{children:"a"})})}),d(G,{children:[d(f,{children:[e(n,{rowSpan:2,className:"text-center",children:"Total"}),e(n,{rowSpan:2,className:"text-center",children:e(i,{value:m(l,"sirkulasi")})}),p.map((a,r)=>e(n,{rowSpan:2,className:"text-center",children:e(i,{value:M(l,a)})},r)),e(n,{rowSpan:2,className:"text-center",children:e(i,{value:m(l,"totalInstalment")})}),m(l,"sirkulasiAfter")==S?e(n,{rowSpan:2,className:"text-center",children:e(i,{value:m(l,"sirkulasiAfter")})}):e(n,{className:"text-center",children:e(i,{value:m(l,"sirkulasiAfter")})})]}),e(f,{children:S&&m(l,"sirkulasiAfter")!=S?e(n,{className:"text-center bg-red-500",children:e(i,{value:S})}):""})]})]}),e(J,{datas:l,show:F,onClosed:C,triggeredId:B})]})};export{be as default};