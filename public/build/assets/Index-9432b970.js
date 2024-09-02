import{r as u,j as t,a as e,b as M,d as O}from"./app-c2fdeeef.js";import{P as R}from"./PrimaryButton-bfa9ba04.js";import{A as Y}from"./AuthenticatedLayout-6fd87b0f.js";import{d as j}from"./dayjs.min-5868073a.js";import{N as m}from"./react-number-format.es-733a9385.js";import{u as K,A as J,a as q,b as G,c as H}from"./useFilterTable-0dfbccf9.js";import{T as U}from"./TextInput-a78071f8.js";import{S as w}from"./SelectList-bd1c94f0.js";import{u as V}from"./useServerFilter-cafa312c.js";import{B as Q}from"./index-ab58e90b.js";import"./button-c3d083fb.js";import"./utils-36e2ef84.js";import"./createLucideIcon-b534cceb.js";import"./SweetAlert-d0db66ed.js";import"./react-icons.esm-54b37c86.js";import"./index-efd1f812.js";import"./index-ebe8d1ac.js";import"./Loading-bfc8c4ad.js";import"./transition-ade3a8b7.js";const ge=({loans:k,server_filters:z,dateOfWeek:h,...b})=>{const{transaction_date:S,transaction_day:F,serverFilters:x,onServerFilterChange:f,onServerFilterSubmit:C,loading:A,setLoading:X,mantriMantri:T}=V(route().current(),z),P=1e3,{filters:d,setFilters:v,orderData:l,setOrderData:N,currentPage:Z,setCurrentPage:$,displayData:g,totalPages:W,handlePageChange:ee,totals:ae}=K({},P,k),[r,D]=u.useState(""),[n,p]=u.useState({column:"",operators:"1",values:""}),_=(a,s="text")=>{D({column:a,format:s})};u.useEffect(()=>{const a=JSON.parse(localStorage.getItem("internal_storage_buku_transaksi"));a&&Object.keys(a).length>0&&v(a)},[]),u.useEffect(()=>{localStorage.setItem("internal_storage_buku_transaksi",JSON.stringify(d))},[d]),u.useEffect(()=>{const a=s=>{s.target.className.includes("filter_trigger")?(_(s.target.getAttribute("data-item"),s.target.getAttribute("data-format")),p({...n,column:s.target.getAttribute("data-item")})):_("")};return window.addEventListener("click",a),()=>{window.removeEventListener("click",a)}});const E=()=>{const a=[...d],s=a.findIndex(c=>c.column===n.column);s!==-1?a[s]=n:a.push(n),v(a)},I=a=>{[...d];const s=d.filter(c=>c.column!==a);v(s)},B=a=>{const{name:s,value:c,type:y}=a.target;let o=c;y==="number"&&(o=parseInt(c)),p({...n,[s]:o})},i=()=>e("div",{className:"fixed text-white -translate-x-1/2 top-1/2 left-1/2 lg:w-1/3",onClick:a=>a.stopPropagation(),children:e("div",{className:"w-full max-w-full bg-white border border-gray-300 rounded-lg shadow-lg",children:t("div",{className:"flex flex-wrap items-center justify-end gap-3 px-2 py-4 text-2xl",children:[t("div",{className:"flex flex-col-reverse flex-1",children:[e("input",{name:"column",readOnly:!0,value:n.column,onChange:a=>p({...n,column:a.target.value}),className:"read-only:bg-gray-200 read-only:cursor-not-allowed border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/column"}),e("label",{className:"text-xs font-semibold text-gray-400 peer-focus/column:text-blue-500",children:"Kolom"})]}),t("div",{className:"flex flex-col-reverse flex-1",children:[t("select",{name:"operators",value:n.operators,onChange:a=>p({...n,operators:a.target.value}),className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:outline-none focus:border-b-2 focus:border-b-blue-500 focus:ring-0 peer/operator",children:[e("option",{value:"1",children:"contains"}),e("option",{value:"2",children:"equal"})]}),e("label",{className:"text-xs font-semibold text-gray-400 peer-focus/operator:text-blue-500",children:"Operator"})]}),t("div",{className:"flex flex-col-reverse flex-1",children:[e("input",{value:n.values,type:r.format=="number"?"number":r.format=="date"?"date":r.format=="currency"?"number":"text",onChange:B,name:"values",className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/value"}),e("label",{className:"text-xs font-semibold text-gray-400 peer-focus/value:text-blue-500",children:"Kata Kunci"})]}),t("div",{className:"flex items-center justify-center flex-1",children:[e("button",{onClick:E,className:"p-2 text-xs text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white",children:"Go"}),e("button",{onClick:()=>N({column:r.column,orderby:"asc"}),className:"p-1 ml-3 text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white",children:e(G,{})}),e("button",{onClick:()=>N({column:r.column,orderby:"desc"}),className:"p-1 ml-1 text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white",children:e(H,{})})]})]})})});return t(Y,{auth:b.auth,errors:b.errors,header:"Buku Transaksi",loading:A,children:[e(M,{title:"Buku Transaksi"}),t("div",{className:"relative",children:[t("div",{className:"flex flex-wrap items-center justify-end gap-3 px-6 py-4",children:[e("div",{children:e(U,{option:S,type:"month",className:"block w-full text-sm",id:"transaction_date",name:"transaction_date",value:x.transaction_date,onChange:f})}),e("div",{children:e(w,{options:F,type:"date",className:"block w-32 text-sm",id:"transaction_day",name:"transaction_day",value:x.transaction_day,onChange:f})}),e("div",{children:e(w,{options:T,type:"date",className:"block w-32 text-sm",id:"mantri",name:"mantri",value:x.mantri,onChange:f})}),e(R,{color:"yellow",title:"Cari",onClick:C})]}),d&&e("div",{className:"inline-block space-y-1",children:d.map(a=>a.column==""?null:t("div",{className:"flex items-center justify-start space-y-2",children:[t("div",{className:"flex items-center overflow-hidden border rounded-md",children:[e("div",{className:"p-2 text-lg text-white bg-green-400",children:e(J,{})}),t("div",{className:"px-3 text-sm text-main-500",children:[e("span",{className:"mr-1 capitalize ",children:a.column}),e("span",{className:"mr-1 capitalize ",children:a.operators==1?"Contains":"="}),t("span",{children:["'",a.values,"'"]})]})]}),e("div",{className:"p-1 ml-2 rounded hover:border hover:bg-gray-300 hover:cursor-pointer",onClick:()=>I(a.column),children:e(q,{})})]}))}),t("div",{className:"px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5",children:[e("div",{className:"text-lg font-semibold",children:"Daftar Transaksi"}),e("div",{className:"max-h-screen mx-auto mb-6 rounded shadow ring-1 ring-black ring-opacity-5",children:e("div",{className:"overflow-auto max-h-[70vh]",children:t("table",{className:"relative w-full text-xs text-left text-gray-500",children:[e("thead",{className:"sticky top-0 z-50 text-gray-900 uppercase whitespace-nowrap",children:t("tr",{className:"text-center bg-gray-200",children:[e("th",{className:"top-0 left-0 z-40 bg-gray-200 lg:sticky",children:t("div",{className:"flex items-start justify-start gap-1 w-96",children:[t("div",{"data-item":"nomor_pinjaman","data-format":"text",className:"flex-1 px-4 py-3 text-center hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Nomor",l.column=="nomor_pinjaman"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="nomor_pinjaman"&&i()]}),t("div",{"data-item":"nama_customer","data-format":"text",className:"flex-[2] hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger text-center",children:["Nama Nasabah",l.column=="nama_customer"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="nama_customer"&&i()]})]})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"nik_customer","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Nik",l.column=="nik_customer"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="nik_customer"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{"data-item":"alamat_customer","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:"Note"})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"alamat_customer","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Alamat",l.column=="alamat_customer"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="alamat_customer"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"kelompok","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Kelompok",l.column=="kelompok"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="kelompok"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"hari","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Hari",l.column=="hari"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="hari"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"tanggal_drop","data-format":"date",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Tanggal Drop",l.column=="tanggal_drop"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="tanggal_drop"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"pinjaman_ke","data-format":"text",className:"flex-1 px-4 py-3",children:["Pnj Ke",l.column=="pinjaman_ke"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="pinjaman_ke"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"jumlah_angsuran","data-format":"text",className:"flex-1 px-4 py-3",children:["jml Angsuran",l.column=="jumlah_angsuran"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="jumlah_angsuran"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"pinjaman","data-format":"text",className:"flex-1 px-4 py-3",children:["Pinjaman",l.column=="pinjaman"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="pinjaman"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"total_angsuran_bulan_lalu","data-format":"text",className:"flex-1 px-4 py-3",children:["Angs Bln Sebelumnya",l.column=="total_angsuran_bulan_lalu"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="total_angsuran_bulan_lalu"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"total_angsuran_bulan_ini","data-format":"text",className:"flex-1 px-4 py-3",children:["Saldo Sebelumnya",l.column=="total_angsuran_bulan_ini"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="total_angsuran_bulan_ini"&&i()]})})}),h&&h.map((a,s)=>e("th",{children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-3",children:j(a).format("DD-MM-YY")})})},s)),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"total_angsuran_bulan_ini","data-format":"text",className:"flex-1 px-4 py-3",children:["Angsuran",l.column=="total_angsuran_bulan_ini"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="total_angsuran_bulan_ini"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"saldo_bulan_ini","data-format":"text",className:"flex-1 px-4 py-3",children:["Saldo",l.column=="saldo_bulan_ini"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="saldo_bulan_ini"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"status","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Status",l.column=="status"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="status"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"lunas","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Lunas",l.column=="lunas"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="lunas"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"jenis_nasabah","data-format":"text",className:"flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",children:["Jenis Nasabah",l.column=="jenis_nasabah"&&e("span",{className:"ml-1 italic text-blue-400",children:l.orderby}),r.column=="jenis_nasabah"&&i()]})})})]})}),e("tbody",{children:g&&g.map((a,s)=>t("tr",{className:"bg-white even:bg-blue-50",children:[e("td",{className:"top-0 left-0 z-40 lg:sticky bg-inherit",children:t("div",{className:"flex items-start justify-start gap-1",children:[t("div",{className:"flex items-center justify-between flex-1 w-full px-4 py-1",children:[t("div",{children:[e("span",{children:s+1}),e("span",{children:" | "}),e("span",{children:a.nomor_pinjaman})]}),e(O,{href:route("pinjaman.normal.show",a.id),className:"p-1 text-sm font-semibold text-white bg-blue-400 rounded",children:e(Q,{})})]}),e("div",{className:"flex-[2] py-1 px-4 text-start lg:whitespace-nowrap",children:a.nama_customer})]})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly w-36",children:e("div",{className:"flex-1 px-4 py-1",children:a.nik_customer})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly w-36",children:t("div",{className:"flex-1 px-4 py-1",children:[a.lunas=="lunas"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded",children:"Lunas"}):"",a.status=="normal"?e("span",{className:"px-2 py-1 mr-1 text-xs border rounded",children:a.status}):a.status=="cm"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded",children:a.status}):a.status=="mb"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded",children:a.status}):a.status=="ml"?e("span",{className:"px-2 py-1 mr-1 text-xs text-white bg-black border rounded",children:a.status}):e("div",{children:a.status})]})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly w-36",children:e("div",{className:"flex-1 px-4 py-1",children:a.alamat_customer})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:a.kelompok})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:a.hari})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:j(a.tanggal_drop).format("DD-MM-YYYY")})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:a.pinjaman_ke})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:a.jumlah_angsuran})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 px-4 py-1",children:e(m,{value:a.pinjaman,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 px-4 py-1",children:e(m,{value:a.total_angsuran_bulan_lalu,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 px-4 py-1",children:e(m,{value:a.saldo_bulan_lalu,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),h&&h.map((c,y)=>e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 px-4 py-1",children:(()=>{const o=a.angsuran.find(L=>L.pembayaran_date==c);return e(m,{value:o==null?void 0:o.jumlah,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})()})})},y)),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 px-4 py-1",children:e(m,{value:a.total_angsuran_bulan_ini,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 px-4 py-1",children:e(m,{value:a.saldo_bulan_ini,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:a.status})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:a.lunas})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-1",children:a.loan_notes})})})]},s))})]})})})]})]})]})};export{ge as default};
