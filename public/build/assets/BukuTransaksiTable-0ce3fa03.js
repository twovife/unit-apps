import{r as l,j as i,a,d as T,F as D,R as v}from"./app-49513fe7.js";import{F as r,T as N,a as S,b as n,c as h,d as K,e as f,f as R}from"./FormatNumbering-aa0fb6f2.js";import{u as _,f as m,g as B}from"./index-30164b0a.js";import F from"./Action-98932743.js";import{B as M}from"./BargeStatus-21c38151.js";import{B as k}from"./BadgeStatus-9f176e10.js";import"./utils-46f1eee5.js";import"./react-number-format.es-af5b4c77.js";import"./dialog-d18ad688.js";import"./index-d19021c0.js";import"./react-icons.esm-665c9a46.js";import"./index-d6d6f4c3.js";import"./button-02e9f315.js";import"./index-f96983da.js";import"./card-1edd8ef7.js";import"./tabs-78c20ec0.js";import"./index-77e42ac0.js";import"./RiwayatPengajuan-1e8858af.js";import"./DetailRiwayat-4c6b60e0.js";import"./play-68195996.js";import"./createLucideIcon-274b4533.js";import"./Acc-da1ba1e9.js";import"./Loading-464ad84f.js";import"./transition-265a589d.js";import"./label-01aff0bc.js";import"./index-0b4e949c.js";import"./index.esm-1256866f.js";import"./Tolak-c733ac0f.js";import"./DropJadi-36aa3454.js";import"./Gagal-ffe0f39f.js";import"./DetailTableOnAction-13b7d732.js";import"./badge-bc671c0a.js";import"./RemoveLoan-f76bbfce.js";import"./ReStatus-e102171a.js";import"./SelectList-3ec2eb3f.js";import"./ChangeDetail-f310abd7.js";import"./input-f62b4336.js";const ye=({datas:d})=>{const[p,w]=l.useState([]);l.useEffect(()=>{w(d)},[d]);const s=(e=>e.reduce((o,t)=>(o.request+=t.request||0,o.drop+=t.drop||0,o.drop_jadi+=t.drop_jadi||0,o.acc+=t.acc||0,o),{request:0,drop:0,acc:0,drop_jadi:0}))(p),b=l.useMemo(()=>[{header:"Tgl Drop",accessorKey:"tanggal_drop",cell:({getValue:e,cell:o})=>i("div",{className:"flex flex-col items-center justify-center gap-1 lg:gap-3 lg:flex-row",children:[a("div",{className:"whitespace-nowrap",children:T(e()).format("DD-MM-YY")}),a(k,{value:o.row.original.drop_langsung})]})},{header:"Status",type:"show",accessorKey:"status",cell:({getValue:e})=>e()},{header:"Nama",accessorKey:"nama",cell:({getValue:e})=>e()},{header:"Alamat",accessorKey:"alamat",cell:({getValue:e})=>e()},{header:"No Angt",accessorKey:"nomor_anggota",cell:({getValue:e})=>e()},{header:"Pinj ke",accessorKey:"pinjaman_ke",cell:({getValue:e})=>e()},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop})},{header:"Pengajuan",accessorKey:"request",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.request})},{header:"Acc",accessorKey:"acc",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.acc})},{header:"Drop Jadi",accessorKey:"drop_jadi",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop_jadi})}],[s]),c=_({data:p,columns:b,getCoreRowModel:B(),debugTable:!0}),[x,u]=l.useState(!1),[y,g]=l.useState(),C=e=>{u(!0),g(e)};return i(D,{children:[a(F,{show:x,onClosed:e=>{u(!1),g()},triggeredData:y}),i(N,{className:"w-full mb-3 text-xs table-auto",children:[a(S,{className:"sticky top-0 z-10 bg-gray-100",children:c.getHeaderGroups().map((e,o)=>a(n,{children:e.headers.map((t,j)=>a(h,{className:"text-center",children:m(t.column.columnDef.header,t.getContext())},j))},o))}),a(K,{children:c.getRowModel().rows.length?c.getRowModel().rows.map((e,o)=>a(v.Fragment,{children:a(n,{className:"text-center",children:e.getVisibleCells().map(t=>a(f,{className:`${t.column.columnDef.className}`,children:t.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(M,{value:t.row.original.status,onClick:()=>C(t.row.original)})}):m(t.column.columnDef.cell,t.getContext())},t.id))},o)},o)):a(n,{children:a(f,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(R,{children:c.getFooterGroups().map(e=>a(n,{children:e.headers.map(o=>a(h,{className:"text-center text-black bg-gray-100",children:m(o.column.columnDef.footer,o.getContext())},o.id))},e.id))})]})]})};export{ye as default};