import{q as d,W as p,j as t,a}from"./app-35d31ed9.js";import{I as o}from"./InputError-43992ab8.js";import{I as l}from"./InputLabel-c3c1a497.js";import{T as u}from"./TextInput-1dda684e.js";function I({mustVerifyEmail:f,status:h,className:i}){const r=d().props.auth.user,{data:m,setData:n,patch:c,errors:s,processing:b,recentlySuccessful:y}=p({name:r.employee.nama_karyawan,jabatan:`${r.employee.jabatan} ${r.employee.area>0?r.employee.area:""}`});return t("section",{className:i,children:[t("header",{children:[a("h2",{className:"text-lg font-medium text-gray-900",children:"Profile Information"}),a("p",{className:"mt-1 text-sm text-gray-600",children:"Update your account's profile information and email address."})]}),t("form",{onSubmit:e=>{e.preventDefault(),c(route("profile.update"))},className:"mt-6 space-y-6",children:[t("div",{children:[a(l,{htmlFor:"name",value:"Name"}),a(u,{id:"name",className:"block w-full mt-1",readOnly:!0,value:m.name,onChange:e=>n("name",e.target.value),required:!0,isFocused:!0,autoComplete:"name"}),a(o,{className:"mt-2",message:s.name})]}),t("div",{children:[a(l,{htmlFor:"jabatan",value:"Jabatan"}),a(u,{id:"jabatan",readOnly:!0,className:"block w-full mt-1",value:m.jabatan,onChange:e=>n("jabatan",e.target.value),required:!0,autoComplete:"username"}),a(o,{className:"mt-2",message:s.jabatan})]})]})]})}export{I as default};