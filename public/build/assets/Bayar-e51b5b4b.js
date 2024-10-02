import{W as k,j as a,a as e,b as w,d as p}from"./app-ae52ec07.js";import{L as j}from"./LinkButton-2530469c.js";import{N as c}from"./react-number-format.es-7b2605ae.js";import{M as C}from"./MobileLayout-cd18cc01.js";import{I as u}from"./InputLabel-5f6bda1f.js";import{T as _}from"./TextInput-f41f2f4a.js";import{C as M}from"./index.esm-adfb63fe.js";import{u as I}from"./useServerFilter-817f2401.js";import{P as D}from"./PrimaryButton-ad0a1a2f.js";import{C as S}from"./Checkbox-53129a28.js";import{I as f}from"./InputError-ed161ac0.js";import"./Loading-c16ef2a1.js";import"./transition-35635860.js";import"./SweetAlert-bbaabdd4.js";import"./createLucideIcon-494c28e3.js";import"./react-icons.esm-e24aa064.js";import"./index-ccc745c0.js";import"./button-9abb5f3a.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-83f244ef.js";import"./index-ea66e8bf.js";const Z=({loan:t,...l})=>{var o;const{status_angsuran:x}=I();x.filter(s=>s.value>=t.status);const{data:i,setData:m,post:N,processing:v,errors:n,reset:b}=k({danatitipan:!1,jumlah:0,pembayaran_date:""});console.log(n);const h=s=>{m(s.target.name,s.target.type==="checkbox"?s.target.checked:s.target.value)},g=(s,r)=>{m(r,parseInt(s))},y=s=>{s.preventDefault(),N(l.post_route,{onSuccess:()=>b()})};let d=t.pinjaman;return a(C,{auth:l.auth,errors:l.errors,header:"Angsuran Nasabah",loading:v,children:[e(w,{title:"Buku Transaksi"}),a("div",{className:"bg-white/30 rounded shadow w-full p-3",children:[a("div",{className:"flex w-full justify-between items-center",children:[e("div",{className:"font-semibold",children:"Bayar Angsuran"}),e("div",{className:"font-semibold",children:e(j,{as:"a",href:l.back_button,color:"blue",title:"Back"})})]}),a("div",{className:"overflow-auto",children:[a("div",{children:[a("div",{className:"flex gap-3",children:[a("div",{className:"flex-1 flex justify-between items-center",children:[e("div",{children:"Nomor"}),e("div",{children:":"})]}),e("div",{className:"flex-[2]",children:t.id})]}),a("div",{className:"flex gap-3",children:[a("div",{className:"flex-1 flex justify-between items-center",children:[e("div",{children:"Nasabah"}),e("div",{children:":"})]}),e("div",{className:"flex-[2]",children:t.customer.nama})]}),a("div",{className:"flex gap-3",children:[a("div",{className:"flex-1 flex justify-between items-center",children:[e("div",{children:"Alamat"}),e("div",{children:":"})]}),e("div",{className:"flex-[2]",children:t.customer.alamat})]}),a("div",{className:"flex gap-3",children:[a("div",{className:"flex-1 flex justify-between items-center",children:[e("div",{children:"NIK"}),e("div",{children:":"})]}),e("div",{className:"flex-[2]",children:t.customer.nik})]}),a("div",{className:"flex gap-3",children:[a("div",{className:"flex-1 flex justify-between items-center",children:[e("div",{children:"Kelompok | Mantri"}),e("div",{children:":"})]}),a("div",{className:"flex-[2]",children:[t.kelompok," | ",t.droper.nama_karyawan]})]}),a("div",{className:"flex gap-3",children:[a("div",{className:"flex-1 flex justify-between items-center",children:[e("div",{children:"Tanggal Drop"}),e("div",{children:":"})]}),a("div",{className:"flex-[2]",children:[t.hari," |"," ",p(t.tanggal_drop).format("DD-MM-YYYY")]})]}),a("div",{className:"flex gap-3",children:[a("div",{className:"flex-1 flex justify-between items-center",children:[e("div",{children:"Pinjaman"}),e("div",{children:":"})]}),a("div",{className:"flex-[2]",children:[e(c,{value:t.pinjaman,displayType:"text",thousandSeparator:",",prefix:"Rp. "})," ","|"," ",t.status==1?e("span",{className:"text-green-500",children:"Normal"}):t.status==2?e("span",{className:"text-amber-500",children:"CM"}):t.status==3?e("span",{className:"text-red-500",children:"MB"}):e("span",{className:"text-white bg-black p-1",children:"ML"})]})]})]}),e("div",{className:"mt-3",children:e("div",{className:"shadow text-xs rounded overflow-auto border max-h-[50vh]",children:a("table",{className:"w-full bg-white",children:[e("thead",{children:a("tr",{className:"text-center",children:[e("th",{className:"p-2",children:"No"}),e("th",{className:"p-2",children:"Tanggal Angsur"}),e("th",{className:"p-2",children:"Jumlah"}),e("th",{className:"p-2",children:"Saldo"})]})}),e("tbody",{className:"text-center",children:(o=t.angsuran)==null?void 0:o.map((s,r)=>(d=d-s.jumlah,a("tr",{className:"odd:bg-gray-200",children:[e("td",{className:"px-2 py-1",children:r+1}),e("td",{className:"px-2 py-1",children:p(s.pembayaran_date).format("DD-MM-YY")}),e("td",{className:"px-2 py-1",children:e(c,{value:s.jumlah,displayType:"text",thousandSeparator:","})}),e("td",{className:"px-2 py-1",children:a("div",{className:"flex justify-center gap-2",children:[e("div",{className:"text-end flex-1",children:e(c,{value:d,displayType:"text",thousandSeparator:","})}),e("div",{className:"text-start flex-1",children:s.status==1?e("span",{className:"text-green-500",children:"Normal"}):s.status==2?e("span",{className:"text-amber-500",children:"CM"}):s.status==3?e("span",{className:"text-red-500",children:"MB"}):e("span",{className:"text-white bg-black p-1",children:"ML"})})]})})]},r)))})]})})}),l.batasan.is_paid==0?a("form",{onSubmit:y,className:"mt-3",children:[e("div",{children:"Input Data"}),a("div",{className:"flex gap-3 flex-wrap",children:[a("div",{className:"flex-1",children:[e(u,{value:"Tanggal"}),e(_,{type:"date",onChange:h,max:l.batasan.maxdate,min:l.batasan.mindate,className:"block mt-1 w-full",id:"pembayaran_date",name:"pembayaran_date",value:i.pembayaran_date}),e(f,{message:n.pembayaran_date,className:"mt-2"})]}),a("div",{className:"flex-1",children:[e(u,{value:"Jumlah"}),e(M,{name:"jumlah",id:"jumlah",className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full mt-1",allowDecimals:!1,prefix:"Rp. ",required:!0,onValueChange:g,value:i.jumlah,placeholder:"Inputkan angka tanpa sparator"}),e(f,{message:n.jumlah,className:"mt-2"})]})]}),e("div",{className:"mt-3 px-2",children:e("div",{className:"inline-block",children:a("label",{className:"flex items-center justify-center font-bold",children:[e(S,{name:"danatitipan",value:i.danatitipan,onChange:h}),e("span",{className:"ml-2 text-sm text-gray-600",children:"Dana Titipan?"})]})})}),a("div",{className:"mt-3 flex justify-between items-center",children:[e(D,{title:"Submit",type:"submit"}),e("a",{target:"_blank",href:`https://api.whatsapp.com/send?phone=628563158592&text=Ralat%20Angsuran%20Nomor%20${t.id}%20%2C%20(%20ganti%20ketik%20ralatnya%20dimana%20)`,className:"text-xs py-1 px-2 border border-gray-600 focus:bg-gray-600 focus:text-white rounded flex justify-center items-center",children:e("span",{children:"lapor"})})]})]}):a("div",{className:"mt-3",children:[e("div",{children:"Sudah Ada Pembayaran Untuk Hari Ini"}),a("small",{children:["*Laporkan jika ada yang eror",e("a",{target:"_blank",href:`https://api.whatsapp.com/send?phone=628563158592&text=Ralat%20Angsuran%20Nomor%20${t.id}%20%2C%20(%20ganti%20ketik%20ralatnya%20dimana%20)`,className:"text-xs ml-1 text-blue-700 underline",children:e("span",{children:"disini"})})]})]})]})]})]})};export{Z as default};