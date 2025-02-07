import{r as u,j as c,a as t,d as R,R as z}from"./app-d484a7d2.js";import{T as H,a as Y,b as f,c as p,d as $,e as r,f as q}from"./table-28113ab4.js";import{F as s}from"./FormatNumbering-edbebc7d.js";import{B as G}from"./button-8c0bc7cc.js";import J from"./Action22-eed2315a.js";import K from"./ApprovalAkhir-24c367bc.js";import"./utils-3f044a58.js";import"./react-number-format.es-e89b213e.js";import"./index-98ca6607.js";import"./dialog-bc3ab689.js";import"./index-4a4b187e.js";import"./index-5c259ab6.js";import"./Combination-44a5c864.js";import"./index-73a971cd.js";import"./react-icons.esm-9d6503eb.js";import"./card-983e7773.js";import"./StatusPinjaman-d3f046bc.js";import"./badge-e3d200c0.js";import"./BayarAngsuran-91550a59.js";import"./label-adfb4101.js";import"./index-46c17673.js";import"./input-9db99b79.js";import"./index.esm-1326f15a.js";import"./Checkbox-4a6dc653.js";import"./Loading-8de321b5.js";import"./transition-34aa8e6f.js";import"./JenisNasabah-1fb88961.js";import"./InputError-9c72daac.js";import"./InputLabel-f88d45c1.js";import"./PrimaryButton-debee66b.js";import"./SelectList-5d8ad4a0.js";import"./DeleteAngsuran-de8f63c7.js";import"./TextInput-96fee1a6.js";import"./useFrontEndPermission-20ee38cb.js";import"./NoEditOverlay-cc55b0e3.js";const It=({dateOfWeek:m,datas:N,sirkulasi:k})=>{const[n,y]=u.useState([]),[T,w]=u.useState({ml:{sirkulasi:0,angsuran:0,saldo:0},mb:{sirkulasi:0,angsuran:0,saldo:0},ccm:{sirkulasi:0,angsuran:0,saldo:0},cm:{sirkulasi:0,angsuran:0,saldo:0},all:{surkulasi:0,angsuran:0,saldo:0}});u.useEffect(()=>{if(N){const e=N.map((a,h)=>(()=>{const i={},x=(l=>{switch(l.type){case"ml":return(k==null?void 0:k.ml_amount)??0;default:return l.data.reduce((o,P)=>o+P.saldo_sebelumnya,0)}})(a);m.forEach(l=>{i[l]=0});let g=0;const S=a.data.reduce((l,o)=>l+o.pemutihanThisMonth,0);return a.data.forEach(l=>{m.forEach(o=>{l.instalment[o]!==void 0&&(g+=l.instalment[o].total_nominal,i[o]+=l.instalment[o].total_nominal)})}),w(l=>({...l,[a.type]:{sirkulasi:x,angsuran:g,saldo:x-(g+S)}})),{key:a.month,instalment:{...i},sirkulasi:x,totalInstalment:g,totalPemutihan:S,sirkulasiAfter:x-(g+S),type:a.type}})());y(e)}},[N]);const I=(e,a)=>e.reduce((v,i)=>v+parseInt(i.instalment[a]??0),0),d=(e,a,h)=>e.reduce((i,A)=>h&&A.type==="normal"?i:i+parseInt(A[a]??0),0),[B,C]=u.useState(null),[F,j]=u.useState(!1),D=()=>{j(!1),C(null)},[E,b]=u.useState(!1),M=e=>{b(!0)},_=()=>{b(!1)};return c("div",{className:"relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin",children:[c(H,{className:"text-xs rounded-lg",children:[t(Y,{className:"sticky top-0 left-0 z-10",children:c(f,{className:"bg-gray-200",children:[t(p,{className:"text-center",children:"Bulan"}),t(p,{className:"text-center",children:"Sirkulasi"}),m.map((e,a)=>t(p,{className:"text-center",children:R(e).format("DD-MM-YY")},a)),t(p,{className:"text-center",children:"Angsuran"}),t(p,{className:"text-center",children:"MD"}),t(p,{className:"text-center",children:"Saldo"})]})}),t($,{children:n?n.map((e,a)=>t(z.Fragment,{children:c(f,{children:[t(r,{children:e.key}),t(r,{className:`${e.type=="normal"?"bg-green-200":""} `,children:t(s,{value:e.sirkulasi})}),m.map((h,v)=>t(r,{className:"text-center",children:t(s,{value:e.instalment[h]})},v)),t(r,{children:t(s,{value:e.totalInstalment})}),t(r,{children:t(s,{value:e.totalPemutihan})}),t(r,{children:t(s,{value:e.sirkulasiAfter})})]})},a)):t(f,{children:t(r,{children:"a"})})}),c(q,{children:[c(f,{children:[t(r,{rowSpan:2,className:"text-center",children:"Total"}),t(r,{className:"text-center",children:t(s,{value:d(n,"sirkulasi",!0)})}),t(r,{className:"text-center",colspan:m.length+3})]}),c(f,{children:[t(r,{className:"text-center",children:t(s,{value:d(n,"sirkulasi")})}),m.map((e,a)=>t(r,{className:"text-center",children:t(s,{value:I(n,e)})},a)),t(r,{className:"text-center",children:t(s,{value:d(n,"totalInstalment")})}),t(r,{className:"text-center",children:t(s,{value:d(n,"totalPemutihan")})}),t(r,{className:"text-center",children:t(s,{value:d(n,"sirkulasiAfter")})})]})]})]}),c("div",{className:"flex items-center justify-end gap-3 mt-6",children:[t("div",{children:"Approval Akhir Bulan"}),t("div",{children:t(G,{onClick:M,variant:"green",size:"sm",children:"Approval"})})]}),t(K,{show:E,onClosed:_,datas:T}),t(J,{datas:n,show:F,onClosed:D,triggeredId:B})]})};export{It as default};
