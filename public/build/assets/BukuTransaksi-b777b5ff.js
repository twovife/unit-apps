import{r as l,j as i,a,c as D,F as T,R as v}from"./app-35d31ed9.js";import{T as N,a as S,b as n,c as h,d as K,e as f,f as R}from"./table-06e53020.js";import{u as _,f as m,g as B}from"./index-1469b9f7.js";import{F as r}from"./FormatNumbering-7d539e15.js";import F from"./Action-efc7307d.js";import{B as M}from"./BargeStatus-8ccd377a.js";import{B as k}from"./BadgeStatus-dd3c5d72.js";import"./utils-36e2ef84.js";import"./react-number-format.es-d26c8058.js";import"./dialog-5923ce6e.js";import"./index-d3423716.js";import"./index-30fd9ee9.js";import"./button-1aa3a58c.js";import"./react-icons.esm-2b559b63.js";import"./index-4dbb77c9.js";import"./index-2b75c312.js";import"./card-201f9aba.js";import"./tabs-d27c9ef9.js";import"./RiwayatPengajuan-e98b5a16.js";import"./badge-a296b71f.js";import"./Acc-64600fbe.js";import"./Loading-4c55c56e.js";import"./transition-e7b86cd0.js";import"./NoEditOverlay-19559f6f.js";import"./useFrontEndPermission-35e96759.js";import"./label-abe714e5.js";import"./index-c504300c.js";import"./index.esm-afbbfe1e.js";import"./ActionTable-7f494273.js";import"./RemoveLoan-9f8962d4.js";import"./ChangeDetail-1ccbc071.js";import"./input-68668017.js";const he=({datas:d})=>{const[p,w]=l.useState([]);l.useEffect(()=>{w(d)},[d]);const s=(e=>e.reduce((o,t)=>(o.request+=t.request||0,o.drop+=t.drop||0,o.drop_jadi+=t.drop_jadi||0,o.acc+=t.acc||0,o),{request:0,drop:0,acc:0,drop_jadi:0}))(p),b=l.useMemo(()=>[{header:"Tgl Drop",accessorKey:"tanggal_drop",cell:({getValue:e,cell:o})=>i("div",{className:"flex flex-col items-center justify-center gap-1 lg:gap-3 lg:flex-row",children:[a("div",{className:"whitespace-nowrap",children:D(e()).format("DD-MM-YY")}),a(k,{value:o.row.original.drop_langsung})]})},{header:"Status",type:"show",accessorKey:"status",cell:({getValue:e})=>e()},{header:"Nama",accessorKey:"nama",cell:({getValue:e})=>e()},{header:"Alamat",accessorKey:"alamat",cell:({getValue:e})=>e()},{header:"No Angt",accessorKey:"nomor_anggota",cell:({getValue:e})=>e()},{header:"Pinj ke",accessorKey:"pinjaman_ke",cell:({getValue:e})=>e()},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop})},{header:"Pengajuan",accessorKey:"request",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.request})},{header:"Acc",accessorKey:"acc",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.acc})},{header:"Drop Jadi",accessorKey:"drop_jadi",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop_jadi})}],[s]),c=_({data:p,columns:b,getCoreRowModel:B(),debugTable:!0}),[x,u]=l.useState(!1),[y,g]=l.useState(),C=e=>{u(!0),g(e)};return i(T,{children:[a(F,{show:x,onClosed:e=>{u(!1),g()},triggeredData:y}),i(N,{className:"w-full mb-3 text-xs table-auto",children:[a(S,{className:"sticky top-0 z-10 bg-gray-100",children:c.getHeaderGroups().map((e,o)=>a(n,{children:e.headers.map((t,j)=>a(h,{className:"text-center",children:m(t.column.columnDef.header,t.getContext())},j))},o))}),a(K,{children:c.getRowModel().rows.length?c.getRowModel().rows.map((e,o)=>a(v.Fragment,{children:a(n,{className:"text-center",children:e.getVisibleCells().map(t=>a(f,{className:`${t.column.columnDef.className}`,children:t.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(M,{value:t.row.original.status,onClick:()=>C(t.row.original)})}):m(t.column.columnDef.cell,t.getContext())},t.id))},o)},o)):a(n,{children:a(f,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(R,{children:c.getFooterGroups().map(e=>a(n,{children:e.headers.map(o=>a(h,{className:"text-center text-black bg-gray-100",children:m(o.column.columnDef.footer,o.getContext())},o.id))},e.id))})]})]})};export{he as default};
