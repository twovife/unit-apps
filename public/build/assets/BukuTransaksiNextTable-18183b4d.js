import{r as l,j as i,a,d as T,F as D,R as v}from"./app-894fb644.js";import{F as r,T as N,a as S,b as n,c as h,d as K,e as f,f as R}from"./FormatNumbering-1c98251f.js";import{u as _,f as m,g as B}from"./index-32ba0184.js";import F from"./Action-75d1992c.js";import{B as M}from"./BargeStatus-7bcc4f2b.js";import{B as k}from"./BadgeStatus-dfc17f1e.js";import"./utils-46f1eee5.js";import"./react-number-format.es-fde60237.js";import"./dialog-a5dfac83.js";import"./index-b8da1699.js";import"./react-icons.esm-bacaa70f.js";import"./index-1ee04d40.js";import"./button-9da4f797.js";import"./index-f96983da.js";import"./card-e75d9471.js";import"./tabs-72060df1.js";import"./index-b32be6a7.js";import"./RiwayatPengajuan-6cfaede1.js";import"./DetailRiwayat-ee80ce7c.js";import"./play-1f63a44c.js";import"./createLucideIcon-fdae9c18.js";import"./Acc-4c641bc3.js";import"./Loading-b2556a0b.js";import"./transition-dd2a41ee.js";import"./label-b28b47d1.js";import"./index-b4346aa2.js";import"./index.esm-481f5ba8.js";import"./Tolak-20207dfd.js";import"./DropJadi-c014de93.js";import"./Gagal-ad1dea0d.js";import"./DetailTableOnAction-f5efbde2.js";import"./badge-9ff1b0cb.js";import"./RemoveLoan-d6be2195.js";import"./ReStatus-5105dab8.js";import"./SelectList-b22ee93b.js";import"./ChangeDetail-b6d9643e.js";import"./input-0ac0cdb0.js";const Ce=({datas:d})=>{const[p,b]=l.useState([]);l.useEffect(()=>{b(d)},[d]);const s=(e=>e.reduce((o,t)=>(o.request+=t.request||0,o.drop+=t.drop||0,o.drop_jadi+=t.drop_jadi||0,o.acc+=t.acc||0,o),{request:0,drop:0,acc:0,drop_jadi:0}))(p),w=l.useMemo(()=>[{header:"Tgl Drop",accessorKey:"tanggal_drop",cell:({getValue:e,cell:o})=>i("div",{className:"flex items-center justify-center gap-3",children:[a("div",{children:T(e()).format("DD-MM-YY")}),a(k,{value:o.row.original.drop_langsung})]})},{header:"Status",type:"show",accessorKey:"status",cell:({getValue:e})=>e()},{header:"Nama",accessorKey:"nama",cell:({getValue:e})=>e()},{header:"Alamat",accessorKey:"alamat",cell:({getValue:e})=>e()},{header:"No Angt",accessorKey:"nomor_anggota",cell:({getValue:e})=>e()},{header:"Pinj ke",accessorKey:"pinjaman_ke",cell:({getValue:e})=>e()},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop})},{header:"Pengajuan",accessorKey:"request",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.request})},{header:"Acc",accessorKey:"acc",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.acc})},{header:"Drop Jadi",accessorKey:"drop_jadi",cell:({getValue:e})=>a(r,{value:e()}),footer:e=>a(r,{value:s.drop_jadi})}],[s]),c=_({data:p,columns:w,getCoreRowModel:B(),debugTable:!0}),[y,u]=l.useState(!1),[C,g]=l.useState(),j=e=>{u(!0),g(e)};return i(D,{children:[a(F,{show:y,onClosed:e=>{u(!1),g()},triggeredData:C}),i(N,{className:"w-full mb-3 table-auto",children:[a(S,{className:"sticky top-0 z-10 bg-gray-100",children:c.getHeaderGroups().map((e,o)=>a(n,{children:e.headers.map((t,x)=>a(h,{className:"text-center",children:m(t.column.columnDef.header,t.getContext())},x))},o))}),a(K,{children:c.getRowModel().rows.length?c.getRowModel().rows.map((e,o)=>a(v.Fragment,{children:a(n,{className:"text-center",children:e.getVisibleCells().map(t=>a(f,{className:`${t.column.columnDef.className}`,children:t.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(M,{value:t.row.original.status,onClick:()=>j(t.row.original)})}):m(t.column.columnDef.cell,t.getContext())},t.id))},o)},o)):a(n,{children:a(f,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(R,{children:c.getFooterGroups().map(e=>a(n,{children:e.headers.map(o=>a(h,{className:"text-center text-black bg-gray-100",children:m(o.column.columnDef.footer,o.getContext())},o.id))},e.id))})]})]})};export{Ce as default};
