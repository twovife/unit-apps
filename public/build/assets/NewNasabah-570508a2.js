import{q as de,r as s,W as ce,c as x,j as a,a as e,F as C,l as me}from"./app-1dba9351.js";import{I as m}from"./InputError-91f0103e.js";import{L as ue}from"./Loading-e8037743.js";import{B as h}from"./button-f157f404.js";import{C as I,a as Y,b as T,c as E,d as M}from"./card-89e16e77.js";import{T as pe,a as he,b as P,c as R}from"./tabs-0c3e9642.js";import{I as c}from"./input-eaed37ea.js";import{L as i}from"./label-a4aeba48.js";import{C as L}from"./index.esm-5a1b3ab9.js";import{u as ge,S as fe}from"./SelectComponent-457af974.js";import K from"./RiwayatPengajuan-30748ebc.js";import{C as be}from"./Checkbox-7adbb061.js";import{F as ve}from"./FormatNumbering-d3eb1c6d.js";import{S as Ne,X as xe}from"./x-e4ddb53f.js";import"./transition-35d14a90.js";import"./utils-36e2ef84.js";import"./index-fde572c1.js";import"./index-5649da3f.js";import"./index-8e703f61.js";import"./index-a2f41169.js";import"./index-5c4228d0.js";import"./BadgeStatus-be8d1a73.js";import"./badge-bcbfa6d6.js";import"./react-number-format.es-08d37f9d.js";import"./createLucideIcon-682d5847.js";const Be=({onClosed:z,generateAngsuran:V=!1,submitUrl:F})=>{const{printUrl:y,auth:G}=de().props,O=G.permissions.includes("can create"),[w,U]=s.useState(null);console.log(w),s.useEffect(()=>{U(y.url)},[y.timestamp]);const{optKelompok:B}=ge(),{data:n,setData:f,post:H,errors:u,processing:$,reset:q}=ce({isActiveMember:!1,nik:"",request_date:"",tanggal_drop:"",no_kk:"",nama:"",alamat:"",kelompok:"",request_nominal:0,angsuran:[]}),[o,v]=s.useState([]),[J,W]=s.useState(0);s.useEffect(()=>{console.log(n.request_nominal);const t=parseInt(n.request_nominal??0)*1.3;console.log(t);const l=n.angsuran.reduce((r,d)=>{const A=parseInt(d.nominal,10);return r+(isNaN(A)?0:A)},0);W(t-l)},[n.angsuran,n.request_nominal]),s.useEffect(()=>{v([])},[n.tanggal_drop]),s.useEffect(()=>{f("angsuran",o)},[o]);const X=()=>{const t=o.length>0?x(o[o.length-1].transaction_date).add(1,"week").format("YYYY-MM-DD"):n.tanggal_drop?x(n.tanggal_drop).add(1,"week").format("YYYY-MM-DD"):"";v([...o,{id:Date.now(),transaction_date:t}])},Q=t=>{v(o.filter(l=>l.id!==t))},j=(t,l,r)=>{v(o.map(d=>d.id===t?{...d,[l]:r}:d))},Z=(t,l,r)=>{v(o.map(d=>d.id===r?{...d,[l]:t}:d))},[b,ee]=s.useState(""),[ae,k]=s.useState(!1),[D,S]=s.useState(),[p,_]=s.useState([]),[te,ne]=s.useState();s.useEffect(()=>{ne(n.request_date),f(t=>({...t,tanggal_drop:x(n.request_date).add(1,"week").format("YYYY-MM-DD")}))},[n.request_date]);const le=(t,l)=>{f(l,t)},g=t=>{const{name:l,value:r}=t.target;f(l,r)},re=t=>{const{name:l,value:r}=t.target;_([]),ee(r)},ie=async t=>{t.preventDefault(),q(),k(!0),S(),await me({method:"post",url:route("transaction.nasabah_buku_transaksi"),data:{nik:b}}).then(function({data:l}){k(!1),f(r=>({...r,nik:l.return_nik,isActiveMember:!!l.data})),l.data?_(l.data):_([])}).catch(function({response:l}){S(l.data.message),k(!1)})},se=t=>{z(),q()},oe=t=>{t.preventDefault(),H(F,{onSuccess:()=>{se()},replace:!0})},N=t=>{const l=t.target.getAttribute("data-value");f("request_nominal",l)};return a("div",{className:"flex flex-col w-full gap-3 lg:flex-row",children:[e(ue,{show:ae||$}),a("div",{className:"w-auto",children:[a("fieldset",{className:"min-w-[20vw] p-4 mb-3 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Cari Nasabah"}),a("form",{className:"w-full mb-3",onSubmit:ie,children:[e(i,{optional:!0,children:"NIK"}),a("div",{className:"flex items-center gap-3",children:[e(c,{type:"text",name:"nik",value:b,onChange:re,placeholder:"Cek NIK"}),a(h,{className:"text-xs",size:"sm",children:[e(Ne,{className:"w-auto h-4 mr-1"}),"Cari"]})]}),D&&e(m,{message:D,className:"mt-1"}),a("div",{className:`font-semibold mt-1 ${b.length==16?"text-green-500":"text-red-500"}`,children:[b.length," Digit"]}),e("div",{children:w&&e("a",{href:w??"#",target:"_blank",children:"Lihat Transaksi Terakhir"})})]})]}),O&&e(C,{children:b&&n.nik==b&&a("fieldset",{className:"w-full p-4 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Detail Pinjaman"}),a("form",{className:"w-full mb-3",onSubmit:oe,children:[a("div",{className:"flex flex-col gap-5 lg:flex-row",children:[a("div",{className:"flex-1",children:[a("div",{className:"flex gap-3",children:[a("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Pengajuan"}),e(c,{type:"date",name:"request_date",required:!0,value:n.request_date,onChange:g}),e(m,{message:u.request_date})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Drop"}),e(c,{type:"date",name:"tanggal_drop",min:te,required:!0,value:n.tanggal_drop,onChange:g}),e(m,{message:u.tanggal_drop})]})]}),n.request_date&&n.request_date==n.tanggal_drop?e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"DROP BARU"}):e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"PENGAJUAN DROP"}),a("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NIK"}),e(c,{type:"text",name:"nik",value:n.nik,disabled:!0,onChange:g}),e(m,{message:u.nik})]}),n.isActiveMember?a(C,{children:[a("div",{className:"w-full mb-3",children:[e(i,{children:"Nama"}),e(c,{type:"text",disabled:!0,value:p.nama??""})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Alamat"}),e(c,{type:"text",disabled:!0,value:p.alamat??""})]})]}):a(C,{children:[a("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NO KK"}),e(c,{type:"text",name:"no_kk",value:n.no_kk,onChange:g}),e(m,{message:u.no_kk})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Nama"}),e(c,{type:"text",name:"nama",value:n.nama,onChange:g,required:!0}),e(m,{message:u.nama})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Alamat"}),e(c,{type:"text",name:"alamat",value:n.alamat,onChange:g,required:!0}),e(m,{message:u.alamat})]})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Kelompok"}),e(fe,{value:n.kelompok,options:B,name:"kelompok",nullvalue:!0,onChange:g,required:!0}),e(m,{message:u.kelompok})]}),a("div",{className:"w-full mb-3",children:[e(i,{children:"Nominal Pinjaman"}),e(L,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",defaultValue:0,allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:le,value:n.request_nominal,placeholder:"Inputkan angka tanpa sparator"}),e(m,{message:u.request_nominal})]}),a("div",{className:"flex flex-wrap w-full gap-2 mb-3",children:[e(h,{type:"button",variant:"outline",size:"xs",onClick:N,"data-value":"500000",children:"500.000"}),e(h,{type:"button",variant:"outline",size:"xs",onClick:N,"data-value":"700000",children:"700.000"}),e(h,{type:"button",variant:"outline",size:"xs",onClick:N,"data-value":"1000000",children:"1.000.000"}),e(h,{type:"button",variant:"destructive",size:"xs",onClick:N,"data-value":"0",children:"reset"})]})]}),o.length>0&&a("div",{className:"flex-1",children:[o.map((t,l)=>a("div",{className:"flex flex-col gap-3 mb-3 lg:flex-row",children:[a("div",{className:"w-full",children:[e(i,{children:"Tanggal Storting"}),e(c,{type:"date",name:"transaction_date",min:x(n.tanggal_drop).add(1,"week").format("YYYY-MM-DD"),required:!0,value:t.transaction_date,onChange:r=>j(t.id,r.target.name,r.target.value)})]}),a("div",{className:"w-full",children:[e(i,{children:"Nominal"}),a("div",{className:"flex items-center justify-start gap-3",children:[e("div",{className:"flex-1 min-w-32",children:e(L,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"nominal",defaultValue:0,allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:(r,d)=>Z(parseInt(r),d,t.id),value:t.nominal,placeholder:"Inputkan angka tanpa sparator"})}),a("div",{className:"flex items-center justify-start gap-1",children:[e(be,{name:"dana_titipan",id:`dana_titipan_${t.id}`,checked:t.isActiveMember,onChange:r=>j(t.id,r.target.name,r.target.checked)}),e(i,{htmlFor:`dana_titipan_${t.id}`,className:"whitespace-nowrap",nomb:!0,children:"Dana Titipan"})]}),e(h,{onClick:()=>Q(t.id),type:"button",size:"iconsm",variant:"outline",children:e(xe,{className:"w-auto h-3"})})]})]})]},t.id)),a("div",{className:"flex justify-end gap-3 font-semibold text-red-500",children:[e("div",{children:"Saldo Tersisa"}),e(ve,{value:J})]})]})]}),a("div",{className:"text-end",children:[V&&n.tanggal_drop&&e(h,{type:"button",onClick:X,className:"mr-3",variant:"outline",children:"Add Angsuran"}),e(h,{children:"Submit"})]})]})]})})]}),e("div",{className:"w-auto lg:w-full",children:a(pe,{defaultValue:"pengajuan",className:"w-auto",children:[a(he,{className:"grid w-full grid-cols-2",children:[e(P,{value:"pengajuan",children:"Riwayat Pinjaman"}),e(P,{value:"pinjaman",children:"Riwayat Lain"})]}),e(R,{value:"pengajuan",children:a(I,{children:[a(Y,{children:[e(T,{children:"Riwayat Unit"}),e(E,{children:"Riwayat Pengajuan Nasabah sesuai dengan nik di satu unit"})]}),e(M,{className:"space-y-2",children:e("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(K,{data:p==null?void 0:p.history_branch})})})]})}),e(R,{value:"pinjaman",children:a(I,{children:[a(Y,{children:[e(T,{children:"Riwayat Lain"}),e(E,{children:"Riwayat Pengajuan Nasabah sesuai dengan nik di unit selain unit ini"})]}),e(M,{className:"space-y-2",children:e("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(K,{data:p==null?void 0:p.history_lain})})})]})})]})})]})};export{Be as default};