import{q as o,r as x,j as s,a,b as y,d as n,F as N,y as g}from"./app-c852447f.js";import{L as u}from"./LinkButton-796e2744.js";import{A as b}from"./AuthenticatedLayout-b09b1afa.js";import"./index.esm-0dcdc36d.js";import"./TextInput-d72b0805.js";import{N as t}from"./react-number-format.es-0ad3a443.js";import"./button-f1d79983.js";import"./index-f96983da.js";import"./utils-36e2ef84.js";import"./index-3beca8f3.js";import"./createLucideIcon-88b2e6a4.js";import"./SweetAlert-32246a70.js";import"./react-icons.esm-26840eb3.js";import"./index-71acb7a6.js";import"./index-4a6df377.js";import"./Loading-3cde90b0.js";import"./transition-bebf8616.js";const L=({requesttoApprove:l,loanHistory:d,requestHistory:p,...c})=>{o();const[h,i]=x.useState(!1),r=e=>{g.put(route("transaction.update",l.id),{action:e},{onStart:()=>i(!0),onFinish:()=>i(!1)})};return s(b,{auth:c.auth,errors:c.errors,header:"Buku Transaksi",loading:h,children:[a(y,{title:"Buku Transaksi"}),s("div",{className:"relative",children:[a("div",{className:"flex items-center justify-end px-6 py-4",children:a(u,{color:"outline",as:"a",href:c.back_to_index,title:"Back"})}),a("div",{className:"px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5",children:s("div",{children:[s("div",{className:"mb-3",children:[a("div",{className:"mb-2 text-lg font-semibold",children:"Pengajuan Pinjaman"}),a("div",{className:"p-4 mb-3 overflow-auto border rounded shadow border-black/5",children:s("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap",children:s("tr",{children:[a("th",{className:"px-3 py-2",children:"Tanggal Pengajuan"}),a("th",{className:"px-3 py-2",children:"Nomor Pinjaman"}),a("th",{className:"px-3 py-2",children:"Nama Customer"}),a("th",{className:"px-3 py-2",children:"NIK"}),a("th",{className:"px-3 py-2",children:"Alamat"}),a("th",{className:"px-3 py-2",children:"Unit"}),a("th",{className:"px-3 py-2",children:"Kelompok"}),a("th",{className:"px-3 py-2",children:"Hari"}),a("th",{className:"px-3 py-2",children:"Drop"}),a("th",{className:"px-3 py-2",children:"Tanggal Drop"}),a("th",{className:"px-3 py-2",children:"Nama Mantri"}),a("th",{className:"px-3 py-2",children:"Pengajuan Ke"}),a("th",{className:"px-3 py-2",children:"Action"})]})}),a("tbody",{children:l?s("tr",{children:[a("td",{className:"px-3 py-2",children:n(l.tanggal_pengajuan).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2",children:l.id}),a("td",{className:"px-3 py-2",children:l.customer_name}),a("td",{className:"px-3 py-2",children:l.customer_nik}),a("td",{className:"px-3 py-2 max-w-36",children:l.customer_alamat}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:l.unit}),a("td",{className:"px-3 py-2",children:l.kelompok}),a("td",{className:"px-3 py-2",children:l.hari}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:a(t,{value:l.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),a("td",{className:"px-3 py-2",children:n(l.tanggal_drop).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:l.mantri_name}),a("td",{className:"px-3 py-2",children:l.pengajuan_ke}),a("td",{className:"px-3 py-2",children:l.status=="open"?s("div",{className:"flex items-center justify-center gap-2",children:[a("button",{className:"px-2 py-1 text-xs bg-green-200 rounded hover:bg-green-300",type:"button",onClick:()=>r(1),children:"Terima"}),a("button",{className:"px-2 py-1 text-xs bg-red-200 rounded hover:bg-red-300",type:"button",onClick:()=>r(2),children:"Tolak"})]}):a("div",{className:"flex items-center justify-center gap-2",children:l.status=="acc"?s(N,{children:[a("div",{className:"text-green-600",children:"Acc"}),l.instalment==0&&a("button",{className:"px-2 py-1 text-xs bg-red-200 rounded hover:bg-red-300",type:"button",onClick:()=>r(3),children:"Batalkan"})]}):l.status=="tolak"?a("div",{children:"ditolak"}):""})})]},l.id):a("tr",{children:a("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]}),s("div",{className:"mb-3",children:[a("div",{className:"mb-2 text-lg font-semibold",children:"History Pinjaman"}),a("div",{className:"p-4 mb-3 overflow-auto border rounded shadow border-black/5",children:s("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap",children:s("tr",{children:[a("th",{className:"px-3 py-2",children:"Nomor Pinjaman"}),a("th",{className:"px-3 py-2",children:"Tanggal Drop"}),a("th",{className:"px-3 py-2",children:"Hari"}),a("th",{className:"px-3 py-2",children:"Unit"}),a("th",{className:"px-3 py-2",children:"Kelompok"}),a("th",{className:"px-3 py-2",children:"Mantri"}),a("th",{className:"px-3 py-2",children:"Drop"}),a("th",{className:"px-3 py-2",children:"Pinjaman"}),a("th",{className:"px-3 py-2",children:"JML Angsuran"}),a("th",{className:"px-3 py-2",children:"Saldo"}),a("th",{className:"px-3 py-2",children:"Pinjaman Ke"}),a("th",{className:"px-3 py-2",children:"Status"})]})}),a("tbody",{children:d?d.map((e,m)=>s("tr",{className:"even:bg-gray-50 hover:bg-gray-200",children:[a("td",{className:"px-3 py-2",children:e.id}),a("td",{className:"px-3 py-2",children:n(e.tanggal_pengajuan).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2",children:e.hari}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:e.unit}),a("td",{className:"px-3 py-2",children:e.kelompok}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:e.mantri_name}),a("td",{className:"px-3 py-2",children:a(t,{value:e.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),a("td",{className:"px-3 py-2",children:a(t,{value:e.pinjaman,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:e.juml_pembayaran}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:a(t,{value:e.saldo,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:e.pinjaman_ke}),a("td",{className:"px-3 py-2",children:a("span",{className:`px-2 py-1 rounded ${e.status=="normal"||e.status=="cm"?"bg-green-200":e.status=="mb"?"bg-yellow-200":e.status=="ml"?"bg-red-200":""}`,children:e.status})})]},e.key)):a("tr",{children:a("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]}),s("div",{className:"mb-3",children:[a("div",{className:"mb-2 text-lg font-semibold",children:"History Pengajuan Sebelumnya"}),a("div",{className:"p-4 mb-3 overflow-auto border rounded shadow border-black/5",children:s("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap",children:s("tr",{children:[a("th",{className:"px-3 py-2",children:"Nomor Pinjaman"}),a("th",{className:"px-3 py-2",children:"Tanggal Drop"}),a("th",{className:"px-3 py-2",children:"Hari"}),a("th",{className:"px-3 py-2",children:"Unit"}),a("th",{className:"px-3 py-2",children:"Kelompok"}),a("th",{className:"px-3 py-2",children:"Mantri"}),a("th",{className:"px-3 py-2",children:"Drop"}),a("th",{className:"px-3 py-2",children:"Pinjaman Ke"}),a("th",{className:"px-3 py-2",children:"Status"})]})}),a("tbody",{children:p?p.map((e,m)=>s("tr",{className:"even:bg-gray-50 hover:bg-gray-200",children:[a("td",{className:"px-3 py-2",children:e.id}),a("td",{className:"px-3 py-2",children:n(e.tanggal_pengajuan).format("DD-MM-YYYY")}),a("td",{className:"px-3 py-2",children:e.hari}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:e.unit}),a("td",{className:"px-3 py-2",children:e.kelompok}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:e.mantri_name}),a("td",{className:"px-3 py-2",children:a(t,{value:e.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:e.pengajuan_ke}),a("td",{className:"px-3 py-2",children:a("span",{className:`px-2 py-1 rounded ${e.status=="acc"?"bg-green-200":e.status=="tolak"?"bg-red-200":""}`,children:e.status})})]},e.key)):a("tr",{children:a("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]})]})})]})]})};export{L as default};