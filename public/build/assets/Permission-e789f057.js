import{W as o,j as a,a as e}from"./app-c852447f.js";import{C as m,a as c,b as l,c as d,d as p}from"./card-f9a33d03.js";import{L as u}from"./label-d7b82de4.js";import{I as h}from"./input-02d3423f.js";import{B as f}from"./button-f1d79983.js";import"./utils-36e2ef84.js";import"./index-14a993ee.js";import"./index-71acb7a6.js";import"./index-f96983da.js";const L=()=>{const{data:s,setData:t,post:n,reset:i,processing:C,errors:b}=o({name:"",type:"permission"});return a(m,{className:"w-1/4",children:[a(c,{children:[e(l,{children:"Generate Permission"}),e(d,{children:"Permission"})]}),e(p,{children:a("form",{onSubmit:r=>{r.preventDefault(),n(route("adminpanel.post_permission"),{onSuccess:()=>{i("name")}})},children:[a("div",{className:"flex flex-col space-y-1.5",children:[e(u,{htmlFor:"name",children:"Pemission Name"}),e(h,{required:!0,name:"name",onChange:r=>{t(r.target.name,r.target.value)},id:"name",value:s.name})]}),e(f,{type:"submit",className:"mt-3",children:"Submit"})]})})]})};export{L as default};