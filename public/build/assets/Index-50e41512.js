import{q as c,j as a,a as e,c as i}from"./app-49513fe7.js";import{M as o,L as h,H as t,U as m}from"./MobileLayout-5f9f99a3.js";import{B as r}from"./button-02e9f315.js";import"./card-1edd8ef7.js";import{M as s}from"./react-icons.esm-665c9a46.js";import{c as l}from"./createLucideIcon-274b4533.js";import"./Loading-464ad84f.js";import"./transition-265a589d.js";import"./SweetAlert-897ab6c3.js";import"./index-d6d6f4c3.js";import"./index-77e42ac0.js";import"./index-a869c44c.js";import"./utils-46f1eee5.js";import"./index-d19021c0.js";import"./index-f96983da.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=l("BookA",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}],["path",{d:"m8 13 4-7 4 7",key:"4rari8"}],["path",{d:"M9.1 11h5.7",key:"1gkovt"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=l("BookCheck",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}],["path",{d:"m9 9.5 2 2 4-4",key:"1dth82"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=l("BookMarked",[["path",{d:"M10 2v8l3-3 3 3V2",key:"sqw3rj"}],["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]]),j=()=>{const{auth:d}=c().props;return a(o,{children:[a("fieldset",{className:"grid gap-6 p-4 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Mantri"}),a("div",{className:"flex items-center justify-around gap-6",children:[a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.create"),children:e(s,{className:"h-7 w-7"})})}),e("div",{children:"Pengajuan"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.transaksi"),children:e(h,{className:"h-7 w-7"})})}),e("div",{children:"Drop"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.angsuran"),children:e(t,{className:"h-7 w-7"})})}),e("div",{children:"Angsuran"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.macet"),children:e(m,{className:"h-7 w-7"})})}),e("div",{children:"Macet"})]})]})]}),a("fieldset",{className:"grid gap-6 p-4 mt-3 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Laporan"}),a("div",{className:"flex items-center justify-around gap-6",children:[a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.buku_angsuran"),children:e(p,{className:"h-7 w-7"})})}),e("div",{children:"Buku Angsuran"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.buku_storting"),children:e(u,{className:"h-7 w-7"})})}),e("div",{children:"Buku Storting"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.rekap_permantri"),children:e(t,{className:"h-7 w-7"})})}),e("div",{children:"Rekap Mantri"})]})]})]}),d.permissions.includes("can update")&&a("fieldset",{className:"grid gap-6 p-4 mt-3 border rounded-lg",children:[e("legend",{className:"px-1 -ml-1 text-sm font-medium",children:"Menu Kepala & Pimpinan"}),a("div",{className:"flex flex-wrap items-center justify-around gap-6",children:[a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("home"),children:e(s,{className:"h-7 w-7"})})}),e("div",{children:"Web Apps"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.buku_transaksi_kepala"),children:e(n,{className:"h-7 w-7"})})}),e("div",{children:"Buku Transaksi"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.rencana_drop_kepala"),children:e(n,{className:"h-7 w-7"})})}),e("div",{children:"Rencana Drop"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.rekap_dua"),children:e(n,{className:"h-7 w-7"})})}),e("div",{children:"Rekap Pimpinan"})]}),a("div",{className:"text-center",children:[e(r,{size:"icon2xl",variant:"outline",asChild:!0,children:e(i,{href:route("mobile_apps.rekap_satu"),children:e(n,{className:"h-7 w-7"})})}),e("div",{children:"Rekap Kasir"})]})]})]})]})};export{j as default};