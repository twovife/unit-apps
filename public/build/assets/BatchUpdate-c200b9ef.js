import{r as i,j as s,a as t,b as w,d as m,c as S}from"./app-c2fdeeef.js";import{I as j}from"./InputError-86b0022b.js";import{I as C}from"./InputLabel-4093411e.js";import{P as D}from"./PrimaryButton-bfa9ba04.js";import{T as I}from"./TextInput-a78071f8.js";import{A as _}from"./AuthenticatedLayout-6fd87b0f.js";import{d as B}from"./dayjs.min-5868073a.js";import{u as T}from"./useServerFilter-cafa312c.js";import{N as A}from"./react-number-format.es-733a9385.js";import E from"./OldCustomer-c59d2994.js";import F from"./NewCustomer-135f8c99.js";import"./button-c3d083fb.js";import"./utils-36e2ef84.js";import"./index-ab58e90b.js";import"./createLucideIcon-b534cceb.js";import"./SweetAlert-d0db66ed.js";import"./react-icons.esm-54b37c86.js";import"./index-efd1f812.js";import"./index-ebe8d1ac.js";import"./Loading-bfc8c4ad.js";import"./transition-ade3a8b7.js";import"./Checkbox-6dfb5de7.js";import"./SelectList-bd1c94f0.js";import"./index.esm-50121a70.js";const it=({max_date:u,min_date:h,...c})=>{const{emps:x,status_angsuran:N}=T(null,null,null,c.mantri),[b,e]=i.useState(!1),[g,y]=i.useState(),[f,n]=i.useState(),[o,k]=i.useState(),[p,d]=i.useState(),v=a=>{const r=document.getElementById("nik").value;e(!0),y(),n(),d(),S({method:"post",url:route("transaction.getnik"),data:{nik:r}}).then(function({data:l}){n(l.data),k(l.reqistered_customer),d(r),e(!1)}).catch(function({response:l}){y(l.data.message),n(),d(),e(!1)})};return s(_,{auth:c.auth,errors:c.errors,header:"Buku Transaksi",loading:b,children:[t(w,{title:"Batch Upload"}),t("div",{className:"relative",children:s("div",{className:"p-4 flex",children:[s("div",{className:"flex-[2]",children:[s("div",{className:"mb-3",children:[t(C,{htmlFor:"nik",value:"Input Nik Customer"}),s("div",{className:"flex items-center justify-start gap-3 mt-1",children:[t(I,{id:"nik",type:"text",name:"nik",required:!0,className:"block",autoComplete:"nik"}),t(D,{title:"Cek",as:"button",type:"button",onClick:v})]}),t(j,{message:g,className:"mt-2"})]}),p?o?t(E,{status:N,setLoading:e,max_date:u,min_date:h,emps:x,nik:p,url:route("batchupdate.batch_post"),customer_id:o==null?void 0:o.id}):t(F,{status:N,setLoading:e,max_date:u,min_date:h,emps:x,nik:p,url:route("batchupdate.batch_post")}):"",t("div",{className:"mb-3"})]}),t("div",{className:"flex-[3]",children:s("div",{className:"mb-3",children:[t("div",{className:"text-lg font-semibold",children:"History Pinjaman Customer"}),t("div",{className:"overflow-hidden mb-3 rounded shadow p-4",children:s("table",{className:"w-full text-sm text-left text-gray-500",children:[t("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap",children:s("tr",{children:[t("th",{className:"px-3 py-2",children:"No"}),t("th",{className:"px-3 py-2",children:"Tanggal Drop"}),t("th",{className:"px-3 py-2",children:"Unit"}),t("th",{className:"px-3 py-2",children:"Kelompok"}),t("th",{className:"px-3 py-2",children:"Mantri"}),t("th",{className:"px-3 py-2",children:"Nama Customer"}),t("th",{className:"px-3 py-2",children:"Drop"}),t("th",{className:"px-3 py-2",children:"Lunas"}),t("th",{className:"px-3 py-2",children:"Status"})]})}),t("tbody",{children:f?f.map((a,r)=>s("tr",{children:[t("td",{className:"px-3 py-2",children:r+1}),t("td",{className:"px-3 py-2",children:B(a.tanggal_drop).format("DD-MM-YYYY")}),t("td",{className:"px-3 py-2",children:a.unit}),t("td",{className:"px-3 py-2",children:a.kelompok}),t("td",{className:"px-3 py-2",children:a.mantri_name}),t("td",{className:"px-3 py-2",children:a.customer_name}),t("td",{className:"px-3 py-2",children:t(A,{value:a.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),t("td",{className:"px-3 py-2",children:a.lunas}),t("td",{className:"px-3 py-2",children:a.status=="normal"||a.status=="cm"?t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"bg-green-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status}):a.status=="mb"?t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"bg-yellow-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status}):t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"bg-red-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status})})]},r)):t("tr",{children:t("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]})})]})})]})};export{it as default};
