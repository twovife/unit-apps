import{r as s,j as e,a as r,b as h,d}from"./app-894fb644.js";import{S as m}from"./SearchComponent-c8a7ca8b.js";import"./Navbar-ab0dec55.js";import"./SweetAlert-02741e5d.js";import"./Loading-b2556a0b.js";import{B as u}from"./button-9da4f797.js";import"./card-e75d9471.js";import"./dialog-a5dfac83.js";import"./tabs-72060df1.js";import"./input-0ac0cdb0.js";import"./label-b28b47d1.js";import"./index.esm-481f5ba8.js";import"./FormatNumbering-1c98251f.js";import f from"./BukuTransaksiTable-df166488.js";import{P as k,a as b,F as x,b as g}from"./popover-0d900f70.js";import"./postcss-c548550e.js";import{M as v}from"./MobileLayout-4cc9a99a.js";import"./SelectComponent-2a477649.js";import"./react-icons.esm-bacaa70f.js";import"./index-1ee04d40.js";import"./index-f9bf1c67.js";import"./createLucideIcon-fdae9c18.js";import"./index-b32be6a7.js";import"./utils-46f1eee5.js";import"./transition-dd2a41ee.js";import"./index-f96983da.js";import"./index-b8da1699.js";import"./index-b4346aa2.js";import"./react-number-format.es-fde60237.js";import"./Action-f37d5a16.js";import"./DropJadi-dd749eb1.js";import"./Gagal-0520d9e7.js";import"./DetailTableOnAction-52d9476e.js";import"./badge-9ff1b0cb.js";import"./RemoveLoan-b0eb124c.js";import"./ReStatus-fb9a4142.js";import"./SelectList-b22ee93b.js";import"./ChangeDetail-ccd928f9.js";import"./BargeStatus-7bcc4f2b.js";const lr=({datas:o,auth:i,...w})=>{const[N,p]=s.useState([]);s.useEffect(()=>{p(o.flat())},[o]);const[t,n]=s.useState(null);return e(v,{header:r(h,{children:"Buku Transaksi"}),children:[e("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(m,{urlLink:route("mobile_apps.transaksi"),localState:"mobile_apps_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:i.permissions.includes("can show kelompok"),searchGroupingBranch:i.permissions.includes("can show branch"),nexOrPrevious:t,setNexOrPrevious:n})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:e(k,{children:[r(b,{asChild:!0,children:e(u,{variant:"outline",children:[r(x,{className:"h-4"}),"Filter"]})}),r(g,{children:r(m,{urlLink:route("mobile_apps.transaksi"),localState:"mobile_apps_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:i.permissions.includes("can show kelompok"),searchGroupingBranch:i.permissions.includes("can show branch"),nexOrPrevious:t,setNexOrPrevious:n})})]})})]}),r("div",{className:"max-h-[70vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:o&&o.map((a,c)=>{var l;return console.log(a),e("div",{className:"mb-3 border rounded-lg",children:[e("div",{className:"p-1 px-2 text-sm",children:["Transaksi Tanggal :",d((l=a[0])==null?void 0:l.tanggal_drop).format("DD-MM-YYYY")]}),r(f,{datas:a},c)]})})})]})};export{lr as default};
