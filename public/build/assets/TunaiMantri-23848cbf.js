import{r as s,q as R,j as g,a,c as j,F as M,R as F}from"./app-779ec234.js";import{F as l,T as k,a as O,b as c,c as h,d as _,e as f,f as B}from"./FormatNumbering-4258954a.js";import{u as H,f as u,g as K}from"./index-e2fa29d8.js";import{B as d}from"./BargeStatus-0420e3f2.js";import"./button-a6591cf8.js";import"./utils-36e2ef84.js";import"./react-number-format.es-7e420cb1.js";const L=({setOnShowModal:b,setTriggeredData:w,setTriggeredType:y,datas:m})=>{const[p,T]=s.useState([]),{auth:x}=R().props;s.useEffect(()=>{T(m)},[m]);const i=(e=>e.reduce((t,o)=>(Object.keys(o).forEach(r=>{t[r]=(t[r]||0)+(o[r]||0)}),t),{}))(p),C=(e,t)=>{b(!0),w(e),y(t)},v=s.useMemo(()=>[{header:"",accessorKey:"kelompok",cell:({getValue:e,cell:t})=>g("div",{className:"flex items-center justify-center gap-3",children:[a("div",{children:t.row.original.type=="daily"?e():j(t.row.original.tanggal).format("DD-MM")}),x.permissions.includes("can update")&&a(d,{onClick:()=>C(t.row.original,2),value:t.row.original.status_dayly_approval,children:t.row.original.status_dayly_approval?"Approved":"Open"})]})},{header:"Titipan 9%",accessorKey:"titipan9",cell:({getValue:e})=>a(l,{value:e()}),footer:e=>a(l,{value:i.titipan9})},{header:"Tunai",accessorKey:"tunai",cell:({getValue:e})=>a(l,{value:e()}),footer:e=>a(l,{value:i.tunai})},{header:"Status",accessorKey:"is_balance",cell:({getValue:e})=>a(d,{value:e()})}],[i]),n=H({data:p,columns:v,getCoreRowModel:K(),debugTable:!0}),[E,D]=s.useState(!1),[q,N]=s.useState(),S=e=>{D(!0),N(e)};return a(M,{children:g(k,{className:"w-full mb-3 table-auto",children:[a(O,{className:"sticky top-0 z-10 bg-gray-100",children:n.getHeaderGroups().map((e,t)=>a(c,{children:e.headers.map((o,r)=>a(h,{className:"text-center",children:u(o.column.columnDef.header,o.getContext())},r))},t))}),a(_,{children:n.getRowModel().rows.length?n.getRowModel().rows.map((e,t)=>a(F.Fragment,{children:a(c,{className:"text-center",children:e.getVisibleCells().map(o=>a(f,{className:`${o.column.columnDef.className}`,children:o.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(d,{value:o.row.original.status,onClick:()=>S(o.row.original)})}):u(o.column.columnDef.cell,o.getContext())},o.id))},t)},t)):a(c,{children:a(f,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(B,{children:n.getFooterGroups().map(e=>a(c,{children:e.headers.map(t=>a(h,{className:"text-center text-black bg-gray-100",children:u(t.column.columnDef.footer,t.getContext())},t.id))},e.id))})]})})};export{L as default};
