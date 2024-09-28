import{r as i,a as e,F as f,j as r,d as S,e as C}from"./app-c852447f.js";import{D as A,a as D,b as R,c as E,d as F}from"./dialog-37297b03.js";import{C as m,a as h,b as d,d as u,c as H}from"./card-f9a33d03.js";import{T as K,a as q,b as x,c as j}from"./tabs-fa800c98.js";import B from"./RiwayatPengajuan-83c2cdcc.js";import{T as J,a as M,b as v,c as s,d as L,e as l,F as G}from"./FormatNumbering-697f2e7e.js";import I from"./Acc-1f280c1c.js";import O from"./Tolak-801b5a8f.js";import U from"./DropJadi-00685a47.js";import V from"./Gagal-0037e361.js";import{B as z}from"./BargeStatus-c5a730b0.js";import"./index-e9664f0b.js";import"./react-icons.esm-26840eb3.js";import"./index-71acb7a6.js";import"./button-f1d79983.js";import"./index-f96983da.js";import"./utils-36e2ef84.js";import"./index-4a6df377.js";import"./index-c09943f8.js";import"./DetailRiwayat-1c1db47a.js";import"./play-ed54e29a.js";import"./createLucideIcon-88b2e6a4.js";import"./react-number-format.es-0ad3a443.js";import"./Loading-3cde90b0.js";import"./transition-bebf8616.js";import"./label-d7b82de4.js";import"./index-14a993ee.js";import"./index.esm-0dcdc36d.js";const we=({show:n=!1,onClosed:t,triggeredData:c})=>{console.log(c);const[a,k]=i.useState([]),[T,b]=i.useState([]),[W,w]=i.useState(),[y,p]=i.useState(!1),[_,N]=i.useState(!1);i.useEffect(()=>{k(c),w(c==null?void 0:c.request)},[c]);const P=async g=>{p(!0),N(),await C({method:"post",url:route("transaction.nasabah_buku_transaksi"),data:{nik:c.nik}}).then(function({data:o}){p(!1),o.falidate_nik?b(o.data):b([])}).catch(function({response:o}){N(o.data.message),p(!1)})};return i.useEffect(()=>{c!=null&&c.nik&&P()},[c]),e(f,{children:e(A,{open:n,onOpenChange:g=>g?"":t(),children:r(D,{className:"h-[90vh] lg:h-auto overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[_&&e("div",{children:"terjadi kesalahan saat memuat data"}),y?e("div",{children:"Data Sedang Dimuat"}):r(R,{children:[e(E,{children:"Check Transaksi Mantri"}),e(F,{children:r(K,{defaultValue:"account",className:"w-full",children:[r(q,{className:"grid w-full grid-cols-2",children:[e(x,{value:"account",children:"Action"}),e(x,{value:"password",children:"Riwayat Pinjaman"})]}),r(j,{value:"account",children:[r(m,{children:[e(h,{children:e(d,{children:"Detail Pengajuan"})}),e(u,{className:"space-y-2",children:e("div",{className:"overflow-auto border rounded-lg scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:Q(a)})})]}),r("div",{className:"flex flex-col gap-3 mt-3 lg:flex-row",children:[r(m,{className:"w-full",children:[e(h,{children:e(d,{children:"Acc / Cek Kodham"})}),e(u,{className:"space-y-2",children:e("div",{className:"flex items-end justify-center gap-2 mx-auto lg:w-1/2",children:(a==null?void 0:a.status)==="open"?r(f,{children:[e(I,{id:a==null?void 0:a.nomor_pengajuan,acc:(a==null?void 0:a.acc)??(a==null?void 0:a.request),onClosed:t}),e(O,{id:a==null?void 0:a.nomor_pengajuan,onClosed:t})]}):r("div",{children:["Status Pengajuan = ",a==null?void 0:a.status,", Tanggal"," ",a==null?void 0:a.check_date]})})})]}),(a==null?void 0:a.status)!=="open"&&r(m,{className:"w-full",children:[e(h,{children:e(d,{children:"Drop Jadi"})}),e(u,{className:"space-y-2",children:e("div",{className:"flex items-end justify-center gap-2 mx-auto lg:w-1/2",children:(a==null?void 0:a.status)==="acc"?r(f,{children:[e(U,{id:a==null?void 0:a.nomor_pengajuan,drop_jadi:a==null?void 0:a.acc,onClosed:t}),e(V,{id:a==null?void 0:a.nomor_pengajuan,onClosed:t})]}):r("div",{children:["Status Pengajuan = ",a==null?void 0:a.status,", Tanggal"," ",a==null?void 0:a.check_date]})})})]})]})]}),e(j,{value:"password",children:r(m,{children:[r(h,{children:[e(d,{children:"Riwayat Pengajuan"}),e(H,{children:"Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang tertera dari semua cabang"})]}),e(u,{className:"space-y-2",children:e("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(B,{data:T})})})]})})]})})]})]})})})};function Q(n){return r(J,{children:[e(M,{children:r(v,{children:[e(s,{className:"text-center",children:"Nomor Pengajuan"}),e(s,{className:"text-center",children:"Tanggal Pengajuan"}),e(s,{className:"text-center",children:"Status"}),e(s,{className:"text-center",children:"Nama Nasabah"}),e(s,{className:"text-center",children:"Unit"}),e(s,{className:"text-center",children:"Pengajuan"}),e(s,{className:"text-center",children:"Tgl Drop"}),e(s,{className:"text-center",children:"Pinj Ke"}),e(s,{className:"text-center",children:"Acc"}),e(s,{className:"text-center",children:"Drop Jadi"})]})}),n&&e(L,{children:r(v,{className:"text-center",children:[e(l,{children:n.nomor_pengajuan}),e(l,{className:"text-start",children:n.tanggal_pengajuan}),e(l,{children:e(z,{value:n.status})}),r(l,{className:"text-start",children:[e("div",{children:n.nama}),e("div",{children:n.nik}),e("div",{children:n.alamat})]}),r(l,{className:"text-start",children:[e("div",{className:"whitespace-nowrap",children:n.unit}),r("div",{children:["Kel ",n.kelompok]})]}),e(l,{children:e(G,{value:n.request})}),e(l,{children:S(n.tanggal_drop).format("DD/MM")}),e(l,{children:n.pinjaman_ke}),e(l,{children:n.acc}),e(l,{children:n.drop_jadi})]})})]})}export{we as default};