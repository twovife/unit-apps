import{r as l,a,d as n,j as g,R as f}from"./app-d484a7d2.js";import{T as x,a as T,b as c,c as R,d as D,e as d}from"./table-28113ab4.js";import{u as M,f as m,g as j}from"./index-2ffe7b9c.js";import{F as w}from"./FormatNumbering-edbebc7d.js";import"./button-8c0bc7cc.js";import"./utils-3f044a58.js";import"./react-number-format.es-e89b213e.js";import"./index-98ca6607.js";const F=({detailData:o})=>{console.log(o);const[i,u]=l.useState([]),[p,y]=l.useState();l.useEffect(()=>{u(o)},[o]);const h=l.useMemo(()=>[{header:"Tgl Pengajuan",accessorKey:"request_date",cell:({getValue:e})=>a("div",{children:n(e()).format("DD/MM")})},{header:"Status Pengajuan",accessorKey:"status",cell:({getValue:e})=>e()},{header:"Tgl Drop",accessorKey:"drop_date",cell:({getValue:e})=>a("div",{children:n(e()).format("DD/MM")})},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(w,{value:e()})},{header:"Lunas",accessorKey:"lunas",cell:({getValue:e})=>e()?"Lunas":"Belum"},{header:"Status",accessorKey:"status_pinjaman",cell:({getValue:e})=>a("div",{className:`uppercase ${e()=="mb"||e()=="ml"?"bg-red-500 font-semibold":""}`,children:e()})}],[]),t=M({data:i,columns:h,getCoreRowModel:j(),debugTable:!0});return g(x,{className:"w-full table-auto",children:[a(T,{children:t.getHeaderGroups().map((e,r)=>a(c,{children:e.headers.map((s,b)=>a(R,{className:"text-center",children:m(s.column.columnDef.header,s.getContext())},b))},r))}),a(D,{children:t.getRowModel().rows.length?t.getRowModel().rows.map((e,r)=>a(f.Fragment,{children:a(c,{className:`${p==e.original.loan_id?"border-b-0":""} text-center`,children:e.getVisibleCells().map(s=>a(d,{className:`${s.column.columnDef.className}`,children:m(s.column.columnDef.cell,s.getContext())},s.id))},r)},r)):a(c,{children:a(d,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})})]})};export{F as default};
