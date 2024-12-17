import{r as p,R as c,j as s,a,x as m,X as ae,F as ie}from"./app-ea40b5cc.js";import{B as b}from"./button-bb453505.js";import{c as $}from"./createLucideIcon-43947fd7.js";import{D as se,a as oe,b as le,c as ce,d as E,e as L}from"./SweetAlert-9e256d9c.js";p.createContext();/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=$("GitMerge",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 21V9a9 9 0 0 0 9 9",key:"7kw0sc"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=$("LayoutList",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}],["path",{d:"M14 4h7",key:"3xa0d5"}],["path",{d:"M14 9h7",key:"1icrd9"}],["path",{d:"M14 15h7",key:"1mj8o2"}],["path",{d:"M14 20h7",key:"11slyb"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=$("UserRound",[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]]);var z={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},T=c.createContext&&c.createContext(z),me=["attr","size","title"];function pe(t,e){if(t==null)return{};var r=fe(t,e),n,i;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(i=0;i<o.length;i++)n=o[i],!(e.indexOf(n)>=0)&&Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}function fe(t,e){if(t==null)return{};var r={};for(var n in t)if(Object.prototype.hasOwnProperty.call(t,n)){if(e.indexOf(n)>=0)continue;r[n]=t[n]}return r}function v(){return v=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},v.apply(this,arguments)}function R(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),r.push.apply(r,n)}return r}function x(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?R(Object(r),!0).forEach(function(n){he(t,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):R(Object(r)).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(r,n))})}return t}function he(t,e,r){return e=ge(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function ge(t){var e=be(t,"string");return typeof e=="symbol"?e:e+""}function be(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function A(t){return t&&t.map((e,r)=>c.createElement(e.tag,x({key:r},e.attr),A(e.child)))}function ve(t){return e=>c.createElement(xe,v({attr:x({},t.attr)},e),A(t.child))}function xe(t){var e=r=>{var{attr:n,size:i,title:o}=t,d=pe(t,me),u=i||r.size||"1em",l;return r.className&&(l=r.className),t.className&&(l=(l?l+" ":"")+t.className),c.createElement("svg",v({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,n,d,{className:l,style:x(x({color:t.color||r.color},r.style),t.style),height:u,width:u,xmlns:"http://www.w3.org/2000/svg"}),o&&c.createElement("title",null,o),t.children)};return T!==void 0?c.createElement(T.Consumer,null,r=>e(r)):e(z)}function ye(t){return ve({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M16.939 7.939 12 12.879l-4.939-4.94-2.122 2.122L12 17.121l7.061-7.06z"},child:[]}]})(t)}const j=({title:t,items:e,active:r,className:n,icon:i})=>{const[o,d]=p.useState(r);return s("div",{className:"relative",children:[s(b,{type:"button",variant:o?"":"outline",onClick:()=>{d(!o)},className:`${n} w-full flex justify-start items-center`,children:[i||a(I,{className:"w-4 h-4 mr-2"}),a("div",{className:"flex-1 w-full text-start",children:t}),a(ye,{className:`${o?"transform rotate-180":""} w-5 h-5 transition-all duration-300`})]}),o&&a("div",{className:"w-full mt-2 origin-top-right rounded-md",children:a("div",{className:"py-1 space-y-2",children:e.map((l,y)=>a(b,{asChild:!0,variant:l.active?"destructive":"outline",className:`${n} w-full flex justify-start items-center`,onClick:()=>d(!1),children:s(m,{href:l.link,children:[a(ue,{className:"w-4 h-4 mr-2"}),l.title]})},y))})})]})},B=({title:t="Menu Baru",className:e,active:r,icon:n,href:i="#"})=>a(b,{asChild:!0,variant:r?"":"outline",className:`${e} w-full flex justify-start items-center`,children:s(m,{href:i,children:[n||a(I,{className:"mr-2 h-4 w-4"})," ",t]})}),we=({isOpen:t})=>{const{auth:e}=ae().props,r=e.permissions.includes("unit apps");return s("aside",{className:`bg-white text-slate-900 w-64 fixed top-16 left-0 bottom-0 z-40 transition-all ease-in-out duration-300 border-r shadow ${t?"translate-x-0":"-translate-x-64"}`,children:[a("div",{className:"px-4 py-4 font-semibold border-b",children:"Apps Menu"}),s("div",{className:"p-4 space-y-4",children:[a(B,{href:route("home"),title:"Home",active:route().current("home")}),r&&s(ie,{children:[a(B,{active:route().current("administrasi.manpower.index"),href:route("administrasi.manpower.index"),title:"Data Karyawan"}),a(j,{title:"Buku Transaksi",active:route().current("transaction.*"),items:[{id:1,title:"Buku Transaksi Mantri",link:route("transaction.index_buku_transaksi"),active:route().current("transaction.index_buku_transaksi")},{id:2,title:"Fast Create",link:route("transaction.fastcreate"),active:route().current("transaction.fastcreate")}]}),a(j,{title:"Angsuran",active:route().current("pinjaman.*"),items:[{id:1,title:"Angsuran Lancar",link:route("pinjaman.index_pinjaman"),active:route().current("pinjaman.index_pinjaman")},{id:3,title:"Macet",link:route("pinjaman.index_pinjaman_macet"),active:route().current("pinjaman.index_pinjaman_macet")},{id:2,title:"Cari Angsuran",link:route("pinjaman.index_pinjaman_search"),active:route().current("pinjaman.index_pinjaman_search")}]}),a(j,{title:"Rekap",active:route().current("kasir.rekap.*"),items:[{id:2,title:"Rekap 1 & Tunai Mantri",link:route("kasir.rekap.rekap_satu"),active:route().current("kasir.rekap.rekap_satu")},{id:1,title:e.permissions.includes("unit apps")?"Rekap 2":"Rekap Pimpinan",link:route("kasir.rekap.rekap_dua"),active:route().current("kasir.rekap.rekap_dua")},{id:3,title:"Rencana Drop",link:route("kasir.rekap.rencana_drop"),active:route().current("kasir.rekap.rencana_drop")},{id:4,title:"Rekap Mantri",link:route("kasir.rekap.rekap_permantri"),active:route().current("kasir.rekap.rekap_permantri")}]})]})]})]})},Ce=we,h=48,ke=({color:t="currentColor",direction:e="left",distance:r="md",duration:n=.4,easing:i="cubic-bezier(0, 0, 0, 1)",hideOutline:o=!0,label:d,lines:u=3,onToggle:l,render:y,rounded:F=!1,size:H=32,toggle:U,toggled:N,disabled:G=!1,animateOnMount:K=!1})=>{const[W,X]=p.useState(!1),[V,q]=p.useState(!1);p.useEffect(()=>{q(!0)},[]);const f=Math.max(12,Math.min(h,H)),J=Math.round((h-f)/2),_=f/12,g=Math.round(_),M=f/(u*((r==="lg"?.25:r==="sm"?.75:.5)+(u===3?1:1.25))),w=Math.round(M),Q=g*u+w*(u-1),Y=Math.round((h-Q)/2),Z=u===3?r==="lg"?4.0425:r==="sm"?5.1625:4.6325:r==="lg"?6.7875:r==="sm"?8.4875:7.6675,ee=(_-g+(M-w))/(u===3?1:2),te=parseFloat((f/Z-ee/(4/3)).toFixed(2)),P=Math.max(0,n),S={cursor:G?"not-allowed":"pointer",height:`${h}px`,position:"relative",transition:`${P}s ${i}`,userSelect:"none",width:`${h}px`},C={background:t,height:`${g}px`,left:`${J}px`,position:"absolute"};o&&(S.outline="none"),F&&(C.borderRadius="9em");const re=()=>{const D=N!==void 0?N:W;return K&&!V?!D:D},ne=U||X,k=re();return y({barHeight:g,barStyles:C,burgerStyles:S,easing:i,handler:()=>{ne(!k),typeof l=="function"&&l(!k)},isLeft:e==="left",isToggled:k,label:d,margin:w,move:te,time:P,topOffset:Y,width:f})};function O(){return O=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},O.apply(this,arguments)}const je=t=>c.createElement(ke,O({},t,{render:e=>c.createElement("div",{className:"hamburger-react","aria-label":e.label,"aria-expanded":e.isToggled,onClick:t.disabled?void 0:e.handler,onKeyUp:t.disabled?void 0:r=>r.key==="Enter"&&e.handler(),role:"button",style:{...e.burgerStyles,transform:`${e.isToggled?`rotate(${90*(e.isLeft?-1:1)}deg)`:"none"}`},tabIndex:0},c.createElement("div",{style:{...e.barStyles,width:`${e.width}px`,top:`${e.topOffset}px`,transition:`${e.time}s ${e.easing}`,transform:`${e.isToggled?`rotate(${45*(e.isLeft?-1:1)}deg) translate(${e.move*(e.isLeft?-1:1)}px, ${e.move}px)`:"none"}`}}),c.createElement("div",{style:{...e.barStyles,width:`${e.width}px`,top:`${e.topOffset+e.barHeight+e.margin}px`,transition:`${e.time}s ${e.easing}`,transform:`${e.isToggled?"scaleX(0)":"none"}`}}),c.createElement("div",{style:{...e.barStyles,width:`${e.width}px`,top:`${e.topOffset+e.barHeight*2+e.margin*2}px`,transition:`${e.time}s ${e.easing}`,transform:`${e.isToggled?`rotate(${45*(e.isLeft?1:-1)}deg) translate(${e.move*(e.isLeft?-1:1)}px, ${e.move*-1}px)`:"none"}`}}))})),Oe=({toggleSidebar:t,isOpen:e,auth:r,header:n})=>(p.useState(!1),a("header",{className:"sticky top-0 z-50 flex items-center h-16 gap-4 px-4 bg-white border-b md:px-6",children:s("nav",{className:"flex flex-row items-center w-full gap-5 text-sm font-medium lg:gap-6",children:[s("div",{className:"flex items-center justify-start",children:[a(je,{distance:"md",toggled:e,toggle:t,size:16,rounded:!0,color:"#020617"}),a("p",{className:"hidden font-semibold lg:block",children:"UBMI APPS"})]}),s("div",{className:"flex flex-1 w-full gap-6 underline",children:[a(m,{href:"#",className:"transition-colors text-muted-foreground hover:text-foreground",children:"Home"}),a(m,{href:route("mobile_apps.index"),className:"transition-colors text-muted-foreground hover:text-foreground",children:"Mantri Apps"})]}),s(se,{children:[a(oe,{asChild:!0,children:s(b,{className:"flex items-center justify-center gap-3 text-sm",children:[r.user.username,a(de,{className:"w-4 h-4 animate-pulse"})]})}),s(le,{align:"end",children:[a(ce,{children:r.user.employee.nama_karyawan}),a(E,{}),a(L,{children:a(m,{href:route("profile.edit"),children:"Profile"})}),a(E,{}),a(L,{children:a(m,{href:route("logout"),method:"post",as:"button",replace:"true",children:"Logout"})})]})]})]})})),De=Oe;export{De as N,Ce as S};
