import{r as l,a as e,j as t,F as S,d as C,e as I}from"./app-6f41ea55.js";import{I as w}from"./InputError-b4e0c872.js";import{I as F}from"./InputLabel-52ec6bce.js";import{P as L}from"./PrimaryButton-48a8ef32.js";import{T}from"./TextInput-5e359523.js";import{M as j}from"./MobileLayout-cacd6cfb.js";import{N as M}from"./react-number-format.es-e3a92009.js";import B from"./OldCustomer-9de62663.js";import E from"./NewCustomer-b1e93282.js";import{u as _}from"./useServerFilter-7e6055d6.js";import{L as q}from"./LinkButton-2be25880.js";import"./Loading-8a7dd92c.js";import"./transition-31f369b9.js";import"./SweetAlert-44be5df9.js";import"./createLucideIcon-7c9aa304.js";import"./react-icons.esm-1bb75465.js";import"./index-6fff1c53.js";import"./button-c3c23cc6.js";import"./utils-36e2ef84.js";import"./index-3568c39e.js";import"./index-4127c4c4.js";import"./SelectList-2c850a5f.js";import"./index.esm-ea129bf0.js";const oe=({max_date:u,min_date:h,...n})=>{var x,v;const{emps:A,kolompokMantri:N}=_(null,null,null,n.mantri),[y,s]=l.useState(!1),[b,f]=l.useState(),[a,d]=l.useState(),[o,k]=l.useState(),[c,p]=l.useState(),g=r=>{const i=document.getElementById("nik").value;s(!0),f(),d(),p(),I({method:"post",url:route("transaction.getnik"),data:{nik:i}}).then(function({data:m}){d(m.data),k(m.reqistered_customer),p(i),s(!1)}).catch(function({response:m}){f(m.data.message),d(),p(),s(!1)})};return e(j,{auth:n.auth,errors:n.errors,header:"Buku Transaksi",loading:y,children:t(S,{children:[t("div",{className:"mb-3",children:[e(F,{htmlFor:"nik",value:"Input Nik Customer"}),t("div",{className:"flex items-center justify-start w-full gap-3",children:[e("div",{className:"w-full",children:e(T,{id:"nik",type:"text",name:"nik",required:!0,className:"block w-full mt-1",autoComplete:"nik"})}),e(L,{title:"Cari",as:"button",type:"button",onClick:g}),e(q,{color:"blue",as:"a",href:route("mantriapps.index"),title:"Home"})]}),e(w,{message:b,className:"mt-2"})]}),a&&t("div",{className:"mb-3",children:[t("div",{className:"mb-3",children:[t("div",{className:"flex",children:[e("div",{className:"flex-[3]",children:"Nama Nasabah"}),e("div",{className:"flex-1",children:":"}),e("div",{className:"flex-[5]",children:(x=a==null?void 0:a[0])==null?void 0:x.customer_name})]}),t("div",{className:"flex mb-3",children:[e("div",{className:"flex-[3]",children:"NIK"}),e("div",{className:"flex-1",children:":"}),e("div",{className:"flex-[5]",children:(v=a==null?void 0:a[0])==null?void 0:v.nik})]})]}),e("div",{className:"overflow-auto rounded shadow-sm max-h-[50vh] border-b-2",children:t("table",{className:"w-full text-sm border",children:[e("thead",{className:"bg-gray-200",children:t("tr",{children:[e("td",{className:"px-2 py-1",children:"Tgl Drop"}),e("td",{className:"px-2 py-1",children:"Total Drop"}),e("td",{className:"px-2 py-1",children:"Lunas"}),e("td",{className:"px-2 py-1",children:"Status"})]})}),t("tbody",{children:[a&&a.map((r,i)=>t("tr",{className:"even:bg-gray-100",children:[e("td",{className:"px-2 py-1",children:r.tanggal_drop?C(r.tanggal_drop).format("DD-MM-YY"):""}),e("td",{className:"px-2 py-1",children:e(M,{value:r.drop,displayType:"text",thousandSeparator:","})}),e("td",{className:"px-2 py-1",children:r.lunas}),e("td",{className:"px-2 py-1",children:r.status})]},i)),e("tr",{})]})]})})]}),c?o?e(B,{setLoading:s,max_date:u,min_date:h,emps:N,nik:c,customer_id:o==null?void 0:o.id,url:route("mantriapps.store")}):e(E,{setLoading:s,max_date:u,min_date:h,emps:N,nik:c,url:route("mantriapps.store")}):""]})})};export{oe as default};