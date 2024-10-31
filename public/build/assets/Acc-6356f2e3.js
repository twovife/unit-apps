import{W as C,r as w,j as l,a as o,F as f}from"./app-779ec234.js";import{L as N}from"./Loading-762ba472.js";import{B as r}from"./badge-429ab026.js";import{B as e}from"./button-a6591cf8.js";import{L as h}from"./label-7b574e4d.js";import{C as d}from"./index.esm-e7946a20.js";import"./transition-6c6be02d.js";import"./utils-36e2ef84.js";import"./index-571c597f.js";import"./index-1d496a67.js";const T=({id:p,acc:v,onClosed:b,triggeredData:n})=>{const{data:m,setData:u,put:t,errors:_,processing:x,reset:j,transform:k}=C({approved_nominal:"",status:"",drop:""});w.useEffect(()=>{u(s=>({...s,approved_nominal:(n==null?void 0:n.acc)??(n==null?void 0:n.request),drop:n==null?void 0:n.acc}))},[p,v]);const a=(s,i)=>{u(i,s)},c=s=>{k(i=>({...i,status:s})),t(route("transaction.action_buku_transaksi",p),{onFinish:()=>{b()}})};return l("form",{className:"w-full",onSubmit:s=>s.preventDefault(),children:[o(N,{show:x}),o("div",{className:"mb-3",children:(n==null?void 0:n.status)==="open"?l(f,{children:[o(h,{htmlFor:"approved_nominal",children:"Nominal ACC"}),l("div",{className:"flex items-center justify-center gap-3",children:[o(d,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"approved_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:a,value:m.approved_nominal,placeholder:"Inputkan angka tanpa sparator"}),o(e,{variant:"green",onClick:()=>c("acc"),children:"ACC"}),o(e,{variant:"destructive",onClick:()=>c("tolak"),children:"Tolak"})]})]}):l(r,{size:"lg",variant:"green",children:["Status Pengajuan = ",n==null?void 0:n.status,", Pada Tanggal",n==null?void 0:n.check_date]})}),(n==null?void 0:n.status)!=="open"&&o("div",{className:"mb-3",children:(n==null?void 0:n.status)==="acc"?l(f,{children:[o(h,{htmlFor:"drop",className:"whitespace-normal",children:"Drop Jadi"}),l("div",{className:"flex items-center justify-center gap-3",children:[o(d,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"drop",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:a,value:m.drop,placeholder:"Inputkan angka tanpa sparator"}),o(e,{variant:"green",onClick:()=>c("success"),children:"DROP"}),o(e,{variant:"destructive",onClick:()=>c("gagal"),children:"GAGAL"})]})]}):l(r,{size:"lg",variant:"green",children:["Status Pengajuan = ",n==null?void 0:n.status,", Tanggal",n==null?void 0:n.check_date]})})]})};export{T as default};
