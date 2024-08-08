import{r as l,a as e,j as a,F as S,c as C}from"./app-1b050a65.js";import{I}from"./InputError-3a1578c1.js";import{I as w}from"./InputLabel-d5db3934.js";import{P as F}from"./PrimaryButton-a26a8ed0.js";import{T as L}from"./TextInput-e29cc122.js";import{M as T}from"./MobileLayout-0382170d.js";import{d as j}from"./dayjs.min-77524380.js";import{N as M}from"./react-number-format.es-dd7647d9.js";import B from"./OldCustomer-6b9ba48a.js";import E from"./NewCustomer-82b73c72.js";import{u as _}from"./useServerFilter-e2e9b5a4.js";import{L as q}from"./LinkButton-c751c59b.js";import"./Loading-956b91e8.js";import"./transition-442663d2.js";import"./index-d4522d2d.js";import"./SelectList-2328f4c7.js";import"./index.esm-39fe6420.js";const ee=({max_date:p,min_date:h,...n})=>{var x,v;const{emps:A,kolompokMantri:N}=_(null,null,null,n.mantri),[y,r]=l.useState(!1),[b,f]=l.useState(),[t,c]=l.useState(),[o,k]=l.useState(),[d,u]=l.useState(),g=s=>{const i=document.getElementById("nik").value;r(!0),f(),c(),u(),C({method:"post",url:route("transaction.getnik"),data:{nik:i}}).then(function({data:m}){c(m.data),k(m.reqistered_customer),u(i),r(!1)}).catch(function({response:m}){f(m.data.message),c(),u(),r(!1)})};return e(T,{auth:n.auth,errors:n.errors,header:"Buku Transaksi",loading:y,children:a(S,{children:[a("div",{className:"mb-3",children:[e(w,{htmlFor:"nik",value:"Input Nik Customer"}),a("div",{className:"flex items-center justify-start gap-3 w-full",children:[e("div",{className:"w-full",children:e(L,{id:"nik",type:"text",name:"nik",required:!0,className:"mt-1 block w-full",autoComplete:"nik"})}),e(F,{title:"Cari",as:"button",type:"button",onClick:g}),e(q,{color:"blue",as:"a",href:route("mantriapps.index"),title:"Home"})]}),e(I,{message:b,className:"mt-2"})]}),t&&a("div",{className:"mb-3",children:[a("div",{className:"mb-3",children:[a("div",{className:"flex",children:[e("div",{className:"flex-[3]",children:"Nama Nasabah"}),e("div",{className:"flex-1",children:":"}),e("div",{className:"flex-[5]",children:(x=t==null?void 0:t[0])==null?void 0:x.customer_name})]}),a("div",{className:"flex mb-3",children:[e("div",{className:"flex-[3]",children:"NIK"}),e("div",{className:"flex-1",children:":"}),e("div",{className:"flex-[5]",children:(v=t==null?void 0:t[0])==null?void 0:v.nik})]})]}),e("div",{className:"overflow-auto rounded shadow-sm max-h-[50vh] border-b-2",children:a("table",{className:"text-sm w-full border",children:[e("thead",{className:"bg-gray-200",children:a("tr",{children:[e("td",{className:"py-1 px-2",children:"Tgl Drop"}),e("td",{className:"py-1 px-2",children:"Total Drop"}),e("td",{className:"py-1 px-2",children:"Lunas"}),e("td",{className:"py-1 px-2",children:"Status"})]})}),a("tbody",{children:[t&&t.map((s,i)=>a("tr",{className:"even:bg-gray-100",children:[e("td",{className:"px-2 py-1",children:s.tanggal_drop?j(s.tanggal_drop).format("DD-MM-YY"):""}),a("td",{className:"px-2 py-1",children:[" ",e(M,{value:s.drop,displayType:"text",thousandSeparator:","})]}),e("td",{className:"px-2 py-1",children:s.lunas}),e("td",{className:"px-2 py-1",children:s.status})]},i)),e("tr",{})]})]})})]}),d?o?e(B,{setLoading:r,max_date:p,min_date:h,emps:N,nik:d,customer_id:o==null?void 0:o.id,url:route("mantriapps.store")}):e(E,{setLoading:r,max_date:p,min_date:h,emps:N,nik:d,url:route("mantriapps.store")}):""]})})};export{ee as default};