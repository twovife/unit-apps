import{r as m,j as r,a as e,b as T,F as E,c as I,d as L}from"./app-c852447f.js";import{P as M}from"./PrimaryButton-0dec68f2.js";import{A as B}from"./AuthenticatedLayout-b09b1afa.js";import{N as Y}from"./react-number-format.es-0ad3a443.js";import{u as $,A as G,a as J,b as K,c as R,d as V}from"./useFilterTable-0891b549.js";import"./TextInput-d72b0805.js";import{L as y}from"./LinkButton-796e2744.js";import{u as q}from"./useServerFilter-15eb4ebd.js";import{S as H}from"./SelectList-abb4228a.js";import"./button-f1d79983.js";import"./index-f96983da.js";import"./utils-36e2ef84.js";import"./index-3beca8f3.js";import"./createLucideIcon-88b2e6a4.js";import"./SweetAlert-32246a70.js";import"./react-icons.esm-26840eb3.js";import"./index-71acb7a6.js";import"./index-4a6df377.js";import"./Loading-3cde90b0.js";import"./transition-bebf8616.js";const ke=({loans:N,server_filters:w,...p})=>{const{transaction_date:U,serverFilters:k,onServerFilterChange:C,onServerFilterSubmit:b,loading:F,setLoading:Q,mantriMantri:S}=q(route().current(),w),j=1e3,{filters:n,setFilters:f,orderData:W,setOrderData:h,currentPage:X,setCurrentPage:Z,displayData:g,totalPages:ee,handlePageChange:te,totals:re}=$({},j,N),[c,A]=m.useState(""),[o,u]=m.useState({column:"",operators:"1",values:""}),x=(t,a="text")=>{A({column:t,format:a})};m.useEffect(()=>{const t=JSON.parse(localStorage.getItem("internal_storage_buku_transaksi"));t&&Object.keys(t).length>0&&f(t)},[]),m.useEffect(()=>{localStorage.setItem("internal_storage_buku_transaksi",JSON.stringify(n))},[n]),m.useEffect(()=>{const t=a=>{a.target.className.includes("filter_trigger")?(x(a.target.getAttribute("data-item"),a.target.getAttribute("data-format")),u({...o,column:a.target.getAttribute("data-item")})):x("")};return window.addEventListener("click",t),()=>{window.removeEventListener("click",t)}});const _=()=>{const t=[...n],a=t.findIndex(l=>l.column===o.column);a!==-1?t[a]=o:t.push(o),f(t)},P=t=>{[...n];const a=n.filter(l=>l.column!==t);f(a)},D=t=>{const{name:a,value:l,type:s}=t.target;let i=l;s==="number"&&(i=parseInt(l)),u({...o,[a]:i})},v=[{title:["Tanggal","Nomor Pinjaman","Customer"],column:["transaction_date","id","customer_nama"],format:["date","number","text"],headClass:"sticky left-0 top-0 z-40 w-1/2 md:w-1/4",bodyClass:"sticky left-0 top-0 z-40 w-1/2 md:w-1/4"},{title:["NIK"],column:["customer_nik"],format:["text"]},{title:["Alamat"],column:["customer_alamat"],format:["text"]},{title:["Kel"],column:["kelompok"],format:["text"]},{title:["Hari"],column:["hari"],format:["text"]},{title:["Pengajuan"],column:["pinjaman"],format:["money"]},{title:["Tanggal Drop"],column:["tanggal_drop"],format:["date"]},{title:["Status"],column:["status"],format:["text"]},{title:["Diperiksa"],column:["tanggal_approve"],format:["date"]},{title:["Oleh"],column:["approver"],format:["text"]},{title:["Mantri"],column:["droper"],format:["text"],headClass:"bg-rose-200"}],O=()=>e("div",{className:"fixed text-white top-1/2 left-1/2 -translate-x-1/2 w-1/3",onClick:t=>t.stopPropagation(),children:e("div",{className:"bg-white border border-gray-300 rounded-lg shadow-lg max-w-full w-full",children:r("div",{className:"flex justify-end items-center text-2xl px-2 py-4 flex-wrap",children:[r("div",{className:"flex-1 flex flex-col-reverse",children:[e("input",{name:"column",value:o.column,onChange:t=>u({...o,column:t.target.value}),className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/column"}),e("label",{className:"text-gray-400 text-xs font-semibold peer-focus/column:text-blue-500",children:"Column"})]}),r("div",{className:"flex-1 flex flex-col-reverse",children:[r("select",{name:"operators",value:o.operators,onChange:t=>u({...o,operators:t.target.value}),className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:outline-none focus:border-b-2 focus:border-b-blue-500 focus:ring-0 peer/operator",children:[e("option",{value:"1",children:"contains"}),e("option",{value:"2",children:"equal"})]}),e("label",{className:"text-gray-400 text-xs font-semibold peer-focus/operator:text-blue-500",children:"Operator"})]}),r("div",{className:"flex-1 flex flex-col-reverse",children:[e("input",{value:o.values,type:c.format=="number"?"number":c.format=="date"?"date":c.format=="money"?"number":"text",onChange:D,name:"values",className:"border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/value"}),e("label",{className:"text-gray-400 text-xs font-semibold peer-focus/value:text-blue-500",children:"Value"})]}),r("div",{className:"flex-1 flex items-center justify-center",children:[e("button",{onClick:_,className:"text-black text-xs border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-2 rounded-lg",children:"Go"}),e("button",{onClick:()=>h({column:c.column,orderby:"asc"}),className:"text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-3",children:e(K,{})}),e("button",{onClick:()=>h({column:c.column,orderby:"desc"}),className:"text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-1",children:e(R,{})})]})]})})}),z=()=>g.length===0?e(E,{children:e("tbody",{children:e("tr",{children:e("td",{colSpan:"2",children:"Data Not Found"})})})}):e("tbody",{children:g.map((t,a)=>r("tr",{className:`border-b text-xs ${t.status=="acc"?"bg-emerald-100 hover:bg-green-300 even:bg-green-200":t.status=="tolak"?"bg-rose-100 hover:bg-red-300 even:bg-rose-200":"bg-white hover:bg-blue-50 even:bg-gray-100"}`,children:[e("td",{children:r("div",{className:"flex items-center justify-evenly",children:[e("div",{className:"flex-1 py-1 px-4",children:a+1}),e(I,{as:"a",href:route("transaction.show",t.id),className:"flex-1",children:e(V,{})})]})}),v.map((l,s)=>e("td",{className:`${l.bodyClass?`${l.bodyClass}  bg-inherit`:" relative z-30"}`,children:e("div",{className:"flex items-start justify-evenly",children:l.column.map((i,d)=>l.format[d]=="date"?e("div",{className:"flex-1 py-1 px-4",children:t[i]?L(t[i]).format("DD-MM-YYYY"):""},d):l.format[d]=="money"?e("div",{className:"flex-1 py-1 px-4",children:e(Y,{value:t[i],displayType:"text",thousandSeparator:",",prefix:"Rp. "})},d):e("div",{className:"flex-1 py-1 px-4",children:t[i]},d))})},s))]},a))});return r(B,{auth:p.auth,errors:p.errors,header:"Buku Transaksi",loading:F,children:[e(T,{title:"Buku Transaksi"}),r("div",{className:"relative",children:[r("div",{className:"px-6 py-4 flex justify-end items-center gap-3",children:[e("div",{children:e(H,{type:"date",className:"block w-full min-w-16 text-sm",id:"mantri",name:"mantri",options:S,value:k.mantri,onChange:C})}),e(M,{color:"yellow",title:"Cari",onClick:b}),e(y,{href:route("transaction.index_open"),title:"Refresh",onClick:b}),e(y,{color:"blue",as:"a",href:route("transaction.create"),title:"Create"})]}),n&&e("div",{className:"inline-block space-y-1",children:n.map(t=>t.column==""?null:r("div",{className:"flex items-center justify-start space-y-2",children:[r("div",{className:"border flex items-center rounded-md overflow-hidden",children:[e("div",{className:"p-2 text-lg bg-green-400 text-white",children:e(G,{})}),r("div",{className:"px-3 text-sm text-main-500",children:[e("span",{className:"mr-1 capitalize ",children:t.column}),e("span",{className:"mr-1 capitalize ",children:t.operators==1?"Contains":"="}),r("span",{children:["'",t.values,"'"]})]})]}),e("div",{className:"hover:border hover:bg-gray-300 hover:cursor-pointer rounded p-1 ml-2",onClick:()=>P(t.column),children:e(J,{})})]}))}),r("div",{className:"bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md",children:[e("div",{className:"font-semibold text-lg",children:"Daftar Transaksi"}),e("div",{className:"mx-auto mb-6 overflow-auto ring-1 ring-black ring-opacity-5 rounded shadow",children:r("table",{className:"w-full text-xs text-left text-gray-500 relative",children:[e("thead",{className:"text-gray-900 uppercase sticky top-0 whitespace-nowrap z-50",children:r("tr",{children:[e("th",{className:"bg-gray-200 relative z-30",children:e("div",{className:"flex items-start justify-evenly",children:e("div",{className:"px-4 py-3 ",children:"No"})})}),v.map((t,a)=>e("th",{"data-item":t.column,"data-format":t.format??"text",scope:"col",className:`bg-gray-200 ${t.headClass??" relative z-30"}`,children:e("div",{className:"flex items-start justify-evenly",children:t.title.map((l,s)=>r("div",{"data-item":t.column[s],"data-format":t.format[s]??"text",className:"flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",children:[l,c.column==t.column[s]&&O()]},s))})},a))]})}),z()]})})]})]})]})};export{ke as default};
