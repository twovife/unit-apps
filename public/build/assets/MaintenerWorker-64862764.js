import{W as h,j as a,a as e}from"./app-89964f60.js";import{C as f,a as C,b as v,d as b}from"./card-662026ea.js";import{L as g}from"./label-e1be8c98.js";import"./input-dda9d482.js";import{B as m}from"./button-662018a0.js";import{S as y}from"./SelectList-389240a1.js";import"./utils-aa679991.js";import"./index-bcb7b51f.js";import"./index-ea477c8f.js";const U=({userOptions:i,roleOptions:S})=>{const{data:l,setData:c,post:n,reset:o,processing:k,errors:x,transform:s}=h({username:"",type:""}),u=r=>{c(r.target.name,r.target.value)},d=r=>{s(t=>({...t,type:1})),n(route("adminpanel.giveMaintenerWorker"),{onSuccess:()=>{o()}})},p=r=>{s(t=>({...t,type:2})),n(route("adminpanel.giveMaintenerWorker"),{onSuccess:()=>{o()}})};return a(f,{children:[e(C,{children:e(v,{children:"User Role"})}),e(b,{children:a("form",{onSubmit:r=>r.preventDefault(),children:[a("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e(g,{htmlFor:"username",children:"User Name"}),e(y,{options:i,required:!0,name:"username",onChange:u,value:l.username,id:"username",nullvalue:!0})]}),e(m,{onClick:d,type:"submit",className:"mt-3",children:"Submit"}),e(m,{onClick:p,type:"submit",className:"mt-3",children:"Remove"})]})})]})};export{U as default};
