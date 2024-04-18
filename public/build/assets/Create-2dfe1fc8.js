import{r as i,j as e,a as t,b,c as v}from"./app-8e61fab9.js";import{I as w}from"./InputError-d00c1a74.js";import{I as S}from"./InputLabel-b7bc1344.js";import{L as C}from"./LinkButton-a85a1bc5.js";import{P as j}from"./PrimaryButton-4b64a2ec.js";import{T as D}from"./TextInput-1ce8a17c.js";import{A as I}from"./AuthenticatedLayout-3df793e2.js";import{d as B}from"./dayjs.min-532d1b9f.js";import"./index.esm-ca10c6c7.js";import T from"./NewCustomer-1a526134.js";import L from"./OldCustomer-5671954f.js";import{u as _}from"./useServerFilter-5790a777.js";import{N as A}from"./react-number-format.es-2eed35b4.js";import"./transition-1bc1b228.js";import"./index-67bf5e86.js";import"./Loading-21dc693c.js";import"./Checkbox-268c9db9.js";import"./SelectList-67065cde.js";const Z=({max_date:p,min_date:u,...l})=>{const{emps:h}=_(null,null,null,l.mantri),[y,s]=i.useState(!1),[f,x]=i.useState(),[N,c]=i.useState(),[n,k]=i.useState(),[d,m]=i.useState(),g=a=>{const r=document.getElementById("nik").value;s(!0),x(),c(),m(),v({method:"post",url:route("transaction.getnik"),data:{nik:r}}).then(function({data:o}){c(o.data),k(o.reqistered_customer),m(r),s(!1)}).catch(function({response:o}){x(o.data.message),c(),m(),s(!1)})};return e(I,{auth:l.auth,errors:l.errors,header:"Buku Transaksi",loading:y,children:[t(b,{title:"Buku Transaksi"}),e("div",{className:"relative",children:[t("div",{className:"px-6 py-4 flex justify-end items-center",children:t(C,{color:"outline",as:"a",href:l.back_to_index,title:"Back"})}),t("div",{className:"bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md",children:e("div",{className:"flex justify-between items-start",children:[e("div",{className:"flex-[2]",children:[e("div",{className:"mb-3",children:[t(S,{htmlFor:"nik",value:"Input Nik Customer"}),e("div",{className:"flex items-center justify-start gap-3",children:[t(D,{id:"nik",type:"text",name:"nik",required:!0,className:"mt-1 block",autoComplete:"nik"}),t(j,{title:"Submit",as:"button",type:"button",onClick:g})]}),t(w,{message:f,className:"mt-2"})]}),e("div",{className:"mb-3",children:[t("div",{className:"text-lg font-semibold",children:"History Pinjaman Customer"}),t("div",{className:"overflow-hidden mb-3 rounded shadow p-4",children:e("table",{className:"w-full text-sm text-left text-gray-500",children:[t("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap",children:e("tr",{children:[t("th",{className:"px-3 py-2",children:"No"}),t("th",{className:"px-3 py-2",children:"Tanggal Drop"}),t("th",{className:"px-3 py-2",children:"Unit"}),t("th",{className:"px-3 py-2",children:"Kelompok"}),t("th",{className:"px-3 py-2",children:"Mantri"}),t("th",{className:"px-3 py-2",children:"Nama Customer"}),t("th",{className:"px-3 py-2",children:"Drop"}),t("th",{className:"px-3 py-2",children:"Lunas"}),t("th",{className:"px-3 py-2",children:"Status"})]})}),t("tbody",{children:N?N.map((a,r)=>e("tr",{children:[t("td",{className:"px-3 py-2",children:r+1}),t("td",{className:"px-3 py-2",children:B(a.tanggal_drop).format("DD-MM-YYYY")}),t("td",{className:"px-3 py-2",children:a.unit}),t("td",{className:"px-3 py-2",children:a.kelompok}),t("td",{className:"px-3 py-2",children:a.mantri_name}),t("td",{className:"px-3 py-2",children:a.customer_name}),t("td",{className:"px-3 py-2",children:t(A,{value:a.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),t("td",{className:"px-3 py-2",children:a.lunas}),t("td",{className:"px-3 py-2",children:a.status=="normal"||a.status=="cm"?t("span",{className:"bg-green-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status}):a.status=="mb"?t("span",{className:"bg-yellow-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status}):t("span",{className:"bg-red-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status})})]},r)):t("tr",{children:t("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]})]}),d?n?t(L,{setLoading:s,max_date:p,min_date:u,emps:h,nik:d,customer_id:n==null?void 0:n.id}):t(T,{setLoading:s,max_date:p,min_date:u,emps:h,nik:d}):""]})})]})]})};export{Z as default};
