import{r as c,q as d,j as h,a as e}from"./app-dd703d36.js";import{N as g,S as u}from"./Navbar-7f6cdba0.js";import{S as t}from"./SweetAlert-f0351698.js";import{L as f}from"./Loading-28c0fbaf.js";function x({header:i,children:o,loading:n=!1}){const[s,m]=c.useState(!1),l=()=>{m(!s)},{errors:r,flash:a,auth:p}=d().props;return h("div",{className:"relative",children:[Object.keys(r).length>0&&e(t,{type:"error",message:r[0],keys:a}),a.message&&e(t,{type:"success",message:a.message,keys:a}),e(f,{show:n}),e(g,{isOpen:s,toggleSidebar:l,auth:p,header:i}),e(u,{isOpen:s}),e("div",{className:`px-4 py-6 transition-all ease-in-out  duration-300 h-auto bg-white min-h-[calc(100vh-4rem)]  ${s?"ml-64":"ml-0"}`,children:e("main",{children:o})})]})}export{x as A};