import{q as P,r as c,W as ee,d as x,j as l,F as ae,a,y as le}from"./app-31b36b2d.js";import{u as te,S as f}from"./SelectComponent-cbd63afc.js";import{B as M}from"./button-339395a9.js";import{I as W}from"./input-8739ee9b.js";import{M as se,R as ne}from"./react-icons.esm-b4d85436.js";import{L as oe}from"./Loading-d8ca4ddf.js";import{L as m}from"./label-a31a3876.js";const ue=({urlLink:g=route("home"),localState:_,searchDate:B=!1,labelDate:F="Date",searchMonth:L=!1,labelMonth:R="Bulan",searchPlanText:E=!1,planTextName:h="search",searchHari:q=!1,searchWilayah:G=!1,searchGroupingBranch:K=!1,searchKelompok:H=!1,children:J,nexOrPrevious:i=null,setNexOrPrevious:z})=>{const{selectedSearchParam:w,optWilayah:v,selectedWilayah:N,setSelectedWilayah:A,filteredBranch:O,optKelompok:Q,dayOpt:T}=te(),{server_filter:{hari:k,branch_id:b,month:S,date:C,wilayah:j,kelompok:I}}=P().props,d=c.useRef(null),{data:n,setData:s,get:U,processing:u}=ee({}),[V,p]=c.useState(!1);console.log(n);const o=e=>{const{name:t,value:r}=e.target;E?t==h?s(y=>{const D={[t]:r};for(const Y in y)Y!==t&&(D[Y]="");return D}):s(y=>({...y,[t]:r,[h]:""})):isNaN(r)?s(t,r):s(t,parseInt(r))},X=e=>{const{value:t}=e.target;A(t),s({branch_id:""})},Z=e=>{e.preventDefault(),U(g)},$=e=>{e.preventDefault(),le.visit(g,{onStart:t=>p(!0),onFinish:t=>p(!1)}),localStorage.setItem(_,JSON.stringify({oldFilter:[],oldPage:1}))};return c.useEffect(()=>{const e={};w?e[h]=w:(b&&(e.branch_id=parseInt(b)),C&&(e.date=C),S&&(e.month=S),j&&(e.wilayah=parseInt(j)),I&&(e.kelompok=parseInt(I)),k&&(e.hari=k)),Object.keys(e).length>0&&s(e)},[]),c.useEffect(()=>{p(u)},[u]),c.useEffect(()=>(i&&(i=="next"?(s(e=>({...e,date:x(e.date).add(1,"week").format("YYYY-MM-DD")})),setTimeout(()=>{d.current.click()},500)):i=="previous"&&(s(e=>({...e,date:x(e.date).subtract(1,"week").format("YYYY-MM-DD")})),setTimeout(()=>{d.current.click()},500))),()=>{i&&z(null)}),[i]),l(ae,{children:[a(oe,{show:u||V}),l("form",{className:"flex flex-col items-end w-full gap-3 lg:w-auto lg:flex-row",onSubmit:Z,children:[B&&l("div",{className:"w-full",children:[a(m,{children:F}),a(W,{className:"w-full",type:"date",name:"date",value:n.date,onChange:o,placeholder:"Name of your project"})]}),L&&l("div",{className:"w-full",children:[a(m,{children:R}),a(W,{className:"w-full",type:"month",name:"month",value:n.month,onChange:o,placeholder:"Name of your project"})]}),H&&l("div",{className:"w-full",children:[a(m,{children:"Kelompok"}),a(f,{className:"w-full",value:n.kelompok,options:Q,name:"kelompok",onChange:o})]}),G&&l("div",{className:"w-full",children:[a(m,{children:"Wilayah"}),a(f,{className:"w-full",value:n.wilayah,options:v,name:"wilayah",onChange:o})]}),q&&l("div",{className:"w-full",children:[a(m,{children:"Hari"}),a(f,{className:"w-full",value:n.hari,options:T,name:"hari",onChange:o})]}),K&&l("div",{className:"flex items-center justify-center w-full gap-3",children:[a("div",{className:"flex-1",children:a(f,{valuetype:"number",value:N,options:v,name:"wilayah",required:"true",onChange:X})}),N!==""&&a("div",{className:"flex-1",children:a(f,{value:n.branch_id,options:O,name:"branch_id",required:"true",onChange:o})})]}),l("div",{className:"flex items-center justify-end col-span-2 gap-3",children:[l(M,{ref:d,variant:"outline",type:"submit",children:[a(se,{className:"h-3.5 w-3.5"}),a("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Cari"})]}),l(M,{variant:"outline",type:"button",onClick:$,children:[a(ne,{}),a("span",{className:"sr-only sm:not-sr-only sm:whitespace-nowrap",children:"Reset"})]}),J]})]})]})};export{ue as S};