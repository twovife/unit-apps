import{r as t,W as h,j as o,a as e}from"./app-e784aa14.js";import"./TextInput-95558883.js";import{B as a}from"./button-bbb9af53.js";import{L as v}from"./Loading-6279b149.js";import"./utils-36e2ef84.js";import"./transition-890b9c0c.js";function N({id:i,onClosed:l}){const[n,r]=t.useState(!1);t.useRef();const{data:y,setData:D,delete:c,processing:d,reset:u,errors:x}=h(),s=()=>{r(!0)},f=()=>{setTimeout(()=>{r(!1)},200)},m=t.useRef(null);return o("div",{ref:m,onMouseLeave:f,children:[e(v,{show:d}),e("form",{onSubmit:p=>{p.preventDefault(),c(route("pinjaman.destroy_loan",i),{onSuccess:()=>{u(),l()}})},children:o("div",{className:"flex flex-col overflow-hidden h-9",children:[e("div",{className:`inline transition-all duration-300
              ${n?"translate-y-full":"translate-y-0"}
              `,children:e(a,{type:"button",onClick:s,children:"Hapus"})}),e("div",{className:`inline transition-all duration-300
              ${n?"-translate-y-full":"translate-y-0"}`,children:e(a,{type:"submit",variant:"destructive",onClick:s,children:"Yakin?"})})]})})]})}export{N as default};