import{X as W,r as o,G as Z,d as _,j as e,a,F as j,f as aa}from"./app-d484a7d2.js";import{I as m}from"./InputError-9c72daac.js";import{L as ea}from"./Loading-8de321b5.js";import{B as h}from"./button-8c0bc7cc.js";import{I as d}from"./input-9db99b79.js";import{L as i}from"./label-adfb4101.js";import{C as S}from"./index.esm-1326f15a.js";import{u as ta,S as na}from"./SelectComponent-fd985b41.js";import{A as la}from"./AuthenticatedLayout-5411a3b6.js";import{C as ra}from"./Checkbox-4a6dc653.js";import{T as ia,a as sa,b as A,c as E}from"./tabs-d23cdf33.js";import{C as I,a as R,b as T,c as Y,d as M}from"./card-983e7773.js";import P from"./RiwayatPengajuan-efbf5a4f.js";import{S as oa}from"./search-25c6371c.js";import{X as da}from"./x-faa75065.js";import"./transition-34aa8e6f.js";import"./index-98ca6607.js";import"./utils-3f044a58.js";import"./index-46c17673.js";import"./index-73a971cd.js";import"./Navbar-e52bcf93.js";import"./createLucideIcon-d000e5d9.js";import"./SweetAlert-732fed95.js";import"./index-5c259ab6.js";import"./index-285c6289.js";import"./Combination-44a5c864.js";import"./index-d874ae91.js";import"./index-0912e6e8.js";import"./react-icons.esm-9d6503eb.js";import"./table-28113ab4.js";import"./index-2ffe7b9c.js";import"./FormatNumbering-edbebc7d.js";import"./react-number-format.es-e89b213e.js";import"./BadgeStatus-df51cdca.js";import"./badge-e3d200c0.js";const $a=()=>{const{printUrl:k}=W().props;o.useEffect(()=>{k.url&&window.open(k.url,"_blank")},[k.timestamp]);const{optKelompok:L}=ta(),{data:n,setData:g,post:K,errors:u,processing:z,reset:C}=Z({isActiveMember:!1,nik:"",request_date:"",tanggal_drop:"",no_kk:"",nama:"",alamat:"",kelompok:"",request_nominal:"",angsuran:[]}),[s,b]=o.useState([]);o.useEffect(()=>{b([])},[n.tanggal_drop]),o.useEffect(()=>{g("angsuran",s)},[s]);const U=()=>{const t=s.length>0?_(s[s.length-1].transaction_date).add(1,"week").format("YYYY-MM-DD"):n.tanggal_drop?_(n.tanggal_drop).add(1,"week").format("YYYY-MM-DD"):"";b([...s,{id:Date.now(),transaction_date:t}])},B=t=>{b(s.filter(l=>l.id!==t))},y=(t,l,r)=>{b(s.map(c=>c.id===t?{...c,[l]:r}:c))},O=(t,l,r)=>{b(s.map(c=>c.id===r?{...c,[l]:t}:c))},[v,V]=o.useState(""),[$,x]=o.useState(!1),[q,D]=o.useState(),[p,w]=o.useState([]),[F,G]=o.useState();o.useEffect(()=>{G(n.request_date),g(t=>({...t,tanggal_drop:n.request_date?_(n.request_date).add(1,"week").format("YYYY-MM-DD"):""}))},[n.request_date]);const H=(t,l)=>{g(l,t)},f=t=>{const{name:l,value:r}=t.target;g(l,r)},X=t=>{const{name:l,value:r}=t.target;V(r),w([])},J=async t=>{t.preventDefault(),C(),x(!0),D(),await aa({method:"post",url:route("transaction.nasabah_buku_transaksi"),data:{nik:v}}).then(function({data:l}){x(!1),g(r=>({...r,nik:l.return_nik,isActiveMember:!!l.data})),l.data?w(l.data):w([])}).catch(function({response:l}){D(l.data.message),x(!1)})},Q=t=>{t.preventDefault(),K(route("transaction.store_buku_transaksi_batch"),{onSuccess:()=>{C()}})},N=t=>{const l=t.target.getAttribute("data-value");g("request_nominal",l)};return e(la,{children:[a(ea,{show:$||z}),e("div",{className:"flex flex-col w-full gap-3 lg:flex-row",children:[e("div",{className:"w-auto",children:[e("fieldset",{className:"w-full p-4 mb-3 border rounded-lg",children:[a("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Cari Nasabah"}),e("form",{className:"w-full mb-3",onSubmit:J,children:[a(i,{optional:!0,children:"NIK"}),e("div",{className:"flex items-center gap-3",children:[a(d,{type:"text",name:"nik",value:v,onChange:X,placeholder:"Cek NIK"}),e(h,{className:"text-xs",size:"sm",children:[a(oa,{className:"w-auto h-4 mr-1"}),"Cari"]})]}),q&&a(m,{message:q,className:"mt-1"}),e("div",{className:`font-semibold mt-1 ${v.length==16?"text-green-500":"text-red-500"}`,children:[v.length," Digit"]})]})]}),v&&n.nik==v&&e("fieldset",{className:"w-full p-4 border rounded-lg",children:[a("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Detail Pinjaman"}),e("form",{className:"w-full mb-3",onSubmit:Q,children:[e("div",{className:"flex gap-5",children:[e("div",{className:"flex-1",children:[e("div",{className:"flex gap-3",children:[e("div",{className:"w-full mb-3",children:[a(i,{children:"Tanggal Pengajuan"}),a(d,{type:"date",name:"request_date",required:!0,value:n.request_date,onChange:f}),a(m,{value:u.request_date})]}),e("div",{className:"w-full mb-3",children:[a(i,{children:"Tanggal Drop"}),a(d,{type:"date",name:"tanggal_drop",min:F,required:!0,value:n.tanggal_drop,onChange:f}),a(m,{value:u.tanggal_drop})]})]}),n.request_date&&n.request_date==n.tanggal_drop?a("div",{className:"w-full mb-3 font-semibold text-red-500",children:"DROP BARU"}):a("div",{className:"w-full mb-3 font-semibold text-red-500",children:"PENGAJUAN DROP"}),e("div",{className:"w-full mb-3",children:[a(i,{optional:!0,children:"NIK"}),a(d,{type:"text",name:"nik",value:n.nik,disabled:!0,onChange:f}),a(m,{value:u.nik})]}),n.isActiveMember?e(j,{children:[e("div",{className:"w-full mb-3",children:[a(i,{children:"Nama"}),a(d,{type:"text",disabled:!0,value:p.nama??""})]}),e("div",{className:"w-full mb-3",children:[a(i,{children:"Alamat"}),a(d,{type:"text",disabled:!0,value:p.alamat??""})]})]}):e(j,{children:[e("div",{className:"w-full mb-3",children:[a(i,{optional:!0,children:"NO KK"}),a(d,{type:"text",name:"no_kk",value:n.no_kk,onChange:f}),a(m,{value:u.no_kk})]}),e("div",{className:"w-full mb-3",children:[a(i,{children:"Nama"}),a(d,{type:"text",name:"nama",value:n.nama,onChange:f,required:!0}),a(m,{value:u.nama})]}),e("div",{className:"w-full mb-3",children:[a(i,{children:"Alamat"}),a(d,{type:"text",name:"alamat",value:n.alamat,onChange:f,required:!0}),a(m,{value:u.alamat})]})]}),e("div",{className:"w-full mb-3",children:[a(i,{children:"Kelompok"}),a(na,{value:n.kelompok,options:L,name:"kelompok",nullvalue:!0,onChange:f,required:!0}),a(m,{value:u.kelompok})]}),e("div",{className:"w-full mb-3",children:[a(i,{children:"Nominal Pinjaman"}),a(S,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:H,value:n.request_nominal,placeholder:"Inputkan angka tanpa sparator"}),a(m,{value:u.request_nominal})]}),e("div",{className:"flex flex-wrap w-full gap-2 mb-3",children:[a(h,{type:"button",variant:"outline",size:"xs",onClick:N,"data-value":"500000",children:"500.000"}),a(h,{type:"button",variant:"outline",size:"xs",onClick:N,"data-value":"700000",children:"700.000"}),a(h,{type:"button",variant:"outline",size:"xs",onClick:N,"data-value":"1000000",children:"1.000.000"}),a(h,{type:"button",variant:"destructive",size:"xs",onClick:N,"data-value":"0",children:"reset"})]})]}),a("div",{className:"flex-1",children:s.map((t,l)=>e("div",{className:"flex gap-3 mb-3",children:[e("div",{className:"w-full",children:[a(i,{children:"Tanggal Storting"}),a(d,{type:"date",name:"transaction_date",required:!0,value:t.transaction_date,onChange:r=>y(t.id,r.target.name,r.target.value)})]}),e("div",{className:"w-full",children:[a(i,{children:"Nominal"}),e("div",{className:"flex items-center justify-start gap-3",children:[a("div",{className:"min-w-32",children:a(S,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:(r,c)=>O(parseInt(r),c,t.id),value:t.nominal,placeholder:"Inputkan angka tanpa sparator"})}),e("div",{className:"flex items-center justify-start gap-3",children:[a(ra,{name:"dana_titipan",id:`dana_titipan_${t.id}`,checked:t.isActiveMember,onChange:r=>y(t.id,r.target.name,r.target.checked)}),a(i,{htmlFor:`dana_titipan_${t.id}`,className:"whitespace-nowrap",children:"Dana Titipan"})]}),a(h,{onClick:()=>B(t.id),type:"button",size:"iconsm",variant:"outline",children:a(da,{className:"w-auto h-3"})})]})]})]},t.id))})]}),e("div",{className:"text-end",children:[n.tanggal_drop&&a(h,{type:"button",onClick:U,className:"mr-3",variant:"outline",children:"Add Angsuran"}),a(h,{children:"Submit"})]})]})]})]}),a("div",{className:"w-auto lg:w-3/4",children:e(ia,{defaultValue:"pengajuan",className:"w-auto",children:[e(sa,{className:"grid w-full grid-cols-2",children:[a(A,{value:"pengajuan",children:"Riwayat Pinjaman"}),a(A,{value:"pinjaman",children:"Ringkasan Pinjaman"})]}),a(E,{value:"pengajuan",children:e(I,{children:[e(R,{children:[a(T,{children:"Riwayat Unit"}),a(Y,{children:"Riwayat Pengajuan Nasabah sesuai dengan nik di satu unit"})]}),a(M,{className:"space-y-2",children:a("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:a(P,{data:p==null?void 0:p.history_branch})})})]})}),a(E,{value:"pinjaman",children:e(I,{children:[e(R,{children:[a(T,{children:"Riwayat Lain"}),a(Y,{children:"Riwayat Pengajuan Nasabah sesuai dengan nik di unit selain unit ini"})]}),a(M,{className:"space-y-2",children:a("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:a(P,{data:p==null?void 0:p.history_lain})})})]})})]})})]})]})};export{$a as default};
