import{r as n,q as N,j as p,a,c as R,F as S,R as j}from"./app-779ec234.js";import{F as t,T as F,a as M,b as i,c as f,d as O,e as g,f as B}from"./FormatNumbering-4258954a.js";import{u as H,f as u,g as _}from"./index-e2fa29d8.js";import{B as h}from"./BargeStatus-0420e3f2.js";import"./button-a6591cf8.js";import"./utils-36e2ef84.js";import"./react-number-format.es-7e420cb1.js";const L=({setOnShowModal:b,setTriggeredData:v,setTriggeredType:y,datas:d})=>{const[m,w]=n.useState([]),{auth:T}=N().props;n.useEffect(()=>{w(d)},[d]);const s=(e=>e.reduce((o,r)=>(Object.keys(r).forEach(l=>{o[l]=(o[l]||0)+(r[l]||0)}),o),{}))(m),x=(e,o)=>{b(!0),v(e),y(o)},C=n.useMemo(()=>[{header:"",accessorKey:"kelompok",cell:({getValue:e,cell:o})=>p("div",{className:"flex items-center justify-center gap-3",children:[a("div",{children:o.row.original.type=="daily"?e():R(o.row.original.tanggal).format("DD-MM")}),T.permissions.includes("can update")&&a(h,{onClick:()=>x(o.row.original,1),value:o.row.original.status_dayly_approval,children:o.row.original.status_dayly_approval?"Approved":"Open"})]})},{header:"Kasbon",accessorKey:"kasbon",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.kasbon})},{header:"Storting",accessorKey:"storting",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.storting})},{header:"DO11%",accessorKey:"do11",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.do11})},{header:"Deb",accessorKey:"debit",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.debit})},{header:"Drop",accessorKey:"drop",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.drop})},{header:"Transport",accessorKey:"transport",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.transport})},{header:"Kre",accessorKey:"kredit",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.kredit})},{header:"Tunai",accessorKey:"tunai",cell:({getValue:e})=>a(t,{value:e()}),footer:e=>a(t,{value:s.tunai})}],[s]),c=H({data:m,columns:C,getCoreRowModel:_(),debugTable:!0}),[E,D]=n.useState(!1),[q,K]=n.useState(),k=e=>{D(!0),K(e)};return a(S,{children:p(F,{className:"w-full mb-3 table-auto",children:[a(M,{className:"sticky top-0 z-10 bg-gray-100",children:c.getHeaderGroups().map((e,o)=>a(i,{children:e.headers.map((r,l)=>a(f,{className:"text-center",children:u(r.column.columnDef.header,r.getContext())},l))},o))}),a(O,{children:c.getRowModel().rows.length?c.getRowModel().rows.map((e,o)=>a(j.Fragment,{children:a(i,{className:"text-center",children:e.getVisibleCells().map(r=>a(g,{className:`${r.column.columnDef.className}`,children:r.column.columnDef.type=="show"?a("div",{className:"flex items-center justify-center gap-2",children:a(h,{value:r.row.original.status,onClick:()=>k(r.row.original)})}):u(r.column.columnDef.cell,r.getContext())},r.id))},o)},o)):a(i,{children:a(g,{colSpan:"4",children:"Belum Ada Catatan Pinjaman"})})}),a(B,{children:c.getFooterGroups().map(e=>a(i,{children:e.headers.map(o=>a(f,{className:"text-center text-black bg-gray-100",children:u(o.column.columnDef.footer,o.getContext())},o.id))},e.id))})]})})};export{L as default};
