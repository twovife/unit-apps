import{G as T,j as a,a as e}from"./app-d484a7d2.js";import{C as n,a as o,b as s,c as k,d as c}from"./card-983e7773.js";import A from"./Permission-038fc021.js";import B from"./Role-dfe141ef.js";import{A as P}from"./AuthenticatedLayout-5411a3b6.js";import{L as U}from"./label-adfb4101.js";import"./input-9db99b79.js";import{B as L}from"./button-8c0bc7cc.js";import{S as j}from"./SelectList-5d8ad4a0.js";import{C as D}from"./Checkbox-4a6dc653.js";import{I as H}from"./InputLabel-f88d45c1.js";import I from"./AssignRoles-8c701894.js";import{B as u}from"./BadgeStatus-df51cdca.js";import q from"./MaintenerWorker-d23a2949.js";import{T as F,a as G,b as g,c as m,d as O,e as t}from"./table-28113ab4.js";import"./utils-3f044a58.js";import"./Navbar-e52bcf93.js";import"./createLucideIcon-d000e5d9.js";import"./SweetAlert-732fed95.js";import"./index-5c259ab6.js";import"./index-98ca6607.js";import"./index-73a971cd.js";import"./index-285c6289.js";import"./Combination-44a5c864.js";import"./index-d874ae91.js";import"./index-0912e6e8.js";import"./react-icons.esm-9d6503eb.js";import"./Loading-8de321b5.js";import"./transition-34aa8e6f.js";import"./index-46c17673.js";import"./badge-e3d200c0.js";const ye=({role:d,permission:h,user:N,maintenen_workers:f,...M})=>{const{data:b,setData:x,post:C,processing:W,errors:_,reset:y}=T({role:"",permission:[]}),S=r=>{x(r.target.name,r.target.value)},R=r=>{const l=document.querySelectorAll('.checkbox-group input[type="checkbox"]'),w=Array.from(l).filter(i=>i.checked).map(i=>i.name);x(i=>({...i,permission:w}))},p=d.map(r=>({display:r.name,value:r.id,id:r.id})),v=N.map(r=>({display:r.username,value:r.id,id:r.id}));return a(P,{children:[a("div",{className:"flex w-full gap-3 mb-3",children:[e(A,{}),e(B,{}),a(n,{className:"w-1/2",children:[a(o,{children:[e(s,{children:"Generate Permission"}),e(k,{children:"Permission"})]}),e(c,{children:a("form",{onSubmit:r=>{r.preventDefault(),C(route("adminpanel.role_assign"),{onSuccess:()=>{y()}})},children:[a("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e(U,{htmlFor:"role",children:"Role Name"}),e(j,{options:p,label:"Role",placeholder:"Select Role",required:!0,name:"role",onChange:S,value:b.role,id:"role",nullvalue:!0})]}),e("div",{className:"flex flex-wrap gap-3 checkbox-group",children:b.role&&h.map((r,l)=>a("div",{className:"flex items-center flex-1 gap-3 whitespace-nowrap",children:[e(D,{name:r.name,onChange:R,placeholder:"Select Permission",id:r.name}),e(H,{htmlFor:r.name,children:r.name})]},l))}),e(L,{type:"submit",className:"mt-3",children:"Submit"})]})})]})]}),a("div",{className:"flex w-full gap-3",children:[e(I,{userOptions:v,roleOptions:p}),a(n,{children:[e(o,{children:e(s,{children:"User Role"})}),e(c,{children:e("div",{className:"flex flex-wrap gap-3",children:h&&h.map((r,l)=>e(u,{value:r.name},l))})})]})]}),e("div",{className:"mt-3",children:a(n,{children:[e(o,{children:e(s,{children:"User Role"})}),e(c,{children:e("div",{className:"h-[50vh] overflow-auto space-y-3",children:d&&d.map(r=>a(n,{children:[e(o,{children:e(s,{children:e(u,{value:"normal",children:r.name})})}),e(c,{className:"flex gap-1",children:r.permissions.map(l=>e(u,{value:l.name,children:l.name}))})]}))})})]})}),a("div",{className:"flex w-full gap-3 mt-3",children:[e("div",{className:"flex-1",children:e(q,{userOptions:v,roleOptions:p})}),e("div",{className:"flex-1",children:a(n,{children:[e(o,{children:e(s,{children:"User Role"})}),e(c,{children:a(F,{children:[e(G,{children:a(g,{children:[e(m,{children:"No"}),e(m,{children:"User"}),e(m,{children:"Nama"}),e(m,{children:"Unit"})]})}),e(O,{children:f&&f.map((r,l)=>a(g,{children:[e(t,{children:l+1}),e(t,{children:r.username}),e(t,{children:r.employee.nama_karyawan}),e(t,{children:r.branch.unit})]},l))})]})})]})})]})]})};export{ye as default};
