import{W as S,j as a,a as e}from"./app-b2e3bcc2.js";import{C as n,a as s,b as t,c as w,d as m}from"./card-80859391.js";import y from"./Permission-2ab1aedf.js";import k from"./Role-48729443.js";import{A as R}from"./AuthenticatedLayout-925c4fb0.js";import{L as A}from"./label-4e6a82af.js";import"./input-8f5cd5a1.js";import{B as P}from"./button-225b58b4.js";import{S as B}from"./SelectList-a92b418e.js";import{C as L}from"./Checkbox-94cae1fd.js";import{I as j}from"./InputLabel-fe0192f0.js";import D from"./AssignRoles-4ac331e0.js";import{B as d}from"./BadgeStatus-09beab77.js";import"./utils-36e2ef84.js";import"./Navbar-a97c36fe.js";import"./createLucideIcon-ceb555d4.js";import"./SweetAlert-fe0e438e.js";import"./index-c5f589e9.js";import"./index-0db32300.js";import"./index-3d3a56cb.js";import"./react-icons.esm-0e6c2f2a.js";import"./index-c1406b89.js";import"./Loading-69a20464.js";import"./transition-ec8a3a4b.js";import"./index-a2c4b0b3.js";import"./badge-404ffddc.js";const me=({role:o,permission:c,user:f,...I})=>{const{data:p,setData:h,post:x,processing:q,errors:F,reset:g}=S({role:"",permission:[]}),v=r=>{h(r.target.name,r.target.value)},b=r=>{const l=document.querySelectorAll('.checkbox-group input[type="checkbox"]'),N=Array.from(l).filter(i=>i.checked).map(i=>i.name);h(i=>({...i,permission:N}))},u=o.map(r=>({display:r.name,value:r.id,id:r.id}));console.log(o);const C=f.map(r=>({display:r.username,value:r.id,id:r.id}));return a(R,{children:[a("div",{className:"flex w-full gap-3 mb-3",children:[e(y,{}),e(k,{}),a(n,{className:"w-1/2",children:[a(s,{children:[e(t,{children:"Generate Permission"}),e(w,{children:"Permission"})]}),e(m,{children:a("form",{onSubmit:r=>{r.preventDefault(),x(route("adminpanel.role_assign"),{onSuccess:()=>{g()}})},children:[a("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e(A,{htmlFor:"role",children:"Role Name"}),e(B,{options:u,label:"Role",placeholder:"Select Role",required:!0,name:"role",onChange:v,value:p.role,id:"role",nullvalue:!0})]}),e("div",{className:"flex flex-wrap gap-3 checkbox-group",children:p.role&&c.map((r,l)=>a("div",{className:"flex items-center flex-1 gap-3 whitespace-nowrap",children:[e(L,{name:r.name,onChange:b,placeholder:"Select Permission",id:r.name}),e(j,{htmlFor:r.name,children:r.name})]},l))}),e(P,{type:"submit",className:"mt-3",children:"Submit"})]})})]})]}),a("div",{className:"flex w-full gap-3",children:[e(D,{userOptions:C,roleOptions:u}),a(n,{children:[e(s,{children:e(t,{children:"User Role"})}),e(m,{children:e("div",{className:"flex flex-wrap gap-3",children:c&&c.map((r,l)=>e(d,{value:r.name},l))})})]})]}),e("div",{className:"mt-3",children:a(n,{children:[e(s,{children:e(t,{children:"User Role"})}),e(m,{children:e("div",{className:"h-[50vh] overflow-auto space-y-3",children:o&&o.map(r=>a(n,{children:[e(s,{children:e(t,{children:e(d,{value:"normal",children:r.name})})}),e(m,{className:"flex gap-1",children:r.permissions.map(l=>e(d,{value:l.name,children:l.name}))})]}))})})]})})]})};export{me as default};