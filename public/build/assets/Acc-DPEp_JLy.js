import{G as w,r as N,j as n}from"./app-ns96WniE.js";import{L as y}from"./Loading-CQcppPTv.js";import{N as p}from"./NoEditOverlay-Dv4NQiXx.js";import{u as _}from"./useFrontEndPermission-Bz_ZFMzI.js";import{B as r}from"./badge-BURuAftI.js";import{B as c}from"./button-BdBexs_k.js";import{L as f}from"./label-dPIdyTXP.js";import{C as t}from"./index.esm-VUGX4ntA.js";import"./index-D7YONi1a.js";import"./transition-DQ1_kMjs.js";import"./utils-CytzSlOG.js";import"./index-Gs9KmwE-.js";import"./index-BrmqkDWz.js";import"./index-BYjqc5GM.js";const O=({id:i,acc:x,onClosed:h,triggeredData:s})=>{const{data:m,setData:u,put:d,processing:v,reset:j,transform:b}=w({approved_nominal:"",status:"",drop:""}),{isMantri:k,isCreator:C}=_();N.useEffect(()=>{u(o=>({...o,approved_nominal:(s==null?void 0:s.acc)??(s==null?void 0:s.request),drop:s==null?void 0:s.acc}))},[i,x]);const a=(o,e)=>{u(e,o)},l=o=>{b(e=>({...e,status:o})),d(route("transaction.action_buku_transaksi",i),{onSuccess:()=>{j(),h()}})};return n.jsxs("form",{className:"w-full",onSubmit:o=>o.preventDefault(),children:[!C&&n.jsx(p,{value:"User Tidak Dapat Digunakan Untuk Mengedit"}),n.jsx(y,{show:v}),n.jsx("div",{className:"mb-3",children:(s==null?void 0:s.status)==="open"?n.jsxs(n.Fragment,{children:[k&&n.jsx(p,{value:"Tunggu Pimpinan Acc Terlebih Dahulu"}),n.jsx(f,{htmlFor:"approved_nominal",children:"Nominal ACC"}),n.jsx(t,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"approved_nominal",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:a,value:m.approved_nominal,placeholder:"Inputkan angka tanpa sparator"}),n.jsxs("div",{className:"flex items-center justify-end gap-3 mt-2",children:[n.jsx(c,{variant:"green",onClick:()=>l("acc"),children:"ACC"}),n.jsx(c,{variant:"destructive",onClick:()=>l("tolak"),children:"Tolak"})]})]}):n.jsxs(r,{size:"lg",variant:"green",children:["Status Pengajuan = ",s==null?void 0:s.status,", Pada Tanggal",s==null?void 0:s.check_date]})}),(s==null?void 0:s.status)!=="open"&&n.jsx("div",{className:"mb-3",children:(s==null?void 0:s.status)==="acc"?n.jsxs(n.Fragment,{children:[n.jsx(f,{htmlFor:"drop",className:"whitespace-normal",children:"Drop Jadi"}),n.jsx(t,{className:"flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",name:"drop",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:a,value:m.drop,placeholder:"Inputkan angka tanpa sparator"}),n.jsxs("div",{className:"flex items-center justify-end gap-3 mt-2",children:[n.jsx(c,{variant:"green",onClick:()=>l("success"),children:"DROP"}),n.jsx(c,{variant:"destructive",onClick:()=>l("gagal"),children:"GAGAL"})]})]}):n.jsxs(r,{size:"lg",variant:"green",children:["Status Pengajuan = ",s==null?void 0:s.status,", Tanggal",s==null?void 0:s.check_date]})})]})};export{O as default};
