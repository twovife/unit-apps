import{G as u,r as c,j as e,S as x}from"./app-ns96WniE.js";import{G as g}from"./GuestLayout-B_X9epj-.js";import{I as j}from"./InputError-m8Jdx8a7.js";import{I as o}from"./input-CSn3wVhG.js";import{L as m}from"./label-dPIdyTXP.js";import{C as h,a as f,b as w,c as C,d as L}from"./card-BENIATWH.js";import{B as b}from"./button-BdBexs_k.js";import{L as v}from"./Loading-CQcppPTv.js";import"./utils-CytzSlOG.js";import"./index-BrmqkDWz.js";import"./index-BYjqc5GM.js";import"./index-D7YONi1a.js";import"./index-Gs9KmwE-.js";import"./transition-DQ1_kMjs.js";function k({status:s,canResetPassword:N}){const{data:a,setData:t,post:n,processing:i,errors:d,reset:l}=u({username:"",password:"",remember:""});c.useEffect(()=>()=>{l("password")},[]);const p=r=>{r.preventDefault(),n(route("login"),{replace:!0})};return e.jsxs(g,{children:[e.jsx(x,{title:"Log in"}),e.jsx(v,{show:i}),e.jsxs(h,{className:"max-w-sm",children:[e.jsxs(f,{children:[e.jsx(w,{className:"text-2xl",children:"Login"}),e.jsx(C,{children:s||"Enter your username below to login to your account"})]}),e.jsx(L,{children:e.jsxs("form",{className:"grid gap-4",onSubmit:p,children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(m,{htmlFor:"username",children:"Username"}),e.jsx(o,{name:"username",type:"text",placeholder:"username",required:!0,autoComplete:"username",isFocused:!0,value:a.username,onChange:r=>t("username",r.target.value)}),e.jsx(j,{message:d.username,className:"mt-2"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(m,{htmlFor:"password",children:"Password"}),e.jsx(o,{name:"password",type:"password",required:!0,value:a.password,onChange:r=>t("password",r.target.value)})]}),e.jsx(b,{type:"submit",className:"w-full",children:"Login"})]})})]})]})}export{k as default};
