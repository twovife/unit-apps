import{r as y,j as t,a,b as w,d as m,c as C}from"./app-894fb644.js";import{I as n}from"./InputLabel-4b35f36f.js";import{L as T}from"./LinkButton-ad3feacf.js";import{P as S}from"./PrimaryButton-28ebe16b.js";import{S as p}from"./SelectList-b22ee93b.js";import{T as h}from"./TextInput-336aec83.js";import{u as L}from"./useServerFilter-d52bab85.js";import{M}from"./MobileLayout-4cc9a99a.js";import{N as F}from"./react-number-format.es-fde60237.js";import"./Loading-b2556a0b.js";import"./transition-dd2a41ee.js";import"./SweetAlert-02741e5d.js";import"./createLucideIcon-fdae9c18.js";import"./react-icons.esm-bacaa70f.js";import"./index-1ee04d40.js";import"./button-9da4f797.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-b32be6a7.js";import"./index-b8da1699.js";const X=({data:c,branch:j,server_filters:r,...s})=>{const{serverFilters:o,onServerFilterChange:i,onServerFilterSubmit:u,loading:N,setLoading:D,mantriMantri:g,transaction_day:x}=L(route().current(),r);console.log(r);const b=r.previledge=="mantri"?[{id:1,value:r.kelompok,display:`Mantri ${r.kelompok}`}]:g,[d,f]=y.useState(""),v=()=>c.filter(e=>{const l=d.toLowerCase();return e.nik.toLowerCase().includes(l)||e.nama.toLowerCase().includes(l)||e.id==l}),k=e=>{f(e.target.value)};return t(M,{auth:s.auth,errors:s.errors,header:"Buku Transaksi",loading:N,children:[a(w,{title:"Buku Transaksi"}),t("div",{className:"mb-3",children:[t("div",{className:"flex justify-between items-center w-full gap-1 flex-wrap",children:[t("div",{className:"flex-1",children:[a(n,{htmlFor:"kelompok",value:"Kelompok"}),a(p,{id:"kelompok",type:"text",onChange:i,name:"kelompok",value:o.kelompok,options:b,className:"mt-1 block w-full",autoComplete:"kelompok"})]}),t("div",{className:"flex-1",children:[a(n,{htmlFor:"hari",value:"Hari"}),a(p,{id:"hari",type:"text",onChange:i,name:"hari",value:o.hari,options:x,className:"mt-1 block w-full",autoComplete:"hari"})]}),t("div",{className:"flex-1",children:[a(n,{htmlFor:"date",value:"Tanggal Pengajuan"}),t("div",{className:"flex text-center items-center gap-1",children:[a("div",{className:"flex-1",children:a(h,{id:"date",type:"month",onChange:i,value:o.date,name:"date",className:"mt-1 block w-full"})}),a(S,{onClick:u,title:"Cari"}),a(T,{color:"blue",as:"a",href:route("mantriapps.index"),title:"Home"})]})]})]}),a("div",{className:"w-full mt-3",children:a(h,{value:d,onChange:k,className:"w-full",placeHolder:"Masukkan NIK / Nama"})})]}),a("div",{className:"overflow-auto rounded shadow-sm max-h-[50vh] lg:max-h-[65vh] border-b-2",children:t("table",{className:"text-sm w-full border",children:[a("thead",{className:"bg-gray-200",children:t("tr",{className:"text-center",children:[a("td",{className:"p-2",children:"Tgl"}),a("td",{className:"p-2",children:"Nasabah"}),a("td",{className:"p-2",children:"Drop"}),a("td",{className:"p-2",children:"Status"}),a("td",{className:"p-2",children:"No. Trans"})]})}),a("tbody",{children:c&&v().map((e,l)=>t("tr",{className:`even:bg-gray-100 text-xs text-center ${e.id==s.id?"bg-green-100":""}`,children:[t("td",{className:"px-2 py-1 text-start",children:[a("div",{className:"font-semibold text-sm"}),t("div",{className:"mb-1 italic font-light whitespace-nowrap",children:[a("span",{className:"capitalize",children:"Pengajuan : "}),e.transaction_date?m(e.transaction_date).format("DD-MM-YY"):"","/"]}),a("div",{className:"mb-1 italic font-light",children:t("span",{className:"capitalize",children:["Drop : ",e.tanggal_drop?m(e.tanggal_drop).format("DD-MM-YY"):""]})})]}),t("td",{className:"px-2 py-1 text-start",children:[a("div",{className:"mb-1 font-semibold",children:e.nama}),a("div",{className:"mb-1",children:e.nik}),a("div",{className:"mb-1 font-light italic",children:e.alamat})]}),a("td",{className:"px-2 py-1 text-end",children:a(F,{value:e.drop,displayType:"text",thousandSeparator:","})}),a("td",{className:"px-2 py-1 text-center",children:a(C,{className:`${e.status=="acc"?"bg-green-500":e.status=="tolak"?"bg-red-500":"bg-blue-500"} px-2 py-1.5 hover:bg-blue-700 text-white hover:cursor-pointer rounded`,href:route("mantriapps.show",e.id),children:e.status})}),a("td",{className:"px-2 py-1",children:a("div",{children:e.id})})]},l))})]})})]})};export{X as default};
