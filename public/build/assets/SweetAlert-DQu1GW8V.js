import{R as d,c as g,r as y}from"./app-ns96WniE.js";import{S as _}from"./sweetalert2.esm.all-k-RAFA3H.js";const p=[{key:"title",getter:t=>t.getTitle()},{key:"html",getter:t=>t.getHtmlContainer()},{key:"confirmButtonText",getter:t=>t.getConfirmButton()},{key:"denyButtonText",getter:t=>t.getDenyButton()},{key:"cancelButtonText",getter:t=>t.getCancelButton()},{key:"footer",getter:t=>t.getFooter()},{key:"closeButtonHtml",getter:t=>t.getCloseButton()},{key:"iconHtml",getter:t=>t.getIconContent()},{key:"loaderHtml",getter:t=>t.getLoader()}],h=()=>{};function k(t){function l(e){const n={},o={},r=p.map(a=>a.key);return Object.entries(e).forEach(a=>{let[i,c]=a;r.includes(i)&&d.isValidElement(c)?(n[i]=c,o[i]=" "):o[i]=c}),[n,o]}function u(e,n){Object.entries(n).forEach(o=>{let[r,a]=o;const c=p.find(f=>f.key===r).getter(t),s=g.createRoot(c);s.render(a),e.__roots.push(s)})}function m(e){e.__roots.forEach(n=>{n.unmount()}),e.__roots=[]}return class extends t{static argsToParams(e){if(d.isValidElement(e[0])||d.isValidElement(e[1])){const n={};return["title","html","icon"].forEach((o,r)=>{e[r]!==void 0&&(n[o]=e[r])}),n}else return t.argsToParams(e)}_main(e,n){this.__roots=[],this.__params=Object.assign({},n,e);const[o,r]=l(this.__params),a=r.willOpen||h,i=r.didOpen||h,c=r.didDestroy||h;return super._main(Object.assign({},r,{willOpen:s=>{u(this,o),a(s)},didOpen:s=>{setTimeout(()=>{i(s)})},didDestroy:s=>{c(s),m(this)}}))}update(e){Object.assign(this.__params,e),m(this);const[n,o]=l(this.__params);super.update(o),u(this,n)}}}const T=({type:t,message:l,keys:u})=>{const m=k(_);return y.useEffect(()=>{m.fire({position:"top-end",icon:t,title:l||(t==="error"?"Terjadi Kesalahan Silahkan hub IT.":"Anda Telah Melakukan Perubahan"),showConfirmButton:!1,timer:2e3})},[t,l,u]),null};export{T as S};
