import{W as F,r as m,d as N,j as t,a as e,F as D,e as U}from"./app-894fb644.js";import{I as c}from"./InputError-aa33e7fd.js";import{L as V}from"./Loading-b2556a0b.js";import{B as p}from"./button-9da4f797.js";import"./card-e75d9471.js";import"./dialog-a5dfac83.js";import"./tabs-72060df1.js";import{I as o}from"./input-0ac0cdb0.js";import{L as i}from"./label-b28b47d1.js";import{C as S}from"./index.esm-481f5ba8.js";import{u as $,S as G}from"./SelectComponent-2a477649.js";import{A as H}from"./AuthenticatedLayout-55c47614.js";import{C as X}from"./Checkbox-767b89a8.js";import{S as J}from"./search-b8ecaf08.js";import{c as W}from"./createLucideIcon-fdae9c18.js";import"./transition-dd2a41ee.js";import"./index-f96983da.js";import"./utils-46f1eee5.js";import"./index-b8da1699.js";import"./react-icons.esm-bacaa70f.js";import"./index-1ee04d40.js";import"./index-b32be6a7.js";import"./index-b4346aa2.js";import"./Navbar-ab0dec55.js";import"./index-f9bf1c67.js";import"./SweetAlert-02741e5d.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=W("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),ye=()=>{const{optKelompok:A}=$(),{data:n,setData:f,post:I,errors:u,processing:E,reset:k}=F({isActiveMember:!1,nik:"",request_date:"",tanggal_drop:"",no_kk:"",nama:"",alamat:"",kelompok:"",request_nominal:"",angsuran:[]}),[s,v]=m.useState([]);m.useEffect(()=>{v([])},[n.tanggal_drop]),m.useEffect(()=>{f("angsuran",s)},[s]);const M=()=>{const a=s.length>0?N(s[s.length-1].transaction_date).add(1,"week").format("YYYY-MM-DD"):n.tanggal_drop?N(n.tanggal_drop).add(1,"week").format("YYYY-MM-DD"):"";v([...s,{id:Date.now(),transaction_date:a}])},Y=a=>{v(s.filter(l=>l.id!==a))},_=(a,l,r)=>{v(s.map(d=>d.id===a?{...d,[l]:r}:d))},j=(a,l,r)=>{v(s.map(d=>d.id===r?{...d,[l]:a}:d))},[g,K]=m.useState(""),[L,x]=m.useState(!1),[w,C]=m.useState(),[y,q]=m.useState([]),[z,P]=m.useState();m.useEffect(()=>{P(n.request_date),f(a=>({...a,tanggal_drop:n.request_date?N(n.request_date).add(1,"week").format("YYYY-MM-DD"):""}))},[n.request_date]);const R=(a,l)=>{f(l,a)},h=a=>{const{name:l,value:r}=a.target;f(l,r)},T=a=>{const{name:l,value:r}=a.target;K(r)},B=async a=>{a.preventDefault(),k(),x(!0),C(),await U({method:"post",url:route("transaction.nasabah_buku_transaksi"),data:{nik:g}}).then(function({data:l}){x(!1),f(r=>({...r,nik:l.return_nik,isActiveMember:!!l.data})),l.data?q(l.data):q([])}).catch(function({response:l}){C(l.data.message),x(!1)})},O=a=>{a.preventDefault(),I(route("transaction.store_buku_transaksi_batch"),{onSuccess:()=>{k()}})},b=a=>{const l=a.target.getAttribute("data-value");f("request_nominal",l)};return t(H,{children:[e(V,{show:L||E}),t("div",{className:"flex flex-col w-full gap-3 lg:flex-row",children:[t("div",{className:"w-auto",children:[t("fieldset",{className:"w-full p-4 mb-3 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Cari Nasabah"}),t("form",{className:"w-full mb-3",onSubmit:B,children:[e(i,{optional:!0,children:"NIK"}),t("div",{className:"flex items-center gap-3",children:[e(o,{type:"text",name:"nik",value:g,onChange:T,placeholder:"Cek NIK"}),t(p,{className:"text-xs",size:"sm",children:[e(J,{className:"w-auto h-4 mr-1"}),"Cari"]})]}),w&&e(c,{message:w,className:"mt-1"}),t("div",{className:`font-semibold mt-1 ${g.length==16?"text-green-500":"text-red-500"}`,children:[g.length," Digit"]})]})]}),g&&n.nik==g&&t("fieldset",{className:"w-full p-4 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Detail Pinjaman"}),t("form",{className:"w-full mb-3",onSubmit:O,children:[t("div",{className:"flex gap-5",children:[t("div",{className:"flex-1",children:[t("div",{className:"flex gap-3",children:[t("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Pengajuan"}),e(o,{type:"date",name:"request_date",required:!0,value:n.request_date,onChange:h}),e(c,{value:u.request_date})]}),t("div",{className:"w-full mb-3",children:[e(i,{children:"Tanggal Drop"}),e(o,{type:"date",name:"tanggal_drop",min:z,required:!0,value:n.tanggal_drop,onChange:h}),e(c,{value:u.tanggal_drop})]})]}),n.request_date&&n.request_date==n.tanggal_drop?e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"DROP BARU"}):e("div",{className:"w-full mb-3 font-semibold text-red-500",children:"PENGAJUAN DROP"}),t("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NIK"}),e(o,{type:"text",name:"nik",value:n.nik,disabled:!0,onChange:h}),e(c,{value:u.nik})]}),n.isActiveMember?t(D,{children:[t("div",{className:"w-full mb-3",children:[e(i,{children:"Nama"}),e(o,{type:"text",disabled:!0,value:y.nama??""})]}),t("div",{className:"w-full mb-3",children:[e(i,{children:"Alamat"}),e(o,{type:"text",disabled:!0,value:y.alamat??""})]})]}):t(D,{children:[t("div",{className:"w-full mb-3",children:[e(i,{optional:!0,children:"NO KK"}),e(o,{type:"text",name:"no_kk",value:n.no_kk,onChange:h}),e(c,{value:u.no_kk})]}),t("div",{className:"w-full mb-3",children:[e(i,{children:"Nama"}),e(o,{type:"text",name:"nama",value:n.nama,onChange:h,required:!0}),e(c,{value:u.nama})]}),t("div",{className:"w-full mb-3",children:[e(i,{children:"Alamat"}),e(o,{type:"text",name:"alamat",value:n.alamat,onChange:h,required:!0}),e(c,{value:u.alamat})]})]}),t("div",{className:"w-full mb-3",children:[e(i,{children:"Kelompok"}),e(G,{value:n.kelompok,options:A,name:"kelompok",nullvalue:!0,onChange:h,required:!0}),e(c,{value:u.kelompok})]}),t("div",{className:"w-full mb-3",children:[e(i,{children:"Nominal Pinjaman"}),e(S,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"request_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:R,value:n.request_nominal,placeholder:"Inputkan angka tanpa sparator"}),e(c,{value:u.request_nominal})]}),t("div",{className:"flex flex-wrap w-full gap-2 mb-3",children:[e(p,{type:"button",variant:"outline",size:"xs",onClick:b,"data-value":"500000",children:"500.000"}),e(p,{type:"button",variant:"outline",size:"xs",onClick:b,"data-value":"700000",children:"700.000"}),e(p,{type:"button",variant:"outline",size:"xs",onClick:b,"data-value":"1000000",children:"1.000.000"}),e(p,{type:"button",variant:"destructive",size:"xs",onClick:b,"data-value":"0",children:"reset"})]})]}),e("div",{className:"flex-1",children:s.map((a,l)=>t("div",{className:"flex gap-3 mb-3",children:[t("div",{className:"w-full",children:[e(i,{children:"Tanggal Storting"}),e(o,{type:"date",name:"transaction_date",required:!0,value:a.transaction_date,onChange:r=>_(a.id,r.target.name,r.target.value)})]}),t("div",{className:"w-full",children:[e(i,{children:"Nominal"}),t("div",{className:"flex items-center justify-start gap-3",children:[e("div",{className:"min-w-32",children:e(S,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:(r,d)=>j(parseInt(r),d,a.id),value:a.nominal,placeholder:"Inputkan angka tanpa sparator"})}),t("div",{className:"flex items-center justify-start gap-3",children:[e(X,{name:"dana_titipan",id:`dana_titipan_${a.id}`,checked:a.isActiveMember,onChange:r=>_(a.id,r.target.name,r.target.checked)}),e(i,{htmlFor:`dana_titipan_${a.id}`,className:"whitespace-nowrap",children:"Dana Titipan"})]}),e(p,{onClick:()=>Y(a.id),type:"button",size:"iconsm",variant:"outline",children:e(Q,{className:"w-auto h-3"})})]})]})]},a.id))})]}),t("div",{className:"text-end",children:[n.tanggal_drop&&e(p,{type:"button",onClick:M,className:"mr-3",variant:"outline",children:"Add Angsuran"}),e(p,{children:"Submit"})]})]})]})]}),e("div",{className:"w-auto"})]})]})};export{ye as default};
