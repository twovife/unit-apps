import{r as l,j as i,a,c as D,F as T,R as v}from"./app-3a486d21.js";import{F as r,T as N,a as S,b as n,c as h,d as K,e as f,f as R}from"./FormatNumbering-5b4293d6.js";import{u as _,f as m,g as B}from"./index-97831a2a.js";import F from"./Action-6ecfe798.js";import{B as M}from"./BargeStatus-ddde7db3.js";import{B as k}from"./BadgeStatus-da57c0a5.js";import"./utils-36e2ef84.js";import"./react-number-format.es-c6c21ae2.js";import"./dialog-40faced7.js";import"./index-1ac019a9.js";import"./index-b11542d4.js";import"./button-86a9f00e.js";import"./react-icons.esm-4455653d.js";import"./index-3bc92c50.js";import"./index-c9709444.js";import"./card-4303b3a0.js";import"./tabs-7c5298e1.js";import"./RiwayatPengajuan-07b83aa9.js";import"./badge-7a94ba86.js";import"./Acc-bf7267ba.js";import"./Loading-bf985ab0.js";import"./transition-2ab53969.js";import"./NoEditOverlay-28b780f6.js";import"./useFrontEndPermission-f7e3c78b.js";import"./label-0db42a0f.js";import"./index-9c7bfea1.js";import"./index.esm-6e044766.js";import"./ActionTable-cb0423fd.js";import"./RemoveLoan-8c1e4412.js";import"./ChangeDetail-023fbb6a.js";import"./input-d06c8f20.js";const ge=({datas:d})=>{const[p,w]=l.useState([]);l.useEffect(()=>{w(d)},[d]);const s=(e=>e.reduce((o,t)=>(o.request+=t.request||0,o.drop+=t.drop||0,o.drop_jadi+=t.drop_jadi||0,o.acc+=t.acc||0,o),{request:0,drop:0,acc:0,drop_jadi:0}))(p),b=l.useMemo(()=>[{header:"Tgl Drop",accessorKey:"tanggal_drop",cell:({getValue:e,cell:o})=>i("div",{className:"flex flex-col items-center justify-center gap-1 lg:gap-3 lg:flex-row",children:[a("div",{className:"whitespace-nowrap",children:D(e()).format("DD-MM-YY")}),a(k,{value:o.row.original.drop_langsung})]})},{header:"Status",type:"show",accessorKey:"status",cell:({getValue:e})=>e()},{header:"Nama",accessorKey:"nama",cell:({getValue:e})=>e()},{header:"Alamat",accessorKey:"alamat",cell:({getValue:e})=>e()},{header:"No Angt",accessorKey:"nomor_anggota",cell:({getValue:e})=>e()},{header:"Pinj ke",accessorKey:"pinjaman_ke",cell:({getValue:e})=>e()},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop})},{header:"Pengajuan",accessorKey:"request",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.request})},{header:"Acc",accessorKey:"acc",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.acc})},{header:"Drop Jadi",accessorKey:"drop_jadi",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop_jadi})}],[s]),c=_({data:p,columns:b,getCoreRowModel:B(),debugTable:!0}),[x,u]=l.useState(!1),[y,g]=l.useState(),C=e=>{u(!0),g(e)};return i(T,{children:[a(F,{show:x,onClosed:e=>{u(!1),g()},triggeredData:y}),i(N,{className:"w-full mb-3 text-xs table-auto",children:[a(S,{className:"sticky top-0 z-10 bg-gray-100",children:c.getHeaderGroups().map((e,o)=>a(n,{children:e.headers.map((t,j)=>a(h,{className:"text-center",children:m(t.column.columnDef.header,t.getContext())},j))},o))}),a(K,{children:c.getRowModel().rows.length?c.getRowModel().rows.map((e,o)=>a(v.Fragment,{children:a(n,{className:"text-center",children:e.getVisibleCells().map(t=>a(f,{className:`${t.column.columnDef.className}`,children:t.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(M,{value:t.row.original.status,onClick:()=>C(t.row.original)})}):m(t.column.columnDef.cell,t.getContext())},t.id))},o)},o)):a(n,{children:a(f,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(R,{children:c.getFooterGroups().map(e=>a(n,{children:e.headers.map(o=>a(h,{className:"text-center text-black bg-gray-100",children:m(o.column.columnDef.footer,o.getContext())},o.id))},e.id))})]})]})};export{ge as default};