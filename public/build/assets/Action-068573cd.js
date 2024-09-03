import{a as e,r as d,j as l,d as f,e as v}from"./app-b58b93b4.js";import{D as B,a as H,b as P,c as _}from"./dialog-a24bd46e.js";import{C as b,a as j,b as D,d as C}from"./card-b3da9105.js";import{T,a as w,b as s,c as n,d as y,e as a,F as S}from"./FormatNumbering-8eb1706e.js";import{B as i}from"./badge-827464e0.js";import L from"./BayarAngsuran-1ab54d80.js";import E from"./JenisNasabah-eac60321.js";import I from"./DeleteAngsuran-e42826d0.js";import"./index-a4918a2f.js";import"./react-icons.esm-422e8e58.js";import"./index-012bbd11.js";import"./button-43f09e73.js";import"./utils-36e2ef84.js";import"./react-number-format.es-9de8134e.js";import"./label-407096e5.js";import"./input-344963a2.js";import"./index.esm-3abafde0.js";import"./Checkbox-4c60917f.js";import"./Loading-40bcc598.js";import"./transition-13d01d1a.js";import"./InputError-66e07ae4.js";import"./InputLabel-5e4a2116.js";import"./PrimaryButton-2f1762ed.js";import"./SelectList-d15b0496.js";import"./TextInput-42dbdd7a.js";const h=({value:t="normal"})=>{switch(t==null?void 0:t.toLowerCase()){case"normal":return e(i,{variant:"outline",children:t});case"cm":return e(i,{variant:"yellow",children:t});case"mb":return e(i,{variant:"destructive",children:t});case"ml":return e(i,{children:t});case"lunas":return e(i,{variant:"green",children:t});case"belum":return e(i,{variant:"outline",children:t});default:return e(i,{children:t})}},he=({datas:t,show:u=!1,onClosed:Y,triggeredId:o})=>{const[K,p]=d.useState(!1),[O,N]=d.useState(!1),[r,x]=d.useState({}),[k,g]=d.useState([]),A=async c=>{p(!0),N(),await v({method:"get",url:route("pinjaman.get_loan_pinjaman",c)}).then(function({data:m}){p(!1),x(m.pinjaman),g(m.instalment)}).catch(function({response:m}){N()})};d.useEffect(()=>{o&&A(o)},[o,t]);const M=()=>{Y(),x({}),g([])};return e(B,{open:u,onOpenChange:c=>c?"":M(),children:l(H,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[e(P,{className:"max-h-10",children:e(_,{children:"Isi Angsuran"})}),l(b,{className:"w-full",children:[e(j,{children:e(D,{children:"Rincian Pinjaman"})}),e(C,{children:l(T,{children:[e(w,{className:"bg-gray-200",children:l(s,{children:[e(n,{className:"text-center",children:"Nomor"}),e(n,{className:"text-center",children:"Nasabah"}),e(n,{className:"text-center",children:"NIK"}),e(n,{className:"text-center",children:"Alamat"}),e(n,{className:"text-center",children:"Unit"}),e(n,{className:"text-center",children:"Kelompok"}),e(n,{className:"text-center",children:"Hari"}),e(n,{className:"text-center",children:"Tanggal Drop"}),e(n,{className:"text-center",children:"Pinjaman"}),e(n,{className:"text-center",children:"Nama Mantri"}),e(n,{className:"text-center",children:"Status"}),e(n,{className:"text-center",children:"Ket"}),e(n,{className:"text-center",children:"Lunas"})]})}),e(y,{children:Object.keys(r).length!==0?l(s,{className:"text-center",children:[e(a,{children:r.id}),e(a,{children:r.nama}),e(a,{children:r.nik}),e(a,{children:r.alamat}),e(a,{children:r.branch}),e(a,{children:r.kelompok}),e(a,{children:r.hari}),e(a,{children:f(r.tanggal_drop).format("DD-MM-YYYY")}),e(a,{children:e(S,{value:r.pinjaman})}),e(a,{children:r.mantri}),e(a,{children:e(h,{value:r.status_pinjaman})}),e(a,{children:r.notes}),e(a,{children:e(h,{value:r.lunas?"Lunas":"Belum"})})]}):e(s,{children:e(a,{children:"Menunggu data . . ."})})})]})})]}),l("div",{className:"flex flex-col w-full gap-3 mt-3 lg:flex-row",children:[l(b,{className:"flex-[5]",children:[e(j,{children:e(D,{children:"Rincian Pinjaman"})}),e(C,{children:l(T,{children:[e(w,{className:"bg-gray-200",children:l(s,{children:[e(n,{className:"text-center",children:"Action"}),e(n,{className:"text-center",children:"Tanggal Pembayaran"}),e(n,{className:"text-center",children:"Jumlah"}),e(n,{className:"text-center",children:"Saldo"}),e(n,{className:"text-center",children:"Dana Titipan"}),e(n,{className:"text-center",children:"Mantri"}),e(n,{className:"text-center",children:"Status"})]})}),e(y,{children:Object.keys(r).length!==0?k.map(c=>l(s,{className:"text-center",children:[e(a,{children:e(I,{id:c.id})}),e(a,{children:f(c.transaction_date).format("DD-MM-YYYY")}),e(a,{children:e(S,{value:c.nominal})}),e(a,{children:c.saldo}),e(a,{children:c.danatitipan=="true"?"Yes":""}),e(a,{children:c.mantri}),l(a,{children:[" ",e(h,{value:c.status})]})]})):e(s,{children:e(a,{children:"Menunggu data . . ."})})})]})})]}),l("div",{className:"flex-[2]",children:[e(L,{triggeredId:r.id}),e(E,{loan:r})]})]})]})})};export{he as default};
