import{r as t,W as f,j as i,a as e}from"./app-894fb644.js";import"./TextInput-336aec83.js";import{B as o}from"./button-9da4f797.js";import{L as p}from"./Loading-b2556a0b.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./transition-dd2a41ee.js";function N({id:a}){const[r,n]=t.useState(!1);t.useRef();const{data:h,setData:v,delete:l,processing:c,reset:x,errors:y}=f(),s=()=>{n(!0)},u=()=>{setTimeout(()=>{n(!1)},200)},d=t.useRef(null);return i("div",{ref:d,onMouseLeave:u,children:[e(p,{show:c}),e("form",{onSubmit:m=>{m.preventDefault(),l(route("pinjaman.destroy_angsuran",a),{preserveScroll:!0})},children:i("div",{className:"flex flex-col h-6 overflow-hidden",children:[e("div",{className:`inline transition-all duration-300
              ${r?"translate-y-full":"translate-y-0"}
              `,children:e(o,{type:"button",size:"xs",onClick:s,children:"Hapus"})}),e("div",{className:`inline transition-all duration-300
              ${r?"-translate-y-full":"translate-y-0"}`,children:e(o,{type:"submit",size:"xs",variant:"destructive",onClick:s,children:"Yakin?"})})]})})]})}export{N as default};