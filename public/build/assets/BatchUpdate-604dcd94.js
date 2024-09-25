import{r as i,j as s,a as t,b as w,d as S,c as m,e as j}from"./app-6f41ea55.js";import{I as C}from"./InputError-b4e0c872.js";import{I as D}from"./InputLabel-52ec6bce.js";import{P as I}from"./PrimaryButton-48a8ef32.js";import{T as _}from"./TextInput-5e359523.js";import{A as B}from"./AuthenticatedLayout-08d06c68.js";import{u as T}from"./useServerFilter-7e6055d6.js";import{N as A}from"./react-number-format.es-e3a92009.js";import E from"./OldCustomer-83c435bd.js";import F from"./NewCustomer-a118a12a.js";import"./button-c3c23cc6.js";import"./utils-36e2ef84.js";import"./index-66872147.js";import"./createLucideIcon-7c9aa304.js";import"./SweetAlert-44be5df9.js";import"./react-icons.esm-1bb75465.js";import"./index-6fff1c53.js";import"./index-3568c39e.js";import"./Loading-8a7dd92c.js";import"./transition-31f369b9.js";import"./Checkbox-d7e2dac8.js";import"./SelectList-2c850a5f.js";import"./index.esm-ea129bf0.js";const rt=({max_date:u,min_date:h,...c})=>{const{emps:x,status_angsuran:N}=T(null,null,null,c.mantri),[b,e]=i.useState(!1),[g,y]=i.useState(),[f,n]=i.useState(),[o,k]=i.useState(),[p,d]=i.useState(),v=a=>{const r=document.getElementById("nik").value;e(!0),y(),n(),d(),j({method:"post",url:route("transaction.getnik"),data:{nik:r}}).then(function({data:l}){n(l.data),k(l.reqistered_customer),d(r),e(!1)}).catch(function({response:l}){y(l.data.message),n(),d(),e(!1)})};return s(B,{auth:c.auth,errors:c.errors,header:"Buku Transaksi",loading:b,children:[t(w,{title:"Batch Upload"}),t("div",{className:"relative",children:s("div",{className:"p-4 flex",children:[s("div",{className:"flex-[2]",children:[s("div",{className:"mb-3",children:[t(D,{htmlFor:"nik",value:"Input Nik Customer"}),s("div",{className:"flex items-center justify-start gap-3 mt-1",children:[t(_,{id:"nik",type:"text",name:"nik",required:!0,className:"block",autoComplete:"nik"}),t(I,{title:"Cek",as:"button",type:"button",onClick:v})]}),t(C,{message:g,className:"mt-2"})]}),p?o?t(E,{status:N,setLoading:e,max_date:u,min_date:h,emps:x,nik:p,url:route("batchupdate.batch_post"),customer_id:o==null?void 0:o.id}):t(F,{status:N,setLoading:e,max_date:u,min_date:h,emps:x,nik:p,url:route("batchupdate.batch_post")}):"",t("div",{className:"mb-3"})]}),t("div",{className:"flex-[3]",children:s("div",{className:"mb-3",children:[t("div",{className:"text-lg font-semibold",children:"History Pinjaman Customer"}),t("div",{className:"overflow-hidden mb-3 rounded shadow p-4",children:s("table",{className:"w-full text-sm text-left text-gray-500",children:[t("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap",children:s("tr",{children:[t("th",{className:"px-3 py-2",children:"No"}),t("th",{className:"px-3 py-2",children:"Tanggal Drop"}),t("th",{className:"px-3 py-2",children:"Unit"}),t("th",{className:"px-3 py-2",children:"Kelompok"}),t("th",{className:"px-3 py-2",children:"Mantri"}),t("th",{className:"px-3 py-2",children:"Nama Customer"}),t("th",{className:"px-3 py-2",children:"Drop"}),t("th",{className:"px-3 py-2",children:"Lunas"}),t("th",{className:"px-3 py-2",children:"Status"})]})}),t("tbody",{children:f?f.map((a,r)=>s("tr",{children:[t("td",{className:"px-3 py-2",children:r+1}),t("td",{className:"px-3 py-2",children:S(a.tanggal_drop).format("DD-MM-YYYY")}),t("td",{className:"px-3 py-2",children:a.unit}),t("td",{className:"px-3 py-2",children:a.kelompok}),t("td",{className:"px-3 py-2",children:a.mantri_name}),t("td",{className:"px-3 py-2",children:a.customer_name}),t("td",{className:"px-3 py-2",children:t(A,{value:a.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),t("td",{className:"px-3 py-2",children:a.lunas}),t("td",{className:"px-3 py-2",children:a.status=="normal"||a.status=="cm"?t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"bg-green-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status}):a.status=="mb"?t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"bg-yellow-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status}):t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"bg-red-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",children:a.status})})]},r)):t("tr",{children:t("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]})})]})})]})};export{rt as default};