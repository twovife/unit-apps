import{W as o,j as a,a as e}from"./app-1dba9351.js";import{C as m,a as c,b as l,c as d,d as p}from"./card-89e16e77.js";import{L as u}from"./label-a4aeba48.js";import{I as h}from"./input-eaed37ea.js";import{B as f}from"./button-f157f404.js";import"./utils-36e2ef84.js";import"./index-a2f41169.js";import"./index-8e703f61.js";const I=()=>{const{data:s,setData:n,post:t,reset:i,processing:C,errors:b}=o({name:"",type:"permission"});return a(m,{className:"w-1/4",children:[a(c,{children:[e(l,{children:"Generate Permission"}),e(d,{children:"Permission"})]}),e(p,{children:a("form",{onSubmit:r=>{r.preventDefault(),t(route("adminpanel.post_permission"),{onSuccess:()=>{i("name")}})},children:[a("div",{className:"flex flex-col space-y-1.5",children:[e(u,{htmlFor:"name",children:"Pemission Name"}),e(h,{required:!0,name:"name",onChange:r=>{n(r.target.name,r.target.value)},id:"name",value:s.name})]}),e(f,{type:"submit",className:"mt-3",children:"Submit"})]})})]})};export{I as default};