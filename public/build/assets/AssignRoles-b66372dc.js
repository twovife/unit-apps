import{W as d,j as a,a as e}from"./app-35d31ed9.js";import{C as p,a as h,b as f,d as b}from"./card-201f9aba.js";import{L as o}from"./label-abe714e5.js";import"./input-68668017.js";import{B as C}from"./button-1aa3a58c.js";import{S as l}from"./SelectList-57492041.js";import"./utils-36e2ef84.js";import"./index-c504300c.js";import"./index-4dbb77c9.js";const D=({userOptions:n,roleOptions:m})=>{const{data:s,setData:i,post:u,reset:c,processing:g,errors:v}=d({username:"",role:""}),t=r=>{i(r.target.name,r.target.value)};return a(p,{className:"w-1/2",children:[e(h,{children:e(f,{children:"User Role"})}),e(b,{children:a("form",{onSubmit:r=>{r.preventDefault(),u(route("adminpanel.user_assign"),{onSuccess:()=>{c()}})},children:[a("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e(o,{htmlFor:"username",children:"User Name"}),e(l,{options:n,required:!0,name:"username",onChange:t,value:s.username,id:"username",nullvalue:!0})]}),a("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e(o,{htmlFor:"role",children:"Role Name"}),e(l,{options:m,required:!0,name:"role",onChange:t,value:s.role,id:"role",nullvalue:!0})]}),e(C,{type:"submit",className:"mt-3",children:"Submit"})]})})]})};export{D as default};