import{r as s,a as m,F as E}from"./app-c2fdeeef.js";import{c as R}from"./utils-36e2ef84.js";function j(e,t){typeof e=="function"?e(t):e!=null&&(e.current=t)}function x(...e){return t=>e.forEach(n=>j(n,t))}function H(...e){return s.useCallback(x(...e),e)}var w=s.forwardRef((e,t)=>{const{children:n,...r}=e,o=s.Children.toArray(n),i=o.find(S);if(i){const a=i.props.children,u=o.map(v=>v===i?s.Children.count(a)>1?s.Children.only(null):s.isValidElement(a)?a.props.children:null:v);return m(g,{...r,ref:t,children:s.isValidElement(a)?s.cloneElement(a,void 0,u):null})}return m(g,{...r,ref:t,children:n})});w.displayName="Slot";var g=s.forwardRef((e,t)=>{const{children:n,...r}=e;if(s.isValidElement(n)){const o=P(n);return s.cloneElement(n,{...A(r,n.props),ref:t?x(t,o):o})}return s.Children.count(n)>1?s.Children.only(null):null});g.displayName="SlotClone";var O=({children:e})=>m(E,{children:e});function S(e){return s.isValidElement(e)&&e.type===O}function A(e,t){const n={...t};for(const r in t){const o=e[r],i=t[r];/^on[A-Z]/.test(r)?o&&i?n[r]=(...u)=>{i(...u),o(...u)}:o&&(n[r]=o):r==="style"?n[r]={...o,...i}:r==="className"&&(n[r]=[o,i].filter(Boolean).join(" "))}return{...e,...n}}function P(e){var r,o;let t=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(o=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}function C(e){var t,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=C(e[t]))&&(r&&(r+=" "),r+=n);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function k(){for(var e,t,n=0,r="";n<arguments.length;)(e=arguments[n++])&&(t=C(e))&&(r&&(r+=" "),r+=t);return r}const b=e=>typeof e=="boolean"?"".concat(e):e===0?"0":e,p=k,W=(e,t)=>n=>{var r;if((t==null?void 0:t.variants)==null)return p(e,n==null?void 0:n.class,n==null?void 0:n.className);const{variants:o,defaultVariants:i}=t,a=Object.keys(o).map(l=>{const c=n==null?void 0:n[l],f=i==null?void 0:i[l];if(c===null)return null;const d=b(c)||b(f);return o[l][d]}),u=n&&Object.entries(n).reduce((l,c)=>{let[f,d]=c;return d===void 0||(l[f]=d),l},{}),v=t==null||(r=t.compoundVariants)===null||r===void 0?void 0:r.reduce((l,c)=>{let{class:f,className:d,...V}=c;return Object.entries(V).every(N=>{let[y,h]=N;return Array.isArray(h)?h.includes({...i,...u}[y]):{...i,...u}[y]===h})?[...l,f,d]:l},[]);return p(e,a,v,n==null?void 0:n.class,n==null?void 0:n.className)},B=W("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",green:"bg-green-500 text-white shadow hover:bg-green-500/90",yellow:"bg-yellow-500 text-white shadow hover:bg-yellow-500/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",xs:"h-6 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9",iconsm:"h-7 w-7",iconlg:"h-10 w-10",iconxl:"h-12 w-12",icon2xl:"h-16 w-16"}},defaultVariants:{variant:"default",size:"default"}}),z=s.forwardRef(({className:e,variant:t,size:n,asChild:r=!1,...o},i)=>m(r?w:"button",{className:R(B({variant:t,size:n,className:e})),ref:i,...o}));z.displayName="Button";export{z as B,w as S,x as a,W as c,H as u};
