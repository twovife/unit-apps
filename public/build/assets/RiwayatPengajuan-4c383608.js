import{r as n,j as c,a,R as w,F as x}from"./app-31b36b2d.js";import{T as y,a as T,b as r,c as j,d as N,e as i}from"./FormatNumbering-b7b746e0.js";import{u as R,f as d,D as C,g as D}from"./DetailRiwayat-fb9fbb22.js";import{B as P}from"./button-339395a9.js";import{c as K}from"./createLucideIcon-3f426ecb.js";import"./utils-36e2ef84.js";import"./react-number-format.es-3c4bd28d.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=K("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]),H=({data:m})=>{const[u,g]=n.useState([]);n.useEffect(()=>{g(m)},[m]);const[s,p]=n.useState(),h=t=>{p(e=>e===t?null:t)},b=n.useMemo(()=>[{accessorKey:"unit",header:"unit",type:"show",cell:({row:t,getValue:e})=>e()},{accessorKey:"kelompok",header:"Kelompok",cell:({row:t,getValue:e})=>e()},{accessorKey:"jumlah_pengajuan",header:"TTL Pengajuan",cell:({row:t,getValue:e})=>e()},{accessorKey:"jumlah_pinjaman",header:"TTL Pinjaman",cell:({row:t,getValue:e})=>e()}],[]),l=R({data:u,columns:b,getCoreRowModel:D(),debugTable:!0});return c(y,{className:"w-full table-auto",children:[a(T,{className:"sticky top-0 z-10 bg-gray-100",children:l.getHeaderGroups().map((t,e)=>a(r,{children:t.headers.map((o,f)=>a(j,{className:"text-center",children:d(o.column.columnDef.header,o.getContext())},f))},e))}),a(N,{children:l.getRowModel().rows.length?l.getRowModel().rows.map((t,e)=>a(w.Fragment,{children:c(x,{children:[a(r,{className:`${s==t.original.id?"border-b-0":""} text-center`,children:t.getVisibleCells().map(o=>a(i,{className:`${o.column.columnDef.className}`,children:o.column.columnDef.type=="show"?c("div",{className:"flex items-center justify-start gap-2",children:[a(P,{onClick:()=>h(o.row.original.id),type:"button",size:"icon",variant:"ghost",className:`${s==t.original.id?"rotate-90 text-green-700 bg-gradient-to-br from-green-50 to-green-100":""}`,children:a(M,{className:"h-4 w-auto transition-all duration-150"})}),a("div",{children:d(o.column.columnDef.cell,o.getContext())})]}):d(o.column.columnDef.cell,o.getContext())},o.id))},e),s==t.original.id&&a(r,{className:"p-0 hover:bg-transparent",children:a(i,{colSpan:"4",className:"p-0 border-0",children:a(C,{detailData:t.original.pinjaman})})},`newrow${e}`)]})},e)):a(r,{children:a(i,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})})]})};export{H as default};