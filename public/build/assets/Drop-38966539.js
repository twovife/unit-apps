import{r as x,j as t,a as e,d as k}from"./app-51991a42.js";import{I as c}from"./InputLabel-4693d0ab.js";import{L as y}from"./LinkButton-d11e99cf.js";import{P as w}from"./PrimaryButton-28fcbfcc.js";import{S as C}from"./SelectList-7098a124.js";import{T as m}from"./TextInput-54aa262b.js";import{u as S}from"./useServerFilter-17471464.js";import{M as D}from"./MobileLayout-f563df25.js";import{d as p}from"./dayjs.min-22669388.js";import{N as L}from"./react-number-format.es-6c997f89.js";import"./Loading-3f527b09.js";import"./transition-69eb0433.js";import"./index-c1d39eb0.js";const q=({data:o,branch:T,server_filters:l,...s})=>{const{serverFilters:n,onServerFilterChange:d,onServerFilterSubmit:h,loading:u,setLoading:M,mantriMantri:N}=S(route().current(),l),b=l.previledge=="mantri"?[{id:1,value:l.kelompok,display:l.kelompok}]:N,[i,g]=x.useState(""),f=()=>o.filter(a=>{const r=i.toLowerCase();return a.nik.toLowerCase().includes(r)||a.nama.toLowerCase().includes(r)||a.id==r}),v=a=>{g(a.target.value)};return t(D,{auth:s.auth,errors:s.errors,header:"Drop Harians",loading:u,children:[t("div",{className:"mb-3",children:[t("div",{className:"w-full",children:[e(c,{htmlFor:"kelompok",value:"Kelompok"}),e(C,{id:"kelompok",type:"text",onChange:d,name:"kelompok",value:n.kelompok,options:b,className:"mt-1 block w-full",autoComplete:"kelompok"})]}),t("div",{className:"mt-3 w-full",children:[e(c,{htmlFor:"date",value:"Tanggal Drop"}),t("div",{className:"flex text-center items-center gap-1",children:[e("div",{className:"flex-1",children:e(m,{id:"date",disabled:!0,type:"date",onChange:d,value:n.date,name:"date",className:"mt-1 block w-full"})}),e(w,{onClick:h,title:"Cari"}),e(y,{color:"blue",as:"a",href:route("mantriapps.index"),title:"Home"})]})]}),e("div",{className:"w-full mt-3",children:e(m,{value:i,onChange:v,className:"w-full",placeHolder:"Masukkan NIK / Nama"})})]}),e("div",{className:"overflow-auto rounded shadow-sm max-h-[50vh] border-b-2",children:t("table",{className:"text-sm w-full border",children:[e("thead",{className:"bg-gray-200",children:t("tr",{className:"text-center",children:[e("td",{className:"p-2",children:"Tgl"}),e("td",{className:"p-2",children:"Nasabah"}),e("td",{className:"p-2",children:"Drop"}),e("td",{className:"p-2",children:"Status"}),e("td",{className:"p-2",children:"No. Trans"})]})}),e("tbody",{children:o&&f().map((a,r)=>t("tr",{className:`even:bg-gray-100 text-xs text-center ${a.id==s.id?"bg-green-100":""}`,children:[t("td",{className:"px-2 py-1 text-start",children:[e("div",{className:"font-semibold text-sm"}),t("div",{className:"mb-1 italic font-light whitespace-nowrap",children:[t("span",{className:"capitalize",children:[a.hari,","]}),a.transaction_date?p(a.transaction_date).format("DD-MM-YY"):"","/"]}),e("div",{className:"mb-1 italic font-light",children:t("span",{className:"capitalize",children:["Drop : ",a.tanggal_drop?p(a.tanggal_drop).format("DD-MM-YY"):""]})})]}),t("td",{className:"px-2 py-1 text-start",children:[e("div",{className:"mb-1 font-semibold",children:a.nama}),e("div",{className:"mb-1",children:a.nik}),e("div",{className:"mb-1 font-light italic",children:a.alamat})]}),e("td",{className:"px-2 py-1 text-end",children:e(L,{value:a.drop,displayType:"text",thousandSeparator:","})}),e("td",{className:"px-2 py-1 text-center",children:e(k,{className:`${a.status=="acc"?"bg-green-500":a.status=="tolak"?"bg-red-500":"bg-blue-500"} px-2 py-1.5 hover:bg-blue-700 text-white hover:cursor-pointer rounded`,href:route("mantriapps.show_drop",a.id),children:a.status})}),e("td",{className:"px-2 py-1",children:e("div",{children:a.id})})]},r))})]})})]})};export{q as default};