import{r as c,a,c as f,F as K,j as w,R as x}from"./app-779ec234.js";import{F as o,T as C,a as k,b as u,c as h,d as D,e as g,f as R}from"./FormatNumbering-4258954a.js";import{u as N,f as d,g as S}from"./index-e2fa29d8.js";import{B as M}from"./BargeStatus-0420e3f2.js";import"./button-a6591cf8.js";import"./utils-36e2ef84.js";import"./react-number-format.es-7e420cb1.js";const z=({datas:i})=>{const[m,p]=c.useState([]);c.useEffect(()=>{p(i)},[i]);const t=(e=>e.reduce((l,r)=>(Object.keys(r).forEach(s=>{l[s]=(l[s]||0)+(r[s]||0)}),l),{}))(m),b=c.useMemo(()=>[{header:"Hari",accessorKey:"tanggal",cell:({getValue:e})=>a("div",{children:f(e()).format("dddd")}),footer:e=>a("div",{className:"text-center",children:"TOTAL"})},{header:"Tanggal",accessorKey:"tanggal",cell:({getValue:e})=>a("div",{children:f(e()).format("DD-MM-YY")})},{header:"Kelompok",accessorKey:"kelompok",cell:({getValue:e})=>a("div",{children:e()})},{header:"Kasbon",accessorKey:"kasbon",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.kasbon})},{header:"Target",accessorKey:"target",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.target})},{header:"Masuk",accessorKey:"masuk",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.masuk})},{header:"Keluar",accessorKey:"keluar",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.keluar})},{header:"Storting",accessorKey:"storting",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.storting})},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.drop})},{header:"Baru",accessorKey:"baru",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.baru})},{header:"Lama",accessorKey:"lama",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.lama})},{header:"Rencana",accessorKey:"rencana",cell:({getValue:e})=>a(o,{value:e()}),footer:e=>a(o,{value:t.rencana})}],[t]),n=N({data:m,columns:b,getCoreRowModel:S(),debugTable:!0}),[F,v]=c.useState(!1),[B,y]=c.useState(),T=e=>{v(!0),y(e)};return a(K,{children:w(C,{className:"w-full mb-3 table-auto",children:[a(k,{className:"sticky top-0 z-10 bg-gray-100",children:n.getHeaderGroups().map((e,l)=>a(u,{children:e.headers.map((r,s)=>a(h,{className:"text-center",children:d(r.column.columnDef.header,r.getContext())},s))},l))}),a(D,{children:n.getRowModel().rows.length?n.getRowModel().rows.map((e,l)=>a(x.Fragment,{children:a(u,{className:"text-center",children:e.getVisibleCells().map((r,s)=>a(g,{className:`${r.column.columnDef.className}`,children:r.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(M,{value:r.row.original.status,onClick:()=>T(r.row.original)})}):d(r.column.columnDef.cell,r.getContext())},s))},l)},l)):a(u,{children:a(g,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(R,{children:n.getFooterGroups().map((e,l)=>a(u,{children:e.headers.map((r,s)=>a(h,{className:"text-center text-black bg-gray-100",children:d(r.column.columnDef.footer,r.getContext())},s))},l))})]})})};export{z as default};
