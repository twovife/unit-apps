import{q as f,W as j,r as x,j as n,a as e}from"./app-35d31ed9.js";import{L as y}from"./Loading-4c55c56e.js";import{S as N}from"./SelectList-57492041.js";import{B as C}from"./button-1aa3a58c.js";import{D as w,a as L,b as S,c as g,d as F}from"./dialog-5923ce6e.js";import{I as s}from"./input-68668017.js";import{L as l}from"./label-abe714e5.js";import"./transition-e7b86cd0.js";import"./utils-36e2ef84.js";import"./index-d3423716.js";import"./index-30fd9ee9.js";import"./react-icons.esm-2b559b63.js";import"./index-4dbb77c9.js";import"./index-c504300c.js";const z=({show:i,onClosed:c,triggeredData:r})=>{const{roles:t}=f().props,d=t==null?void 0:t.map(a=>({display:a.name,value:a.id,id:a.id})),{data:m,setData:o,post:u,reset:p,transform:O,errors:_,processing:h}=j({id:"",branch_id:"",nama:"",jabatan:"",username:"",role:""}),b=a=>{a.preventDefault(),u(route("administrasi.manpower.store"))};x.useEffect(()=>{r&&o(a=>({...a,id:r.id,branch_id:r.branch_id,nama:r.employee_name,username:r.username,jabatan:r.employment,role:r.role}))},[r]);const v=a=>{c(),p()};return n(w,{open:i,onOpenChange:a=>a?"":v(),children:[e(y,{show:h}),n(L,{className:"w-[90vw] lg:max-w-md h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[e(S,{className:"max-h-10",children:e(g,{children:"Buat User"})}),e(F,{children:n("form",{onSubmit:b,children:[n("div",{className:"mb-3",children:[e(l,{htmlFor:"nama",children:"Nama"}),e(s,{id:"nama",name:"nama",readOnly:!0,value:m.nama,onChange:a=>o("nama",a.target.value)})]}),n("div",{className:"mb-3",children:[e(l,{htmlFor:"username",children:"Username"}),e(s,{id:"username",name:"username",value:m.username,onChange:a=>o("username",a.target.value)})]}),n("div",{className:"mb-3",children:[e(l,{htmlFor:"jabatan",children:"Jabatan"}),e(s,{id:"jabatan",name:"jabatan",readOnly:!0,value:m.jabatan,onChange:a=>o("jabatan",a.target.value)})]}),n("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e(l,{htmlFor:"role",children:"Role Name"}),e(N,{options:d,required:!0,name:"role",onChange:a=>o("role",a.target.value),value:m.role,id:"role",nullvalue:!0})]}),e(C,{type:"submit",children:"Submit"})]})})]})]})};export{z as default};
