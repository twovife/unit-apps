import{a as e,q as L,r as o,j as t,c as v,l as Y}from"./app-3a486d21.js";import{D as B,a as E,b as O,c as F}from"./dialog-40faced7.js";import{C as w,a as D,b as C,d as k}from"./card-4303b3a0.js";import{T as y,a as T,b as c,c as r,d as S,e as a,F as A}from"./FormatNumbering-5b4293d6.js";import{B as i}from"./badge-7a94ba86.js";import I from"./BayarAngsuran-37b2b689.js";import K from"./JenisNasabah-64e978be.js";import R from"./DeleteAngsuran-5fe58bd0.js";import U from"./DeleteLoan-79ced610.js";import{u as J}from"./useFrontEndPermission-f7e3c78b.js";import{N as M}from"./NoEditOverlay-28b780f6.js";import"./index-1ac019a9.js";import"./index-b11542d4.js";import"./button-86a9f00e.js";import"./utils-36e2ef84.js";import"./react-icons.esm-4455653d.js";import"./index-3bc92c50.js";import"./react-number-format.es-c6c21ae2.js";import"./label-0db42a0f.js";import"./index-9c7bfea1.js";import"./input-d06c8f20.js";import"./index.esm-6e044766.js";import"./Checkbox-31095ac7.js";import"./Loading-bf985ab0.js";import"./transition-2ab53969.js";import"./InputError-1e3296f9.js";import"./InputLabel-94d9028a.js";import"./PrimaryButton-e213c4c7.js";import"./SelectList-b5298cfc.js";import"./TextInput-fa891645.js";const h=({value:l="normal"})=>{switch(l==null?void 0:l.toLowerCase()){case"normal":return e(i,{variant:"outline",children:l});case"cm":return e(i,{variant:"yellow",children:l});case"mb":return e(i,{variant:"destructive",children:l});case"ml":return e(i,{children:l});case"lunas":return e(i,{variant:"green",children:l});case"belum":return e(i,{variant:"outline",children:l});default:return e(i,{children:l})}},De=({datas:l,show:p=!1,onClosed:_,triggeredId:d})=>{const{server_filter:{closed_transaction:u}}=L().props,[q,N]=o.useState(!1),[$,g]=o.useState(!1),{isCreator:P}=J(),[n,f]=o.useState({}),[x,b]=o.useState([]),H=async s=>{N(!0),g(),await Y({method:"get",url:route("pinjaman.get_loan_pinjaman",s)}).then(function({data:m}){N(!1),f(m.pinjaman),b(m.instalment)}).catch(function({response:m}){g()})};o.useEffect(()=>{d&&H(d)},[d,l]);const j=()=>{_(),f({}),b([])};return e(B,{open:p,onOpenChange:s=>s?"":j(),children:t(E,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin p-1 lg:p-6",children:[e(O,{className:"max-h-10",children:e(F,{className:"p-2",children:"Isi Angsuran"})}),t(w,{className:"w-full",children:[e(D,{children:e(C,{children:"Rincian Pinjaman"})}),e(k,{className:"p-1 lg:p-5",children:e("div",{className:"w-full overflow-auto",children:t(y,{children:[e(T,{className:"bg-gray-200",children:t(c,{children:[e(r,{className:"text-center",children:"Nomor"}),e(r,{className:"text-center",children:"Nasabah"}),e(r,{className:"text-center",children:"NIK"}),e(r,{className:"text-center",children:"Alamat"}),e(r,{className:"text-center",children:"Unit"}),e(r,{className:"text-center",children:"Kelompok"}),e(r,{className:"text-center",children:"Hari"}),e(r,{className:"text-center",children:"Tanggal Drop"}),e(r,{className:"text-center",children:"Pinjaman"}),e(r,{className:"text-center",children:"Nama Mantri"}),e(r,{className:"text-center",children:"Status"}),e(r,{className:"text-center",children:"Ket"}),e(r,{className:"text-center",children:"Lunas"})]})}),e(S,{children:Object.keys(n).length!==0?t(c,{className:"text-center",children:[e(a,{children:n.id}),e(a,{children:n.nama}),e(a,{children:n.nik}),e(a,{children:n.alamat}),e(a,{children:n.branch}),e(a,{children:n.kelompok}),e(a,{children:n.hari}),e(a,{children:v(n.tanggal_drop).format("DD-MM-YYYY")}),e(a,{children:e(A,{value:n.pinjaman})}),e(a,{children:n.mantri}),e(a,{children:e(h,{value:n.status_pinjaman})}),e(a,{children:n.notes}),e(a,{children:e(h,{value:n.lunas?"Lunas":"Belum"})})]}):e(c,{children:e(a,{children:"Menunggu data . . ."})})})]})})})]}),t("div",{className:"flex flex-col w-full gap-3 mt-3 lg:flex-row",children:[t(w,{className:"flex-[5]",children:[e(D,{children:e(C,{children:"Rincian Angsuran"})}),e(k,{className:"p-1 lg:p-5",children:e("div",{className:"w-full overflow-auto",children:t(y,{className:"text-xs",children:[e(T,{className:"bg-gray-200",children:t(c,{children:[e(r,{className:"text-center",children:"Action"}),e(r,{className:"text-center",children:"Tanggal"}),e(r,{className:"text-center",children:"Jumlah"}),e(r,{className:"text-center",children:"Saldo"}),e(r,{className:"hidden text-center lg:table-cell",children:"Mantri"}),e(r,{className:"text-center",children:"Status"})]})}),e(S,{children:Object.keys(n).length!==0?x.map(s=>t(c,{className:"text-center",children:[e(a,{children:(!u||u<=s.transaction_date)&&e(R,{id:s.id})}),e(a,{className:"whitespace-nowrap",children:v(s.transaction_date).format("DD-MM-YY")}),e(a,{className:`${s.danatitipan==1?"text-red-500 font-semibold":""}`,children:e(A,{value:s.nominal})}),e(a,{children:s.saldo}),e(a,{className:"hidden lg:block",children:s.mantri}),t(a,{children:[" ",e(h,{value:s.status})]})]})):e(c,{children:e(a,{children:"Menunggu data . . ."})})})]})})})]}),t("div",{className:"flex-[2] relative",children:[n.lunas==!0?e(M,{value:"Pinjaman Sudah Lunas"}):!P&&e(M,{value:"User Tidak Dapat Digunakan Untuk Mengedit"}),e(I,{triggeredId:n.id,triggeredPinjaman:n,instalment:x}),e(K,{loan:n}),t("div",{className:"flex items-center justify-end gap-3 p-3",children:[e("div",{className:"font-semibold",children:"Hapus Pinjaman"}),e(U,{id:n.id,onClosed:j})]})]})]})]})})};export{De as default};
