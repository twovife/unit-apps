import{r as t,W as h,j as o,a as e}from"./app-ae52ec07.js";import"./TextInput-f41f2f4a.js";import{B as i}from"./button-9abb5f3a.js";import{L as v}from"./Loading-c16ef2a1.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./transition-35635860.js";function S({id:a,onClosed:l}){const[n,r]=t.useState(!1);t.useRef();const{data:y,setData:D,delete:c,processing:d,reset:u,errors:x}=h(),s=()=>{r(!0)},m=()=>{setTimeout(()=>{r(!1)},200)},f=t.useRef(null);return o("div",{ref:f,onMouseLeave:m,children:[e(v,{show:d}),e("form",{onSubmit:p=>{p.preventDefault(),c(route("pinjaman.destroy_loan",a),{onSuccess:()=>{u(),l()}})},children:o("div",{className:"flex flex-col overflow-hidden h-9",children:[e("div",{className:`inline transition-all duration-300
              ${n?"translate-y-full":"translate-y-0"}
              `,children:e(i,{type:"button",onClick:s,children:"Hapus"})}),e("div",{className:`inline transition-all duration-300
              ${n?"-translate-y-full":"translate-y-0"}`,children:e(i,{type:"submit",variant:"destructive",onClick:s,children:"Yakin?"})})]})})]})}export{S as default};