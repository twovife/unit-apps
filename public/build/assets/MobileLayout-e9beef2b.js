import{q as n,j as a,a as e}from"./app-8e61fab9.js";import{S as r,L as o}from"./Loading-21dc693c.js";import{e as d}from"./index-c570cf25.js";const h=({auth:i,header:l,children:c,loading:m=!1})=>{const{errors:t,flash:s}=n().props;return a("div",{className:"antialiased relative z-10",children:[Object.keys(t).length>0&&e(r,{type:"error",message:t[0]}),(s==null?void 0:s.message)&&e(r,{type:"success",message:s==null?void 0:s.message}),e(o,{show:m}),e("img",{src:"/18529.jpg",className:"absolute z-0 h-screen max-w-xl top-0 left-1/2 -translate-x-1/2 opacity-70"}),a("div",{className:" relative max-w-xl mx-auto h-screen",children:[e("div",{className:"sticky top-0 z-10 bg-red-500 text-white",children:a("div",{className:"w-full flex items-center justify-between py-2 px-4",children:[a("div",{className:"flex justify-start items-center gap-1",children:[e("span",{children:e(d,{})}),e("span",{children:l})]}),e("div",{children:i.user.username})]})}),e("div",{className:"p-4",children:c})]})]})};export{h as M};
