import{r as l,j as i,a,c as D,F as T,R as v}from"./app-dd5d88de.js";import{T as N,a as S,b as n,c as h,d as K,e as f,f as R}from"./table-d54f704d.js";import{u as _,f as m,g as B}from"./index-cabbab55.js";import{F as r}from"./FormatNumbering-d6810bb2.js";import F from"./Action-b3475fdd.js";import{B as M}from"./BargeStatus-7cd1c1c1.js";import{B as k}from"./BadgeStatus-4401e736.js";import"./utils-36e2ef84.js";import"./react-number-format.es-3a1d10c2.js";import"./dialog-2d9e111f.js";import"./index-60452824.js";import"./index-c4845c96.js";import"./button-cc368867.js";import"./react-icons.esm-370ad885.js";import"./index-4a15253f.js";import"./index-71703707.js";import"./card-74aeb78f.js";import"./tabs-b542c6d3.js";import"./RiwayatPengajuan-8b0a10d1.js";import"./badge-d25c8798.js";import"./Acc-77d6528e.js";import"./Loading-7f25859b.js";import"./transition-7dacb077.js";import"./NoEditOverlay-1769054d.js";import"./useFrontEndPermission-93dca647.js";import"./label-b1b09a72.js";import"./index-aa4e1d5d.js";import"./index.esm-c9659912.js";import"./ActionTable-19861877.js";import"./RemoveLoan-d40c9dde.js";import"./ChangeDetail-4239cd8e.js";import"./input-b4c964f5.js";const he=({datas:d})=>{const[p,w]=l.useState([]);l.useEffect(()=>{w(d)},[d]);const s=(e=>e.reduce((o,t)=>(o.request+=t.request||0,o.drop+=t.drop||0,o.drop_jadi+=t.drop_jadi||0,o.acc+=t.acc||0,o),{request:0,drop:0,acc:0,drop_jadi:0}))(p),b=l.useMemo(()=>[{header:"Tgl Drop",accessorKey:"tanggal_drop",cell:({getValue:e,cell:o})=>i("div",{className:"flex flex-col items-center justify-center gap-1 lg:gap-3 lg:flex-row",children:[a("div",{className:"whitespace-nowrap",children:D(e()).format("DD-MM-YY")}),a(k,{value:o.row.original.drop_langsung})]})},{header:"Status",type:"show",accessorKey:"status",cell:({getValue:e})=>e()},{header:"Nama",accessorKey:"nama",cell:({getValue:e})=>e()},{header:"Alamat",accessorKey:"alamat",cell:({getValue:e})=>e()},{header:"No Angt",accessorKey:"nomor_anggota",cell:({getValue:e})=>e()},{header:"Pinj ke",accessorKey:"pinjaman_ke",cell:({getValue:e})=>e()},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop})},{header:"Pengajuan",accessorKey:"request",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.request})},{header:"Acc",accessorKey:"acc",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.acc})},{header:"Drop Jadi",accessorKey:"drop_jadi",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop_jadi})}],[s]),c=_({data:p,columns:b,getCoreRowModel:B(),debugTable:!0}),[x,u]=l.useState(!1),[y,g]=l.useState(),C=e=>{u(!0),g(e)};return i(T,{children:[a(F,{show:x,onClosed:e=>{u(!1),g()},triggeredData:y}),i(N,{className:"w-full mb-3 text-xs table-auto",children:[a(S,{className:"sticky top-0 z-10 bg-gray-100",children:c.getHeaderGroups().map((e,o)=>a(n,{children:e.headers.map((t,j)=>a(h,{className:"text-center",children:m(t.column.columnDef.header,t.getContext())},j))},o))}),a(K,{children:c.getRowModel().rows.length?c.getRowModel().rows.map((e,o)=>a(v.Fragment,{children:a(n,{className:"text-center",children:e.getVisibleCells().map(t=>a(f,{className:`${t.column.columnDef.className}`,children:t.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(M,{value:t.row.original.status,onClick:()=>C(t.row.original)})}):m(t.column.columnDef.cell,t.getContext())},t.id))},o)},o)):a(n,{children:a(f,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(R,{children:c.getFooterGroups().map(e=>a(n,{children:e.headers.map(o=>a(h,{className:"text-center text-black bg-gray-100",children:m(o.column.columnDef.footer,o.getContext())},o.id))},e.id))})]})]})};export{he as default};
