import{a,j as h,F as u}from"./app-8e61fab9.js";function b({name:i,value:d,className:l,required:n=!0,handleChange:c,options:r,nullValue:s,nullvalue:t,...o}){return a("select",{name:i,value:d,className:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 "+l,required:n,...o,children:r?h(u,{children:[s||t?a("option",{value:"",children:"Pilih Salah Satu"}):null,r.map(e=>a("option",{value:e.value,children:e.display},e.id))]}):a("option",{value:"",children:"Pilih Salah Satu"})})}export{b as S};
