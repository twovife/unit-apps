import{r as e,a as s}from"./app-b2e3bcc2.js";const l=e.forwardRef(function({type:t="text",className:a="",isFocused:n=!1,readOnly:f=!1,required:u=!0,...c},r){const o=r||e.useRef();return e.useEffect(()=>{n&&o.current.focus()},[]),s("div",{className:"flex flex-col items-start",children:s("input",{...c,type:t,readOnly:f,required:u,className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm read-only:bg-gray-100 read-only:cursor-not-allowed "+a,ref:o})})});export{l as T};