import{W as p,j as a,a as e}from"./app-bbbb9813.js";import{L as l}from"./Loading-c4649ed5.js";import{S as d}from"./SelectList-04ad65bd.js";import{B as c}from"./button-980248e4.js";import{L as h}from"./label-d990cf67.js";import"./transition-07aaf9e3.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-0f3ff2b4.js";import"./index-463fef4e.js";const q=({triggeredId:r,onClosed:s})=>{const{data:o,setData:n,put:i,processing:u,reset:m}=p({});return a("form",{onSubmit:t=>{t.preventDefault(),i(route("transaction.updateEverything",r),{preventDefault:!0,preserveState:!0,onSuccess:()=>{m(),s()}})},children:[e(l,{show:u}),e(h,{htmlFor:"status",children:"Status"}),a("div",{className:"flex gap-3",children:[e(d,{onChange:t=>{n(t.target.name,t.target.value)},value:o.status,id:"status",nullValue:!0,required:!0,name:"status",options:[{id:1,value:"open",display:"Open"}]}),e(c,{type:"submit",children:"Ubah"})]})]})};export{q as default};