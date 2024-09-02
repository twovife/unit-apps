import{q as N,r as g,j as e,a,b as f,d,F as y,y as b}from"./app-5b6f9f0b.js";import{L as u}from"./LinkButton-81c871ab.js";import{N as n}from"./react-number-format.es-9f54f8e0.js";import{M as v}from"./MobileLayout-94c752bd.js";import"./Loading-505c125f.js";import"./transition-9c1132d9.js";import"./SweetAlert-8f979f46.js";import"./createLucideIcon-f58de514.js";import"./react-icons.esm-929697d3.js";import"./index-58caa8d4.js";import"./button-ab0f3b37.js";import"./utils-36e2ef84.js";import"./index-55789df0.js";import"./index-daa5f6af.js";const C=({requesttoApprove:s,loanHistory:r,requestHistory:t,can_edit:m,...c})=>{const{progress:o}=N();console.log(o);const[p,h]=g.useState(!1),i=l=>{b.put(route("mantriapps.update",s.id),{action:l},{onStart:()=>h(!0),onFinish:()=>h(!1)})};return e(v,{auth:c.auth,errors:c.errors,header:"Buku Transaksi",loading:p,children:[a(f,{title:"Buku Transaksi"}),e("div",{className:"mb-3",children:[e("div",{className:"mb-3 flex justify-between items-center",children:[a("div",{className:"font-semibold underline ",children:"Pengajuan Pinjaman"}),a(u,{color:"blue",as:"a",href:c.back_to_index,title:"Back"})]}),e("div",{className:"space-y-2 mb-3",children:[e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Hari, Tanggal Pengajuan"}),a("div",{className:"flex-[1]",children:":"}),e("div",{className:"flex-[5]",children:[a("span",{className:"capitalize",children:s.hari}),", ",d(s.tanggal_pengajuan).format("DD-MM-YYYY")]})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Hari, Tanggal Drop"}),a("div",{className:"flex-[1]",children:":"}),e("div",{className:"flex-[5]",children:[a("span",{className:"capitalize",children:s.hari}),", ",d(s.tanggal_drop).format("DD-MM-YYYY")]})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Nomor Pinjaman"}),a("div",{className:"flex-[1]",children:":"}),a("div",{className:"flex-[5]",children:s.id})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Nomor Nasabah"}),a("div",{className:"flex-[1]",children:":"}),e("div",{className:"flex-[5]",children:[s.customer_name,e("span",{className:"font-light italic text-gray-500",children:[" (",s.customer_nik,")"]})]})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Alamat"}),a("div",{className:"flex-[1]",children:":"}),a("div",{className:"flex-[5]",children:s.customer_alamat})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Permintaan Drop"}),a("div",{className:"flex-[1]",children:":"}),a("div",{className:"flex-[5]",children:a(n,{value:s.drop,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Unit / Kelompok"}),a("div",{className:"flex-[1]",children:":"}),e("div",{className:"flex-[5]",children:[s.unit," / Kelompok ",s.kelompok]})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Mantri"}),a("div",{className:"flex-[1]",children:":"}),a("div",{className:"flex-[5]",children:s.mantri_name})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Pengajuan Ke"}),a("div",{className:"flex-[1]",children:":"}),a("div",{className:"flex-[5]",children:s.pengajuan_ke})]}),e("div",{className:"flex",children:[a("div",{className:"flex-[3]",children:"Status"}),a("div",{className:"flex-[1]",children:":"}),a("div",{className:"flex-[5]",children:a("span",{className:`px-2 py-1 rounded border ${s.status=="open"?"bg-gray-200":s.status=="acc"?"bg-green-200":s.status=="tolak"?"bg-red-200":"bg-gray-200"}`,children:s.status})})]})]}),a("div",{className:"flex justify-end items-center",children:m&&s.status=="open"?e("div",{className:"flex items-center justify-center gap-2",children:[a("button",{className:"bg-green-200 py-1 px-2 rounded hover:bg-green-300 border border-green-300",type:"button",onClick:()=>i(1),children:"Terima"}),a("button",{className:"bg-red-200 py-1 px-2 rounded hover:bg-red-300 border border-red-300",type:"button",onClick:()=>i(2),children:"Tolak"})]}):a("div",{className:"flex items-center justify-center gap-2",children:s.status=="acc"?e(y,{children:[a("div",{className:"text-green-600",children:"Acc"}),s.instalment==0&&a("button",{className:"bg-red-200 py-1 px-2 rounded hover:bg-red-300 border border-red-300",type:"button",onClick:()=>i(3),children:"Batalkan"})]}):s.status=="tolak"?a("div",{children:"ditolak"}):""})})]}),a("div",{className:"relative",children:a("div",{className:"bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md",children:e("div",{children:[e("div",{className:"mb-3",children:[a("div",{className:"text-lg font-semibold mb-2",children:"History Pinjaman"}),a("div",{className:"overflow-hidden mb-3 rounded border border-black/5 shadow p-4",children:e("table",{className:"w-full text-xs text-left text-gray-500",children:[a("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap",children:e("tr",{children:[a("th",{className:"px-1 py-1",children:"No"}),a("th",{className:"px-1 py-1",children:"Tanggal Drop"}),a("th",{className:"px-1 py-1",children:"Unit / Mantri"}),a("th",{className:"px-1 py-1",children:"Drop"}),a("th",{className:"px-1 py-1",children:"Status"})]})}),a("tbody",{children:r?r.map((l,x)=>e("tr",{className:"even:bg-gray-50 hover:bg-gray-200",children:[a("td",{className:"px-1 py-1",children:l.id}),a("td",{className:"px-1 py-1 whitespace-nowrap",children:e("div",{className:"capitalize mb-1",children:[l.hari,", ",d(l.tanggal_drop).format("DD-MM-YY")]})}),e("td",{className:"px-1 py-1 whitespace-nowrap",children:[a("div",{children:l.unit}),e("div",{children:[l.mantri_name," ",l.kelompok]})]}),a("td",{className:"px-1 py-1 whitespace-nowrap",children:a(n,{value:l.drop,displayType:"text",thousandSeparator:","})}),a("td",{className:"px-1 py-1",children:a("span",{className:`px-2 py-1 rounded ${l.status=="normal"||l.status=="cm"?"bg-green-200":l.status=="mb"?"bg-yellow-200":l.status=="ml"?"bg-red-200":""}`,children:l.status})})]},l.key)):a("tr",{children:a("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]}),e("div",{className:"mb-3",children:[a("div",{className:"text-lg font-semibold mb-2",children:"History Pengajuan Sebelumnya"}),a("div",{className:"overflow-hidden mb-3 rounded border border-black/5 shadow p-4",children:e("table",{className:"w-full text-sm text-left text-gray-500",children:[a("thead",{className:"text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap",children:e("tr",{children:[a("th",{className:"px-3 py-2",children:"No"}),a("th",{className:"px-3 py-2",children:"Tanggal Drop"}),a("th",{className:"px-3 py-2",children:"Unit"}),a("th",{className:"px-3 py-2",children:"Mantri"}),a("th",{className:"px-3 py-2",children:"Drop"}),a("th",{className:"px-3 py-2",children:"Status"})]})}),a("tbody",{children:t?t.map((l,x)=>e("tr",{className:"even:bg-gray-50 hover:bg-gray-200 text-xs",children:[a("td",{className:"px-3 py-2",children:l.id}),e("td",{className:"px-3 py-2",children:[l.hari,", ",d(l.tanggal_pengajuan).format("DD-MM-YYYY")]}),a("td",{className:"px-3 py-2 whitespace-nowrap",children:l.unit}),e("td",{className:"px-3 py-2",children:[l.mantri_name," -"," ",l.kelompok]}),a("td",{className:"px-3 py-2",children:a(n,{value:l.drop,displayType:"text",thousandSeparator:","})}),a("td",{className:"px-3 py-2",children:a("span",{className:`px-2 py-1 rounded ${l.status=="acc"?"bg-green-200":l.status=="tolak"?"bg-red-200":""}`,children:l.status})})]},l.key)):a("tr",{children:a("td",{colSpan:3,children:"Data tidak ditemukan"})})})]})})]})]})})})]})};export{C as default};
