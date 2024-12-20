import{r as s,a as m,F as j}from"./app-ea40b5cc.js";import{c as E}from"./utils-450acc22.js";function y(e,n){if(typeof e=="function")return e(n);e!=null&&(e.current=n)}function w(...e){return n=>{let t=!1;const r=e.map(o=>{const i=y(o,n);return!t&&typeof i=="function"&&(t=!0),i});if(t)return()=>{for(let o=0;o<r.length;o++){const i=r[o];typeof i=="function"?i():y(e[o],null)}}}}function H(...e){return s.useCallback(w(...e),e)}var C=s.forwardRef((e,n)=>{const{children:t,...r}=e,o=s.Children.toArray(t),i=o.find(O);if(i){const a=i.props.children,u=o.map(v=>v===i?s.Children.count(a)>1?s.Children.only(null):s.isValidElement(a)?a.props.children:null:v);return m(h,{...r,ref:n,children:s.isValidElement(a)?s.cloneElement(a,void 0,u):null})}return m(h,{...r,ref:n,children:t})});C.displayName="Slot";var h=s.forwardRef((e,n)=>{const{children:t,...r}=e;if(s.isValidElement(t)){const o=A(t);return s.cloneElement(t,{...S(r,t.props),ref:n?w(n,o):o})}return s.Children.count(t)>1?s.Children.only(null):null});h.displayName="SlotClone";var k=({children:e})=>m(j,{children:e});function O(e){return s.isValidElement(e)&&e.type===k}function S(e,n){const t={...n};for(const r in n){const o=e[r],i=n[r];/^on[A-Z]/.test(r)?o&&i?t[r]=(...u)=>{i(...u),o(...u)}:o&&(t[r]=o):r==="style"?t[r]={...o,...i}:r==="className"&&(t[r]=[o,i].filter(Boolean).join(" "))}return{...e,...t}}function A(e){var r,o;let n=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,t=n&&"isReactWarning"in n&&n.isReactWarning;return t?e.ref:(n=(o=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:o.get,t=n&&"isReactWarning"in n&&n.isReactWarning,t?e.props.ref:e.props.ref||e.ref)}function V(e){var n,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e))for(n=0;n<e.length;n++)e[n]&&(t=V(e[n]))&&(r&&(r+=" "),r+=t);else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function P(){for(var e,n,t=0,r="";t<arguments.length;)(e=arguments[t++])&&(n=V(e))&&(r&&(r+=" "),r+=n);return r}const p=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,x=P,W=(e,n)=>t=>{var r;if((n==null?void 0:n.variants)==null)return x(e,t==null?void 0:t.class,t==null?void 0:t.className);const{variants:o,defaultVariants:i}=n,a=Object.keys(o).map(l=>{const d=t==null?void 0:t[l],f=i==null?void 0:i[l];if(d===null)return null;const c=p(d)||p(f);return o[l][c]}),u=t&&Object.entries(t).reduce((l,d)=>{let[f,c]=d;return c===void 0||(l[f]=c),l},{}),v=n==null||(r=n.compoundVariants)===null||r===void 0?void 0:r.reduce((l,d)=>{let{class:f,className:c,...N}=d;return Object.entries(N).every(R=>{let[b,g]=R;return Array.isArray(g)?g.includes({...i,...u}[b]):{...i,...u}[b]===g})?[...l,f,c]:l},[]);return x(e,a,v,t==null?void 0:t.class,t==null?void 0:t.className)},B=W("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",green:"bg-green-500 text-white shadow hover:bg-green-500/90",yellow:"bg-yellow-500 text-white shadow hover:bg-yellow-500/90",blue:"bg-blue-500 text-white shadow hover:bg-blue-500/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",destructiveoutline:"border border-destructive bg-background text-destructive shadow-sm hover:bg-destructive/90 hover:text-destructive-foreground",destructiveoutline2:"border border-destructive bg-background text-destructive shadow-sm",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",xs:"h-6 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9",iconsm:"h-7 w-7",iconlg:"h-10 w-10",iconxl:"h-12 w-12",icon2xl:"h-16 w-16"}},defaultVariants:{variant:"default",size:"default"}}),z=s.forwardRef(({className:e,variant:n,size:t,asChild:r=!1,...o},i)=>m(r?C:"button",{className:E(B({variant:n,size:t,className:e})),ref:i,...o}));z.displayName="Button";export{z as B,C as S,w as a,W as c,H as u};