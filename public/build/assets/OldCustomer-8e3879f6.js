import{W as x,j as e,a}from"./app-a7896ce4.js";import{C}from"./Checkbox-01b05292.js";import{I as s}from"./InputError-200f96e0.js";import{I as m}from"./InputLabel-f21c8542.js";import{P as y}from"./PrimaryButton-d861a6ad.js";import{S as _}from"./SelectList-40614ce6.js";import{T as o}from"./TextInput-7bf99ae9.js";import{C as j}from"./index.esm-385d9f83.js";const B=({setLoading:d,max_date:i,min_date:g,emps:u,customer_id:p,nik:h,url:b=route("transaction.store")})=>{const{data:t,setData:c,post:f,processing:N,errors:l}=x({transaction_date:i,tanggal_drop:"",customer_id:p,nik:h,mantri:"",pinjaman:"",type_create:"2",droplangsung:!1}),r=n=>{c(n.target.name,n.target.type==="checkbox"?n.target.checked:n.target.value)},v=(n,k)=>{c(k,n)};return e("form",{className:"flex-1",onSubmit:n=>{n.preventDefault(),f(b),d(N)},children:[a("div",{className:"text-lg font-semibold",children:"Permintaan Pinjaman Baru (Nasabah Lama)"}),e("div",{className:"p-4",children:[e("div",{className:"flex w-full gap-2 mb-1",children:[e("div",{className:"flex-1",children:[a(m,{htmlFor:"transaction_date",value:"Tanggal Pinjam"}),a(o,{id:"transaction_date",type:"date",name:"transaction_date",max:i,value:t.transaction_date,className:"mt-1 block w-full",onChange:r}),a(s,{message:l.transaction_date,className:"mt-2"})]}),e("div",{className:"flex-1",children:[a(m,{htmlFor:"tanggal_drop",value:"Tanggal Drop"}),a(o,{id:"tanggal_drop",type:"date",name:"tanggal_drop",min:g,value:t.tanggal_drop,className:"mt-1 block w-full",onChange:r}),a(s,{message:l.tanggal_drop,className:"mt-2"})]})]}),e("div",{className:"mb-1",children:[a(m,{htmlFor:"nik",value:"NIK Customer"}),a(o,{id:"nik",type:"text",name:"nik",value:t.nik,className:"mt-1 block w-full",readOnly:!0,onChange:r}),a(s,{message:l.nik,className:"mt-2"})]}),e("div",{className:"mb-1",children:[a(m,{htmlFor:"mantri",value:"Mantri"}),a(_,{id:"mantri",type:"text",name:"mantri",options:u,nullValue:!0,value:t.mantri,className:"mt-1 block w-full",onChange:r}),a(s,{message:l.mantri,className:"mt-2"})]}),e("div",{className:"mb-1",children:[a(m,{htmlFor:"pinjaman",value:"Nominal Pinjaman",className:"mb-1"}),a(j,{name:"pinjaman",id:"pinjaman",className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:v,value:t.pinjaman,placeholder:"Inputkan angka tanpa sparator"}),a(s,{message:l.pinjaman,className:"mt-2"})]}),t.transaction_date==t.tanggal_drop&&a("div",{className:"block mt-4",children:e("label",{className:"flex items-center",children:[a(C,{name:"droplangsung",value:t.droplangsung,onChange:r}),a("span",{className:"ml-2 font-semibold text-gray-600",children:"Drop Langsung?"})]})}),a("div",{className:"block mt-4",children:a(y,{type:"submit",title:"Submit",color:"green"})})]})]})};export{B as default};