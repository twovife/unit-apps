import{X as R,r as l,j as u}from"./app-ns96WniE.js";function f({propsWilayah:c="",...h}={}){var S;const{server_filter:a}=R().props,[y,r]=l.useState((a==null?void 0:a.search)??null),[t,o]=l.useState((a==null?void 0:a.wilayah)??"");l.useEffect(()=>{c!==""&&o(c)},[c]);const[i,n]=l.useState((a==null?void 0:a.branch_id)??""),[m,b]=l.useState((a==null?void 0:a.month)??""),[g,v]=l.useState((a==null?void 0:a.date)??""),[x,w]=l.useState((a==null?void 0:a.employee_id)??""),[W,j]=l.useState((a==null?void 0:a.kelompok)??""),[k,E]=l.useState((a==null?void 0:a.hari)??""),B=[{id:0,display:"Pusat",value:0},{id:1,display:"Wilayah 1",value:1},{id:2,display:"Wilayah 2",value:2},{id:3,display:"Wilayah 3",value:3},{id:4,display:"Wilayah 4",value:4},{id:5,display:"Wilayah 5",value:5},{id:6,display:"Wilayah 6",value:6},{id:7,display:"Wilayah 7",value:7},{id:8,display:"Wilayah 8",value:8},{id:9,display:"Wilayah 9",value:9},{id:10,display:"Wilayah 10",value:10}],F=[{id:0,display:"senin",value:"senin"},{id:1,display:"selasa",value:"selasa"},{id:2,display:"rabu",value:"rabu"},{id:3,display:"kamis",value:"kamis"},{id:4,display:"jumat",value:"jumat"},{id:5,display:"sabtu",value:"sabtu"}],P=[{id:1,display:1,value:1},{id:2,display:2,value:2},{id:3,display:3,value:3},{id:4,display:4,value:4},{id:5,display:5,value:5},{id:6,display:6,value:6},{id:7,display:7,value:7},{id:8,display:8,value:8},{id:9,display:9,value:9},{id:10,display:10,value:10}],H=(S=a==null?void 0:a.branch)==null?void 0:S.map(d=>({id:d.id,display:d.unit,value:d.id})),[C,K]=l.useState(),[D,M]=l.useState(),N=d=>{const{value:s}=d.target;o(s)},O=d=>{const{value:s}=d.target;n(s)};return l.useEffect(()=>{var s,p;const d=t!==""?(p=(s=a==null?void 0:a.branch)==null?void 0:s.filter(e=>e.wilayah==parseInt(t)))==null?void 0:p.map(e=>({id:e.id,display:e.unit,value:e.id,wilayah:e.wilayah})):"";K(d)},[t]),l.useEffect(()=>{var s,p;const d=i!==""?(p=(s=a==null?void 0:a.employees)==null?void 0:s.filter(e=>e.branch_id==i))==null?void 0:p.map(e=>({id:e.id,display:`${e.nama_karyawan} ${e.date_resign?" - Resign":""} `,value:e.id,className:e.date_resign?"bg-red-200":""})):"";M(d)},[i]),{selectedSearchParam:y,selectedWilayah:t,setSelectedWilayah:o,selectedBranch_id:i,setSelectedBranch_id:n,selectedEmployee:x,setSelectedEmployee:w,selectedMonth:m,setSelectedMonth:b,selectedDate:g,setSelectedDate:v,optBranch:H,optWilayah:B,filteredBranch:C,filteredEmps:D,selectedKelompok:W,setSelectedKelompok:j,onWilayahChangeHandler:N,onBranchChangeHandler:O,optKelompok:P,dayOpt:F,selectedHari:k,setSelectedHari:E}}function G({name:c,value:h,className:a,required:y=!0,handleChange:r,options:t,nullvalue:o,...i}){return u.jsx("select",{name:c,value:h,className:"flex h-9 w-full min-w-20 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"+a,required:y,...i,children:t?u.jsxs(u.Fragment,{children:[o?u.jsx("option",{children:"Pilih Salah Satu"}):null,t.map(n=>u.jsx("option",{value:n.value,children:n.display},n.id))]}):u.jsx("option",{children:"Pilih Salah Satu"})})}export{G as S,f as u};
