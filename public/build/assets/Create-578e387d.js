import{r as i,j as a,a as t,b,d as v,e as w}from"./app-bbbb9813.js";import{I as S}from"./InputError-d676faa3.js";import{I as C}from"./InputLabel-f1416a62.js";import{L as j}from"./LinkButton-cfd5911e.js";import{P as D}from"./PrimaryButton-8e3f1dc4.js";import{T as I}from"./TextInput-77a5acd1.js";import{A as B}from"./AuthenticatedLayout-9ef8e60a.js";import T from"./NewCustomer-f9f4503b.js";import L from"./OldCustomer-38d70f30.js";import{u as _}from"./useServerFilter-8b1193e8.js";import{N as A}from"./react-number-format.es-5b468fed.js";import"./button-980248e4.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-18d24c2d.js";import"./createLucideIcon-6fdf622d.js";import"./SweetAlert-d5c00433.js";import"./react-icons.esm-9d66f758.js";import"./index-463fef4e.js";import"./index-bc5cdca9.js";import"./Loading-c4649ed5.js";import"./transition-07aaf9e3.js";import"./SelectList-04ad65bd.js";import"./index.esm-89937cb9.js";const it=({max_date:d,min_date:u,...o})=>{const{emps:E,kolompokMantri:h}=_(null,null,null,o.mantri),[y,s]=i.useState(!1),[f,x]=i.useState(),[N,c]=i.useState(),[l,k]=i.useState(),[m,p]=i.useState(),g=e=>{const r=document.getElementById("nik").value;s(!0),x(),c(),p(),w({method:"post",url:route("transaction.getnik"),data:{nik:r}}).then(function({data:n}){c(n.data),k(n.reqistered_customer),p(r),s(!1)}).catch(function({response:n}){x(n.data.message),c(),p(),s(!1)})};return a(B,{auth:o.auth,errors:o.errors,header:"Buku Transaksi",loading:y,children:[t(b,{title:"Buku Transaksi"}),a("div",{className:"relative",children:[t("div",{className:"flex items-center justify-end px-6 py-4",children:t(j,{color:"outline",as:"a",href:o.back_to_index,title:"Back"})}),t("div",{className:"px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5",children:a("div",{className:"flex items-start justify-between",children:[a("div",{className:"flex-[2]",children:[a("div",{className:"mb-3",children:[t(C,{htmlFor:"nik",value:"Input Nik Customer"}),a("div",{className:"flex items-center justify-start gap-3",children:[t(I,{id:"nik",type:"text",name:"nik",required:!0,className:"block mt-1",autoComplete:"nik"}),t(D,{title:"Submit",as:"button",type:"button",onClick:g})]}),t(S,{message:f,className:"mt-2"})]}),a("div",{className:"mb-3",children:[t("div",{className:"text-lg font-semibold",children:"History Pinjaman Customer"}),t("div",{className:"p-4 mb-3 overflow-hidden rounded shadow",children:a("table",{className:"w-full text-sm text-left text-gray-500",children:[t("thead",{className:"sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap",children:a("tr",{children:[t("th",{className:"px-3 py-2",children:"No"}),t("th",{className:"px-3 py-2",children:"Tanggal Drop"}),t("th",{className:"px-3 py-2",children:"Unit"}),t("th",{className:"px-3 py-2",children:"Kelompok"}),t("th",{className:"px-3 py-2",children:"Mantri"}),t("th",{className:"px-3 py-2",children:"Nama Customer"}),t("th",{className:"px-3 py-2",children:"Drop"}),t("th",{className:"px-3 py-2",children:"Lunas"}),t("th",{className:"px-3 py-2",children:"Status"})]})}),t("tbody",{children:N?N.map((e,r)=>a("tr",{children:[t("td",{className:"px-3 py-2",children:r+1}),t("td",{className:"px-3 py-2",children:v(e.tanggal_drop).format("DD-MM-YYYY")}),t("td",{className:"px-3 py-2",children:e.unit}),t("td",{className:"px-3 py-2",children:e.kelompok}),t("td",{className:"px-3 py-2",children:e.mantri_name}),t("td",{className:"px-3 py-2",children:e.customer_name}),t("td",{className:"px-3 py-2",children:t(A,{value:e.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),t("td",{className:"px-3 py-2",children:e.lunas}),t("td",{className:"px-3 py-2",children:e.status=="normal"||e.status=="cm"?t("span",{className:"px-5 py-1 font-semibold text-white uppercase bg-green-400 rounded-lg",children:e.status}):e.status=="mb"?t("span",{className:"px-5 py-1 font-semibold text-white uppercase bg-yellow-400 rounded-lg",children:e.status}):t("span",{className:"px-5 py-1 font-semibold text-white uppercase bg-red-400 rounded-lg",children:e.status})})]},r)):t("tr",{children:t("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]})]}),m?l?t(L,{setLoading:s,max_date:d,min_date:u,emps:h,nik:m,customer_id:l==null?void 0:l.id}):t(T,{setLoading:s,max_date:d,min_date:u,emps:h,nik:m}):""]})})]})]})};export{it as default};