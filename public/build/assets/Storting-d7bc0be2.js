import{r as g,j as r,a as e,d as y}from"./app-260c0bfe.js";import{I as c}from"./InputLabel-0ea8f1da.js";import{L as k}from"./LinkButton-3b4464a6.js";import{P as w}from"./PrimaryButton-bbd7e23e.js";import{S}from"./SelectList-25f06bd4.js";import{T as m}from"./TextInput-fcf21a9f.js";import{u as j}from"./useServerFilter-94f34783.js";import{M as C}from"./MobileLayout-f8540d22.js";import{d as L}from"./dayjs.min-de438db8.js";import{N as s}from"./react-number-format.es-ffe68996.js";import"./Loading-8e6a41be.js";import"./transition-7550f544.js";import"./index-d23eb06d.js";const q=({data:i,server_filters:t,...n})=>{const{serverFilters:o,onServerFilterChange:p,onServerFilterSubmit:h,loading:u,setLoading:T,mantriMantri:b,transaction_day:F}=j(route().current(),t),v=t.previledge=="mantri"?[{id:1,value:t.kelompok,display:t.kelompok}]:b,[d,N]=g.useState(""),f=()=>i.filter(a=>{const l=d.toLowerCase();return a.nik.toLowerCase().includes(l)||a.nama.toLowerCase().includes(l)||a.id==l}),x=a=>{N(a.target.value)};return r(C,{auth:n.auth,errors:n.errors,header:"Drop Harians",loading:u,children:[r("div",{className:"mb-3",children:[r("div",{className:"flex justify-between items-center w-full gap-1 flex-wrap",children:[r("div",{className:"flex-1",children:[e(c,{htmlFor:"kelompok",value:"Kelompok"}),e(S,{id:"kelompok",type:"text",onChange:p,name:"kelompok",value:o.kelompok,options:v,className:"mt-1 block w-full",autoComplete:"kelompok"})]}),r("div",{className:"flex-1",children:[e(c,{htmlFor:"hari",value:"Hari"}),r("div",{className:"flex text-center items-center gap-1",children:[e("div",{className:"flex-1",children:e(m,{value:o.hari,disabled:!0})}),e(w,{onClick:h,title:"Cari"}),e(k,{color:"blue",as:"a",href:route("mantriapps.index"),title:"Home"})]})]})]}),e("div",{className:"w-full mt-3",children:e(m,{value:d,onChange:x,className:"w-full",placeholder:"Masukkan NIK / Nama"})})]}),e("div",{className:"overflow-auto rounded shadow-lg max-h-[50vh] border-b-2 border-2 border-white/50",children:r("table",{className:"text-sm w-full border",children:[e("thead",{className:"bg-gray-200",children:r("tr",{className:"text-center",children:[e("td",{className:"p-2",children:"Tgl"}),e("td",{className:"p-2",children:"Nasabah"}),e("td",{className:"p-2",children:"Pinjaman"}),e("td",{className:"p-2",children:"Status"})]})}),e("tbody",{children:i&&f().map((a,l)=>r("tr",{className:`text-xs ${a.is_paid?"even:bg-green-100 bg-green-100":"even:bg-gray-100"}`,children:[e("td",{className:"px-2 py-1",children:e("div",{className:"mb-1 italic font-light",children:e("span",{className:"capitalize",children:a.tanggal_drop?L(a.tanggal_drop).format("DD-MM"):""})})}),r("td",{className:"px-2 py-1",children:[e("div",{className:"mb-1 font-semibold",children:a.nama}),e("div",{className:"mb-1",children:a.nik}),e("div",{className:"mb-1 font-light italic",children:a.alamat})]}),e("td",{className:"px-2 py-1 text-end",children:r("div",{className:"text-xs",children:[r("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pinj"}),e(s,{value:a.pinjaman,displayType:"text",thousandSeparator:","})]}),r("div",{className:"flex justify-between mb-1 border-b-black border-b-2",children:[e("div",{children:"Angs"}),e(s,{value:a.total_angsuran,displayType:"text",thousandSeparator:","})]}),r("div",{className:"flex justify-between",children:[e("div",{children:"Saldo"}),e(s,{value:a.saldo_ansuran,displayType:"text",thousandSeparator:","})]})]})}),e("td",{className:"px-2 py-1 text-center",children:e(y,{className:"bg-blue-500 px-2 py-1.5 hover:bg-blue-700 text-white hover:cursor-pointer rounded",href:route("mantriapps.bayar",a.id),children:a.status})})]},l))})]})})]})};export{q as default};
