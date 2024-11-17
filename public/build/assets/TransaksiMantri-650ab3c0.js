import{r as i,j as e,a as r,b as w}from"./app-01dbd2ca.js";import{S as c,P as g,a as x,F as y,b as v}from"./popover-c2744ca3.js";import{A as T}from"./AuthenticatedLayout-8a7eacb9.js";import{B as n}from"./button-e594156b.js";import{T as C,a as N,b as m,c as p}from"./tabs-187fcb4b.js";import S from"./BukuTransaksi-6ee6555e.js";import _ from"./Create-c8aaf51d.js";import j from"./Rencana-985c8e04.js";import{c as B}from"./createLucideIcon-72decb57.js";import"./SelectComponent-41d65774.js";import"./input-2f9dcac5.js";import"./utils-36e2ef84.js";import"./react-icons.esm-e69bb1a2.js";import"./index-0257f697.js";import"./index-e96bcad6.js";import"./Loading-bacf33e9.js";import"./transition-37508b69.js";import"./label-a59e5876.js";import"./index-be647e53.js";import"./index-1a5a975e.js";import"./Navbar-deb25518.js";import"./SweetAlert-bc29475f.js";import"./index-9c33a239.js";import"./FormatNumbering-750d2fb1.js";import"./react-number-format.es-7ab5d1fe.js";import"./index-758bbc06.js";import"./Action-cfb5643c.js";import"./dialog-e5ae602b.js";import"./index-4d3b6f23.js";import"./card-7ec1f0b3.js";import"./RiwayatPengajuan-aa121312.js";import"./BadgeStatus-5eefca01.js";import"./badge-61cfb712.js";import"./Acc-de65c6b2.js";import"./NoEditOverlay-5ca8dba7.js";import"./useFrontEndPermission-7736c5f3.js";import"./index.esm-eff4be9d.js";import"./ActionTable-dd98cf4e.js";import"./RemoveLoan-15ce4d30.js";import"./ChangeDetail-763bcfdb.js";import"./BargeStatus-71fa1036.js";import"./NewNasabah-ba0064aa.js";import"./InputError-95ccc56c.js";import"./Checkbox-b0b6d04c.js";import"./x-7fa3aa2b.js";import"./Approval-70eec766.js";import"./InputLabel-2f797a2a.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=B("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]),Nr=({datas:a,buku_rencana:u,auth:s,...P})=>{const[M,d]=i.useState([]);i.useEffect(()=>{d(a.flat())},[a]);const[k,o]=i.useState(!1),l=t=>{o(!0)},f=t=>{o(!1)};return e(T,{header:r(w,{children:"Buku Transaksi"}),children:[e("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(c,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:s.permissions.includes("can show kelompok"),searchGroupingBranch:s.permissions.includes("can show branch"),children:s.permissions.includes("can create")&&e(n,{type:"button",onClick:l,children:[r(h,{className:"h-3.5 w-3.5"}),r("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),e("div",{className:"flex justify-end gap-3 lg:hidden",children:[e(g,{children:[r(x,{asChild:!0,children:e(n,{variant:"outline",children:[r(y,{className:"h-4"}),"Filter"]})}),r(v,{children:r(c,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:s.permissions.includes("can show kelompok"),searchGroupingBranch:s.permissions.includes("can show branch")})})]}),e(n,{type:"button",onClick:l,children:[r(h,{className:"h-3.5 w-3.5"}),r("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),r(_,{show:k,onClosed:f}),r("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(C,{defaultValue:"bukutransaksi",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:e(N,{children:[r(m,{value:"bukutransaksi",children:"Buku Transaksi"}),r(m,{value:"dailyTarget",children:"Rencana Drop"})]})}),r(p,{value:"bukutransaksi",children:a&&a.map((t,b)=>r(S,{datas:t},b))}),r(p,{value:"dailyTarget",children:r(j,{datas:u,dataTransaksi:a})})]})})]})};export{Nr as default};