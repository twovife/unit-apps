import{R as c,r as d,j as n,x as f,X as B}from"./app-ns96WniE.js";import"./Dropdown-DlxH6jXK.js";import{B as x}from"./button-BdBexs_k.js";import{c as O}from"./createLucideIcon-CwSQg7Eu.js";import{D as ie,a as se,b as oe,c as le,d as E,e as C}from"./sweetalert2.esm.all-k-RAFA3H.js";import{S as L}from"./SweetAlert-DQu1GW8V.js";import{L as ce}from"./Loading-CQcppPTv.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=O("GitMerge",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 21V9a9 9 0 0 0 9 9",key:"7kw0sc"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=O("LayoutList",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}],["path",{d:"M14 4h7",key:"3xa0d5"}],["path",{d:"M14 9h7",key:"1icrd9"}],["path",{d:"M14 15h7",key:"1mj8o2"}],["path",{d:"M14 20h7",key:"11slyb"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=O("UserRound",[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]]);var A={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},R=c.createContext&&c.createContext(A),pe=["attr","size","title"];function me(t,e){if(t==null)return{};var r=fe(t,e),a,i;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(i=0;i<o.length;i++)a=o[i],!(e.indexOf(a)>=0)&&Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}function fe(t,e){if(t==null)return{};var r={};for(var a in t)if(Object.prototype.hasOwnProperty.call(t,a)){if(e.indexOf(a)>=0)continue;r[a]=t[a]}return r}function g(){return g=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},g.apply(this,arguments)}function T(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),r.push.apply(r,a)}return r}function j(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?T(Object(r),!0).forEach(function(a){he(t,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):T(Object(r)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(r,a))})}return t}function he(t,e,r){return e=xe(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function xe(t){var e=ge(t,"string");return typeof e=="symbol"?e:e+""}function ge(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var a=r.call(t,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function F(t){return t&&t.map((e,r)=>c.createElement(e.tag,j({key:r},e.attr),F(e.child)))}function je(t){return e=>c.createElement(be,g({attr:j({},t.attr)},e),F(t.child))}function be(t){var e=r=>{var{attr:a,size:i,title:o}=t,u=me(t,pe),s=i||r.size||"1em",l;return r.className&&(l=r.className),t.className&&(l=(l?l+" ":"")+t.className),c.createElement("svg",g({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,a,u,{className:l,style:j(j({color:t.color||r.color},r.style),t.style),height:s,width:s,xmlns:"http://www.w3.org/2000/svg"}),o&&c.createElement("title",null,o),t.children)};return R!==void 0?c.createElement(R.Consumer,null,r=>e(r)):e(A)}function ve(t){return je({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M16.939 7.939 12 12.879l-4.939-4.94-2.122 2.122L12 17.121l7.061-7.06z"},child:[]}]})(t)}const w=({title:t,items:e,active:r,className:a,icon:i})=>{const[o,u]=d.useState(r),s=()=>{u(!o)};return n.jsxs("div",{className:"relative",children:[n.jsxs(x,{type:"button",variant:o?"":"outline",onClick:s,className:`${a} w-full flex justify-start items-center`,children:[i||n.jsx(z,{className:"w-4 h-4 mr-2"}),n.jsx("div",{className:"flex-1 w-full text-start",children:t}),n.jsx(ve,{className:`${o?"transform rotate-180":""} w-5 h-5 transition-all duration-300`})]}),o&&n.jsx("div",{className:"w-full mt-2 origin-top-right rounded-md",children:n.jsx("div",{className:"py-1 space-y-2",children:e.map((l,b)=>n.jsx(x,{asChild:!0,variant:l.active?"destructive":"outline",className:`${a} w-full flex justify-start items-center`,onClick:()=>u(!1),children:n.jsxs(f,{href:l.link,children:[n.jsx(ue,{className:"w-4 h-4 mr-2"}),l.title]})},b))})})]})},I=({title:t="Menu Baru",className:e,active:r,icon:a,href:i="#"})=>n.jsx(x,{asChild:!0,variant:r?"":"outline",className:`${e} w-full flex justify-start items-center`,children:n.jsxs(f,{href:i,children:[a||n.jsx(z,{className:"mr-2 h-4 w-4"})," ",t]})}),ye=({isOpen:t})=>{const{auth:e}=B().props,r=e.permissions.includes("unit apps");return n.jsxs("aside",{className:`bg-white text-slate-900 w-64 fixed top-16 left-0 bottom-0 z-40 transition-all ease-in-out duration-300 border-r shadow ${t?"translate-x-0":"-translate-x-64"}`,children:[n.jsx("div",{className:"px-4 py-4 font-semibold border-b",children:"Apps Menu"}),n.jsxs("div",{className:"p-4 space-y-4",children:[n.jsx(I,{href:route("home"),title:"Home",active:route().current("home")}),r&&n.jsxs(n.Fragment,{children:[n.jsx(I,{active:route().current("administrasi.manpower.index"),href:route("administrasi.manpower.index"),title:"Data Karyawan"}),n.jsx(w,{title:"Buku Transaksi",active:route().current("transaction.*"),items:[{id:1,title:"Buku Transaksi Mantri",link:route("transaction.index_buku_transaksi"),active:route().current("transaction.index_buku_transaksi")},{id:2,title:"Fast Create",link:route("transaction.fastcreate"),active:route().current("transaction.fastcreate")}]}),n.jsx(w,{title:"Angsuran",active:route().current("pinjaman.*"),items:[{id:1,title:"Angsuran Lancar",link:route("pinjaman.index_pinjaman"),active:route().current("pinjaman.index_pinjaman")},{id:3,title:"Macet",link:route("pinjaman.index_pinjaman_macet"),active:route().current("pinjaman.index_pinjaman_macet")},{id:2,title:"Cari Angsuran",link:route("pinjaman.index_pinjaman_search"),active:route().current("pinjaman.index_pinjaman_search")}]}),n.jsx(w,{title:"Rekap",active:route().current("kasir.rekap.*"),items:[{id:2,title:"Rekap 1 & Tunai Mantri",link:route("kasir.rekap.rekap_satu"),active:route().current("kasir.rekap.rekap_satu")},{id:1,title:e.permissions.includes("unit apps")?"Rekap 2":"Rekap Pimpinan",link:route("kasir.rekap.rekap_dua"),active:route().current("kasir.rekap.rekap_dua")},{id:3,title:"Rencana Drop",link:route("kasir.rekap.rencana_drop"),active:route().current("kasir.rekap.rencana_drop")},{id:4,title:"Rekap Mantri",link:route("kasir.rekap.rekap_permantri"),active:route().current("kasir.rekap.rekap_permantri")}]})]})]})]})},m=48,we=({color:t="currentColor",direction:e="left",distance:r="md",duration:a=.4,easing:i="cubic-bezier(0, 0, 0, 1)",hideOutline:o=!0,label:u,lines:s=3,onToggle:l,render:b,rounded:H=!1,size:U=32,toggle:G,toggled:$,disabled:K=!1,animateOnMount:W=!1})=>{const[X,V]=d.useState(!1),[q,J]=d.useState(!1);d.useEffect(()=>{J(!0)},[]);const p=Math.max(12,Math.min(m,U)),Q=Math.round((m-p)/2),N=p/12,h=Math.round(N),_=p/(s*((r==="lg"?.25:r==="sm"?.75:.5)+(s===3?1:1.25))),v=Math.round(_),Y=h*s+v*(s-1),Z=Math.round((m-Y)/2),ee=s===3?r==="lg"?4.0425:r==="sm"?5.1625:4.6325:r==="lg"?6.7875:r==="sm"?8.4875:7.6675,te=(N-h+(_-v))/(s===3?1:2),re=parseFloat((p/ee-te/(4/3)).toFixed(2)),M=Math.max(0,a),S={cursor:K?"not-allowed":"pointer",height:`${m}px`,position:"relative",transition:`${M}s ${i}`,userSelect:"none",width:`${m}px`},P={background:t,height:`${h}px`,left:`${Q}px`,position:"absolute"};o&&(S.outline="none"),H&&(P.borderRadius="9em");const ne=()=>{const D=$!==void 0?$:X;return W&&!q?!D:D},ae=G||V,y=ne();return b({barHeight:h,barStyles:P,burgerStyles:S,easing:i,handler:()=>{ae(!y),typeof l=="function"&&l(!y)},isLeft:e==="left",isToggled:y,label:u,margin:v,move:re,time:M,topOffset:Z,width:p})};function k(){return k=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},k.apply(this,arguments)}const ke=t=>c.createElement(we,k({},t,{render:e=>c.createElement("div",{className:"hamburger-react","aria-label":e.label,"aria-expanded":e.isToggled,onClick:t.disabled?void 0:e.handler,onKeyUp:t.disabled?void 0:r=>r.key==="Enter"&&e.handler(),role:"button",style:{...e.burgerStyles,transform:`${e.isToggled?`rotate(${90*(e.isLeft?-1:1)}deg)`:"none"}`},tabIndex:0},c.createElement("div",{style:{...e.barStyles,width:`${e.width}px`,top:`${e.topOffset}px`,transition:`${e.time}s ${e.easing}`,transform:`${e.isToggled?`rotate(${45*(e.isLeft?-1:1)}deg) translate(${e.move*(e.isLeft?-1:1)}px, ${e.move}px)`:"none"}`}}),c.createElement("div",{style:{...e.barStyles,width:`${e.width}px`,top:`${e.topOffset+e.barHeight+e.margin}px`,transition:`${e.time}s ${e.easing}`,transform:`${e.isToggled?"scaleX(0)":"none"}`}}),c.createElement("div",{style:{...e.barStyles,width:`${e.width}px`,top:`${e.topOffset+e.barHeight*2+e.margin*2}px`,transition:`${e.time}s ${e.easing}`,transform:`${e.isToggled?`rotate(${45*(e.isLeft?1:-1)}deg) translate(${e.move*(e.isLeft?-1:1)}px, ${e.move*-1}px)`:"none"}`}}))})),Oe=({toggleSidebar:t,isOpen:e,auth:r,header:a})=>{const[i,o]=d.useState(!1);return n.jsx("header",{className:"sticky top-0 z-50 flex items-center h-16 gap-4 px-4 bg-white border-b md:px-6",children:n.jsxs("nav",{className:"flex flex-row items-center w-full gap-5 text-sm font-medium lg:gap-6",children:[n.jsxs("div",{className:"flex items-center justify-start",children:[n.jsx(ke,{distance:"md",toggled:e,toggle:t,size:16,rounded:!0,color:"#020617"}),n.jsx("p",{className:"hidden font-semibold lg:block",children:"UBMI APPS"})]}),n.jsx("div",{className:"flex flex-1 w-full gap-6 underline",children:n.jsx(f,{href:route("mobile_apps.index"),className:"transition-colors text-muted-foreground hover:text-foreground",children:"Mantri Apps"})}),n.jsxs(ie,{children:[n.jsx(se,{asChild:!0,children:n.jsxs(x,{className:"flex items-center justify-center gap-3 text-sm",children:[r.user.username,n.jsx(de,{className:"w-4 h-4 animate-pulse"})]})}),n.jsxs(oe,{align:"end",children:[n.jsx(le,{children:r.user.employee.nama_karyawan}),n.jsx(E,{}),n.jsx(C,{children:n.jsx(f,{href:route("profile.edit"),children:"Profile"})}),n.jsx(E,{}),n.jsx(C,{children:n.jsx(f,{href:route("logout"),method:"post",as:"button",replace:"true",children:"Logout"})})]})]})]})})};function Le({header:t,children:e,loading:r=!1}){const[a,i]=d.useState(!1),o=()=>{i(!a)},{errors:u,flash:s,auth:l}=B().props;return n.jsxs("div",{className:"relative",children:[Object.keys(u).length>0&&n.jsx(L,{type:"error",message:u[0],keys:s}),s.message&&n.jsx(L,{type:"success",message:s.message,keys:s}),n.jsx(ce,{show:r}),n.jsx(Oe,{isOpen:a,toggleSidebar:o,auth:l,header:t}),n.jsx(ye,{isOpen:a}),n.jsx("div",{className:`px-4 py-6 transition-all ease-in-out  duration-300 h-auto bg-white min-h-[calc(100vh-4rem)]  ${a?"ml-64":"ml-0"}`,children:n.jsx("main",{children:e})})]})}export{Le as A};
