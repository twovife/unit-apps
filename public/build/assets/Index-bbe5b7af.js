import{j as i,a as r,b as n}from"./app-49513fe7.js";import"./Navbar-ecfd2a64.js";import"./SweetAlert-897ab6c3.js";import"./Loading-464ad84f.js";import{S as o}from"./SearchComponent-16bac3e8.js";import"./tabs-78c20ec0.js";import m from"./AngsuranTable-4e989d88.js";import"./FormatNumbering-aa0fb6f2.js";import{M as l}from"./MobileLayout-5f9f99a3.js";import{P as p,a as c,F as u,b as h}from"./popover-87ce1bfb.js";import{B as d}from"./button-02e9f315.js";import"./index-8be16ec8.js";import"./createLucideIcon-274b4533.js";import"./react-icons.esm-665c9a46.js";import"./index-d6d6f4c3.js";import"./index-77e42ac0.js";import"./index-a869c44c.js";import"./utils-46f1eee5.js";import"./transition-265a589d.js";import"./SelectComponent-d151e1ae.js";import"./input-f62b4336.js";import"./label-01aff0bc.js";import"./index-0b4e949c.js";import"./index-f96983da.js";import"./badge-bc671c0a.js";import"./react-number-format.es-af5b4c77.js";import"./index-d19021c0.js";const J=({datas:a,dateOfWeek:s,sirkulasi:f,...t})=>{const{auth:e}=t;return i(l,{header:r(n,{children:"Angsuran Lancar"}),children:[i("div",{className:"flex flex-row items-center justify-between gap-3 mb-3",children:[r("div",{className:"flex-none shrink-0 whitespace-nowrap",children:r("h1",{className:"text-xl font-semibold tracking-tight ",children:"Buku Transaksi"})}),r("div",{className:"items-center justify-end flex-auto hidden w-full lg:flex",children:r(o,{urlLink:route("mobile_apps.buku_angsuran"),localState:"mobile_apps_buku_angsuran",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})}),r("div",{className:"flex justify-end gap-3 lg:hidden",children:i(p,{children:[r(c,{asChild:!0,children:i(d,{variant:"outline",children:[r(u,{className:"h-4"}),"Filter"]})}),r(h,{children:r(o,{urlLink:route("mobile_apps.buku_angsuran"),localState:"mobile_apps_buku_angsuran",searchMonth:!0,searchHari:!0,searchKelompok:e.permissions.includes("can show kelompok"),searchGroupingBranch:e.permissions.includes("can show branch")})})]})})]}),r(m,{dateOfWeek:s,datas:a})]})};export{J as default};