import{W as b,j as o,a as r}from"./app-1462653e.js";import{C as g,a as C,b as v,c as S,d as N}from"./card-686f1795.js";import k from"./Permission-dff157ff.js";import y from"./Role-784a1f42.js";import{A as w}from"./AuthenticatedLayout-2ca4c16b.js";import{L as A}from"./label-d40db7f0.js";import"./input-128f4793.js";import{B as P}from"./button-6c361328.js";import{S as R}from"./SelectList-99cb3bf2.js";import{C as L}from"./Checkbox-df7571f3.js";import{I as j}from"./InputLabel-64d1dc72.js";import D from"./AssignRoles-b0f0052c.js";import"./utils-46f1eee5.js";import"./Navbar-eebc0438.js";import"./index-1c1377c4.js";import"./createLucideIcon-037cf062.js";import"./SweetAlert-7f5893b4.js";import"./react-icons.esm-8f459c06.js";import"./index-674c48b1.js";import"./index-fea0dcf8.js";import"./index-792d96a5.js";import"./Loading-8594628c.js";import"./transition-df6989b0.js";import"./index-4a6b9bf3.js";import"./index-f96983da.js";const le=({role:n,permission:m,user:c,...I})=>{const{data:t,setData:l,post:p,processing:q,errors:B,reset:d}=b({role:"",permission:[]}),h=e=>{l(e.target.name,e.target.value)},u=e=>{const s=document.querySelectorAll('.checkbox-group input[type="checkbox"]'),x=Array.from(s).filter(a=>a.checked).map(a=>a.name);l(a=>({...a,permission:x}))},i=n.map(e=>({display:e.name,value:e.id,id:e.id}));console.log(i);const f=c.map(e=>({display:e.username,value:e.id,id:e.id}));return o(w,{children:[o("div",{className:"flex w-full gap-3 mb-3",children:[r(k,{}),r(y,{}),o(g,{className:"w-1/2",children:[o(C,{children:[r(v,{children:"Generate Permission"}),r(S,{children:"Permission"})]}),r(N,{children:o("form",{onSubmit:e=>{e.preventDefault(),p(route("adminpanel.role_assign"),{onSuccess:()=>{d()}})},children:[o("div",{className:"flex flex-col space-y-1.5 mb-3",children:[r(A,{htmlFor:"role",children:"Role Name"}),r(R,{options:i,label:"Role",placeholder:"Select Role",required:!0,name:"role",onChange:h,value:t.role,id:"role",nullvalue:!0})]}),r("div",{className:"flex flex-wrap gap-3 checkbox-group",children:t.role&&m.map((e,s)=>o("div",{className:"flex items-center flex-1 gap-3 whitespace-nowrap",children:[r(L,{name:e.name,onChange:u,placeholder:"Select Permission",id:e.name}),r(j,{htmlFor:e.name,children:e.name})]},s))}),r(P,{type:"submit",className:"mt-3",children:"Submit"})]})})]})]}),r("div",{className:"flex w-full gap-3",children:r(D,{userOptions:f,roleOptions:i})})]})};export{le as default};
