import{r as i,a as e,F as f,j as r,d as C,e as S}from"./app-a0d29dc0.js";import{D as A,a as D,b as K,c as R,d as E}from"./dialog-1be5e82a.js";import{C as m,a as h,b as u,d,c as F}from"./card-a29f0399.js";import{T as H,a as q,b as x,c as j}from"./tabs-865f34a0.js";import B from"./RiwayatPengajuan-e9bccb3e.js";import{T as J,a as M,b as k,c,d as I,e as l,F as L}from"./FormatNumbering-cf8ab2a7.js";import{B as G}from"./badge-581d80cf.js";import O from"./Acc-941b2c8d.js";import U from"./Tolak-1009e0b3.js";import V from"./DropJadi-71310e02.js";import z from"./Gagal-14a102cb.js";import"./index-5cd67b05.js";import"./react-icons.esm-574d18b9.js";import"./index-3a918115.js";import"./button-04b96693.js";import"./utils-36e2ef84.js";import"./index-a4d2990b.js";import"./index-e875f363.js";import"./DetailRiwayat-2f05b9e4.js";import"./play-741f0ca9.js";import"./createLucideIcon-eced512e.js";import"./react-number-format.es-6c16da80.js";import"./Loading-aa0339c0.js";import"./transition-f1922511.js";import"./label-c2fd6b2d.js";import"./index.esm-76235d9e.js";const ve=({show:n=!1,onClosed:t,triggeredData:s})=>{console.log(s);const[a,v]=i.useState([]),[T,b]=i.useState([]),[W,w]=i.useState(),[y,p]=i.useState(!1),[_,N]=i.useState(!1);i.useEffect(()=>{v(s),w(s==null?void 0:s.request)},[s]);const P=async g=>{p(!0),N(),await S({method:"post",url:route("transaction.nasabah_buku_transaksi"),data:{nik:s.nik}}).then(function({data:o}){p(!1),o.falidate_nik?b(o.data):b([])}).catch(function({response:o}){N(o.data.message),p(!1)})};return i.useEffect(()=>{s!=null&&s.nik&&P()},[s]),e(f,{children:e(A,{open:n,onOpenChange:g=>g?"":t(),children:r(D,{className:"w-[90vw] h-[90vh] lg:h-auto overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:[_&&e("div",{children:"terjadi kesalahan saat memuat data"}),y?e("div",{children:"Data Sedang Dimuat"}):r(K,{children:[e(R,{children:"Check Transaksi Mantri"}),e(E,{children:r(H,{defaultValue:"account",className:"w-full",children:[r(q,{className:"grid w-full grid-cols-2",children:[e(x,{value:"account",children:"Action"}),e(x,{value:"password",children:"Riwayat Pinjaman"})]}),r(j,{value:"account",children:[r(m,{children:[e(h,{children:e(u,{children:"Detail Pengajuan"})}),e(d,{className:"space-y-2",children:e("div",{className:"overflow-auto border rounded-lg scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:Q(a)})})]}),r("div",{className:"flex flex-col gap-3 mt-3 lg:flex-row",children:[r(m,{className:"w-full",children:[e(h,{children:e(u,{children:"Acc / Cek Kodham"})}),e(d,{className:"space-y-2",children:e("div",{className:"flex items-end justify-center gap-2 mx-auto lg:w-1/2",children:(a==null?void 0:a.status)==="open"?r(f,{children:[e(O,{id:a==null?void 0:a.nomor_pengajuan,acc:(a==null?void 0:a.acc)??(a==null?void 0:a.request),onClosed:t}),e(U,{id:a==null?void 0:a.nomor_pengajuan,onClosed:t})]}):r("div",{children:["Status Pengajuan = ",a==null?void 0:a.status,", Tanggal"," ",a==null?void 0:a.check_date]})})})]}),(a==null?void 0:a.status)!=="open"&&r(m,{className:"w-full",children:[e(h,{children:e(u,{children:"Drop Jadi"})}),e(d,{className:"space-y-2",children:e("div",{className:"flex items-end justify-center gap-2 mx-auto lg:w-1/2",children:(a==null?void 0:a.status)==="acc"?r(f,{children:[e(V,{id:a==null?void 0:a.nomor_pengajuan,drop_jadi:a==null?void 0:a.acc,onClosed:t}),e(z,{id:a==null?void 0:a.nomor_pengajuan,onClosed:t})]}):r("div",{children:["Status Pengajuan = ",a==null?void 0:a.status,", Tanggal"," ",a==null?void 0:a.check_date]})})})]})]})]}),e(j,{value:"password",children:r(m,{children:[r(h,{children:[e(u,{children:"Riwayat Pengajuan"}),e(F,{children:"Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang tertera dari semua cabang"})]}),e(d,{className:"space-y-2",children:e("div",{className:"h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin",children:e(B,{data:T})})})]})})]})})]})]})})})};function Q(n){return r(J,{children:[e(M,{children:r(k,{children:[e(c,{className:"text-center",children:"Tanggal Pengajuan"}),e(c,{className:"text-center",children:"Nomor Pengajuan"}),e(c,{className:"text-center",children:"Status"}),e(c,{className:"text-center",children:"Nama Nasabah"}),e(c,{className:"text-center",children:"NIK"}),e(c,{className:"text-center",children:"Alamat"}),e(c,{className:"text-center",children:"Unit"}),e(c,{className:"text-center",children:"Kelompok"}),e(c,{className:"text-center",children:"Pengajuan"}),e(c,{className:"text-center",children:"Tgl Drop"}),e(c,{className:"text-center",children:"Kelompok"}),e(c,{className:"text-center",children:"Pinj Ke"}),e(c,{className:"text-center",children:"Acc"}),e(c,{className:"text-center",children:"Drop Jadi"})]})}),n&&e(I,{children:r(k,{className:"text-center",children:[e(l,{className:"bg-red-200",children:n.tanggal_pengajuan}),e(l,{children:n.nomor_pengajuan}),e(l,{children:e(G,{variant:n.status=="open"?"green":n.status=="acc"?"yellow":n.status=="success"?"default":"destructive",children:n.status})}),e(l,{children:n.nama}),e(l,{children:n.nik}),e(l,{children:n.alamat}),e(l,{children:n.unit}),e(l,{children:n.kelompok}),e(l,{children:e(L,{value:n.request})}),e(l,{children:C(n.tanggal_drop).format("DD/MM")}),e(l,{children:n.kelompok}),e(l,{children:n.pinjaman_ke}),e(l,{children:n.acc}),e(l,{children:n.drop_jadi})]})})]})}export{ve as default};
