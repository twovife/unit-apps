import{W as T,j as a,a as e}from"./app-1513e6ad.js";import{C as n,a as o,b as s,c as k,d as c}from"./card-496f5bec.js";import A from"./Permission-73d92c6d.js";import B from"./Role-2de342cb.js";import{A as P}from"./AuthenticatedLayout-96f1f334.js";import{L as U}from"./label-fcb642ac.js";import"./input-79bff17c.js";import{B as L}from"./button-fa3185df.js";import{S as j}from"./SelectList-5a93a8d5.js";import{C as D}from"./Checkbox-da7e107c.js";import{I as H}from"./InputLabel-7e6bf775.js";import I from"./AssignRoles-76f12af5.js";import{B as u}from"./BadgeStatus-6e08e193.js";import q from"./MaintenerWorker-18d40976.js";import{T as F,a as O,b as g,c as m,d as W,e as t}from"./table-7e5d8dfc.js";import"./utils-aa679991.js";import"./SweetAlert-09647bae.js";import"./Loading-dd9671cb.js";import"./transition-d80bb77d.js";import"./AppSidebar-f5076252.js";import"./DropdownProfile-b0c5b238.js";import"./use-mobile-fce16445.js";import"./separator-e6bdf748.js";import"./index-40c8da9e.js";import"./react-icons.esm-5687bae1.js";import"./Combination-6c46d091.js";import"./index-1c376abe.js";import"./index-fbaf698f.js";import"./index-3fba9fed.js";import"./createLucideIcon-0dc67ecd.js";import"./user-x-d8428dea.js";import"./index-f6c8e49c.js";import"./badge-2f261dfb.js";const Re=({role:d,permission:h,user:N,maintenen_workers:f,...G})=>{const{data:b,setData:x,post:C,processing:M,errors:_,reset:y}=T({role:"",permission:[]}),S=r=>{x(r.target.name,r.target.value)},R=r=>{const l=document.querySelectorAll('.checkbox-group input[type="checkbox"]'),w=Array.from(l).filter(i=>i.checked).map(i=>i.name);x(i=>({...i,permission:w}))},p=d.map(r=>({display:r.name,value:r.id,id:r.id})),v=N.map(r=>({display:r.username,value:r.id,id:r.id}));return a(P,{children:[a("div",{className:"flex w-full gap-3 mb-3",children:[e(A,{}),e(B,{}),a(n,{className:"w-1/2",children:[a(o,{children:[e(s,{children:"Generate Permission"}),e(k,{children:"Permission"})]}),e(c,{children:a("form",{onSubmit:r=>{r.preventDefault(),C(route("adminpanel.role_assign"),{onSuccess:()=>{y()}})},children:[a("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e(U,{htmlFor:"role",children:"Role Name"}),e(j,{options:p,label:"Role",placeholder:"Select Role",required:!0,name:"role",onChange:S,value:b.role,id:"role",nullvalue:!0})]}),e("div",{className:"flex flex-wrap gap-3 checkbox-group",children:b.role&&h.map((r,l)=>a("div",{className:"flex items-center flex-1 gap-3 whitespace-nowrap",children:[e(D,{name:r.name,onChange:R,placeholder:"Select Permission",id:r.name}),e(H,{htmlFor:r.name,children:r.name})]},l))}),e(L,{type:"submit",className:"mt-3",children:"Submit"})]})})]})]}),a("div",{className:"flex w-full gap-3",children:[e(I,{userOptions:v,roleOptions:p}),a(n,{children:[e(o,{children:e(s,{children:"User Role"})}),e(c,{children:e("div",{className:"flex flex-wrap gap-3",children:h&&h.map((r,l)=>e(u,{value:r.name},l))})})]})]}),e("div",{className:"mt-3",children:a(n,{children:[e(o,{children:e(s,{children:"User Role"})}),e(c,{children:e("div",{className:"h-[50vh] overflow-auto space-y-3",children:d&&d.map(r=>a(n,{children:[e(o,{children:e(s,{children:e(u,{value:"normal",children:r.name})})}),e(c,{className:"flex gap-1",children:r.permissions.map(l=>e(u,{value:l.name,children:l.name}))})]}))})})]})}),a("div",{className:"flex w-full gap-3 mt-3",children:[e("div",{className:"flex-1",children:e(q,{userOptions:v,roleOptions:p})}),e("div",{className:"flex-1",children:a(n,{children:[e(o,{children:e(s,{children:"User Role"})}),e(c,{children:a(F,{children:[e(O,{children:a(g,{children:[e(m,{children:"No"}),e(m,{children:"User"}),e(m,{children:"Nama"}),e(m,{children:"Unit"})]})}),e(W,{children:f&&f.map((r,l)=>a(g,{children:[e(t,{children:l+1}),e(t,{children:r.username}),e(t,{children:r.employee.nama_karyawan}),e(t,{children:r.branch.unit})]},l))})]})})]})})]})]})};export{Re as default};
