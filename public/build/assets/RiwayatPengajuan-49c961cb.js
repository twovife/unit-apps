import{r as n,j as c,a,R as w,F as x}from"./app-96bf9012.js";import{T,a as j,b as r,c as y,d as N,e as i}from"./FormatNumbering-260991c3.js";import{u as R,f as m,g as C}from"./index-911770b2.js";import{B as D}from"./button-db28f379.js";import P from"./DetailRiwayat-14aef6da.js";import{P as K}from"./play-3a1b5482.js";import"./utils-36e2ef84.js";import"./react-number-format.es-103496b8.js";import"./createLucideIcon-a3088983.js";const z=({data:d})=>{const[u,p]=n.useState([]);n.useEffect(()=>{p(d)},[d]);const[s,g]=n.useState(),h=t=>{g(e=>e===t?null:t)},b=n.useMemo(()=>[{accessorKey:"unit",header:"unit",type:"show",cell:({row:t,getValue:e})=>e()},{accessorKey:"kelompok",header:"Kelompok",cell:({row:t,getValue:e})=>e()},{accessorKey:"jumlah_pengajuan",header:"TTL Pengajuan",cell:({row:t,getValue:e})=>e()},{accessorKey:"jumlah_pinjaman",header:"TTL Pinjaman",cell:({row:t,getValue:e})=>e()}],[]),l=R({data:u,columns:b,getCoreRowModel:C(),debugTable:!0});return c(T,{className:"w-full table-auto",children:[a(j,{className:"sticky top-0 z-10 bg-gray-100",children:l.getHeaderGroups().map((t,e)=>a(r,{children:t.headers.map((o,f)=>a(y,{className:"text-center",children:m(o.column.columnDef.header,o.getContext())},f))},e))}),a(N,{children:l.getRowModel().rows.length?l.getRowModel().rows.map((t,e)=>a(w.Fragment,{children:c(x,{children:[a(r,{className:`${s==t.original.id?"border-b-0":""} text-center`,children:t.getVisibleCells().map(o=>a(i,{className:`${o.column.columnDef.className}`,children:o.column.columnDef.type=="show"?c("div",{className:"flex items-center justify-start gap-2",children:[a(D,{onClick:()=>h(o.row.original.id),type:"button",size:"icon",variant:"ghost",className:`${s==t.original.id?"rotate-90 text-green-700 bg-gradient-to-br from-green-50 to-green-100":""}`,children:a(K,{className:"h-4 w-auto transition-all duration-150"})}),a("div",{children:m(o.column.columnDef.cell,o.getContext())})]}):m(o.column.columnDef.cell,o.getContext())},o.id))},e),s==t.original.id&&a(r,{className:"p-0 hover:bg-transparent",children:a(i,{colSpan:"4",className:"p-0 border-0",children:a(P,{detailData:t.original.pinjaman})})},`newrow${e}`)]})},e)):a(r,{children:a(i,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})})]})};export{z as default};
