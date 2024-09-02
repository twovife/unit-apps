import{W as F,r as M,j as t,a,d as p}from"./app-5b6f9f0b.js";import{C as S}from"./Checkbox-0d49be85.js";import{I as s}from"./InputError-5b929580.js";import{I as r}from"./InputLabel-de4c3e76.js";import{P as f}from"./PrimaryButton-c890247d.js";import{S as A}from"./SelectList-f0dd00de.js";import{T as o}from"./TextInput-516f049f.js";import{C as _}from"./index.esm-671163b8.js";const X=({status:P,setLoading:N,max_date:T,min_date:v,emps:x,customer_id:q,nik:C,url:y=route("transaction.store")})=>{const{data:n,setData:g,post:w,processing:D,errors:l}=F({nama:"",no_kk:"",alamat:"",nik:C,tanggal_drop:"",mantri:"",pinjaman:"",type_create:"2",danatitipan_1:!1,tanggal_angsuran_1:"",status_angsuran_:""}),[c,h]=M.useState([{id:1}]);console.log();const Y=()=>{const e=c[c.length-1].id+1;h([...c,{id:e}]),g({...n,[`tanggal_angsuran_${e}`]:p(n.tanggal_drop).add(e,"week").format("YYYY-MM-DD")})},$=e=>{const m=c.filter(u=>u.id!==e);h(m);const i={...n};delete i[`tanggal_angsuran_${e}`],delete i[`angsuran_${e}`],g(i)},j=e=>{const{name:m,value:i}=e.target,u={...n};Object.keys(u).forEach(b=>{(b.includes("angsuran")||b.includes("danatitipan"))&&delete u[b]}),h([{id:1},{id:2},{id:3}]);const I={...u,[m]:i,tanggal_angsuran_1:p(i).add(1,"week").format("YYYY-MM-DD"),tanggal_angsuran_2:p(i).add(2,"week").format("YYYY-MM-DD"),tanggal_angsuran_3:p(i).add(3,"week").format("YYYY-MM-DD")};g(I)},d=e=>{g(e.target.name,e.target.type==="checkbox"?e.target.checked:e.target.value)},k=(e,m)=>{g(m,e)};return console.log(n),t("form",{className:"flex-1",onSubmit:e=>{e.preventDefault(),w(y),N(D)},children:[a("div",{className:"text-lg font-semibold",children:"Permintaan Pinjaman Baru (Nasabah Lama)"}),t("div",{className:"p-4",children:[t("div",{className:"mb-1",children:[a(r,{optional:!0,htmlFor:"no_kk",value:"No KK Customer"}),a(o,{id:"no_kk",type:"text",name:"no_kk",required:!1,value:n.no_kk,className:"mt-1 block w-full",onChange:d}),a(s,{message:l.no_kk,className:"mt-2"})]}),t("div",{className:"mb-1",children:[a(r,{htmlFor:"nama",value:"Nama Customer"}),a(o,{id:"nama",type:"text",name:"nama",value:n.nama,className:"mt-1 block w-full",onChange:d}),a(s,{message:l.nama,className:"mt-2"})]}),t("div",{className:"mb-1",children:[a(r,{htmlFor:"alamat",value:"Alamat Customer"}),a(o,{id:"alamat",type:"text",name:"alamat",value:n.alamat,className:"mt-1 block w-full",onChange:d}),a(s,{message:l.alamat,className:"mt-2"})]}),t("div",{className:"mb-1",children:[a(r,{htmlFor:"tanggal_drop",value:"Tanggal Drop"}),a(o,{id:"tanggal_drop",type:"date",name:"tanggal_drop",min:v,value:n.tanggal_drop,className:"mt-1 block w-full",onChange:j}),a(s,{message:l.tanggal_drop,className:"mt-2"})]}),t("div",{className:"flex w-full gap-2 mb-1",children:[t("div",{className:"flex-1",children:[a(r,{htmlFor:"nik",value:"NIK Customer"}),a(o,{id:"nik",type:"text",name:"nik",value:n.nik,className:"mt-1 block w-full",readOnly:!0,onChange:d}),a(s,{message:l.nik,className:"mt-2"})]}),t("div",{className:"flex-1",children:[a(r,{htmlFor:"mantri",value:"Mantri"}),a(A,{id:"mantri",type:"text",name:"mantri",options:x,nullValue:!0,value:n.mantri,className:"mt-1 block w-full",onChange:d}),a(s,{message:l.mantri,className:"mt-2"})]})]}),t("div",{className:"mb-1",children:[a(r,{htmlFor:"pinjaman",value:"Nominal Pinjaman",className:"mb-1"}),a(_,{name:"pinjaman",id:"pinjaman",className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:k,value:n.pinjaman,placeholder:"Inputkan angka tanpa sparator"}),a(s,{message:l.pinjaman,className:"mt-2"})]}),a("div",{className:"mt-3 mb-3 font-semibold underline",children:"Input Angsuran"}),c.map((e,m)=>t("div",{className:"flex w-full gap-2 mb-1",children:[t("div",{className:"flex-1",children:[a(r,{htmlFor:`tanggal_angsuran_${e.id}`,value:"Tanggal Angsuran"}),a(o,{id:`tanggal_angsuran_${e.id}`,type:"date",name:`tanggal_angsuran_${e.id}`,value:n[`tanggal_angsuran_${e.id}`],className:"mt-1 block w-full",onChange:d}),a(s,{message:l[`tanggal_angsuran_${e.id}`],className:"mt-2"})]}),t("div",{className:"flex-[1.5]",children:[a(r,{htmlFor:`angsuran_${e.id}`,value:"Nominal Angsuran",className:"mb-1"}),t("div",{className:"flex gap-2 justify-center items-center",children:[a(_,{name:`angsuran_${e.id}`,id:`angsuran_${e.id}`,className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:k,value:n[`angsuran_${e.id}`],placeholder:"Inputkan angka tanpa sparator"}),a("div",{className:"block",children:t("label",{className:"flex items-center",children:[a(S,{name:`danatitipan_${e.id}`,value:n[`danatitipan_${e.id}`],onChange:d}),a("span",{className:"ml-2 text-xs text-gray-600",children:"titipan"})]})}),a("div",{children:m>=0&&a(f,{color:"red",type:"button",className:"block",onClick:()=>$(e.id),children:"X"})})]}),a(s,{message:l[`angsuran_${m}`],className:"mt-2"})]})]},e.id)),a(f,{type:"button",onClick:Y,title:"Add"}),a("div",{className:"block mt-4",children:a(f,{type:"submit",title:"Submit",color:"green"})})]})]})};export{X as default};
