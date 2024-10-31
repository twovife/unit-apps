import{r as d,j as p,a as e,c as L,R as P}from"./app-779ec234.js";import{T as Q,a as U,b as v,c as f,d as V,e as l,F as n,f as X}from"./FormatNumbering-4258954a.js";import{B as Z}from"./button-a6591cf8.js";import $ from"./Action-3beca84b.js";import W from"./ApprovalAkhir-3919f755.js";import"./utils-36e2ef84.js";import"./react-number-format.es-7e420cb1.js";import"./dialog-bcf780b2.js";import"./index-2608bd7c.js";import"./index-66343c5d.js";import"./react-icons.esm-6788e91c.js";import"./index-1d496a67.js";import"./card-ca329881.js";import"./badge-429ab026.js";import"./BayarAngsuran-464461ee.js";import"./label-7b574e4d.js";import"./index-571c597f.js";import"./input-63fe6fe5.js";import"./index.esm-e7946a20.js";import"./Checkbox-71600359.js";import"./Loading-762ba472.js";import"./transition-6c6be02d.js";import"./JenisNasabah-380ae861.js";import"./InputError-d5bc386e.js";import"./InputLabel-e6db6591.js";import"./PrimaryButton-e48c6432.js";import"./SelectList-5a8a79c9.js";import"./DeleteAngsuran-90c74192.js";import"./TextInput-b125d2d2.js";import"./DeleteLoan-93cbdcf2.js";const Ce=({dateOfWeek:k,datas:b,sirkulasi:D})=>{const[i,T]=d.useState([]),[g,B]=d.useState(0),[I,j]=d.useState({ml:{sirkulasi:0,angsuran:0,saldo:0},mb:{sirkulasi:0,angsuran:0,saldo:0},ccm:{sirkulasi:0,angsuran:0,saldo:0},cm:{sirkulasi:0,angsuran:0,saldo:0},all:{surkulasi:0,angsuran:0,saldo:0}});d.useEffect(()=>{if(b){const t=b.map((r,S)=>(()=>{var y;const u={},N=(a=>Array.isArray(a)?a.length===0?{max:{},min:{}}:a.length===1?{max:{},min:a[0]}:a.reduce((s,o)=>{const c=new Date(o.date),J=new Date(s.min.date),K=new Date(s.max.date);return c<J&&(s.min=o),c>K&&(s.max=o),s},{max:a[0],min:a[0]}):{max:{},min:{}})(D);B(((y=N.max)==null?void 0:y.amount)??0);const Y=a=>{var s;switch(a.type){case"ml":return((s=N.min)==null?void 0:s.ml_amount)??0;default:return a.data.reduce((o,c)=>o+c.saldo_sebelumnya,0)}},q=a=>{var s;switch(a.type){case"ml":return((s=N.min)==null?void 0:s.ml_amount)??0;case"mb":return a.data.reduce((o,c)=>o+c.saldo_sebelumnya,0);case"cm":return a.data.reduce((o,c)=>o+c.saldo_sebelumnya,0);default:return a.data.reduce((o,c)=>o+c.saldo_sebelumnya,0)}},A=Y(r),G=q(r);k.forEach(a=>{u[a]=0});let x=0;return r.data.forEach(a=>{k.forEach(s=>{a.instalment[s]!==void 0&&(x+=a.instalment[s],u[s]+=a.instalment[s])})}),j(a=>({...a,[r.type]:{sirkulasi:A,angsuran:x,saldo:A-x}})),{key:r.month,instalment:{...u},sirkulasi:A,sirkulasii:G,totalInstalment:x,sirkulasiAfter:A-x}})());T(t)}},[b]);const C=(t,r)=>t.reduce((h,u)=>h+parseInt(u.instalment[r]??0),0),m=(t,r)=>t.reduce((h,u)=>h+parseInt(u[r]??0),0),[M,_]=d.useState(null),[E,F]=d.useState(!1),R=()=>{F(!1),_(null)},[z,w]=d.useState(!1),H=t=>{w(!0)},O=()=>{w(!1)};return p("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin",children:[p(Q,{className:"text-xs rounded-lg",children:[e(U,{className:"sticky top-0 left-0 z-10",children:p(v,{className:"bg-gray-200",children:[e(f,{className:"text-center",children:"Bulan"}),e(f,{className:"text-center",children:"Sirkulasi"}),e(f,{className:"text-center",children:"Sirkulasi2"}),k.map((t,r)=>e(f,{className:"text-center",children:L(t).format("DD-MM-YY")},r)),e(f,{className:"text-center",children:"Angsuran"}),e(f,{className:"text-center",children:"Saldo"})]})}),e(V,{children:i?i.map((t,r)=>e(P.Fragment,{children:p(v,{children:[e(l,{children:t.key}),e(l,{children:e(n,{value:t.sirkulasi})}),e(l,{children:e(n,{value:t.sirkulasii})}),k.map((S,h)=>e(l,{className:"text-center",children:e(n,{value:t.instalment[S]})},h)),e(l,{children:e(n,{value:t.totalInstalment})}),e(l,{children:e(n,{value:t.sirkulasiAfter})})]})},r)):e(v,{children:e(l,{children:"a"})})}),p(X,{children:[p(v,{children:[e(l,{rowSpan:2,className:"text-center",children:"Total"}),e(l,{rowSpan:2,className:"text-center",children:e(n,{value:m(i,"sirkulasi")})}),e(l,{rowSpan:2,className:"text-center",children:e(n,{value:m(i,"sirkulasii")})}),k.map((t,r)=>e(l,{rowSpan:2,className:"text-center",children:e(n,{value:C(i,t)})},r)),e(l,{rowSpan:2,className:"text-center",children:e(n,{value:m(i,"totalInstalment")})}),m(i,"sirkulasiAfter")==g?e(l,{rowSpan:2,className:"text-center",children:e(n,{value:m(i,"sirkulasiAfter")})}):e(l,{className:"text-center",children:e(n,{value:m(i,"sirkulasiAfter")})})]}),e(v,{children:g&&m(i,"sirkulasiAfter")!=g?e(l,{className:"text-center bg-red-500",children:e(n,{value:g})}):""})]})]}),p("div",{className:"flex items-center justify-end gap-3 mt-6",children:[e("div",{children:"Approval Akhir Bulan"}),e("div",{children:e(Z,{onClick:H,variant:"green",size:"sm",children:"Approval"})})]}),e(W,{show:z,onClosed:O,datas:I}),e($,{datas:i,show:E,onClosed:R,triggeredId:M})]})};export{Ce as default};
