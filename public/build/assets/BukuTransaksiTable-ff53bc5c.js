import{r as o,j as a,F as j,a as e}from"./app-49513fe7.js";import{T as w,a as x,b as c,c as p,d as C,e as t,F as i,f as N}from"./FormatNumbering-aa0fb6f2.js";import T from"./Action-6557ab11.js";import{B as y}from"./BargeStatus-21c38151.js";import{B as S}from"./BadgeStatus-9f176e10.js";import"./utils-46f1eee5.js";import"./react-number-format.es-af5b4c77.js";import"./dialog-d18ad688.js";import"./index-d19021c0.js";import"./react-icons.esm-665c9a46.js";import"./index-d6d6f4c3.js";import"./button-02e9f315.js";import"./index-f96983da.js";import"./card-1edd8ef7.js";import"./tabs-78c20ec0.js";import"./index-77e42ac0.js";import"./Acc-92d093c5.js";import"./Loading-464ad84f.js";import"./transition-265a589d.js";import"./label-01aff0bc.js";import"./index-0b4e949c.js";import"./index.esm-1256866f.js";import"./DropJadi-88257615.js";import"./Gagal-a3f5d720.js";import"./DetailTableOnAction-a30681cb.js";import"./badge-bc671c0a.js";import"./RemoveLoan-b8a181e4.js";import"./ReStatus-0056ed6d.js";import"./SelectList-3ec2eb3f.js";import"./ChangeDetail-3b0a48ca.js";import"./input-f62b4336.js";const se=({datas:m})=>{const[d,f]=o.useState([]);o.useEffect(()=>{f(m)},[m]);const n=(r=>r.reduce((l,s)=>(l.request+=s.request||0,l.drop+=s.drop||0,l.drop_jadi+=s.drop_jadi||0,l.acc+=s.acc||0,l),{request:0,drop:0,acc:0,drop_jadi:0}))(d),[v,h]=o.useState(!1),[b,u]=o.useState(),g=r=>{h(!0),u(r)};return a(j,{children:[e(T,{show:v,onClosed:r=>{h(!1),u()},triggeredData:b}),a(w,{className:"w-full mb-3 text-xs table-auto",children:[e(x,{className:"sticky top-0 z-10 bg-gray-100",children:a(c,{children:[e(p,{}),e(p,{children:"Nasabah"}),e(p,{children:"Drop"})]})}),e(C,{children:d&&d.map(r=>a(c,{children:[e(t,{className:"w-0",children:e("div",{className:"flex items-center justify-center gap-2",children:e(y,{value:r.status,onClick:()=>g(r)})})}),e(t,{children:a("div",{children:[a("div",{className:"text-base font-semibold",children:[a("span",{children:[" ",r.nama]})," ",e(S,{value:r.drop_langsung})]}),e("div",{children:r.nik}),e("div",{children:r.alamat})]})}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(i,{value:r.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(i,{value:r.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(i,{value:r.drop_jadi})]})]})]},r.id))}),e(N,{children:a(c,{children:[e(t,{}),e(t,{children:"Total"}),a(t,{children:[a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Pengajuan"}),e(i,{value:n.request})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"ACC"}),e(i,{value:n.acc})]}),a("div",{className:"flex justify-between gap-6",children:[e("div",{children:"Drop Jadi"}),e(i,{value:n.drop_jadi})]})]})]})})]})]})};export{se as default};