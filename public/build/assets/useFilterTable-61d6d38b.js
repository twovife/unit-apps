import{q as I,r as s}from"./app-7b02764b.js";function b(g,c,p=null){const y=p??I().props.datas,[a,h]=s.useState([{column:"",operators:"1",values:"",...g}]),[n,w]=s.useState({column:"",orderby:""}),[u,l]=s.useState(1);s.useEffect(()=>{l(1)},[a,n]);const S=(r,t)=>{const e=r[t.column],o=t.values;return o==null||o===""?!0:parseInt(t.operators)===1?L(e,o):parseInt(t.operators)===2?C(e,o):!0},L=(r,t)=>{const e=r==null?void 0:r.toString().toLowerCase(),o=t==null?void 0:t.toString().toLowerCase();return!(typeof e=="string"&&!e.includes(o))},C=(r,t)=>{const e=r==null?void 0:r.toString().toLowerCase(),o=t==null?void 0:t.toString().toLowerCase();return e===o},f=y.filter(r=>{for(const t of a)if(!S(r,t))return!1;return!0}).slice().sort((r,t)=>{const e=n.column,o=n.orderby;if(n.column!==""){if(o==="asc")return r[e]<t[e]?-1:r[e]>t[e]?1:0;if(o==="desc")return r[e]>t[e]?-1:r[e]<t[e]?1:0}return 0}),D=Math.ceil(f.length/c),d=f.slice((u-1)*c,u*c);let i={};return d.forEach(r=>{for(let t in r)t!=="wilayah"&&t!=="bulan"&&(i[t]=(parseInt(i[t])||0)+parseInt(r[t]))}),{filters:a,setFilters:h,orderData:n,setOrderData:w,currentPage:u,setCurrentPage:l,displayData:d,totalPages:D,handlePageChange:r=>{l(r)},totals:i}}export{b as u};