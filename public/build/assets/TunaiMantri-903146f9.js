import{r as s,j as g,a,d as N,F as S,R}from"./app-41d5673e.js";import{F as n,T as j,a as M,b as c,c as f,d as F,e as h,f as k}from"./FormatNumbering-a833c6fb.js";import{u as O,f as u,g as _}from"./index-0ea449e5.js";import{B as d}from"./BargeStatus-37285f79.js";import"./button-057951ef.js";import"./utils-46f1eee5.js";import"./react-number-format.es-57e38fbd.js";import"./index-f96983da.js";const I=({setOnShowModal:b,setTriggeredData:w,datas:m})=>{const[p,y]=s.useState([]);s.useEffect(()=>{y(m)},[m]);const i=(e=>e.reduce((t,o)=>(Object.keys(o).forEach(r=>{t[r]=(t[r]||0)+(o[r]||0)}),t),{}))(p),T=e=>{b(!0),w(e)},x=s.useMemo(()=>[{header:"",accessorKey:"kelompok",cell:({getValue:e,cell:t})=>g("div",{className:"flex items-center justify-center gap-3",children:[a("div",{children:t.row.original.type=="daily"?e():N(t.row.original.tanggal).format("DD-MM")}),a(d,{onClick:()=>T(t.row.original),value:t.row.original.status_dayly_approval,children:t.row.original.status_dayly_approval?"Approved":"Open"})]})},{header:"Titipan 9%",accessorKey:"titipan9",cell:({getValue:e})=>a(n,{value:e()}),footer:e=>a(n,{value:i.titipan9})},{header:"Tunai",accessorKey:"tunai",cell:({getValue:e})=>a(n,{value:e()}),footer:e=>a(n,{value:i.storting})},{header:"Status",accessorKey:"is_balance",cell:({getValue:e})=>a(d,{value:e()})}],[i]),l=O({data:p,columns:x,getCoreRowModel:_(),debugTable:!0}),[H,C]=s.useState(!1),[K,v]=s.useState(),D=e=>{C(!0),v(e)};return a(S,{children:g(j,{className:"w-full mb-3 table-auto",children:[a(M,{className:"sticky top-0 z-10 bg-gray-100",children:l.getHeaderGroups().map((e,t)=>a(c,{children:e.headers.map((o,r)=>a(f,{className:"text-center",children:u(o.column.columnDef.header,o.getContext())},r))},t))}),a(F,{children:l.getRowModel().rows.length?l.getRowModel().rows.map((e,t)=>a(R.Fragment,{children:a(c,{className:"text-center",children:e.getVisibleCells().map(o=>a(h,{className:`${o.column.columnDef.className}`,children:o.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(d,{value:o.row.original.status,onClick:()=>D(o.row.original)})}):u(o.column.columnDef.cell,o.getContext())},o.id))},t)},t)):a(c,{children:a(h,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(k,{children:l.getFooterGroups().map(e=>a(c,{children:e.headers.map(t=>a(f,{className:"text-center text-black bg-gray-100",children:u(t.column.columnDef.footer,t.getContext())},t.id))},e.id))})]})})};export{I as default};