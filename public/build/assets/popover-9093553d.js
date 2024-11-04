import{c as Re}from"./createLucideIcon-3b2a01a6.js";import{q as Ne,r as l,W as be,c as q,j as d,F as z,a as o,y as _e}from"./app-56003dbd.js";import{u as Ae,S as A}from"./SelectComponent-54228b91.js";import{B as U,u as V,S as Oe}from"./button-d6854775.js";import{I as J}from"./input-bdff776e.js";import{M as Se,e as ke,h as xe,R as Fe,u as Ee,F as De,D as Ie,P as Me}from"./react-icons.esm-8128ce5a.js";import{L as Te}from"./Loading-af3e5f59.js";import{L as C}from"./label-124f87ed.js";import{c as Le,a as O,P as Z,b as je,d as We}from"./index-b8f03138.js";import{c as Q,A as X,C as Ye,a as Be,R as Ge}from"./index-12058e3b.js";import{P as ee}from"./index-93b08933.js";import{c as $e}from"./utils-36e2ef84.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vo=Re("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]),go=({urlLink:e=route("home"),localState:n,searchDate:a=!1,labelDate:s="Date",searchMonth:t=!1,labelMonth:r="Bulan",searchPlanText:i=!1,planTextName:c="search",searchHari:p=!1,searchWilayah:f=!1,searchGroupingBranch:w=!1,searchKelompok:y=!1,children:m,nexOrPrevious:v=null,setNexOrPrevious:pe})=>{const{selectedSearchParam:M,optWilayah:T,selectedWilayah:L,setSelectedWilayah:fe,filteredBranch:he,optKelompok:me,dayOpt:ve}=Ae(),{server_filter:{hari:j,branch_id:W,month:Y,date:B,wilayah:G,kelompok:$}}=Ne().props,k=l.useRef(null),{data:R,setData:g,get:ge,processing:x}=be({}),[Pe,F]=l.useState(!1),N=u=>{const{name:h,value:_}=u.target;i?h==c?g(E=>{const H={[h]:_};for(const K in E)K!==h&&(H[K]="");return H}):g(E=>({...E,[h]:_,[c]:""})):isNaN(_)?g(h,_):g(h,parseInt(_))},Ce=u=>{const{value:h}=u.target;fe(h),g({branch_id:""})},we=u=>{u.preventDefault(),ge(e)},ye=u=>{u.preventDefault(),_e.visit(e,{onStart:h=>F(!0),onFinish:h=>F(!1)}),localStorage.setItem(n,JSON.stringify({oldFilter:[],oldPage:1}))};return l.useEffect(()=>{const u={};M?u[c]=M:(W&&(u.branch_id=parseInt(W)),B&&(u.date=B),Y&&(u.month=Y),G&&(u.wilayah=parseInt(G)),$&&(u.kelompok=parseInt($)),j&&(u.hari=j)),Object.keys(u).length>0&&g(u)},[]),l.useEffect(()=>{F(x)},[x]),l.useEffect(()=>(v&&(v=="next"?(g(u=>({...u,date:q(u.date).add(1,"week").format("YYYY-MM-DD")})),setTimeout(()=>{k.current.click()},500)):v=="previous"&&(g(u=>({...u,date:q(u.date).subtract(1,"week").format("YYYY-MM-DD")})),setTimeout(()=>{k.current.click()},500))),()=>{v&&pe(null)}),[v]),d(z,{children:[o(Te,{show:x||Pe}),d("form",{className:"flex flex-col items-end w-full gap-3 lg:w-auto lg:flex-row",onSubmit:we,children:[a&&d("div",{className:"w-full",children:[o(C,{children:s}),o(J,{className:"w-full",type:"date",name:"date",value:R.date,onChange:N,placeholder:"Name of your project"})]}),t&&d("div",{className:"w-full",children:[o(C,{children:r}),o(J,{className:"w-full",type:"month",name:"month",value:R.month,onChange:N,placeholder:"Name of your project"})]}),y&&d("div",{className:"w-full",children:[o(C,{children:"Kelompok"}),o(A,{className:"w-full",value:R.kelompok,options:me,name:"kelompok",onChange:N})]}),f&&d("div",{className:"w-full",children:[o(C,{children:"Wilayah"}),o(A,{className:"w-full",value:R.wilayah,options:T,name:"wilayah",onChange:N})]}),p&&d("div",{className:"w-full",children:[o(C,{children:"Hari"}),o(A,{className:"w-full",value:R.hari,options:ve,name:"hari",onChange:N})]}),w&&d(z,{children:[d("div",{className:"w-full",children:[o(C,{children:"Wilayah"}),o(A,{className:"w-full",required:"true",value:L,options:T,name:"wilayah",onChange:Ce})]}),L!==""&&d("div",{className:"w-full",children:[o(C,{children:"Unit"}),o(A,{required:"true",className:"w-full",value:R.branch_id,options:he,name:"branch_id",nullvalue:!0,onChange:N})]})]}),d("div",{className:"flex items-center justify-end col-span-2 gap-3",children:[d(U,{ref:k,variant:"outline",type:"submit",children:[o(Se,{className:"h-3.5 w-3.5"}),o("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Cari"})]}),d(U,{variant:"outline",type:"button",onClick:ye,children:[o(ke,{}),o("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Reset"})]}),m]})]})]})};var D="Popover",[oe,Po]=Le(D,[Q]),S=Q(),[He,P]=oe(D),te=e=>{const{__scopePopover:n,children:a,open:s,defaultOpen:t,onOpenChange:r,modal:i=!1}=e,c=S(n),p=l.useRef(null),[f,w]=l.useState(!1),[y=!1,m]=je({prop:s,defaultProp:t,onChange:r});return o(Ge,{...c,children:o(He,{scope:n,contentId:We(),triggerRef:p,open:y,onOpenChange:m,onOpenToggle:l.useCallback(()=>m(v=>!v),[m]),hasCustomAnchor:f,onCustomAnchorAdd:l.useCallback(()=>w(!0),[]),onCustomAnchorRemove:l.useCallback(()=>w(!1),[]),modal:i,children:a})})};te.displayName=D;var ae="PopoverAnchor",Ke=l.forwardRef((e,n)=>{const{__scopePopover:a,...s}=e,t=P(ae,a),r=S(a),{onCustomAnchorAdd:i,onCustomAnchorRemove:c}=t;return l.useEffect(()=>(i(),()=>c()),[i,c]),o(X,{...r,...s,ref:n})});Ke.displayName=ae;var re="PopoverTrigger",ne=l.forwardRef((e,n)=>{const{__scopePopover:a,...s}=e,t=P(re,a),r=S(a),i=V(n,t.triggerRef),c=o(ee.button,{type:"button","aria-haspopup":"dialog","aria-expanded":t.open,"aria-controls":t.contentId,"data-state":ue(t.open),...s,ref:i,onClick:O(e.onClick,t.onOpenToggle)});return t.hasCustomAnchor?c:o(X,{asChild:!0,...r,children:c})});ne.displayName=re;var I="PopoverPortal",[qe,ze]=oe(I,{forceMount:void 0}),se=e=>{const{__scopePopover:n,forceMount:a,children:s,container:t}=e,r=P(I,n);return o(qe,{scope:n,forceMount:a,children:o(Z,{present:a||r.open,children:o(Me,{asChild:!0,container:t,children:s})})})};se.displayName=I;var b="PopoverContent",le=l.forwardRef((e,n)=>{const a=ze(b,e.__scopePopover),{forceMount:s=a.forceMount,...t}=e,r=P(b,e.__scopePopover);return o(Z,{present:s||r.open,children:r.modal?o(Ue,{...t,ref:n}):o(Je,{...t,ref:n})})});le.displayName=b;var Ue=l.forwardRef((e,n)=>{const a=P(b,e.__scopePopover),s=l.useRef(null),t=V(n,s),r=l.useRef(!1);return l.useEffect(()=>{const i=s.current;if(i)return xe(i)},[]),o(Fe,{as:Oe,allowPinchZoom:!0,children:o(ie,{...e,ref:t,trapFocus:a.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:O(e.onCloseAutoFocus,i=>{var c;i.preventDefault(),r.current||(c=a.triggerRef.current)==null||c.focus()}),onPointerDownOutside:O(e.onPointerDownOutside,i=>{const c=i.detail.originalEvent,p=c.button===0&&c.ctrlKey===!0,f=c.button===2||p;r.current=f},{checkForDefaultPrevented:!1}),onFocusOutside:O(e.onFocusOutside,i=>i.preventDefault(),{checkForDefaultPrevented:!1})})})}),Je=l.forwardRef((e,n)=>{const a=P(b,e.__scopePopover),s=l.useRef(!1),t=l.useRef(!1);return o(ie,{...e,ref:n,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:r=>{var i,c;(i=e.onCloseAutoFocus)==null||i.call(e,r),r.defaultPrevented||(s.current||(c=a.triggerRef.current)==null||c.focus(),r.preventDefault()),s.current=!1,t.current=!1},onInteractOutside:r=>{var p,f;(p=e.onInteractOutside)==null||p.call(e,r),r.defaultPrevented||(s.current=!0,r.detail.originalEvent.type==="pointerdown"&&(t.current=!0));const i=r.target;((f=a.triggerRef.current)==null?void 0:f.contains(i))&&r.preventDefault(),r.detail.originalEvent.type==="focusin"&&t.current&&r.preventDefault()}})}),ie=l.forwardRef((e,n)=>{const{__scopePopover:a,trapFocus:s,onOpenAutoFocus:t,onCloseAutoFocus:r,disableOutsidePointerEvents:i,onEscapeKeyDown:c,onPointerDownOutside:p,onFocusOutside:f,onInteractOutside:w,...y}=e,m=P(b,a),v=S(a);return Ee(),o(De,{asChild:!0,loop:!0,trapped:s,onMountAutoFocus:t,onUnmountAutoFocus:r,children:o(Ie,{asChild:!0,disableOutsidePointerEvents:i,onInteractOutside:w,onEscapeKeyDown:c,onPointerDownOutside:p,onFocusOutside:f,onDismiss:()=>m.onOpenChange(!1),children:o(Ye,{"data-state":ue(m.open),role:"dialog",id:m.contentId,...v,...y,ref:n,style:{...y.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}})})})}),ce="PopoverClose",Ve=l.forwardRef((e,n)=>{const{__scopePopover:a,...s}=e,t=P(ce,a);return o(ee.button,{type:"button",...s,ref:n,onClick:O(e.onClick,()=>t.onOpenChange(!1))})});Ve.displayName=ce;var Ze="PopoverArrow",Qe=l.forwardRef((e,n)=>{const{__scopePopover:a,...s}=e,t=S(a);return o(Be,{...t,...s,ref:n})});Qe.displayName=Ze;function ue(e){return e?"open":"closed"}var Xe=te,eo=ne,oo=se,de=le;const Co=Xe,wo=eo,to=l.forwardRef(({className:e,align:n="center",sideOffset:a=4,...s},t)=>o(oo,{children:o(de,{ref:t,align:n,sideOffset:a,className:$e("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",e),...s})}));to.displayName=de.displayName;export{vo as F,Co as P,go as S,wo as a,to as b};