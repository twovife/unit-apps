import{G as l,r as p,j as s,S as c}from"./app-ns96WniE.js";import{G as u}from"./GuestLayout-B_X9epj-.js";import{I as f}from"./InputError-m8Jdx8a7.js";import{I as x}from"./InputLabel-BcvxcLpZ.js";import{P as w}from"./PrimaryButton-3zP8mq03.js";import{T as j}from"./TextInput-CJIrzYxX.js";function y(){const{data:e,setData:a,post:t,processing:o,errors:m,reset:i}=l({password:""});p.useEffect(()=>()=>{i("password")},[]);const n=r=>{a(r.target.name,r.target.value)},d=r=>{r.preventDefault(),t(route("password.confirm"))};return s.jsxs(u,{children:[s.jsx(c,{title:"Confirm Password"}),s.jsx("div",{className:"mb-4 text-sm text-gray-600",children:"This is a secure area of the application. Please confirm your password before continuing."}),s.jsxs("form",{onSubmit:d,children:[s.jsxs("div",{className:"mt-4",children:[s.jsx(x,{htmlFor:"password",value:"Password"}),s.jsx(j,{id:"password",type:"password",name:"password",value:e.password,className:"mt-1 block w-full",isFocused:!0,onChange:n}),s.jsx(f,{message:m.password,className:"mt-2"})]}),s.jsx("div",{className:"flex items-center justify-end mt-4",children:s.jsx(w,{className:"ml-4",disabled:o,children:"Confirm"})})]})]})}export{y as default};
