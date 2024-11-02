import{q as w,r as d,W as C,j as a,a as e}from"./app-39b6d372.js";import{D as _,a as k,b as y,c as N}from"./dialog-f85cbb30.js";import{C as m,a as u,b as c,d as p}from"./card-aa79b4a0.js";import{L as n}from"./label-072d44fe.js";import{C as i}from"./index.esm-fd89ea87.js";import"./button-7451a1eb.js";import{L as D}from"./Loading-065c687a.js";import"./index-aeb4e016.js";import"./index-6b679260.js";import"./react-icons.esm-992f8423.js";import"./index-0efda1f4.js";import"./utils-36e2ef84.js";import"./index-7bc316dc.js";import"./transition-4fdcf231.js";const K=({datas:A,show:f=!1,onClosed:h})=>{const{sirkulasi:r}=w().props,[b,S]=d.useState(!1),{data:l,setData:s,post:I,reset:L,processing:g,errors:q}=C({ml_amount:"",mb_amount:"",cm_amount:"",amount:""});d.useEffect(()=>{s({ml_amount:r.ml_amount??0,mb_amount:r.mb_amount??0,cm_amount:r.cm_amount??0,amount:r.amount??0})},[r]);const x=()=>{h()},o=(t,v)=>{s(v,t)};return a(_,{open:f,onOpenChange:t=>t?"":x(),children:[e(D,{show:b||g}),a(k,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[e(y,{className:"max-h-10",children:e(N,{children:"Isi Angsuran"})}),a(m,{className:"w-full",children:[a(u,{children:[e(c,{children:"Sirkulasi"}),a("div",{className:"flex gap-3",children:[a(m,{className:"flex-1",children:[e(u,{children:e(c,{children:"Sirkulasi Awal"})}),a(p,{children:[a("div",{className:"mb-3",children:[e(n,{htmlFor:"amount",children:"Sirkulasi Awal"}),e(i,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"amount",allowDecimals:!1,prefix:"Rp. ",min:0,required:!0,readOnly:!0,onValueChange:o,value:l.amount,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"mb-3",children:[e(n,{htmlFor:"ml_amount",children:"Saldo Awal (ML)"}),e(i,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"ml_amount",allowDecimals:!1,prefix:"Rp. ",min:0,required:!0,readOnly:!0,onValueChange:o,value:l.ml_amount,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"mb-3",children:[e(n,{htmlFor:"mb_amount",children:"Saldo Awal (MB)"}),e(i,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"mb_amount",allowDecimals:!1,prefix:"Rp. ",min:0,required:!0,readOnly:!0,onValueChange:o,value:l.mb_amount,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"mb-3",children:[e(n,{htmlFor:"cm_amount",children:"Saldo Awal (CM)"}),e(i,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"cm_amount",allowDecimals:!1,prefix:"Rp. ",min:0,required:!0,readOnly:!0,onValueChange:o,value:l.cm_amount,placeholder:"Inputkan angka tanpa sparator"})]})]})]}),e("div",{className:"flex-1",children:e("div",{children:"Sirkulasi Akhir"})}),e("div",{className:"flex-1",children:e("div",{children:"Sirkulasi Awal Bulan Depan"})})]})]}),e(p,{})]})]})]})};export{K as default};
