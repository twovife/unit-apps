import{W as d,r as f,j as n,a as e}from"./app-bbbb9813.js";import{L as b}from"./Loading-c4649ed5.js";import{B as h}from"./button-980248e4.js";import{L as g}from"./label-d990cf67.js";import{C as x}from"./index.esm-89937cb9.js";import"./transition-07aaf9e3.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-0f3ff2b4.js";import"./index-463fef4e.js";const F=({id:o,drop_jadi:t,onClosed:i})=>{const{data:l,setData:a,put:c,errors:v,processing:p,reset:w}=d({drop:"",status:"success"});f.useEffect(()=>{a("drop",t)},[o,t]);const m=(r,u)=>{a(u,r)},s=r=>{r.preventDefault(),c(route("transaction.action_buku_transaksi",o),{onFinish:()=>{i()}})};return n("form",{className:"w-full",onSubmit:s,children:[e(b,{show:p}),e(g,{htmlFor:"acc",children:"Drop Jadi"}),n("div",{className:"flex items-center justify-center gap-3",children:[e(x,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:m,value:l.drop,placeholder:"Inputkan angka tanpa sparator"}),e(h,{onClick:s,children:"Drop"})]})]})};export{F as default};