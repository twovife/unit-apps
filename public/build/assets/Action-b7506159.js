import{a as e,r as o,j as l,d as f,e as v}from"./app-b5625934.js";import{D as P,a as B,b as H,c as _}from"./dialog-3d367024.js";import{C as b,a as j,b as D,d as C}from"./card-edf02fa5.js";import{T,a as w,b as s,c as n,d as y,e as a}from"./table-112ab48f.js";import{F as S}from"./FormatNumbering-ba546c90.js";import{B as i}from"./badge-e0ff7c20.js";import L from"./BayarAngsuran-84af5113.js";import E from"./JenisNasabah-b86f14af.js";import I from"./DeleteAngsuran-7f902f1c.js";import"./index-ffcae651.js";import"./react-icons.esm-1fb93012.js";import"./index-c5b39d86.js";import"./button-67fd56b0.js";import"./utils-36e2ef84.js";import"./react-number-format.es-12a669e1.js";import"./label-afa1f2bd.js";import"./index-ee2acc57.js";import"./input-dae5d871.js";import"./index.esm-4716ed40.js";import"./Checkbox-84c0f86d.js";import"./Loading-f91d4b2d.js";import"./transition-4a786eba.js";import"./InputError-060683ba.js";import"./InputLabel-4d0e9e40.js";import"./PrimaryButton-09b7de94.js";import"./SelectList-3bdd40b8.js";import"./TextInput-b4a819d8.js";const h=({value:t="normal"})=>{switch(t==null?void 0:t.toLowerCase()){case"normal":return e(i,{variant:"outline",children:t});case"cm":return e(i,{variant:"yellow",children:t});case"mb":return e(i,{variant:"destructive",children:t});case"ml":return e(i,{children:t});case"lunas":return e(i,{variant:"green",children:t});case"belum":return e(i,{variant:"outline",children:t});default:return e(i,{children:t})}},ue=({datas:t,show:p=!1,onClosed:Y,triggeredId:d})=>{const[K,u]=o.useState(!1),[O,N]=o.useState(!1),[r,x]=o.useState({}),[k,g]=o.useState([]),A=async c=>{u(!0),N(),await v({method:"get",url:route("pinjaman.get_loan_pinjaman",c)}).then(function({data:m}){u(!1),x(m.pinjaman),g(m.instalment)}).catch(function({response:m}){N()})};o.useEffect(()=>{d&&A(d)},[d,t]);const M=()=>{Y(),x({}),g([])};return e(P,{open:p,onOpenChange:c=>c?"":M(),children:l(B,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[e(H,{className:"max-h-10",children:e(_,{children:"Isi Angsuran"})}),l(b,{className:"w-full",children:[e(j,{children:e(D,{children:"Rincian Pinjaman"})}),e(C,{children:l(T,{children:[e(w,{className:"bg-gray-200",children:l(s,{children:[e(n,{className:"text-center",children:"Nomor"}),e(n,{className:"text-center",children:"Nasabah"}),e(n,{className:"text-center",children:"NIK"}),e(n,{className:"text-center",children:"Alamat"}),e(n,{className:"text-center",children:"Unit"}),e(n,{className:"text-center",children:"Kelompok"}),e(n,{className:"text-center",children:"Hari"}),e(n,{className:"text-center",children:"Tanggal Drop"}),e(n,{className:"text-center",children:"Pinjaman"}),e(n,{className:"text-center",children:"Nama Mantri"}),e(n,{className:"text-center",children:"Status"}),e(n,{className:"text-center",children:"Ket"}),e(n,{className:"text-center",children:"Lunas"})]})}),e(y,{children:Object.keys(r).length!==0?l(s,{className:"text-center",children:[e(a,{children:r.id}),e(a,{children:r.nama}),e(a,{children:r.nik}),e(a,{children:r.alamat}),e(a,{children:r.branch}),e(a,{children:r.kelompok}),e(a,{children:r.hari}),e(a,{children:f(r.tanggal_drop).format("DD-MM-YYYY")}),e(a,{children:e(S,{value:r.pinjaman})}),e(a,{children:r.mantri}),e(a,{children:e(h,{value:r.status_pinjaman})}),e(a,{children:r.notes}),e(a,{children:e(h,{value:r.lunas?"Lunas":"Belum"})})]}):e(s,{children:e(a,{children:"Menunggu data . . ."})})})]})})]}),l("div",{className:"flex flex-col w-full gap-3 mt-3 lg:flex-row",children:[l(b,{className:"flex-[5]",children:[e(j,{children:e(D,{children:"Rincian Pinjaman"})}),e(C,{children:l(T,{children:[e(w,{className:"bg-gray-200",children:l(s,{children:[e(n,{className:"text-center",children:"Action"}),e(n,{className:"text-center",children:"Tanggal Pembayaran"}),e(n,{className:"text-center",children:"Jumlah"}),e(n,{className:"text-center",children:"Saldo"}),e(n,{className:"text-center",children:"Dana Titipan"}),e(n,{className:"text-center",children:"Mantri"}),e(n,{className:"text-center",children:"Status"})]})}),e(y,{children:Object.keys(r).length!==0?k.map(c=>l(s,{className:"text-center",children:[e(a,{children:e(I,{id:c.id})}),e(a,{children:f(c.transaction_date).format("DD-MM-YYYY")}),e(a,{children:e(S,{value:c.nominal})}),e(a,{children:c.saldo}),e(a,{children:c.danatitipan=="true"?"Yes":""}),e(a,{children:c.mantri}),l(a,{children:[" ",e(h,{value:c.status})]})]})):e(s,{children:e(a,{children:"Menunggu data . . ."})})})]})})]}),l("div",{className:"flex-[2]",children:[e(L,{triggeredId:r.id,triggeredPinjaman:r.pinjaman}),e(E,{loan:r})]})]})]})})};export{ue as default};
