<<<<<<<< HEAD:public/build/assets/OldCustomer-de157f1e.js
import{W as S,r as F,j as t,a as e,c as u}from"./app-1513e6ad.js";import{C as P}from"./Checkbox-da7e107c.js";import{I as i}from"./InputError-ff1ce2b5.js";import{I as d}from"./InputLabel-7e6bf775.js";import{P as h}from"./PrimaryButton-24a1d2b3.js";import{S as T}from"./SelectList-5a93a8d5.js";import{T as b}from"./TextInput-a52a2d1e.js";import{C as k}from"./index.esm-a025e82b.js";const X=({status:A,setLoading:N,max_date:O,min_date:v,emps:x,customer_id:C,nik:y,url:w=route("transaction.store")})=>{const{data:n,setData:m,post:D,processing:Y,errors:r}=S({tanggal_drop:"",customer_id:C,nik:y,mantri:"",pinjaman:"",type_create:"2",danatitipan_1:!1,tanggal_angsuran_1:"",status_angsuran_:""}),[o,p]=F.useState([{id:1}]);console.log();const $=()=>{const a=o[o.length-1].id+1;p([...o,{id:a}]),m({...n,[`tanggal_angsuran_${a}`]:u(n.tanggal_drop).add(a,"week").format("YYYY-MM-DD")})},j=a=>{const s=o.filter(g=>g.id!==a);p(s);const l={...n};delete l[`tanggal_angsuran_${a}`],delete l[`angsuran_${a}`],m(l)},I=a=>{const{name:s,value:l}=a.target,g={...n};Object.keys(g).forEach(f=>{(f.includes("angsuran")||f.includes("danatitipan"))&&delete g[f]}),p([{id:1},{id:2},{id:3}]);const M={...g,[s]:l,tanggal_angsuran_1:u(l).add(1,"week").format("YYYY-MM-DD"),tanggal_angsuran_2:u(l).add(2,"week").format("YYYY-MM-DD"),tanggal_angsuran_3:u(l).add(3,"week").format("YYYY-MM-DD")};m(M)},c=a=>{m(a.target.name,a.target.type==="checkbox"?a.target.checked:a.target.value)},_=(a,s)=>{m(s,a)};return console.log(n),t("form",{className:"flex-1",onSubmit:a=>{a.preventDefault(),D(w),N(Y)},children:[e("div",{className:"text-lg font-semibold",children:"Permintaan Pinjaman Baru (Nasabah Lama)"}),t("div",{className:"p-4",children:[t("div",{className:"mb-1",children:[e(d,{htmlFor:"tanggal_drop",value:"Tanggal Drop"}),e(b,{id:"tanggal_drop",type:"date",name:"tanggal_drop",min:v,value:n.tanggal_drop,className:"mt-1 block w-full",onChange:I}),e(i,{message:r.tanggal_drop,className:"mt-2"})]}),t("div",{className:"flex w-full gap-2 mb-1",children:[t("div",{className:"flex-1",children:[e(d,{htmlFor:"nik",value:"NIK Customer"}),e(b,{id:"nik",type:"text",name:"nik",value:n.nik,className:"mt-1 block w-full",readOnly:!0,onChange:c}),e(i,{message:r.nik,className:"mt-2"})]}),t("div",{className:"flex-1",children:[e(d,{htmlFor:"mantri",value:"Mantri"}),e(T,{id:"mantri",type:"text",name:"mantri",options:x,nullValue:!0,value:n.mantri,className:"mt-1 block w-full",onChange:c}),e(i,{message:r.mantri,className:"mt-2"})]})]}),t("div",{className:"mb-1",children:[e(d,{htmlFor:"pinjaman",value:"Nominal Pinjaman",className:"mb-1"}),e(k,{name:"pinjaman",id:"pinjaman",className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:_,value:n.pinjaman,placeholder:"Inputkan angka tanpa sparator"}),e(i,{message:r.pinjaman,className:"mt-2"})]}),e("div",{className:"mt-3 mb-3 font-semibold underline",children:"Input Angsuran"}),o.map((a,s)=>t("div",{className:"flex w-full gap-2 mb-1",children:[t("div",{className:"flex-1",children:[e(d,{htmlFor:`tanggal_angsuran_${a.id}`,value:"Tanggal Angsuran"}),e(b,{id:`tanggal_angsuran_${a.id}`,type:"date",name:`tanggal_angsuran_${a.id}`,value:n[`tanggal_angsuran_${a.id}`],className:"mt-1 block w-full",onChange:c}),e(i,{message:r[`tanggal_angsuran_${a.id}`],className:"mt-2"})]}),t("div",{className:"flex-[1.5]",children:[e(d,{htmlFor:`angsuran_${a.id}`,value:"Nominal Angsuran",className:"mb-1"}),t("div",{className:"flex gap-2 justify-center items-center",children:[e(k,{name:`angsuran_${a.id}`,id:`angsuran_${a.id}`,className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:_,value:n[`angsuran_${a.id}`],placeholder:"Inputkan angka tanpa sparator"}),e("div",{className:"block",children:t("label",{className:"flex items-center",children:[e(P,{name:`danatitipan_${a.id}`,value:n[`danatitipan_${a.id}`],onChange:c}),e("span",{className:"ml-2 text-xs text-gray-600",children:"titipan"})]})}),e("div",{children:s>=0&&e(h,{color:"red",type:"button",className:"block",onClick:()=>j(a.id),children:"X"})})]}),e(i,{message:r[`angsuran_${s}`],className:"mt-2"})]})]},a.id)),e(h,{type:"button",onClick:$,title:"Add"}),e("div",{className:"block mt-4",children:e(h,{type:"submit",title:"Submit",color:"green"})})]})]})};export{X as default};
========
import{W as S,r as F,j as t,a as e,c as u}from"./app-35d31ed9.js";import{C as P}from"./Checkbox-c284e770.js";import{I as i}from"./InputError-43992ab8.js";import{I as d}from"./InputLabel-c3c1a497.js";import{P as h}from"./PrimaryButton-43022f34.js";import{S as T}from"./SelectList-57492041.js";import{T as b}from"./TextInput-1dda684e.js";import{C as k}from"./index.esm-afbbfe1e.js";const X=({status:A,setLoading:N,max_date:O,min_date:v,emps:x,customer_id:C,nik:y,url:w=route("transaction.store")})=>{const{data:n,setData:m,post:D,processing:Y,errors:r}=S({tanggal_drop:"",customer_id:C,nik:y,mantri:"",pinjaman:"",type_create:"2",danatitipan_1:!1,tanggal_angsuran_1:"",status_angsuran_:""}),[o,p]=F.useState([{id:1}]);console.log();const $=()=>{const a=o[o.length-1].id+1;p([...o,{id:a}]),m({...n,[`tanggal_angsuran_${a}`]:u(n.tanggal_drop).add(a,"week").format("YYYY-MM-DD")})},j=a=>{const s=o.filter(g=>g.id!==a);p(s);const l={...n};delete l[`tanggal_angsuran_${a}`],delete l[`angsuran_${a}`],m(l)},I=a=>{const{name:s,value:l}=a.target,g={...n};Object.keys(g).forEach(f=>{(f.includes("angsuran")||f.includes("danatitipan"))&&delete g[f]}),p([{id:1},{id:2},{id:3}]);const M={...g,[s]:l,tanggal_angsuran_1:u(l).add(1,"week").format("YYYY-MM-DD"),tanggal_angsuran_2:u(l).add(2,"week").format("YYYY-MM-DD"),tanggal_angsuran_3:u(l).add(3,"week").format("YYYY-MM-DD")};m(M)},c=a=>{m(a.target.name,a.target.type==="checkbox"?a.target.checked:a.target.value)},_=(a,s)=>{m(s,a)};return console.log(n),t("form",{className:"flex-1",onSubmit:a=>{a.preventDefault(),D(w),N(Y)},children:[e("div",{className:"text-lg font-semibold",children:"Permintaan Pinjaman Baru (Nasabah Lama)"}),t("div",{className:"p-4",children:[t("div",{className:"mb-1",children:[e(d,{htmlFor:"tanggal_drop",value:"Tanggal Drop"}),e(b,{id:"tanggal_drop",type:"date",name:"tanggal_drop",min:v,value:n.tanggal_drop,className:"mt-1 block w-full",onChange:I}),e(i,{message:r.tanggal_drop,className:"mt-2"})]}),t("div",{className:"flex w-full gap-2 mb-1",children:[t("div",{className:"flex-1",children:[e(d,{htmlFor:"nik",value:"NIK Customer"}),e(b,{id:"nik",type:"text",name:"nik",value:n.nik,className:"mt-1 block w-full",readOnly:!0,onChange:c}),e(i,{message:r.nik,className:"mt-2"})]}),t("div",{className:"flex-1",children:[e(d,{htmlFor:"mantri",value:"Mantri"}),e(T,{id:"mantri",type:"text",name:"mantri",options:x,nullValue:!0,value:n.mantri,className:"mt-1 block w-full",onChange:c}),e(i,{message:r.mantri,className:"mt-2"})]})]}),t("div",{className:"mb-1",children:[e(d,{htmlFor:"pinjaman",value:"Nominal Pinjaman",className:"mb-1"}),e(k,{name:"pinjaman",id:"pinjaman",className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:_,value:n.pinjaman,placeholder:"Inputkan angka tanpa sparator"}),e(i,{message:r.pinjaman,className:"mt-2"})]}),e("div",{className:"mt-3 mb-3 font-semibold underline",children:"Input Angsuran"}),o.map((a,s)=>t("div",{className:"flex w-full gap-2 mb-1",children:[t("div",{className:"flex-1",children:[e(d,{htmlFor:`tanggal_angsuran_${a.id}`,value:"Tanggal Angsuran"}),e(b,{id:`tanggal_angsuran_${a.id}`,type:"date",name:`tanggal_angsuran_${a.id}`,value:n[`tanggal_angsuran_${a.id}`],className:"mt-1 block w-full",onChange:c}),e(i,{message:r[`tanggal_angsuran_${a.id}`],className:"mt-2"})]}),t("div",{className:"flex-[1.5]",children:[e(d,{htmlFor:`angsuran_${a.id}`,value:"Nominal Angsuran",className:"mb-1"}),t("div",{className:"flex gap-2 justify-center items-center",children:[e(k,{name:`angsuran_${a.id}`,id:`angsuran_${a.id}`,className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full",allowDecimals:!1,prefix:"Rp. ",min:1,required:!0,onValueChange:_,value:n[`angsuran_${a.id}`],placeholder:"Inputkan angka tanpa sparator"}),e("div",{className:"block",children:t("label",{className:"flex items-center",children:[e(P,{name:`danatitipan_${a.id}`,value:n[`danatitipan_${a.id}`],onChange:c}),e("span",{className:"ml-2 text-xs text-gray-600",children:"titipan"})]})}),e("div",{children:s>=0&&e(h,{color:"red",type:"button",className:"block",onClick:()=>j(a.id),children:"X"})})]}),e(i,{message:r[`angsuran_${s}`],className:"mt-2"})]})]},a.id)),e(h,{type:"button",onClick:$,title:"Add"}),e("div",{className:"block mt-4",children:e(h,{type:"submit",title:"Submit",color:"green"})})]})]})};export{X as default};
>>>>>>>> parent of 1b5b8c4 (build):public/build/assets/OldCustomer-66c5e88f.js
