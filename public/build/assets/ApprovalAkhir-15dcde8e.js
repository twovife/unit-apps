import{q as k,r as c,W as v,j as a,a as e}from"./app-ae52ec07.js";import{D as _,a as N,b as C,c as y}from"./dialog-931f627e.js";import{C as D,a as I,b as A,d as q}from"./card-8d46e4d6.js";import{L as i}from"./label-2f218faf.js";import{C as s}from"./index.esm-adfb63fe.js";import{B as F}from"./button-9abb5f3a.js";import{L as R}from"./Loading-c16ef2a1.js";import"./index-ea66e8bf.js";import"./react-icons.esm-e24aa064.js";import"./index-ccc745c0.js";import"./utils-46f1eee5.js";import"./index-9560790a.js";import"./index-f96983da.js";import"./transition-35635860.js";const U=({datas:o,show:t=!1,onClosed:u})=>{const{server_filter:{groupId:p,hari:f}}=k().props,[h,V]=c.useState(!1),{data:r,setData:d,post:b,reset:L,processing:g,errors:M}=v({});c.useEffect(()=>{o&&d({hari:f,groupId:p,cm_awal:o.cm.sirkulasi,cm_akhir:o.cm.saldo,ccm_awal:o.ccm.sirkulasi,ccm_akhir:o.ccm.saldo,mb_awal:o.mb.sirkulasi,mb_akhir:o.mb.saldo,ml_awal:0,ml_akhir:0,sirkulasi_awal:0,sirkulasi_akhir:0})},[t,o]);const m=()=>{u()},x=n=>{n.preventDefault(),b(route("adminpanel.sirkulasiAwal"),{onSuccess:()=>{m()}})},l=(n,w)=>{d(w,n)};return a(_,{open:t,onOpenChange:n=>n?"":m(),children:[e(R,{show:h||g}),a(N,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[e(C,{className:"max-h-10",children:e(y,{children:"Isi Angsuran"})}),a(D,{className:"w-full",children:[e(I,{children:e(A,{children:"Input Sirkulasi"})}),e(q,{children:a("form",{onSubmit:x,children:[a("div",{className:"flex gap-3 mb-3",children:[a("div",{className:"flex-1",children:[e(i,{htmlFor:"cm_awal",children:"CM Awal"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"cm_awal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.cm_awal,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"flex-1",children:[e(i,{htmlFor:"cm_akhir",children:"CM Akhir"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"cm_akhir",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.cm_akhir,placeholder:"Inputkan angka tanpa sparator"})]})]}),a("div",{className:"flex gap-3 mb-3",children:[a("div",{className:"flex-1",children:[e(i,{htmlFor:"mb_awal",children:"MB Awal"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"mb_awal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.mb_awal,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"flex-1",children:[e(i,{htmlFor:"mb_akhir",children:"MB Akhir"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"mb_akhir",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.mb_akhir,placeholder:"Inputkan angka tanpa sparator"})]})]}),a("div",{className:"flex gap-3 mb-3",children:[a("div",{className:"flex-1",children:[e(i,{htmlFor:"ml_awal",children:"ML Awal"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"ml_awal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.ml_awal,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"flex-1",children:[e(i,{htmlFor:"ml_akhir",children:"ML Akhir"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"ml_akhir",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.ml_akhir,placeholder:"Inputkan angka tanpa sparator"})]})]}),a("div",{className:"flex gap-3 mb-3",children:[a("div",{className:"flex-1",children:[e(i,{htmlFor:"ccm_awal",children:"Calon CM"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"ccm_awal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.ccm_awal,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"flex-1",children:[e(i,{htmlFor:"ccm_akhir",children:"ML Akhir"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"ccm_akhir",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.ccm_akhir,placeholder:"Inputkan angka tanpa sparator"})]})]}),a("div",{className:"flex gap-3 mb-3",children:[a("div",{className:"flex-1",children:[e(i,{htmlFor:"sirkulasi_awal",children:"Sirkulasi Awal"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"sirkulasi_awal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.sirkulasi_awal,placeholder:"Inputkan angka tanpa sparator"})]}),a("div",{className:"flex-1",children:[e(i,{htmlFor:"sirkulasi_akhir",children:"Sirkulasi Akhir"}),e(s,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"sirkulasi_akhir",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:l,value:r.sirkulasi_akhir,placeholder:"Inputkan angka tanpa sparator"})]})]}),e(F,{type:"submit",children:"Submit"})]})})]})]})]})};export{U as default};