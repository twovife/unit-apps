import{G as _,r as p,j as a,a as n,F as w}from"./app-d484a7d2.js";import{L as y}from"./Loading-8de321b5.js";import{N as g}from"./NoEditOverlay-cc55b0e3.js";import{u as N}from"./useFrontEndPermission-20ee38cb.js";import{B as u}from"./button-8c0bc7cc.js";import"./input-9db99b79.js";import{L as i}from"./label-adfb4101.js";import{C as t}from"./index.esm-1326f15a.js";import"./transition-34aa8e6f.js";import"./index-98ca6607.js";import"./utils-3f044a58.js";import"./index-46c17673.js";import"./index-73a971cd.js";const G=({triggeredData:e,onClosed:c})=>{const{isUnit:k,isMantri:f,isPusat:q,isCreator:j}=N(),{data:l,setData:d,put:h,processing:b,reset:v,transform:x,errors:C}=_({request_date:"",drop_date:"",request_nominal:"",approved_nominal:"",nominal_drop:"",drop_langsung:""});p.useState(null),p.useEffect(()=>{e&&d(o=>({...o,request_date:e.request_date,drop_date:e.tanggal_drop,drop_langsung:e.drop_langsung,request_nominal:e.drop_langsung=="baru"?e.drop_jadi:e.request,approved_nominal:e.acc,nominal_drop:e.drop_jadi}))},[e]);const r=(o,s)=>{d(s,o)},m=o=>{x(s=>({...s,updateType:o})),h(route("transaction.updateEverything",e==null?void 0:e.nomor_pengajuan),{preventDefault:!0,preserveState:!0,onSuccess:()=>{v(),c()}})};return a("form",{onSubmit:o=>o.preventDefault(),children:[f&&n(g,{value:"Hanya bisa dilakukan oleh Pimpinan / Staff"}),n(y,{show:b}),a("div",{className:"flex w-full gap-3 mb-1",children:[l.drop_langsung=="lama"&&a(w,{children:[a("div",{className:"flex-1",children:[n(i,{htmlFor:"request_nominal",children:"Pengajuan"}),n(t,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:r,value:l.request_nominal,placeholder:"Inputkan angka tanpa sparator"})]}),l.approved_nominal&&a("div",{className:"flex-1",children:[n(i,{htmlFor:"approved_nominal",children:"Acc"}),n(t,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"approved_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:r,value:l.approved_nominal,placeholder:"Inputkan angka tanpa sparator"})]})]}),l.nominal_drop&&a("div",{className:"flex-1",children:[n(i,{htmlFor:"nominal_drop",children:"Drop Jadi"}),n(t,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"nominal_drop",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:r,value:l.nominal_drop,placeholder:"Inputkan angka tanpa sparator"})]})]}),a("div",{className:"mb-3",children:[n("div",{className:"text-xs text-blue-500",children:"Perubahan Nominal Mempengaruhi Perolehan Drop dan Rencana Drop"}),n("div",{className:"text-xs text-yellow-500",children:"Reset Pinjaman akan menghilangkan semua data angsuran pada pinjaman ini"})]}),a("div",{className:"flex items-center justify-between",children:[n(u,{onClick:()=>m("detailchange"),type:"submit",children:"Ubah"}),(e==null?void 0:e.drop_langsung)=="lama"&&n(u,{onClick:()=>m("resetdata"),variant:"yellow",type:"submit",children:"Reset Pinjaman"})]})]})};export{G as default};
