import{q as O,W as Y,r as p,d as B,j as a,a as e,F as V,e as F}from"./app-1462653e.js";import{I as r}from"./InputError-2710f739.js";import{L as G}from"./Loading-8594628c.js";import{B as d}from"./button-6c361328.js";import{C as w,a as C,b as y,c as _,d as q}from"./card-686f1795.js";import"./dialog-c6b877fb.js";import{T as H,a as U,b as j,c as D}from"./tabs-4ab4ba62.js";import{I as m}from"./input-128f4793.js";import{L as i}from"./label-d40db7f0.js";import{C as J}from"./index.esm-5d9cbcd9.js";import{u as W,S as $}from"./SelectComponent-d8aec394.js";import{M as Q}from"./MobileLayout-d439654a.js";import{S as X}from"./search-3190de67.js";import"./transition-df6989b0.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-6df52798.js";import"./react-icons.esm-8f459c06.js";import"./index-674c48b1.js";import"./index-fea0dcf8.js";import"./index-4a6b9bf3.js";import"./SweetAlert-7f5893b4.js";import"./createLucideIcon-037cf062.js";import"./index-792d96a5.js";const ye=()=>{const{auth:c}=O().props;console.log(c);const{optKelompok:S}=W(),{data:t,setData:h,post:I,errors:s,processing:A,reset:b}=Y({isActiveMember:!1,nik:"",kelompok:""}),[u,P]=p.useState(""),[R,v]=p.useState(!1),[k,N]=p.useState(),[Z,x]=p.useState([]),[M,T]=p.useState();p.useEffect(()=>{T(t.request_date),h(l=>({...l,tanggal_drop:B(t.request_date).add(1,"week").format("YYYY-MM-DD")}))},[t.request_date]);const K=(l,n)=>{h(n,l)},o=l=>{const{name:n,value:f}=l.target;h(n,f)},L=l=>{const{name:n,value:f}=l.target;P(f)},z=async l=>{l.preventDefault(),b(),v(!0),N(),await F({method:"post",url:route("transaction.nasabah_buku_transaksi"),data:{nik:u}}).then(function({data:n}){v(!1),h(f=>({...f,nik:n.return_nik,isActiveMember:!!n.data,kelompok:c.permissions.includes("can show kelompok")?null:c.user.employee.area})),n.data?x(n.data):x([])}).catch(function({response:n}){N(n.data.message),v(!1)})},E=l=>{l.preventDefault(),I(route("mobile_apps.store"),{onSuccess:()=>{b()}})},g=l=>{const n=l.target.getAttribute("data-value");h("request_nominal",n)};return console.log(t),a(Q,{children:[e(G,{show:R||A}),e("div",{children:e("div",{children:a("div",{className:"flex flex-col w-full gap-3 lg:flex-row",children:[a("div",{className:"w-auto",children:[a("fieldset",{className:"w-full p-4 mb-3 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Cari Nasabah"}),a("form",{className:"w-full mb-3",onSubmit:z,children:[e(i,{optional:!0,children:"NIK"}),a("div",{className:"flex items-center gap-3",children:[e(m,{type:"text",name:"nik",value:u,onChange:L,placeholder:"Cek NIK"}),a(d,{className:"text-xs",size:"sm",children:[e(X,{className:"w-auto h-4 mr-1"}),"Cari"]})]}),k&&e(r,{message:k,className:"mt-1"}),a("div",{className:`font-semibold mt-1 ${u.length==16?"text-green-500":"text-red-500"}`,children:[u.length," Digit"]})]})]}),u&&t.nik==u&&a("fieldset",{className:"w-full p-4 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Detail Pinjaman"}),a("form",{className:"w-full mb-3",onSubmit:E,children:[a("div",{className:"flex gap-3",children:[a("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Pengajuan"}),e(m,{type:"date",name:"request_date",required:!0,value:t.request_date,onChange:o}),e(r,{value:s.request_date})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Drop"}),e(m,{type:"date",name:"tanggal_drop",min:M,required:!0,value:t.tanggal_drop,onChange:o}),e(r,{value:s.tanggal_drop})]})]}),t.request_date&&t.request_date==t.tanggal_drop?e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"DROP BARU"}):e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"PENGAJUAN DROP"}),a("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NIK"}),e(m,{type:"text",name:"nik",value:t.nik,disabled:!0,onChange:o}),e(r,{value:s.nik})]}),!t.isActiveMember&&a(V,{children:[a("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NO KK"}),e(m,{type:"text",name:"no_kk",value:t.no_kk,onChange:o}),e(r,{value:s.no_kk})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Nama"}),e(m,{type:"text",name:"nama",value:t.nama,onChange:o,required:!0}),e(r,{value:s.nama})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Alamat"}),e(m,{type:"text",name:"alamat",value:t.alamat,onChange:o,required:!0}),e(r,{value:s.alamat})]})]}),c.permissions.includes("can show kelompok")?a("div",{className:"w-full mb-3",children:[e(i,{children:"Kelompok"}),e($,{value:t.kelompok,options:S,name:"kelompok",nullvalue:!0,onChange:o,required:!0}),e(r,{value:s.kelompok})]}):a("div",{className:"w-full mb-3",children:[e("div",{children:"Nama Mantri"}),a("div",{children:[c.user.employee.nama_karyawan," kelompok"," ",c.user.employee.area]})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Nominal Pinjaman"}),e(J,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:K,value:t.request_nominal,placeholder:"Inputkan angka tanpa sparator"}),e(r,{value:s.request_nominal})]}),a("div",{className:"flex flex-wrap w-full gap-2 mb-3",children:[e(d,{type:"button",variant:"outline",size:"xs",onClick:g,"data-value":"400000",children:"400.000"}),e(d,{type:"button",variant:"outline",size:"xs",onClick:g,"data-value":"500000",children:"500.000"}),e(d,{type:"button",variant:"outline",size:"xs",onClick:g,"data-value":"700000",children:"700.000"}),e(d,{type:"button",variant:"outline",size:"xs",onClick:g,"data-value":"1000000",children:"1.000.000"}),e(d,{type:"button",variant:"destructive",size:"xs",onClick:g,"data-value":"0",children:"reset"})]}),e("div",{className:"text-end",children:e(d,{children:"Submit"})})]})]})]}),e("div",{className:"w-auto lg:w-3/4",children:a(H,{defaultValue:"pengajuan",className:"w-auto",children:[a(U,{className:"grid w-full grid-cols-2",children:[e(j,{value:"pengajuan",children:"Riwayat Pinjaman"}),e(j,{value:"pinjaman",children:"Ringkasan Pinjaman"})]}),e(D,{value:"pengajuan",children:a(w,{children:[a(C,{children:[e(y,{children:"Riwayat Pengajuan"}),e(_,{children:"Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang tertera dari semua cabang"})]}),e(q,{className:"space-y-2",children:e("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin"})})]})}),e(D,{value:"pinjaman",children:a(w,{children:[a(C,{children:[e(y,{children:"Ringkasan Pinjaman"}),e(_,{children:"Ringkasan Analisa Nasabah"})]}),e(q,{className:"space-y-2",children:e("div",{children:"masih belum ada, update secara berkala"})})]})})]})})]})})})]})};export{ye as default};
