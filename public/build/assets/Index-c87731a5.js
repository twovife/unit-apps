import{r as i,j as a,a as e,b as n,d as t}from"./app-c2fdeeef.js";import{M as h}from"./MobileLayout-8ae40811.js";import{G as l,a as m,b as s,c as u,d as g}from"./index-ab58e90b.js";import"./Loading-bfc8c4ad.js";import"./transition-ade3a8b7.js";import"./SweetAlert-d0db66ed.js";import"./createLucideIcon-b534cceb.js";import"./react-icons.esm-54b37c86.js";import"./index-efd1f812.js";import"./button-c3d083fb.js";import"./utils-36e2ef84.js";import"./index-ebe8d1ac.js";import"./index-138c56f6.js";function f(r){return l({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M106 304v-54h54v-36h-54v-54H70v54H16v36h54v54h36z"},child:[]},{tag:"circle",attr:{cx:"288",cy:"144",r:"112"},child:[]},{tag:"path",attr:{d:"M288 288c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128z"},child:[]}]})(r)}function p(r){return l({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"},child:[]},{tag:"path",attr:{d:"M9 10h6"},child:[]},{tag:"path",attr:{d:"M12 7v6"},child:[]}]})(r)}const W=({...r})=>{const[d,x]=i.useState(!1),o=r.auth.user.permissions.some(c=>c.name==="unit");return a(h,{auth:r.auth,errors:r.errors,header:"Buku Transaksi",loading:d,children:[e(n,{title:"Halaman Utama"}),a("div",{className:"flex justify-center items-center gap-6 flex-wrap",children:[a(t,{as:"a",href:route("mantriapps.create"),className:"w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",children:[e(f,{className:"text-5xl"}),e("p",{className:"text-center leading-tight",children:"Pengajuan Pinjaman"})]}),a(t,{as:"a",href:route("mantriapps.drop"),className:"w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",children:[e(m,{className:"text-5xl"}),e("p",{className:"text-center leading-tight",children:"Daftar Drop Mantri"})]}),a(t,{as:"a",href:route("mantriapps.angsur"),className:"w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",children:[e(s,{className:"text-5xl"}),e("p",{className:"text-center leading-tight",children:"Daftar Storting"})]}),a(t,{as:"a",href:route("mantriapps.ml"),className:"w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",children:[e(s,{className:"text-5xl"}),e("p",{className:"text-center leading-tight",children:"Buku ML"})]}),a(t,{as:"a",href:route("mantriapps.transaksi"),className:"w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",children:[e(p,{className:"text-5xl"}),e("p",{className:"text-center leading-tight",children:"Buku Transaksi"})]}),o&&a(t,{href:route("home"),className:"w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",children:[e(u,{className:"text-5xl"}),e("p",{className:"text-center leading-tight",children:"Web Apps"})]}),a(t,{href:route("logout"),method:"post",as:"button",className:"w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",children:[e(g,{className:"text-5xl"}),e("p",{className:"text-center leading-tight",children:"Logout"})]})]}),e("div",{className:"mt-9",children:a("div",{className:"bg-gray-50/40 backdrop-blur rounded shadow border border-gray-200 p-2 w-full",children:[a("div",{className:"flex justify-start items-center gap-2",children:[e("div",{className:"flex-[3]",children:"Nama"}),e("div",{className:"flex-1",children:":"}),e("div",{className:"flex-[5]",children:r.auth.user.employee.nama_karyawan})]}),a("div",{className:"flex justify-start items-center gap-2",children:[e("div",{className:"flex-[3]",children:"Wilayah / Unit"}),e("div",{className:"flex-1",children:":"}),a("div",{className:"flex-[5]",children:[r.auth.user.employee.branch.wilayah," /"," ",r.auth.user.employee.branch.unit]})]}),a("div",{className:"flex justify-start items-center gap-2",children:[e("div",{className:"flex-[3]",children:"Jabatan"}),e("div",{className:"flex-1",children:":"}),a("div",{className:"flex-[5]",children:[r.auth.user.employee.jabatan," ",r.auth.user.employee.area!=0]})]})]})})]})};export{W as default};
