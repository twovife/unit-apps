import{r as t,X as h,G as v,j as i,a as e}from"./app-ea40b5cc.js";import"./TextInput-3ee4236a.js";import{B as a}from"./button-bb453505.js";import{L as x}from"./Loading-f1fa4628.js";import"./utils-450acc22.js";import"./transition-5f488c71.js";function S({id:l}){const[s,n]=t.useState(!1);t.useRef();const{auth:c}=h().props,r=c.permissions.includes("can create");console.log(r);const{data:y,setData:g,delete:u,processing:d,reset:D,errors:U}=v(),o=()=>{n(!0)},m=()=>{setTimeout(()=>{n(!1)},200)},f=t.useRef(null);return i("div",{ref:f,onMouseLeave:m,children:[e(x,{show:d}),e("form",{onSubmit:p=>{p.preventDefault(),u(route("pinjaman.destroy_angsuran",l),{preserveScroll:!0})},children:i("div",{className:"flex flex-col h-6 overflow-hidden",children:[e("div",{className:`inline transition-all duration-300
              ${s?"translate-y-full":"translate-y-0"}
              `,children:e(a,{disabled:!r,type:"button",size:"xs",onClick:o,children:"Hapus"})}),e("div",{className:`inline transition-all duration-300
              ${s?"-translate-y-full":"translate-y-0"}`,children:e(a,{type:"submit",size:"xs",variant:"destructive",onClick:o,children:"Yakin?"})})]})})]})}export{S as default};