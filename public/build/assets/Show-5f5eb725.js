import{r as S,W as C,j as e,a,b as D,d as x}from"./app-5b6f9f0b.js";import{C as P}from"./Checkbox-0d49be85.js";import{I as c}from"./InputError-5b929580.js";import{I as d}from"./InputLabel-de4c3e76.js";import{L as T}from"./LinkButton-81c871ab.js";import{P as Y}from"./PrimaryButton-c890247d.js";import{S as N}from"./SelectList-f0dd00de.js";import{T as F}from"./TextInput-516f049f.js";import{u as g}from"./useServerFilter-8795299f.js";import{A as I}from"./AuthenticatedLayout-9b0af90d.js";import{C as M}from"./index.esm-671163b8.js";import{N as p}from"./react-number-format.es-9f54f8e0.js";import B from"./JenisNasabah-8f42be09.js";import"./button-ab0f3b37.js";import"./utils-36e2ef84.js";import"./index-8a164555.js";import"./createLucideIcon-f58de514.js";import"./SweetAlert-8f979f46.js";import"./react-icons.esm-929697d3.js";import"./index-58caa8d4.js";import"./index-55789df0.js";import"./Loading-505c125f.js";import"./transition-9c1132d9.js";const la=({loan:s,instalment:o,...r})=>{const{emps:b}=g(null,null,null,r.mantri),{status_angsuran:h}=g();S.useState(!1);const u=h.filter(t=>t.display==s.status).reduce((t,l)=>l.value,null),f=h.filter(t=>t.value>=u),{data:n,setData:y,post:v,processing:w,errors:i,reset:k}=C({tanggal_pembayaran:"",jumlah:"",mantri:s.mantri_id,danatitipan:!1,status:u}),m=t=>{y(t.target.name,t.target.type==="checkbox"?t.target.checked:t.target.value)},j=(t,l)=>{y(l,t)},_=t=>{t.preventDefault(),v(route("pinjaman.normal.update",s.id)),k()};return e(I,{auth:r.auth,errors:r.errors,header:"Buku Transaksi",loading:w,children:[a(D,{title:"Buku Transaksi"}),e("div",{className:"relative",children:[a("div",{className:"px-6 py-4 flex justify-end items-center",children:a(T,{color:"outline",as:"a",href:r.back_to_index,title:"Back"})}),a("div",{className:"bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md",children:e("div",{children:[e("div",{className:"mb-3",children:[a("div",{className:"text-lg font-semibold mb-2",children:"Pengajuan Pinjaman"}),a("div",{className:"overflow-hidden mb-3 rounded border border-black/5 shadow p-4",children:e("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap",children:e("tr",{children:[a("th",{className:"px-3 py-2",children:"Nomor Pinjaman"}),a("th",{className:"px-3 py-2",children:"Nama Nasabah"}),a("th",{className:"px-3 py-2",children:"NIK"}),a("th",{className:"px-3 py-2",children:"Unit"}),a("th",{className:"px-3 py-2",children:"Kelompok"}),a("th",{className:"px-3 py-2",children:"Hari"}),a("th",{className:"px-3 py-2",children:"Tanggal Drop"}),a("th",{className:"px-3 py-2",children:"Pinjaman"}),a("th",{className:"px-3 py-2",children:"Nama Mantri"}),a("th",{className:"px-3 py-2",children:"Status"}),a("th",{className:"px-3 py-2",children:"Jenis Nasabah"}),a("th",{className:"px-3 py-2",children:"Lunas"})]})}),a("tbody",{children:s?e("tr",{children:[a("td",{className:"px-3 py-2",children:s.nomor_pinjaman}),a("td",{className:"px-3 py-2",children:s.nama_customer}),a("td",{className:"px-3 py-2",children:s.nik_customer}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:s.unit}),a("td",{className:"px-3 py-2",children:s.kelompok}),a("td",{className:"px-3 py-2",children:s.hari}),a("td",{className:"px-3 py-2",children:x(s.tanggal_drop).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:a(p,{value:s.pinjaman,displayType:"text",thousandSeparator:","})}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:s.mantri}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:s.status}),a("td",{className:"px-3 py-2",children:s.loan_notes}),a("td",{className:"px-3 py-2",children:s.lunas})]},s.nomor_pinjaman):a("tr",{children:a("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]}),e("div",{className:"mb-3 lg:flex justify-between w-full gap-2",children:[e("div",{className:"mb-3 flex-[2] ",children:[a("div",{className:"text-lg font-semibold mb-2",children:"History Pembayaran"}),a("div",{className:"overflow-hidden mb-3 rounded border border-black/5 shadow p-4",children:a("div",{className:"max-h-[50vh] overflow-auto",children:e("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap z-20",children:e("tr",{children:[a("th",{className:"px-3 py-2",children:"Tanggal Pembayaran"}),a("th",{className:"px-3 py-2",children:"Jumlah"}),a("th",{className:"px-3 py-2",children:"Saldo"}),a("th",{className:"px-3 py-2",children:"Dana titipan"}),a("th",{className:"px-3 py-2",children:"Mantri"}),a("th",{className:"px-3 py-2",children:"Status"})]})}),a("tbody",{className:"relative z-10",children:o?o.map((t,l)=>e("tr",{className:"even:bg-gray-50 hover:bg-gray-200",children:[a("td",{className:"px-3 py-2",children:x(t.tanggal_pembayaran).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2",children:a(p,{value:t.jumlah,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),a("td",{className:"px-3 py-2",children:a(p,{value:t.saldo,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),a("td",{className:"px-3 py-2",children:t.danatitipan?"Ya":"-"}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:t.mantri}),a("td",{className:"px-3 py-2",children:t.status})]},l)):a("tr",{children:a("td",{colSpan:3,children:"Belum Ada Pembayaran Ditemukan"})})})]})})})]}),e("div",{className:"mb-3 flex-1",children:[e("div",{className:"mb-3",children:[a("div",{className:"text-lg font-semibold mb-2",children:"Pembayaran Angsuran"}),a("div",{className:"overflow-hidden mb-3 rounded border border-black/5 shadow p-4",children:e("form",{onSubmit:_,className:"max-h-[50vh] overflow-auto",children:[e("div",{className:"mb-1",children:[a(d,{htmlFor:"tanggal_pembayaran",value:"Tanggal Pembayaran"}),a(F,{id:"tanggal_pembayaran",type:"date",name:"tanggal_pembayaran",value:n.tanggal_pembayaran,min:r.min_date,max:r.max_date,className:"mt-1 block w-full",autoComplete:"tanggal_pembayaran",isFocused:!0,onChange:m}),a(c,{message:i.tanggal_pembayaran,className:"mt-2"})]}),e("div",{className:"mb-1",children:[a(d,{htmlFor:"jumlah",value:"Nominal jumlah",className:"mb-1"}),a(M,{name:"jumlah",id:"jumlah",className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:j,value:n.jumlah,placeholder:"Inputkan angka tanpa sparator"}),a(c,{message:i.jumlah,className:"mt-2"})]}),e("div",{className:"mb-1",children:[a(d,{htmlFor:"status",value:"Status"}),a(N,{id:"status",type:"date",name:"status",nullValue:!0,required:!0,options:f,className:"mt-1 block w-full",autoComplete:"status",isFocused:!0,onChange:m}),a(c,{message:i.status,className:"mt-2"})]}),e("div",{className:"mb-1",children:[a(d,{htmlFor:"mantri",value:"Mantri"}),a(N,{id:"mantri",type:"text",name:"mantri",options:b,nullValue:!0,value:n.mantri,className:"mt-1 block w-full",onChange:m}),a(c,{message:i.mantri,className:"mt-2"})]}),e("div",{className:"mb-1 mt-3 flex justify-between items-center",children:[e("label",{className:"flex items-center",children:[a(P,{name:"danatitipan",value:n.danatitipan,onChange:m}),a("span",{className:"ml-2 text-sm text-gray-600",children:"Dana Titipan?"})]}),a(Y,{title:"Submit",type:"submit"})]})]})})]}),a(B,{loan:s})]})]})]})})]})]})};export{la as default};
