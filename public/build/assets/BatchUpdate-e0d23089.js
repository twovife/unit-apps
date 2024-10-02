import{r as i,j as s,a as t,b as w,d as S,c as m,e as j}from"./app-5028f0e4.js";import{I as C}from"./InputError-a186164f.js";import{I as D}from"./InputLabel-8b13b054.js";import{P as I}from"./PrimaryButton-04e7f072.js";import{T as _}from"./TextInput-d97164c2.js";import{A as B}from"./AuthenticatedLayout-906ca364.js";import{u as T}from"./useServerFilter-b3388aad.js";import{N as A}from"./react-number-format.es-feaff000.js";import E from"./OldCustomer-2f23a90e.js";import F from"./NewCustomer-f61ba7ae.js";import"./Navbar-636b4c95.js";import"./button-6e474809.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-017eb41a.js";import"./createLucideIcon-fb5440a1.js";import"./SweetAlert-2f990cf7.js";import"./react-icons.esm-56e80eae.js";import"./index-9b12ee5b.js";import"./index-7d67727e.js";import"./Loading-ae45eac5.js";import"./transition-3db9c4e8.js";import"./Checkbox-9c1f2e8a.js";import"./SelectList-94666ee8.js";import"./index.esm-bc8b360e.js";const ot=({max_date:u,min_date:h,...c})=>{const{emps:x,status_angsuran:N}=T(null,null,null,c.mantri),[b,e]=i.useState(!1),[g,y]=i.useState(),[f,n]=i.useState(),[o,k]=i.useState(),[p,d]=i.useState(),v=a=>{const r=document.getElementById("nik").value;e(!0),y(),n(),d(),j({method:"post",url:route("transaction.getnik"),data:{nik:r}}).then(function({data:l}){n(l.data),k(l.reqistered_customer),d(r),e(!1)}).catch(function({response:l}){y(l.data.message),n(),d(),e(!1)})};return s(B,{auth:c.auth,errors:c.errors,header:"Buku Transaksi",loading:b,children:[t(w,{title:"Batch Upload"}),t("div",{className:"relative",children:s("div",{className:"flex p-4",children:[s("div",{className:"flex-[2]",children:[s("div",{className:"mb-3",children:[t(D,{htmlFor:"nik",value:"Input Nik Customer"}),s("div",{className:"flex items-center justify-start gap-3 mt-1",children:[t(_,{id:"nik",type:"text",name:"nik",required:!0,className:"block",autoComplete:"nik"}),t(I,{title:"Cek",as:"button",type:"button",onClick:v})]}),t(C,{message:g,className:"mt-2"})]}),p?o?t(E,{status:N,setLoading:e,max_date:u,min_date:h,emps:x,nik:p,url:route("batchupdate.batch_post"),customer_id:o==null?void 0:o.id}):t(F,{status:N,setLoading:e,max_date:u,min_date:h,emps:x,nik:p,url:route("batchupdate.batch_post")}):"",t("div",{className:"mb-3"})]}),t("div",{className:"flex-[3]",children:s("div",{className:"mb-3",children:[t("div",{className:"text-lg font-semibold",children:"History Pinjaman Customer"}),t("div",{className:"p-4 mb-3 overflow-hidden rounded shadow",children:s("table",{className:"w-full text-sm text-left text-gray-500",children:[t("thead",{className:"sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap",children:s("tr",{children:[t("th",{className:"px-3 py-2",children:"No"}),t("th",{className:"px-3 py-2",children:"Tanggal Drop"}),t("th",{className:"px-3 py-2",children:"Unit"}),t("th",{className:"px-3 py-2",children:"Kelompok"}),t("th",{className:"px-3 py-2",children:"Mantri"}),t("th",{className:"px-3 py-2",children:"Nama Customer"}),t("th",{className:"px-3 py-2",children:"Drop"}),t("th",{className:"px-3 py-2",children:"Lunas"}),t("th",{className:"px-3 py-2",children:"Status"})]})}),t("tbody",{children:f?f.map((a,r)=>s("tr",{children:[t("td",{className:"px-3 py-2",children:r+1}),t("td",{className:"px-3 py-2",children:S(a.tanggal_drop).format("DD-MM-YYYY")}),t("td",{className:"px-3 py-2",children:a.unit}),t("td",{className:"px-3 py-2",children:a.kelompok}),t("td",{className:"px-3 py-2",children:a.mantri_name}),t("td",{className:"px-3 py-2",children:a.customer_name}),t("td",{className:"px-3 py-2",children:t(A,{value:a.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),t("td",{className:"px-3 py-2",children:a.lunas}),t("td",{className:"px-3 py-2",children:a.status=="normal"||a.status=="cm"?t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"px-5 py-1 font-semibold text-white uppercase bg-green-400 rounded-lg",children:a.status}):a.status=="mb"?t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"px-5 py-1 font-semibold text-white uppercase bg-yellow-400 rounded-lg",children:a.status}):t(m,{as:"a",href:route("pinjaman.normal.show",a.id),className:"px-5 py-1 font-semibold text-white uppercase bg-red-400 rounded-lg",children:a.status})})]},r)):t("tr",{children:t("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]})})]})})]})};export{ot as default};