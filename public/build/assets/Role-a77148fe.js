import{W as m,j as r,a as e}from"./app-d0c32e8e.js";import{C as i,a as l,b as c,c as d,d as p}from"./card-51a54bd3.js";import{L as u}from"./label-34e21a78.js";import{I as h}from"./input-487391ce.js";import{B as f}from"./button-17a62d66.js";import"./utils-36e2ef84.js";import"./index-3eee53bf.js";import"./index-264e9adc.js";const L=()=>{const{data:t,setData:n,post:s,processing:C,errors:b,reset:o}=m({name:"",type:"role"});return r(i,{className:"w-1/4",children:[r(l,{children:[e(c,{children:"Generate Permission"}),e(d,{children:"Permission"})]}),e(p,{children:r("form",{onSubmit:a=>{a.preventDefault(),s(route("adminpanel.c"),{onSuccess:()=>{o("name")}})},children:[r("div",{className:"flex flex-col space-y-1.5",children:[e(u,{htmlFor:"name",children:"Role Name"}),e(h,{required:!0,name:"name",onChange:a=>{n(a.target.name,a.target.value)},value:t.name,id:"name"})]}),e(f,{type:"submit",className:"mt-3",children:"Submit"})]})})]})};export{L as default};
