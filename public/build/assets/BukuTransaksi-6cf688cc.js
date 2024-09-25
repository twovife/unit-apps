import{r as s,j as r,a as e,b as A}from"./app-6f41ea55.js";import{S as u}from"./SearchComponent-d7b27c37.js";import{A as O}from"./AuthenticatedLayout-08d06c68.js";import{B as t}from"./button-c3c23cc6.js";import j from"./Create-163511f7.js";import P from"./BukuTransaksiTable-9c4cd61a.js";import{P as _,a as D,F as L,b as z}from"./popover-572f52ef.js";import{T as F,a as M,b as d,c as k}from"./tabs-08634156.js";import R from"./Rencana-8e7a7c1a.js";import"./table-e5a48510.js";import"./dialog-9a2a1bd6.js";import"./card-fe7125ef.js";import"./Loading-8a7dd92c.js";import"./label-20ddd90c.js";import"./index.esm-ea129bf0.js";import H from"./Approval-408d29b5.js";import{C as f}from"./circle-plus-57cd5ccd.js";import{c as w}from"./createLucideIcon-7c9aa304.js";import"./SelectComponent-e17edaa0.js";import"./input-f7765aff.js";import"./utils-36e2ef84.js";import"./react-icons.esm-1bb75465.js";import"./index-6fff1c53.js";import"./index-66872147.js";import"./SweetAlert-44be5df9.js";import"./index-3568c39e.js";import"./InputError-b4e0c872.js";import"./RiwayatPengajuan-f5ef0417.js";import"./index-ae5c3c26.js";import"./DetailRiwayat-a645d7ac.js";import"./FormatNumbering-9ee1b047.js";import"./react-number-format.es-e3a92009.js";import"./play-0a859462.js";import"./transition-31f369b9.js";import"./index-4127c4c4.js";import"./index-cd17374b.js";import"./Action-40f02570.js";import"./badge-4d6b0252.js";import"./Acc-b0282622.js";import"./Tolak-bdef2a80.js";import"./DropJadi-7c4ac283.js";import"./Gagal-28bfd55b.js";import"./BargeStatus-24d1f21d.js";import"./BadgeStatus-9f3134ae.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=w("ArrowBigLeft",[["path",{d:"M18 15h-6v4l-7-7 7-7v4h6v6z",key:"lbrdak"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=w("ArrowBigRight",[["path",{d:"M6 9h6V5l7 7-7 7v-4H6V9z",key:"7fvt9c"}]]),Le=({datas:i,buku_rencana:b,auth:o,...G})=>{const[g,v]=s.useState([]);s.useEffect(()=>{v(i.flat())},[i]);const[x,l]=s.useState(!1),c=a=>{l(!0)},C=a=>{l(!1)},[T,m]=s.useState(!1),[N,K]=s.useState(!1),S=a=>{m(!0)},y=a=>{m(!1)},[p,n]=s.useState(null),h=a=>{n(a)};return r(O,{header:e(A,{children:"Buku Transaksi"}),children:[e(H,{show:T,onClosed:y,triggeredData:g,triggeredDate:N}),r("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[e("div",{className:"flex-none shrink-0 whitespace-nowrap",children:e("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),e("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:e(u,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:o.permissions.includes("can show kelompok"),searchGroupingBranch:o.permissions.includes("can show branch"),nexOrPrevious:p,setNexOrPrevious:n,children:o.permissions.includes("can create")&&r(t,{type:"button",onClick:c,children:[e(f,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:[r(_,{children:[e(D,{asChild:!0,children:r(t,{variant:"outline",children:[e(L,{className:"h-4"}),"Filter"]})}),e(z,{children:e(u,{urlLink:route("transaction.index_buku_transaksi"),localState:"transaction_index_buku_transaksi",searchMonth:!0,searchHari:!0,searchKelompok:o.permissions.includes("can show kelompok"),searchGroupingBranch:o.permissions.includes("can show branch"),nexOrPrevious:p,setNexOrPrevious:n})})]}),r(t,{type:"button",onClick:c,children:[e(f,{className:"h-3.5 w-3.5"}),e("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Tambah Pengajuan"})]})]})]}),e(j,{show:x,onClosed:C}),e("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:r(F,{defaultValue:"bukutransaksi",className:"w-full",children:[r("div",{className:"flex items-center justify-between",children:[r(M,{children:[e(d,{value:"bukutransaksi",children:"Buku Transaksi"}),e(d,{value:"dailyTarget",children:"Rencana Drop"})]}),e(t,{onClick:S,size:"sm",className:"mr-3",children:"Cek Transaksi"})]}),e(k,{value:"bukutransaksi",children:i&&i.map((a,B)=>e(P,{datas:a},B))}),e(k,{value:"dailyTarget",children:e(R,{datas:b})})]})}),r("div",{className:"flex justify-between w-full mt-3",children:[e(t,{onClick:()=>h("previous"),size:"icon",children:e(V,{})}),e(t,{onClick:()=>h("next"),size:"icon",children:e(E,{})})]})]})};export{Le as default};