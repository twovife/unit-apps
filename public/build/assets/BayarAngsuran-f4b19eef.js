import{q as N,W as _,r as u,j as r,a}from"./app-46702308.js";import{C as w,a as j,b as I,d as S}from"./card-da554dd9.js";import{L as v}from"./label-ee403b9e.js";import{I as A}from"./input-e82c8bdf.js";import{C as D}from"./index.esm-ffbb0be3.js";import{C as L}from"./Checkbox-2b7a96a3.js";import{B as t}from"./button-8a24cc1b.js";import{L as B}from"./Loading-384dbda5.js";import"./utils-46f1eee5.js";import"./index-0d0f478e.js";import"./index-456a55a4.js";import"./index-f96983da.js";import"./transition-c9987eb0.js";const Y=({triggeredId:d,triggeredPinjaman:E,instalment:s})=>{const{server_filter:{closed_transaction:h},auth:F}=N().props,{data:o,setData:l,post:f,errors:P,processing:x,reset:C,recentlySuccessful:g}=_({type_transaksi:"bayar",transaction_date:"",nominal:0,id:""});u.useEffect(()=>{l("id",d)},[d,g]);const y=(e,i)=>{l(i,e)},m=e=>{l(e.target.name,e.target.type==="checkbox"?e.target.checked:e.target.value)},n=e=>{const i=e.target.getAttribute("data-value");l("nominal",i)},p=e=>{const i=parseInt(o.nominal),c=parseInt(e.target.getAttribute("data-value"));l("nominal",c+i)},k=e=>{e.preventDefault(),f(route("pinjaman.bayar_pinjaman",o.id),{preserveScroll:!0,onSuccess:()=>{C("transaction_date","nominal")}})},[b,z]=u.useState(0);return u.useEffect(()=>{var i;const e=((i=s==null?void 0:s.sort((c,R)=>c.saldo-R.saldo)[0])==null?void 0:i.saldo)??0;z(e)},[s]),r(w,{className:"relative w-full mb-3",children:[a(B,{show:x}),a(j,{children:a(I,{children:"Isi Angsuran"})}),a(S,{children:r("form",{onSubmit:k,children:[r("div",{className:"mb-3",children:[a(v,{htmlFor:"transaction_date",children:"Tanggal Pembayaran"}),a(A,{type:"date",min:h,name:"transaction_date",id:"transaction_date",className:"w-full",value:o.transaction_date,onChange:m})]}),r("div",{className:"mb-3",children:[a(v,{htmlFor:"nominal",children:"Nominal"}),a(D,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"nominal",allowDecimals:!1,prefix:"Rp. ",min:0,required:!0,onValueChange:y,value:o.nominal,placeholder:"Inputkan angka tanpa sparator"})]}),r("div",{className:"flex flex-wrap gap-3",children:[a(t,{type:"button",variant:"outline",size:"xs",onClick:p,"data-value":5e3,children:"+5 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:p,"data-value":1e4,children:"+10 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":5e4,children:"50 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":52e3,children:"52 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":6e4,children:"60 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":65e3,children:"65 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":1e5,children:"100 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":13e4,children:"130 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":195e3,children:"195 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":26e4,children:"260 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":39e4,children:"390 Rb"}),a(t,{type:"button",variant:"outline",size:"xs",onClick:n,"data-value":b,children:b})]}),r("div",{className:"flex items-center justify-between mt-6",children:[r("label",{className:"flex items-center",children:[a(L,{name:"danatitipan",value:o.danatitipan,onChange:m}),a("span",{className:"ml-2 text-sm text-gray-600",children:"Dana Titipan?"})]}),a(t,{type:"submit",children:"Submit"})]})]})})]})};export{Y as default};
