import{r as i,a as s,j as y,F as O}from"./app-894fb644.js";import{c as H,a as p,P as R,R as V,h as q,u as K,F as U,D as Y,b as Z,d as z,e as C,f as J}from"./react-icons.esm-bacaa70f.js";import{u as _,S as Q}from"./button-9da4f797.js";import{P as D}from"./index-1ee04d40.js";var h="Dialog",[I,fe]=H(h),[X,u]=I(h),x=e=>{const{__scopeDialog:o,children:r,open:a,defaultOpen:n,onOpenChange:t,modal:c=!0}=e,l=i.useRef(null),d=i.useRef(null),[g=!1,m]=z({prop:a,defaultProp:n,onChange:t});return s(X,{scope:o,triggerRef:l,contentRef:d,contentId:C(),titleId:C(),descriptionId:C(),open:g,onOpenChange:m,onOpenToggle:i.useCallback(()=>m(B=>!B),[m]),modal:c,children:r})};x.displayName=h;var A="DialogTrigger",ee=i.forwardRef((e,o)=>{const{__scopeDialog:r,...a}=e,n=u(A,r),t=_(o,n.triggerRef);return s(D.button,{type:"button","aria-haspopup":"dialog","aria-expanded":n.open,"aria-controls":n.contentId,"data-state":N(n.open),...a,ref:t,onClick:p(e.onClick,n.onOpenToggle)})});ee.displayName=A;var E="DialogPortal",[te,T]=I(E,{forceMount:void 0}),b=e=>{const{__scopeDialog:o,forceMount:r,children:a,container:n}=e,t=u(E,o);return s(te,{scope:o,forceMount:r,children:i.Children.map(a,c=>s(R,{present:r||t.open,children:s(J,{asChild:!0,container:n,children:c})}))})};b.displayName=E;var v="DialogOverlay",M=i.forwardRef((e,o)=>{const r=T(v,e.__scopeDialog),{forceMount:a=r.forceMount,...n}=e,t=u(v,e.__scopeDialog);return t.modal?s(R,{present:a||t.open,children:s(oe,{...n,ref:o})}):null});M.displayName=v;var oe=i.forwardRef((e,o)=>{const{__scopeDialog:r,...a}=e,n=u(v,r);return s(V,{as:Q,allowPinchZoom:!0,shards:[n.contentRef],children:s(D.div,{"data-state":N(n.open),...a,ref:o,style:{pointerEvents:"auto",...a.style}})})}),f="DialogContent",F=i.forwardRef((e,o)=>{const r=T(f,e.__scopeDialog),{forceMount:a=r.forceMount,...n}=e,t=u(f,e.__scopeDialog);return s(R,{present:a||t.open,children:t.modal?s(ne,{...n,ref:o}):s(re,{...n,ref:o})})});F.displayName=f;var ne=i.forwardRef((e,o)=>{const r=u(f,e.__scopeDialog),a=i.useRef(null),n=_(o,r.contentRef,a);return i.useEffect(()=>{const t=a.current;if(t)return q(t)},[]),s(w,{...e,ref:n,trapFocus:r.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:p(e.onCloseAutoFocus,t=>{var c;t.preventDefault(),(c=r.triggerRef.current)==null||c.focus()}),onPointerDownOutside:p(e.onPointerDownOutside,t=>{const c=t.detail.originalEvent,l=c.button===0&&c.ctrlKey===!0;(c.button===2||l)&&t.preventDefault()}),onFocusOutside:p(e.onFocusOutside,t=>t.preventDefault())})}),re=i.forwardRef((e,o)=>{const r=u(f,e.__scopeDialog),a=i.useRef(!1),n=i.useRef(!1);return s(w,{...e,ref:o,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{var c,l;(c=e.onCloseAutoFocus)==null||c.call(e,t),t.defaultPrevented||(a.current||(l=r.triggerRef.current)==null||l.focus(),t.preventDefault()),a.current=!1,n.current=!1},onInteractOutside:t=>{var d,g;(d=e.onInteractOutside)==null||d.call(e,t),t.defaultPrevented||(a.current=!0,t.detail.originalEvent.type==="pointerdown"&&(n.current=!0));const c=t.target;((g=r.triggerRef.current)==null?void 0:g.contains(c))&&t.preventDefault(),t.detail.originalEvent.type==="focusin"&&n.current&&t.preventDefault()}})}),w=i.forwardRef((e,o)=>{const{__scopeDialog:r,trapFocus:a,onOpenAutoFocus:n,onCloseAutoFocus:t,...c}=e,l=u(f,r),d=i.useRef(null),g=_(o,d);return K(),y(O,{children:[s(U,{asChild:!0,loop:!0,trapped:a,onMountAutoFocus:n,onUnmountAutoFocus:t,children:s(Y,{role:"dialog",id:l.contentId,"aria-describedby":l.descriptionId,"aria-labelledby":l.titleId,"data-state":N(l.open),...c,ref:g,onDismiss:()=>l.onOpenChange(!1)})}),y(O,{children:[s(ae,{titleId:l.titleId}),s(ie,{contentRef:d,descriptionId:l.descriptionId})]})]})}),P="DialogTitle",S=i.forwardRef((e,o)=>{const{__scopeDialog:r,...a}=e,n=u(P,r);return s(D.h2,{id:n.titleId,...a,ref:o})});S.displayName=P;var W="DialogDescription",k=i.forwardRef((e,o)=>{const{__scopeDialog:r,...a}=e,n=u(W,r);return s(D.p,{id:n.descriptionId,...a,ref:o})});k.displayName=W;var G="DialogClose",L=i.forwardRef((e,o)=>{const{__scopeDialog:r,...a}=e,n=u(G,r);return s(D.button,{type:"button",...a,ref:o,onClick:p(e.onClick,()=>n.onOpenChange(!1))})});L.displayName=G;function N(e){return e?"open":"closed"}var $="DialogTitleWarning",[ge,j]=Z($,{contentName:f,titleName:P,docsSlug:"dialog"}),ae=({titleId:e})=>{const o=j($),r=`\`${o.contentName}\` requires a \`${o.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${o.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${o.docsSlug}`;return i.useEffect(()=>{e&&(document.getElementById(e)||console.error(r))},[r,e]),null},se="DialogDescriptionWarning",ie=({contentRef:e,descriptionId:o})=>{const a=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${j(se).contentName}}.`;return i.useEffect(()=>{var t;const n=(t=e.current)==null?void 0:t.getAttribute("aria-describedby");o&&n&&(document.getElementById(o)||console.warn(a))},[a,e,o]),null},pe=x,De=b,ve=M,me=F,Ce=S,Re=k,_e=L;export{me as C,Re as D,ve as O,De as P,pe as R,Ce as T,_e as a};
