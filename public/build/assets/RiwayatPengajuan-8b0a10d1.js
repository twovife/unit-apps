import{r as t,j as n,a,c as h,R as b,F as f}from"./app-dd5d88de.js";import{T as w,a as R,b as o,c as T,d as x,e as m}from"./table-d54f704d.js";import{u as y,f as d,g as j}from"./index-cabbab55.js";import"./button-cc368867.js";import{F as C}from"./FormatNumbering-d6810bb2.js";import{B as D}from"./BadgeStatus-4401e736.js";import"./utils-36e2ef84.js";import"./react-number-format.es-3a1d10c2.js";import"./badge-d25c8798.js";const H=({data:c})=>{const[i,u]=t.useState([]);t.useEffect(()=>{u(c??[])},[c]),t.useState();const p=t.useMemo(()=>[{accessorKey:"kelompok",header:"Kelompok",cell:({row:s,getValue:e})=>n("div",{children:[s.original.unit," - Kel ",e()]})},{accessorKey:"drop_date",header:"Tanggal Drop",cell:({row:s,getValue:e})=>a("div",{children:h(e()).format("DD-MM-YYYY")})},{accessorKey:"pinjaman",header:"Pinjaman",cell:({row:s,getValue:e})=>a(C,{value:e()})},{accessorKey:"lunas",header:"Lunas",cell:({row:s,getValue:e})=>a("div",{children:e()?"Lunas":"Belum"})},{accessorKey:"status",header:"status",cell:({row:s,getValue:e})=>a(D,{value:e()})}],[]),l=y({data:i,columns:p,getCoreRowModel:j(),debugTable:!0});return n(w,{className:"w-full table-auto",children:[a(R,{className:"sticky top-0 z-10 bg-gray-100",children:l.getHeaderGroups().map((s,e)=>a(o,{children:s.headers.map((r,g)=>a(T,{className:"text-center",children:d(r.column.columnDef.header,r.getContext())},g))},e))}),a(x,{children:l.getRowModel().rows.length?l.getRowModel().rows.map((s,e)=>a(b.Fragment,{children:a(f,{children:a(o,{className:"text-center",children:s.getVisibleCells().map(r=>a(m,{className:`${r.column.columnDef.className}`,children:d(r.column.columnDef.cell,r.getContext())},r.id))},e)})},e)):a(o,{children:a(m,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})})]})};export{H as default};
