import{r as u,j as t,a as e,b as R,d as Y}from"./app-c9dd1e61.js";import{P as O}from"./PrimaryButton-ee83cd30.js";import{A as B}from"./AuthenticatedLayout-cd6db565.js";import{d as j}from"./dayjs.min-4461fb08.js";import{N as m}from"./react-number-format.es-aca159db.js";import{A as J,a as K,b as V,c as q,d as G}from"./index-a6721e07.js";import{T as H}from"./TextInput-363ae1b2.js";import{S as w}from"./SelectList-9bc3a09a.js";import{u as U}from"./useServerFilter-bf83a989.js";import{u as Q}from"./useFilterTable-a0011d1c.js";import"./transition-041c81a3.js";import"./index-a780e852.js";import"./Loading-615e1531.js";const xe=({loans:k,server_filters:z,dateOfWeek:h,...b})=>{const{transaction_date:S,transaction_day:C,serverFilters:x,onServerFilterChange:f,onServerFilterSubmit:F,loading:A,setLoading:X,mantriMantri:T}=U(route().current(),z),P=1e3,{filters:d,setFilters:v,orderData:l,setOrderData:N,currentPage:Z,setCurrentPage:$,displayData:g,totalPages:W,handlePageChange:ee,totals:ae}=Q({},P,k),[r,D]=u.useState(""),[n,p]=u.useState({column:"",operators:"1",values:""}),_=(a,s="text")=>{D({column:a,format:s})};u.useEffect(()=>{const a=JSON.parse(localStorage.getItem("internal_storage_buku_transaksi"));a&&Object.keys(a).length>0&&v(a)},[]),u.useEffect(()=>{localStorage.setItem("internal_storage_buku_transaksi",JSON.stringify(d))},[d]),u.useEffect(()=>{const a=s=>{s.target.className.includes("filter_trigger")?(_(s.target.getAttribute("data-item"),s.target.getAttribute("data-format")),p({...n,column:s.target.getAttribute("data-item")})):_("")};return window.addEventListener("click",a),()=>{window.removeEventListener("click",a)}});const I=()=>{const a=[...d],s=a.findIndex(c=>c.column===n.column);s!==-1?a[s]=n:a.push(n),v(a)},E=a=>{[...d];const s=d.filter(c=>c.column!==a);v(s)},L=a=>{const{name:s,value:c,type:y}=a.target;let o=c;y==="number"&&(o=parseInt(c)),p({...n,[s]:o})},i=()=>e("div",{className:"fixed text-white top-1/2 left-1/2 -translate-x-1/2 w-1/3",onClick:a=>a.stopPropagation(),children:e("div",{className:"bg-white border border-gray-300 rounded-lg shadow-lg max-w-full w-full",children:t("div",{className:"flex justify-end items-center text-2xl px-2 py-4",children:[t("div",{className:"flex-1 flex flex-col-reverse",children:[e("input",{name:"column",value:n.column,onChange:a=>p({...n,column:a.target.value}),className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/column"}),e("label",{className:"text-gray-400 text-xs font-semibold peer-focus/column:text-blue-500",children:"Column"})]}),t("div",{className:"flex-1 flex flex-col-reverse",children:[t("select",{name:"operators",value:n.operators,onChange:a=>p({...n,operators:a.target.value}),className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:outline-none focus:border-b-2 focus:border-b-blue-500 focus:ring-0 peer/operator",children:[e("option",{value:"1",children:"contains"}),e("option",{value:"2",children:"equal"})]}),e("label",{className:"text-gray-400 text-xs font-semibold peer-focus/operator:text-blue-500",children:"Operator"})]}),t("div",{className:"flex-1 flex flex-col-reverse",children:[e("input",{value:n.values,type:r.format=="number"?"number":r.format=="date"?"date":r.format=="currency"?"number":"text",onChange:L,name:"values",className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/value"}),e("label",{className:"text-gray-400 text-xs font-semibold peer-focus/value:text-blue-500",children:"Value"})]}),t("div",{className:"flex-1 flex items-center justify-center",children:[e("button",{onClick:I,className:"text-black text-xs border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-2 rounded-lg",children:"Go"}),e("button",{onClick:()=>N({column:r.column,orderby:"asc"}),className:"text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-3",children:e(q,{})}),e("button",{onClick:()=>N({column:r.column,orderby:"desc"}),className:"text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-1",children:e(G,{})})]})]})})});return t(B,{auth:b.auth,errors:b.errors,header:"Buku Transaksi",loading:A,children:[e(R,{title:"Buku Transaksi"}),t("div",{className:"relative",children:[t("div",{className:"px-6 py-4 flex justify-end items-center gap-3 flex-wrap",children:[e("div",{children:e(H,{option:S,type:"month",className:"block text-sm w-full",id:"transaction_date",name:"transaction_date",value:x.transaction_date,onChange:f})}),e("div",{children:e(w,{options:C,type:"date",className:"block text-sm w-32",id:"transaction_day",name:"transaction_day",value:x.transaction_day,onChange:f})}),e("div",{children:e(w,{options:T,type:"date",className:"block text-sm w-32",id:"mantri",name:"mantri",value:x.mantri,onChange:f})}),e(O,{color:"yellow",title:"Cari",onClick:F})]}),d&&e("div",{className:"inline-block space-y-1",children:d.map(a=>a.column==""?null:t("div",{className:"flex items-center justify-start space-y-2",children:[t("div",{className:"border flex items-center rounded-md overflow-hidden",children:[e("div",{className:"p-2 text-lg bg-green-400 text-white",children:e(J,{})}),t("div",{className:"px-3 text-sm text-main-500",children:[e("span",{className:"mr-1 capitalize ",children:a.column}),e("span",{className:"mr-1 capitalize ",children:a.operators==1?"Contains":"="}),t("span",{children:["'",a.values,"'"]})]})]}),e("div",{className:"hover:border hover:bg-gray-300 hover:cursor-pointer rounded p-1 ml-2",onClick:()=>E(a.column),children:e(K,{})})]}))}),t("div",{className:"bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md",children:[e("div",{className:"font-semibold text-lg",children:"Daftar Transaksi"}),e("div",{className:"mx-auto mb-6 ring-1 ring-black ring-opacity-5 rounded shadow max-h-screen",children:e("div",{className:"overflow-auto max-h-[70vh]",children:t("table",{className:"w-full text-xs text-left text-gray-500 relative",children:[e("thead",{className:"text-gray-900 uppercase sticky top-0 whitespace-nowrap z-50",children:t("tr",{className:"bg-gray-200",children:[e("th",{className:"lg:sticky left-0 top-0 z-40 bg-gray-200",children:t("div",{className:"flex w-full bg-gray-200 gap-1",children:[t("div",{"data-item":"nomor_pinjaman","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger text-center",children:["Nomor",l.column=="nomor_pinjaman"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="nomor_pinjaman"&&i()]}),t("div",{"data-item":"nama_customer","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Nama Customer",l.column=="nama_customer"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="nama_customer"&&i()]}),t("div",{"data-item":"nik_customer","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["NIK",l.column=="nik_customer"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="nik_customer"&&i()]})]})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{"data-item":"alamat_customer","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:"Note"})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"alamat_customer","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Alamat",l.column=="alamat_customer"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="alamat_customer"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"kelompok","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Kelompok",l.column=="kelompok"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="kelompok"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"hari","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Hari",l.column=="hari"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="hari"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"tanggal_drop","data-format":"date",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Tanggal Drop",l.column=="tanggal_drop"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="tanggal_drop"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"pinjaman_ke","data-format":"text",className:"flex-1 px-4 py-3",children:["Pnj Ke",l.column=="pinjaman_ke"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="pinjaman_ke"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"jumlah_angsuran","data-format":"text",className:"flex-1 px-4 py-3",children:["jml Angsuran",l.column=="jumlah_angsuran"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="jumlah_angsuran"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"pinjaman","data-format":"text",className:"flex-1 px-4 py-3",children:["Pinjaman",l.column=="pinjaman"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="pinjaman"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"total_angsuran_bulan_lalu","data-format":"text",className:"flex-1 px-4 py-3",children:["Angs Bln Sebelumnya",l.column=="total_angsuran_bulan_lalu"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="total_angsuran_bulan_lalu"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"total_angsuran_bulan_ini","data-format":"text",className:"flex-1 px-4 py-3",children:["Saldo Sebelumnya",l.column=="total_angsuran_bulan_ini"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="total_angsuran_bulan_ini"&&i()]})})}),h&&h.map((a,s)=>e("th",{children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 px-4 py-3",children:j(a).format("DD-MM-YY")})})},s)),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"total_angsuran_bulan_ini","data-format":"text",className:"flex-1 px-4 py-3",children:["Angsuran",l.column=="total_angsuran_bulan_ini"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="total_angsuran_bulan_ini"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"saldo_bulan_ini","data-format":"text",className:"flex-1 px-4 py-3",children:["Saldo",l.column=="saldo_bulan_ini"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="saldo_bulan_ini"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"status","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Status",l.column=="status"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="status"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"lunas","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Lunas",l.column=="lunas"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="lunas"&&i()]})})}),e("th",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:t("div",{"data-item":"jenis_nasabah","data-format":"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:["Jenis Nasabah",l.column=="jenis_nasabah"&&e("span",{className:"ml-1 text-blue-400 italic",children:l.orderby}),r.column=="jenis_nasabah"&&i()]})})})]})}),e("tbody",{children:g&&g.map((a,s)=>t("tr",{className:"bg-white",children:[e("td",{className:"lg:sticky left-0 top-0 z-40 bg-inherit",children:t("div",{className:"flex justify-start items-start lg:w-[25vw]",children:[t("div",{className:"flex-1 flex gap-3 justify-evenly items-center py-1 px-4",children:[t("div",{children:[s+1," | ",a.nomor_pinjaman]}),e(Y,{href:route("pinjaman.normal.show",a.id),children:e(V,{})})]}),e("div",{className:"flex-1 py-1 px-4 lg:whitespace-nowrap text-balance",children:a.nama_customer}),e("div",{className:"flex-1 py-1 px-4",children:a.nik_customer})]})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly w-36",children:t("div",{className:"flex-1 py-1 px-4",children:[a.lunas=="lunas"?e("span",{className:"px-2 py-1 text-xs border rounded bg-green-400 text-white mr-1",children:"Lunas"}):"",a.status=="normal"?e("span",{className:"mr-1 px-2 py-1 text-xs border rounded",children:a.status}):a.status=="cm"?e("span",{className:"mr-1 px-2 py-1 text-xs border rounded bg-yellow-400 text-white",children:a.status}):a.status=="mb"?e("span",{className:"mr-1 px-2 py-1 text-xs border rounded bg-red-400 text-white",children:a.status}):a.status=="ml"?e("span",{className:"mr-1 px-2 py-1 text-xs border rounded bg-black text-white",children:a.status}):e("div",{children:a.status})]})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly w-36",children:e("div",{className:"flex-1 py-1 px-4",children:a.alamat_customer})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:a.kelompok})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:a.hari})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:j(a.tanggal_drop).format("DD-MM-YYYY")})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:a.pinjaman_ke})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:a.jumlah_angsuran})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 py-1 px-4",children:e(m,{value:a.pinjaman,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 py-1 px-4",children:e(m,{value:a.total_angsuran_bulan_lalu,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 py-1 px-4",children:e(m,{value:a.saldo_bulan_lalu,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),h&&h.map((c,y)=>e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 py-1 px-4",children:(()=>{const o=a.angsuran.find(M=>M.pembayaran_date==c);return e(m,{value:o==null?void 0:o.jumlah,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})()})})},y)),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 py-1 px-4",children:e(m,{value:a.total_angsuran_bulan_ini,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly whitespace-nowrap text-end",children:e("div",{className:"flex-1 py-1 px-4",children:e(m,{value:a.saldo_bulan_ini,displayType:"text",thousandSeparator:",",prefix:"Rp. "})})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:a.status})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:a.lunas})})}),e("td",{className:"relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"flex-1 py-1 px-4",children:a.loan_notes})})})]},s))})]})})})]})]})]})};export{xe as default};
