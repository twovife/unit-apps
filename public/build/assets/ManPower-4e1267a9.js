import{q as N,r as d,j as i,F as C,a as e,c as h}from"./app-3f4c46d7.js";import{B as p}from"./BadgeStatus-447b6197.js";import{T as _,a as S,b as u,c as s,d as y,e as n}from"./table-732ed773.js";import A from"./GenerateUser-39c7a0fd.js";import{B}from"./BargeStatus-ff92ba9a.js";import{S as f,P as T,a as D,F as Y,b as j}from"./popover-e9f2a80c.js";import{B as k}from"./button-f56186ee.js";import"./badge-adb99b07.js";import"./utils-36e2ef84.js";import"./Loading-8ece246b.js";import"./transition-459d1e32.js";import"./SelectList-e0776c12.js";import"./dialog-0981729a.js";import"./index-cbf68227.js";import"./index-2eb0b81c.js";import"./react-icons.esm-781bf028.js";import"./index-20cc0eeb.js";import"./input-26f5df22.js";import"./label-4d3ed3a1.js";import"./index-ed928599.js";import"./createLucideIcon-81ee07c9.js";import"./SelectComponent-e5c558f4.js";import"./index-30a40468.js";const se=({datas:l,title:g})=>{const{auth:a}=N().props,[v,t]=d.useState(!1),[b,o]=d.useState(null),x=r=>{o(r),t(!0)};return i(C,{children:[e(A,{show:v,triggeredData:b,onClosed:()=>{o(null),t(!1)}}),i("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[e("div",{className:"flex-none shrink-0 whitespace-nowrap",children:e("h1",{className:"text-xl font-semibold tracking-tight ",children:g})}),e("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:e(f,{urlLink:route("administrasi.manpower.index"),localState:"administrasi_manpower_store",searchGroupingBranch:a.permissions.includes("can show branch")})}),e("div",{className:"flex justify-end gap-3 lg:hidden",children:i(T,{children:[e(D,{asChild:!0,children:i(k,{variant:"outline",children:[e(Y,{className:"h-4"}),"Filter"]})}),e(j,{children:e(f,{urlLink:route("administrasi.manpower.index"),localState:"administrasi_manpower_store",searchGroupingBranch:a.permissions.includes("can show branch")})})]})})]}),e("div",{className:"max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:i(_,{children:[e(S,{children:i(u,{children:[e(s,{children:"Nomor"}),e(s,{children:"Nama Karaywan"}),e(s,{children:"Username"}),e(s,{children:"NIK"}),e(s,{children:"Alamat"}),e(s,{children:"Jabatan"}),e(s,{children:"Tanggal Masuk"}),e(s,{children:"Date Resign"})]})}),e(y,{children:l&&l.map((r,c)=>{var m;return i(u,{children:[e(n,{children:i("div",{className:"flex items-center",children:[e("div",{className:"hidden lg:flex-1 lg:block",children:c+1}),e("div",{className:"flex-1",children:a.permissions.includes("superuser")?e(B,{onClick:()=>x(r),value:r.isActive,children:r.isActive?"Act":"Non Act"}):e(p,{value:r.isActive,children:r.isActive?"Act":"Non Act"})})]})}),e(n,{children:r.employee_name}),i(n,{children:[e(p,{value:r.username_status==1,children:r.username}),a.permissions.includes("superuser")&&e("div",{className:"flex gap-1",children:(m=r.rolelist)==null?void 0:m.map(w=>e("span",{children:w.name}))})]}),e(n,{children:r.identity_id}),e(n,{children:r.address}),e(n,{children:r.employment}),e(n,{children:r.hire_date?h(r.hire_date).format("DD-MM-YYYY"):""}),e(n,{children:r.resign_date?h(r.resign_date).format("DD-MM-YYYY"):""})]},c)})})]})})]})};export{se as default};
