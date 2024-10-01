import{a as e,q as _,r as o,j as t,d as D,e as P}from"./app-bbbb9813.js";import{D as H,a as B,b as L,c as E}from"./dialog-ca804f01.js";import{C,a as y,b as T,d as w}from"./card-b1f77b5f.js";import{T as v,a as S,b as s,c as n,d as Y,e as a}from"./table-c493f1c6.js";import{F as k}from"./FormatNumbering-f8f87953.js";import{B as c}from"./badge-0b28799c.js";import I from"./BayarAngsuran-08aedc25.js";import K from"./JenisNasabah-73f4a9c3.js";import O from"./DeleteAngsuran-d66eb28c.js";import R from"./DeleteLoan-9572e714.js";import"./index-952e433c.js";import"./react-icons.esm-9d66f758.js";import"./index-463fef4e.js";import"./button-980248e4.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./react-number-format.es-5b468fed.js";import"./label-d990cf67.js";import"./index-0f3ff2b4.js";import"./input-47a21bcf.js";import"./index.esm-89937cb9.js";import"./Checkbox-d493c0d7.js";import"./Loading-c4649ed5.js";import"./transition-07aaf9e3.js";import"./InputError-d676faa3.js";import"./InputLabel-f1416a62.js";import"./PrimaryButton-8e3f1dc4.js";import"./SelectList-04ad65bd.js";import"./TextInput-77a5acd1.js";const h=({value:l="normal"})=>{switch(l==null?void 0:l.toLowerCase()){case"normal":return e(c,{variant:"outline",children:l});case"cm":return e(c,{variant:"yellow",children:l});case"mb":return e(c,{variant:"destructive",children:l});case"ml":return e(c,{children:l});case"lunas":return e(c,{variant:"green",children:l});case"belum":return e(c,{variant:"outline",children:l});default:return e(c,{children:l})}},be=({datas:l,show:p=!1,onClosed:A,triggeredId:d})=>{const{server_filter:{closed_transaction:u}}=_().props,[F,N]=o.useState(!1),[J,x]=o.useState(!1),[r,f]=o.useState({}),[g,b]=o.useState([]),M=async i=>{N(!0),x(),await P({method:"get",url:route("pinjaman.get_loan_pinjaman",i)}).then(function({data:m}){N(!1),f(m.pinjaman),b(m.instalment)}).catch(function({response:m}){x()})};o.useEffect(()=>{d&&M(d)},[d,l]);const j=()=>{A(),f({}),b([])};return e(H,{open:p,onOpenChange:i=>i?"":j(),children:t(B,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[e(L,{className:"max-h-10",children:e(E,{children:"Isi Angsuran"})}),t(C,{className:"w-full",children:[e(y,{children:e(T,{children:"Rincian Pinjaman"})}),e(w,{children:t(v,{children:[e(S,{className:"bg-gray-200",children:t(s,{children:[e(n,{className:"text-center",children:"Nomor"}),e(n,{className:"text-center",children:"Nasabah"}),e(n,{className:"text-center",children:"NIK"}),e(n,{className:"text-center",children:"Alamat"}),e(n,{className:"text-center",children:"Unit"}),e(n,{className:"text-center",children:"Kelompok"}),e(n,{className:"text-center",children:"Hari"}),e(n,{className:"text-center",children:"Tanggal Drop"}),e(n,{className:"text-center",children:"Pinjaman"}),e(n,{className:"text-center",children:"Nama Mantri"}),e(n,{className:"text-center",children:"Status"}),e(n,{className:"text-center",children:"Ket"}),e(n,{className:"text-center",children:"Lunas"})]})}),e(Y,{children:Object.keys(r).length!==0?t(s,{className:"text-center",children:[e(a,{children:r.id}),e(a,{children:r.nama}),e(a,{children:r.nik}),e(a,{children:r.alamat}),e(a,{children:r.branch}),e(a,{children:r.kelompok}),e(a,{children:r.hari}),e(a,{children:D(r.tanggal_drop).format("DD-MM-YYYY")}),e(a,{children:e(k,{value:r.pinjaman})}),e(a,{children:r.mantri}),e(a,{children:e(h,{value:r.status_pinjaman})}),e(a,{children:r.notes}),e(a,{children:e(h,{value:r.lunas?"Lunas":"Belum"})})]}):e(s,{children:e(a,{children:"Menunggu data . . ."})})})]})})]}),t("div",{className:"flex flex-col w-full gap-3 mt-3 lg:flex-row",children:[t(C,{className:"flex-[5]",children:[e(y,{children:e(T,{children:"Rincian Pinjaman"})}),e(w,{children:t(v,{children:[e(S,{className:"bg-gray-200",children:t(s,{children:[e(n,{className:"text-center",children:"Action"}),e(n,{className:"text-center",children:"Tanggal Pembayaran"}),e(n,{className:"text-center",children:"Jumlah"}),e(n,{className:"text-center",children:"Saldo"}),e(n,{className:"text-center",children:"Dana Titipan"}),e(n,{className:"text-center",children:"Mantri"}),e(n,{className:"text-center",children:"Status"})]})}),e(Y,{children:Object.keys(r).length!==0?g.map(i=>t(s,{className:"text-center",children:[e(a,{children:(!u||u<i.transaction_date)&&e(O,{id:i.id})}),e(a,{children:D(i.transaction_date).format("DD-MM-YYYY")}),e(a,{children:e(k,{value:i.nominal})}),e(a,{children:i.saldo}),e(a,{children:i.danatitipan=="true"?"Yes":""}),e(a,{children:i.mantri}),t(a,{children:[" ",e(h,{value:i.status})]})]})):e(s,{children:e(a,{children:"Menunggu data . . ."})})})]})})]}),t("div",{className:"flex-[2]",children:[e(I,{triggeredId:r.id,triggeredPinjaman:r.pinjaman,instalment:g}),e(K,{loan:r}),t("div",{className:"flex items-center justify-end gap-3 p-3",children:[e("div",{className:"font-semibold",children:"Hapus Pinjaman"}),e(R,{id:r.id,onClosed:j})]})]})]})]})})};export{be as default};