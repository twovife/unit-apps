import{W as b,j as o,a as r}from"./app-ae52ec07.js";import{C as g,a as C,b as v,c as S,d as N}from"./card-8d46e4d6.js";import k from"./Permission-0efaf5f0.js";import y from"./Role-d737289d.js";import{A as w}from"./AuthenticatedLayout-77712461.js";import{L as A}from"./label-2f218faf.js";import"./input-38867cef.js";import{B as P}from"./button-9abb5f3a.js";import{S as R}from"./SelectList-b9abef02.js";import{C as L}from"./Checkbox-53129a28.js";import{I as j}from"./InputLabel-5f6bda1f.js";import D from"./AssignRoles-ce485088.js";import"./utils-46f1eee5.js";import"./Navbar-5acbd57d.js";import"./index-4b166e85.js";import"./createLucideIcon-494c28e3.js";import"./SweetAlert-bbaabdd4.js";import"./react-icons.esm-e24aa064.js";import"./index-ccc745c0.js";import"./index-83f244ef.js";import"./Loading-c16ef2a1.js";import"./transition-35635860.js";import"./index-9560790a.js";import"./index-f96983da.js";const te=({role:n,permission:m,user:c,...I})=>{const{data:t,setData:l,post:p,processing:q,errors:B,reset:d}=b({role:"",permission:[]}),h=e=>{l(e.target.name,e.target.value)},u=e=>{const s=document.querySelectorAll('.checkbox-group input[type="checkbox"]'),x=Array.from(s).filter(a=>a.checked).map(a=>a.name);l(a=>({...a,permission:x}))},i=n.map(e=>({display:e.name,value:e.id,id:e.id}));console.log(i);const f=c.map(e=>({display:e.username,value:e.id,id:e.id}));return o(w,{children:[o("div",{className:"flex w-full gap-3 mb-3",children:[r(k,{}),r(y,{}),o(g,{className:"w-1/2",children:[o(C,{children:[r(v,{children:"Generate Permission"}),r(S,{children:"Permission"})]}),r(N,{children:o("form",{onSubmit:e=>{e.preventDefault(),p(route("adminpanel.role_assign"),{onSuccess:()=>{d()}})},children:[o("div",{className:"flex flex-col space-y-1.5 mb-3",children:[r(A,{htmlFor:"role",children:"Role Name"}),r(R,{options:i,label:"Role",placeholder:"Select Role",required:!0,name:"role",onChange:h,value:t.role,id:"role",nullvalue:!0})]}),r("div",{className:"flex flex-wrap gap-3 checkbox-group",children:t.role&&m.map((e,s)=>o("div",{className:"flex items-center flex-1 gap-3 whitespace-nowrap",children:[r(L,{name:e.name,onChange:u,placeholder:"Select Permission",id:e.name}),r(j,{htmlFor:e.name,children:e.name})]},s))}),r(P,{type:"submit",className:"mt-3",children:"Submit"})]})})]})]}),r("div",{className:"flex w-full gap-3",children:r(D,{userOptions:f,roleOptions:i})})]})};export{te as default};