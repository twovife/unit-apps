import{W as c,r as p,j as s,a as e}from"./app-56003dbd.js";import{I as u}from"./InputError-a0c99a73.js";import{I as f}from"./InputLabel-972db734.js";import{L as h}from"./Loading-af3e5f59.js";import{P as b}from"./PrimaryButton-1cb11139.js";import{S as C}from"./SelectList-76ba666f.js";import{C as g,a as v,b as y,d as N}from"./card-9a29127a.js";import"./transition-f631a278.js";import"./utils-36e2ef84.js";const A=({loan:t})=>{const{data:n,setData:r,post:i,processing:o,errors:l,reset:m}=c({notes:"",type_transaksi:"notes"});p.useEffect(()=>{r("notes",t.notes)},[t]);const d=a=>{r(a.target.name,a.target.type==="checkbox"?a.target.checked:a.target.value)};return s(g,{children:[e(h,{show:o}),e(v,{children:e(y,{children:"Jenis Nasabah"})}),e(N,{children:s("form",{onSubmit:a=>{a.preventDefault(),i(route("pinjaman.bayar_pinjaman",t.id)),m("notes")},children:[e(f,{htmlFor:"status",value:"Status"}),s("div",{className:"flex items-center justify-between w-full gap-3",children:[e("div",{className:"flex-[3]",children:e(C,{id:"notes",type:"date",name:"notes",value:n.notes,options:[{id:1,value:"10L",display:"10L"},{id:2,value:"Beban Pemakaian",display:"Beban Pemakaian"},{id:3,value:"CM LUNAS",display:"CM LUNAS"}],nullValue:!0,className:"block w-full mt-1",onChange:d})}),e("div",{className:"flex-[1]",children:e(b,{title:"Submit",type:"submit"})})]}),e(u,{message:l.notes,className:"mt-2"})]})})]})};export{A as default};