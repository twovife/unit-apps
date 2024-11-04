import{a as e,q as B,r as d,j as t,c as w,l as L}from"./app-fbd0a2e2.js";import{D as P,a as E,b as I,c as K}from"./dialog-523372bd.js";import{C as D,a as v,b as C,d as T}from"./card-347b431f.js";import{T as k,a as y,b as i,c as n,d as A,e as a,F as S}from"./FormatNumbering-cf21f8d9.js";import{B as c}from"./badge-203a4d55.js";import O from"./BayarAngsuran-f3f2bb3d.js";import R from"./JenisNasabah-e6ac7034.js";import F from"./DeleteAngsuran-c3ea4f7d.js";import J from"./DeleteLoan-818baee9.js";import"./index-24e9d040.js";import"./index-058f087c.js";import"./button-5a2424e9.js";import"./utils-36e2ef84.js";import"./react-icons.esm-8d806691.js";import"./index-b45a066b.js";import"./react-number-format.es-fcacf62d.js";import"./label-27d2c6d0.js";import"./index-d18315af.js";import"./input-954ae0ae.js";import"./index.esm-001de13f.js";import"./Checkbox-42868393.js";import"./Loading-d5a9b033.js";import"./transition-5b58ab89.js";import"./InputError-ba5bbcdb.js";import"./InputLabel-5a0f1e63.js";import"./PrimaryButton-08292fc1.js";import"./SelectList-46bdd58f.js";import"./TextInput-401a65b8.js";const h=({value:l="normal"})=>{switch(l==null?void 0:l.toLowerCase()){case"normal":return e(c,{variant:"outline",children:l});case"cm":return e(c,{variant:"yellow",children:l});case"mb":return e(c,{variant:"destructive",children:l});case"ml":return e(c,{children:l});case"lunas":return e(c,{variant:"green",children:l});case"belum":return e(c,{variant:"outline",children:l});default:return e(c,{children:l})}},je=({datas:l,show:p=!1,onClosed:M,triggeredId:o})=>{const{server_filter:{closed_transaction:u},auth:_}=B().props,Y=_.permissions.includes("can create"),[q,N]=d.useState(!1),[U,g]=d.useState(!1),[r,f]=d.useState({}),[x,b]=d.useState([]),H=async s=>{N(!0),g(),await L({method:"get",url:route("pinjaman.get_loan_pinjaman",s)}).then(function({data:m}){N(!1),f(m.pinjaman),b(m.instalment)}).catch(function({response:m}){g()})};d.useEffect(()=>{o&&H(o)},[o,l]);const j=()=>{M(),f({}),b([])};return e(P,{open:p,onOpenChange:s=>s?"":j(),children:t(E,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin p-1 lg:p-6",children:[e(I,{className:"max-h-10",children:e(K,{className:"p-2",children:"Isi Angsuran"})}),t(D,{className:"w-full",children:[e(v,{children:e(C,{children:"Rincian Pinjaman"})}),e(T,{className:"p-1 lg:p-5",children:e("div",{className:"w-full overflow-auto",children:t(k,{children:[e(y,{className:"bg-gray-200",children:t(i,{children:[e(n,{className:"text-center",children:"Nomor"}),e(n,{className:"text-center",children:"Nasabah"}),e(n,{className:"text-center",children:"NIK"}),e(n,{className:"text-center",children:"Alamat"}),e(n,{className:"text-center",children:"Unit"}),e(n,{className:"text-center",children:"Kelompok"}),e(n,{className:"text-center",children:"Hari"}),e(n,{className:"text-center",children:"Tanggal Drop"}),e(n,{className:"text-center",children:"Pinjaman"}),e(n,{className:"text-center",children:"Nama Mantri"}),e(n,{className:"text-center",children:"Status"}),e(n,{className:"text-center",children:"Ket"}),e(n,{className:"text-center",children:"Lunas"})]})}),e(A,{children:Object.keys(r).length!==0?t(i,{className:"text-center",children:[e(a,{children:r.id}),e(a,{children:r.nama}),e(a,{children:r.nik}),e(a,{children:r.alamat}),e(a,{children:r.branch}),e(a,{children:r.kelompok}),e(a,{children:r.hari}),e(a,{children:w(r.tanggal_drop).format("DD-MM-YYYY")}),e(a,{children:e(S,{value:r.pinjaman})}),e(a,{children:r.mantri}),e(a,{children:e(h,{value:r.status_pinjaman})}),e(a,{children:r.notes}),e(a,{children:e(h,{value:r.lunas?"Lunas":"Belum"})})]}):e(i,{children:e(a,{children:"Menunggu data . . ."})})})]})})})]}),t("div",{className:"flex flex-col w-full gap-3 mt-3 lg:flex-row",children:[t(D,{className:"flex-[5]",children:[e(v,{children:e(C,{children:"Rincian Angsuran"})}),e(T,{className:"p-1 lg:p-5",children:e("div",{className:"w-full overflow-auto",children:t(k,{className:"text-xs",children:[e(y,{className:"bg-gray-200",children:t(i,{children:[e(n,{className:"text-center",children:"Action"}),e(n,{className:"text-center",children:"Tanggal"}),e(n,{className:"text-center",children:"Jumlah"}),e(n,{className:"text-center",children:"Saldo"}),e(n,{className:"hidden text-center lg:table-cell",children:"Dana Titipan"}),e(n,{className:"hidden text-center lg:table-cell",children:"Mantri"}),e(n,{className:"text-center",children:"Status"})]})}),e(A,{children:Object.keys(r).length!==0?x.map(s=>t(i,{className:"text-center",children:[e(a,{children:(!u||u<s.transaction_date)&&e(F,{id:s.id})}),e(a,{className:"whitespace-nowrap",children:w(s.transaction_date).format("DD-MM-YY")}),e(a,{children:e(S,{value:s.nominal})}),e(a,{children:s.saldo}),e(a,{className:"hidden lg:block",children:s.danatitipan=="true"?"Yes":""}),e(a,{className:"hidden lg:block",children:s.mantri}),t(a,{children:[" ",e(h,{value:s.status})]})]})):e(i,{children:e(a,{children:"Menunggu data . . ."})})})]})})})]}),Y&&t("div",{className:"flex-[2]",children:[e(O,{triggeredId:r.id,triggeredPinjaman:r.pinjaman,instalment:x}),e(R,{loan:r}),t("div",{className:"flex items-center justify-end gap-3 p-3",children:[e("div",{className:"font-semibold",children:"Hapus Pinjaman"}),e(J,{id:r.id,onClosed:j})]})]})]})]})})};export{je as default};