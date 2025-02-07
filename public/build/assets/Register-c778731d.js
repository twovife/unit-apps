import{G as v,r as l,X as x,j as s,a as e,S as _,x as b}from"./app-d484a7d2.js";import{I as i}from"./InputError-9c72daac.js";import{I as n}from"./InputLabel-f88d45c1.js";import{T as p}from"./TextInput-96fee1a6.js";import{S as C}from"./SelectList-5d8ad4a0.js";import{A as k}from"./AuthenticatedLayout-5411a3b6.js";import{L as S}from"./Loading-8de321b5.js";import{B as j}from"./button-8c0bc7cc.js";import"./Navbar-e52bcf93.js";import"./createLucideIcon-d000e5d9.js";import"./SweetAlert-732fed95.js";import"./index-5c259ab6.js";import"./index-98ca6607.js";import"./index-73a971cd.js";import"./index-285c6289.js";import"./Combination-44a5c864.js";import"./index-d874ae91.js";import"./index-0912e6e8.js";import"./react-icons.esm-9d6503eb.js";import"./utils-3f044a58.js";import"./transition-34aa8e6f.js";function V({employees:d}){const{data:o,setData:f,post:w,processing:u,errors:t,reset:g}=v({username:"",employee_id:"",password:"",password_confirmation:""});l.useEffect(()=>()=>{g("password","password_confirmation")},[]);const{auth:h}=x().props,c=h.permissions.includes("can update pusat");console.log(c);const m=a=>{f(a.target.name,a.target.type==="checkbox"?a.target.checked:a.target.value)},[y,N]=l.useState([]);return l.useEffect(()=>{const a=d.map(r=>({id:r.id,display:`${r.nama_karyawan} - ${r.jabatan} - ${r.area}`,value:r.id}));N(a)},[d]),s(k,{children:[e(S,{show:u}),e(_,{title:"Register"}),c&&s("form",{onSubmit:a=>{a.preventDefault(),w(route("register"))},className:"max-w-lg mx-auto",children:[s("div",{children:[e(n,{htmlFor:"employee_id",value:"Nama Karyawan"}),e(C,{id:"employee_id",name:"employee_id",value:o.employee_id,className:"mt-1 block w-full",options:y,nullvalue:!0,onChange:m,required:!0}),e(i,{message:t.employee_id,className:"mt-2"})]}),s("div",{className:"mt-4",children:[e(n,{htmlFor:"username",value:"username"}),e(p,{id:"username",name:"username",value:o.username,className:"mt-1 block w-full",autoComplete:"username",onChange:m,required:!0}),e(i,{message:t.username,className:"mt-2"})]}),s("div",{className:"mt-4",children:[e(n,{htmlFor:"password",value:"Password"}),e(p,{id:"password",type:"password",name:"password",value:o.password,className:"mt-1 block w-full",autoComplete:"new-password",onChange:m,required:!0}),e(i,{message:t.password,className:"mt-2"})]}),s("div",{className:"mt-4",children:[e(n,{htmlFor:"password_confirmation",value:"Confirm Password"}),e(p,{id:"password_confirmation",type:"password",name:"password_confirmation",value:o.password_confirmation,className:"mt-1 block w-full",autoComplete:"new-password",onChange:m,required:!0}),e(i,{message:t.password_confirmation,className:"mt-2"})]}),s("div",{className:"flex items-center justify-end mt-4",children:[e(b,{href:route("login"),className:"underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",children:"Already registered?"}),e(j,{className:"ml-4",disabled:u,children:"Register"})]})]})]})}export{V as default};
