import{W as p,j as a,a as e}from"./app-e784aa14.js";import{L as l}from"./Loading-6279b149.js";import{S as d}from"./SelectList-51fda63e.js";import{B as c}from"./button-bbb9af53.js";import{L as h}from"./label-85a71ee3.js";import"./transition-890b9c0c.js";import"./utils-36e2ef84.js";import"./index-b4847f61.js";import"./index-054343f7.js";const C=({triggeredId:r,onClosed:s})=>{const{data:o,setData:n,put:u,processing:i,reset:m}=p({});return a("form",{onSubmit:t=>{t.preventDefault(),u(route("transaction.updateEverything",r),{preventDefault:!0,preserveState:!0,onSuccess:()=>{m(),s()}})},children:[e(l,{show:i}),e(h,{htmlFor:"status",children:"Status"}),a("div",{className:"flex gap-3",children:[e(d,{onChange:t=>{n(t.target.name,t.target.value)},value:o.status,id:"status",nullValue:!0,required:!0,name:"status",options:[{id:1,value:"open",display:"Open"}]}),e(c,{type:"submit",children:"Ubah"})]})]})};export{C as default};