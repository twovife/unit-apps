import{W as d,r as f,j as n,a as e}from"./app-a0d29dc0.js";import{L as b}from"./Loading-aa0339c0.js";import{B as h}from"./button-04b96693.js";import{L as g}from"./label-c2fd6b2d.js";import{C as x}from"./index.esm-76235d9e.js";import"./transition-f1922511.js";import"./utils-36e2ef84.js";import"./index-3a918115.js";const B=({id:a,drop_jadi:o,onClosed:i})=>{const{data:l,setData:t,put:c,errors:v,processing:u,reset:w}=d({drop:"",status:"success"});f.useEffect(()=>{t("drop",o)},[a,o]);const p=(r,m)=>{t(m,r)},s=r=>{r.preventDefault(),c(route("transaction.action_buku_transaksi",a),{onFinish:()=>{i()}})};return n("form",{className:"w-full",onSubmit:s,children:[e(b,{show:u}),e(g,{htmlFor:"acc",children:"Drop Jadi"}),n("div",{className:"flex items-center justify-center gap-3",children:[e(x,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:p,value:l.drop,placeholder:"Inputkan angka tanpa sparator"}),e(h,{onClick:s,children:"Drop"})]})]})};export{B as default};
