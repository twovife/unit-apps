import{W as m,j as u,a}from"./app-a0d29dc0.js";import{L as c}from"./Loading-aa0339c0.js";import{B as p}from"./button-04b96693.js";import"./transition-f1922511.js";import"./utils-36e2ef84.js";const x=({id:o,onClosed:r})=>{const{data:l,setData:d,put:s,errors:f,processing:n,reset:i}=m({status:"gagal"}),t=e=>{e.preventDefault(),s(route("transaction.action_buku_transaksi",o),{onFinish:()=>{i(),r()}})};return u("form",{onSubmit:t,children:[a(c,{show:n}),a(p,{onClick:t,variant:"destructive",children:"TOLAK"})]})};export{x as default};
