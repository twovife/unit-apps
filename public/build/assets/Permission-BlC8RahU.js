import{G as o,j as e}from"./app-ns96WniE.js";import{C as l,a as p,b as c,c as d,d as u}from"./card-BENIATWH.js";import{L as x}from"./label-dPIdyTXP.js";import{I as j}from"./input-CSn3wVhG.js";import{B as h}from"./button-BdBexs_k.js";import"./utils-CytzSlOG.js";import"./index-BrmqkDWz.js";import"./index-BYjqc5GM.js";import"./index-D7YONi1a.js";import"./index-Gs9KmwE-.js";const B=()=>{const{data:r,setData:a,post:t,reset:i}=o({name:"",type:"permission"}),n=s=>{a(s.target.name,s.target.value)},m=s=>{s.preventDefault(),t(route("adminpanel.post_permission"),{onSuccess:()=>{i("name")}})};return e.jsxs(l,{className:"w-1/4",children:[e.jsxs(p,{children:[e.jsx(c,{children:"Generate Permission"}),e.jsx(d,{children:"Permission"})]}),e.jsx(u,{children:e.jsxs("form",{onSubmit:m,children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(x,{htmlFor:"name",children:"Pemission Name"}),e.jsx(j,{required:!0,name:"name",onChange:n,id:"name",value:r.name})]}),e.jsx(h,{type:"submit",className:"mt-3",children:"Submit"})]})})]})};export{B as default};
