import{G as d,j as e}from"./app-ns96WniE.js";import{C as x,a as h,b as j,d as f}from"./card-BENIATWH.js";import{L as C}from"./label-dPIdyTXP.js";import"./input-CSn3wVhG.js";import{B as o}from"./button-BdBexs_k.js";import{S as v}from"./SelectList-CxBUBCFy.js";import"./utils-CytzSlOG.js";import"./index-BrmqkDWz.js";import"./index-BYjqc5GM.js";import"./index-D7YONi1a.js";import"./index-Gs9KmwE-.js";const D=({userOptions:m,roleOptions:b})=>{const{data:i,setData:l,post:s,reset:a,transform:n}=d({username:"",type:""}),c=r=>{l(r.target.name,r.target.value)},u=r=>{n(t=>({...t,type:1})),s(route("adminpanel.giveMaintenerWorker"),{onSuccess:()=>{a()}})},p=r=>{n(t=>({...t,type:2})),s(route("adminpanel.giveMaintenerWorker"),{onSuccess:()=>{a()}})};return e.jsxs(x,{children:[e.jsx(h,{children:e.jsx(j,{children:"User Role"})}),e.jsx(f,{children:e.jsxs("form",{onSubmit:r=>r.preventDefault(),children:[e.jsxs("div",{className:"flex flex-col space-y-1.5 mb-3",children:[e.jsx(C,{htmlFor:"username",children:"User Name"}),e.jsx(v,{options:m,required:!0,name:"username",onChange:c,value:i.username,id:"username",nullvalue:!0})]}),e.jsx(o,{onClick:u,type:"submit",className:"mt-3",children:"Submit"}),e.jsx(o,{onClick:p,type:"submit",className:"mt-3",children:"Remove"})]})})]})};export{D as default};
