import{W as m,j as r,a as e}from"./app-05ace050.js";import{C as i,a as l,b as c,c as d,d as p}from"./card-169e68f9.js";import{L as u}from"./label-b44c9129.js";import{I as h}from"./input-4b693cf1.js";import{B as f}from"./button-f846fb70.js";import"./utils-36e2ef84.js";import"./index-66016791.js";import"./index-d7357eeb.js";const L=()=>{const{data:t,setData:n,post:s,processing:C,errors:b,reset:o}=m({name:"",type:"role"});return r(i,{className:"w-1/4",children:[r(l,{children:[e(c,{children:"Generate Permission"}),e(d,{children:"Permission"})]}),e(p,{children:r("form",{onSubmit:a=>{a.preventDefault(),s(route("adminpanel.post_permission"),{onSuccess:()=>{o("name")}})},children:[r("div",{className:"flex flex-col space-y-1.5",children:[e(u,{htmlFor:"name",children:"Role Name"}),e(h,{required:!0,name:"name",onChange:a=>{n(a.target.name,a.target.value)},value:t.name,id:"name"})]}),e(f,{type:"submit",className:"mt-3",children:"Submit"})]})})]})};export{L as default};