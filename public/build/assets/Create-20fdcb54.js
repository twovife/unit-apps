import{W as H,r as c,d as V,j as a,a as e,F,e as G}from"./app-894fb644.js";import{I as r}from"./InputError-aa33e7fd.js";import{L as U}from"./Loading-b2556a0b.js";import{B as u}from"./button-9da4f797.js";import{C as w,a as C,b as y,c as _,d as D}from"./card-e75d9471.js";import{D as J,a as W,b as $,c as Q,d as X}from"./dialog-a5dfac83.js";import{T as Z,a as ee,b as j,c as q}from"./tabs-72060df1.js";import{I as d}from"./input-0ac0cdb0.js";import{L as i}from"./label-b28b47d1.js";import{C as ae}from"./index.esm-481f5ba8.js";import{u as te,S as ne}from"./SelectComponent-2a477649.js";import le from"./RiwayatPengajuan-8ae04c1a.js";import{S as re}from"./search-b8ecaf08.js";import"./transition-dd2a41ee.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-b8da1699.js";import"./react-icons.esm-bacaa70f.js";import"./index-1ee04d40.js";import"./index-b32be6a7.js";import"./index-b4346aa2.js";import"./FormatNumbering-1c98251f.js";import"./react-number-format.es-fde60237.js";import"./index-32ba0184.js";import"./DetailRiwayat-106c7ab4.js";import"./play-1f63a44c.js";import"./createLucideIcon-fdae9c18.js";const Re=({show:S=!1,onClosed:v})=>{const{optKelompok:P}=te(),{data:t,setData:h,post:I,errors:s,processing:A,reset:f}=H({isActiveMember:!1,nik:""}),[m,R]=c.useState(""),[T,b]=c.useState(!1),[N,k]=c.useState(),[K,x]=c.useState([]),[L,M]=c.useState();c.useEffect(()=>{M(t.request_date),h(n=>({...n,tanggal_drop:V(t.request_date).add(1,"week").format("YYYY-MM-DD")}))},[t.request_date]);const z=(n,l)=>{h(l,n)},o=n=>{const{name:l,value:p}=n.target;h(l,p)},B=n=>{const{name:l,value:p}=n.target;R(p)},E=async n=>{n.preventDefault(),f(),b(!0),k(),await G({method:"post",url:route("transaction.nasabah_buku_transaksi"),data:{nik:m}}).then(function({data:l}){b(!1),h(p=>({...p,nik:l.return_nik,isActiveMember:!!l.data})),l.data?x(l.data):x([])}).catch(function({response:l}){k(l.data.message),b(!1)})},O=n=>{v(),f()},Y=n=>{n.preventDefault(),I(route("transaction.store_buku_transaksi"),{onSuccess:()=>{v(),f()}})},g=n=>{const l=n.target.getAttribute("data-value");h("request_nominal",l)};return a(J,{open:S,onOpenChange:n=>n?"":O(),children:[e(U,{show:T||A}),a(W,{className:"w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[e($,{className:"max-h-10",children:e(Q,{children:"Buat Pinjaman Baru"})}),e(X,{children:a("div",{className:"flex flex-col w-full gap-3 lg:flex-row",children:[a("div",{className:"w-auto",children:[a("fieldset",{className:"w-full p-4 mb-3 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Cari Nasabah"}),a("form",{className:"w-full mb-3",onSubmit:E,children:[e(i,{optional:!0,children:"NIK"}),a("div",{className:"flex items-center gap-3",children:[e(d,{type:"text",name:"nik",value:m,onChange:B,placeholder:"Cek NIK"}),a(u,{className:"text-xs",size:"sm",children:[e(re,{className:"w-auto h-4 mr-1"}),"Cari"]})]}),N&&e(r,{message:N,className:"mt-1"}),a("div",{className:`font-semibold mt-1 ${m.length==16?"text-green-500":"text-red-500"}`,children:[m.length," Digit"]})]})]}),m&&t.nik==m&&a("fieldset",{className:"w-full p-4 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Detail Pinjaman"}),a("form",{className:"w-full mb-3",onSubmit:Y,children:[a("div",{className:"flex gap-3",children:[a("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Pengajuan"}),e(d,{type:"date",name:"request_date",required:!0,value:t.request_date,onChange:o}),e(r,{value:s.request_date})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Drop"}),e(d,{type:"date",name:"tanggal_drop",min:L,required:!0,value:t.tanggal_drop,onChange:o}),e(r,{value:s.tanggal_drop})]})]}),t.request_date&&t.request_date==t.tanggal_drop?e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"DROP BARU"}):e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"PENGAJUAN DROP"}),a("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NIK"}),e(d,{type:"text",name:"nik",value:t.nik,disabled:!0,onChange:o}),e(r,{value:s.nik})]}),!t.isActiveMember&&a(F,{children:[a("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NO KK"}),e(d,{type:"text",name:"no_kk",value:t.no_kk,onChange:o}),e(r,{value:s.no_kk})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Nama"}),e(d,{type:"text",name:"nama",value:t.nama,onChange:o,required:!0}),e(r,{value:s.nama})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Alamat"}),e(d,{type:"text",name:"alamat",value:t.alamat,onChange:o,required:!0}),e(r,{value:s.alamat})]})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Kelompok"}),e(ne,{value:t.kelompok,options:P,name:"kelompok",nullvalue:!0,onChange:o,required:!0}),e(r,{value:s.kelompok})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Nominal Pinjaman"}),e(ae,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:z,value:t.request_nominal,placeholder:"Inputkan angka tanpa sparator"}),e(r,{value:s.request_nominal})]}),a("div",{className:"flex flex-wrap w-full gap-2 mb-3",children:[e(u,{type:"button",variant:"outline",size:"xs",onClick:g,"data-value":"500000",children:"500.000"}),e(u,{type:"button",variant:"outline",size:"xs",onClick:g,"data-value":"700000",children:"700.000"}),e(u,{type:"button",variant:"outline",size:"xs",onClick:g,"data-value":"1000000",children:"1.000.000"}),e(u,{type:"button",variant:"destructive",size:"xs",onClick:g,"data-value":"0",children:"reset"})]}),e("div",{className:"text-end",children:e(u,{children:"Submit"})})]})]})]}),e("div",{className:"w-auto lg:w-3/4",children:a(Z,{defaultValue:"pengajuan",className:"w-auto",children:[a(ee,{className:"grid w-full grid-cols-2",children:[e(j,{value:"pengajuan",children:"Riwayat Pinjaman"}),e(j,{value:"pinjaman",children:"Ringkasan Pinjaman"})]}),e(q,{value:"pengajuan",children:a(w,{children:[a(C,{children:[e(y,{children:"Riwayat Pengajuan"}),e(_,{children:"Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang tertera dari semua cabang"})]}),e(D,{className:"space-y-2",children:e("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(le,{data:K})})})]})}),e(q,{value:"pinjaman",children:a(w,{children:[a(C,{children:[e(y,{children:"Ringkasan Pinjaman"}),e(_,{children:"Ringkasan Analisa Nasabah"})]}),e(D,{className:"space-y-2",children:e("div",{children:"masih belum ada, update secara berkala"})})]})})]})})]})})]})]})};export{Re as default};
