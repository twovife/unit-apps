import{r as d,W as I,j as e,a,b as M,d as g}from"./app-c852447f.js";import{C as Y}from"./Checkbox-5c49bc1f.js";import{I as c}from"./InputError-e408823b.js";import{I as p}from"./InputLabel-cfe10492.js";import{L as H}from"./LinkButton-796e2744.js";import{P as L}from"./PrimaryButton-0dec68f2.js";import{S as A}from"./SelectList-abb4228a.js";import{T as B}from"./TextInput-d72b0805.js";import{u as f}from"./useServerFilter-15eb4ebd.js";import{A as F}from"./AuthenticatedLayout-b09b1afa.js";import{C as J}from"./index.esm-0dcdc36d.js";import{N as o}from"./react-number-format.es-0ad3a443.js";import U from"./JenisNasabah-caf24e47.js";import z from"./ModalHapus-6c09d6aa.js";import"./button-f1d79983.js";import"./index-f96983da.js";import"./utils-36e2ef84.js";import"./index-3beca8f3.js";import"./createLucideIcon-88b2e6a4.js";import"./SweetAlert-32246a70.js";import"./react-icons.esm-26840eb3.js";import"./index-71acb7a6.js";import"./index-4a6df377.js";import"./Loading-3cde90b0.js";import"./transition-bebf8616.js";const ha=({loan:t,instalment:h,...l})=>{const{emps:v}=f(null,null,null,l.mantri);f();const[u,w]=d.useState(!1),[k,x]=d.useState(!1),[j,y]=d.useState(null),{data:s,setData:N,post:S,processing:_,errors:n,reset:D}=I({tanggal_pembayaran:"",jumlah:"",mantri:t.mantri_id,danatitipan:!1}),i=r=>{N(r.target.name,r.target.type==="checkbox"?r.target.checked:r.target.value)},C=(r,m)=>{N(m,r)},P=r=>{r.preventDefault(),S(route("pinjaman.normal.update",t.id)),D()},b=r=>{x(!0),y(r)},T=()=>{x(!1),y(null)};return e(F,{auth:l.auth,errors:l.errors,header:"Buku Transaksi",loading:_||u,children:[a(M,{title:"Buku Transaksi"}),e("div",{className:"relative",children:[e("div",{className:"px-6 py-4 flex justify-between items-center",children:[a("button",{onClick:()=>b(route("pinjaman.normal.deleteLoan",t.id)),className:"border border-red-500 text-red-500 px-2 py-1 text-xs rounded",children:"Hapus Pinjaman"}),a(H,{color:"outline",as:"a",href:l.back_to_index,title:"Back"})]}),a("div",{className:"bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md",children:e("div",{children:[e("div",{className:"mb-3",children:[a("div",{className:"text-lg font-semibold mb-2",children:"Pengajuan Pinjaman"}),a("div",{className:"overflow-auto mb-3 rounded border border-black/5 shadow p-4",children:e("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap text-center",children:e("tr",{children:[a("th",{className:"px-3 py-2",children:"Nomor Pinjaman"}),a("th",{className:"px-3 py-2",children:"Nama Nasabah"}),a("th",{className:"px-3 py-2",children:"NIK"}),a("th",{className:"px-3 py-2",children:"Unit"}),a("th",{className:"px-3 py-2",children:"Kelompok"}),a("th",{className:"px-3 py-2",children:"Hari"}),a("th",{className:"px-3 py-2",children:"Tanggal Drop"}),a("th",{className:"px-3 py-2",children:"Pinjaman"}),a("th",{className:"px-3 py-2",children:"Nama Mantri"}),a("th",{className:"px-3 py-2",children:"Status"}),a("th",{className:"px-3 py-2",children:"Jenis Nasabah"}),a("th",{className:"px-3 py-2",children:"Lunas"})]})}),a("tbody",{className:"text-center",children:t?e("tr",{children:[a("td",{className:"px-3 py-2",children:t.nomor_pinjaman}),a("td",{className:"px-3 py-2",children:t.nama_customer}),a("td",{className:"px-3 py-2",children:t.nik_customer}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:t.unit}),a("td",{className:"px-3 py-2",children:t.kelompok}),a("td",{className:"px-3 py-2",children:t.hari}),a("td",{className:"px-3 py-2",children:g(t.tanggal_drop).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:a(o,{value:t.pinjaman,displayType:"text",thousandSeparator:","})}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:t.mantri}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:t.status}),a("td",{className:"px-3 py-2",children:t.loan_notes}),a("td",{className:"px-3 py-2",children:t.lunas})]},t.nomor_pinjaman):a("tr",{children:a("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]}),e("div",{className:"mb-3 lg:flex justify-between w-full gap-2",children:[e("div",{className:"mb-3 flex-[2] ",children:[a("div",{className:"text-lg font-semibold mb-2",children:"History Pembayaran"}),a("div",{className:"overflow-hidden mb-3 rounded border border-black/5 shadow p-4",children:a("div",{className:"max-h-[50vh] overflow-auto",children:e("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap z-20 text-center",children:e("tr",{children:[a("th",{className:"px-3 py-2",children:"Action"}),a("th",{className:"px-3 py-2",children:"Tanggal Pembayaran"}),a("th",{className:"px-3 py-2",children:"Jumlah"}),a("th",{className:"px-3 py-2",children:"Saldo"}),a("th",{className:"px-3 py-2",children:"Dana titipan"}),a("th",{className:"px-3 py-2",children:"Mantri"}),a("th",{className:"px-3 py-2",children:"Status"})]})}),a("tbody",{className:"relative z-10 text-center",children:h?h.map((r,m)=>e("tr",{className:"even:bg-gray-50 hover:bg-gray-200",children:[a("td",{className:"px-3 py-2",children:a("button",{onClick:()=>b(route("pinjaman.normal.deleteAngsuran",r.id)),className:"bg-red-400 px-2 py-1 rounded text-white",children:"Hapus"})}),a("td",{className:"px-3 py-2",children:g(r.tanggal_pembayaran).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2 text-end",children:a(o,{value:r.jumlah,displayType:"text",thousandSeparator:","})}),a("td",{className:"px-3 py-2 text-end",children:a(o,{value:r.saldo,displayType:"text",thousandSeparator:","})}),a("td",{className:"px-3 py-2",children:r.danatitipan}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:r.mantri}),a("td",{className:"px-3 py-2",children:r.status})]},m)):a("tr",{children:a("td",{colSpan:3,children:"Belum Ada Pembayaran Ditemukan"})})})]})})})]}),a(z,{show:k,setShow:T,url:j,loading:u,setLoading:w}),e("div",{className:"mb-3 flex-1",children:[e("div",{className:"mb-3",children:[a("div",{className:"text-lg font-semibold mb-2",children:"Pembayaran Angsuran"}),a("div",{className:"overflow-hidden mb-3 rounded border border-black/5 shadow p-4",children:e("form",{onSubmit:P,className:"max-h-[50vh] overflow-auto",children:[e("div",{className:"mb-1",children:[a(p,{htmlFor:"tanggal_pembayaran",value:"Tanggal Pembayaran"}),a(B,{id:"tanggal_pembayaran",type:"date",name:"tanggal_pembayaran",value:s.tanggal_pembayaran,min:l.min_date,max:l.max_date,className:"mt-1 block w-full",autoComplete:"tanggal_pembayaran",isFocused:!0,onChange:i}),a(c,{message:n.tanggal_pembayaran,className:"mt-2"})]}),e("div",{className:"mb-1",children:[a(p,{htmlFor:"jumlah",value:"Nominal jumlah",className:"mb-1"}),a(J,{name:"jumlah",id:"jumlah",className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:C,value:s.jumlah,placeholder:"Inputkan angka tanpa sparator"}),a(c,{message:n.jumlah,className:"mt-2"})]}),e("div",{className:"mb-1",children:[a(p,{htmlFor:"mantri",value:"Mantri"}),a(A,{id:"mantri",type:"text",name:"mantri",options:v,nullValue:!0,value:s.mantri,className:"mt-1 block w-full",onChange:i}),a(c,{message:n.mantri,className:"mt-2"})]}),e("div",{className:"mb-1 mt-3 flex justify-between items-center",children:[e("label",{className:"flex items-center",children:[a(Y,{name:"danatitipan",value:s.danatitipan,onChange:i}),a("span",{className:"ml-2 text-sm text-gray-600",children:"Dana Titipan?"})]}),a(L,{title:"Submit",type:"submit"})]})]})})]}),a(U,{loan:t})]})]})]})})]})]})};export{ha as default};
