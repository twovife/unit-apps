import{R as z,r as M}from"./app-9f0c20ba.js";function se(e,r){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&r.indexOf(n)<0&&(a[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,n=Object.getOwnPropertySymbols(e);t<n.length;t++)r.indexOf(n[t])<0&&Object.prototype.propertyIsEnumerable.call(e,n[t])&&(a[n[t]]=e[n[t]]);return a}var Y;(function(e){e.event="event",e.props="prop"})(Y||(Y={}));function W(){}function Ae(e){var r,a=void 0;return function(){for(var n=[],t=arguments.length;t--;)n[t]=arguments[t];return r&&n.length===r.length&&n.every(function(i,f){return i===r[f]})||(r=n,a=e.apply(void 0,n)),a}}function ee(e){return!!(e||"").match(/\d/)}function H(e){return e==null}function Re(e){return typeof e=="number"&&isNaN(e)}function de(e){return H(e)||Re(e)||typeof e=="number"&&!isFinite(e)}function ge(e){return e.replace(/[-[\]/{}()*+?.\\^$|]/g,"\\$&")}function Te(e){switch(e){case"lakh":return/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g;case"wan":return/(\d)(?=(\d{4})+(?!\d))/g;case"thousand":default:return/(\d)(?=(\d{3})+(?!\d))/g}}function Ee(e,r,a){var n=Te(a),t=e.search(/[1-9]/);return t=t===-1?e.length:t,e.substring(0,t)+e.substring(t,e.length).replace(n,"$1"+r)}function Oe(e){var r=M.useRef(e);r.current=e;var a=M.useRef(function(){for(var n=[],t=arguments.length;t--;)n[t]=arguments[t];return r.current.apply(r,n)});return a.current}function oe(e,r){r===void 0&&(r=!0);var a=e[0]==="-",n=a&&r;e=e.replace("-","");var t=e.split("."),i=t[0],f=t[1]||"";return{beforeDecimal:i,afterDecimal:f,hasNegation:a,addNegation:n}}function Be(e){if(!e)return e;var r=e[0]==="-";r&&(e=e.substring(1,e.length));var a=e.split("."),n=a[0].replace(/^0+/,"")||"0",t=a[1]||"";return(r?"-":"")+n+(t?"."+t:"")}function me(e,r,a){for(var n="",t=a?"0":"",i=0;i<=r-1;i++)n+=e[i]||t;return n}function fe(e,r){return Array(r+1).join(e)}function he(e){var r=e+"",a=r[0]==="-"?"-":"";a&&(r=r.substring(1));var n=r.split(/[eE]/g),t=n[0],i=n[1];if(i=Number(i),!i)return a+t;t=t.replace(".","");var f=1+i,S=t.length;return f<0?t="0."+fe("0",Math.abs(f))+t:f>=S?t=t+fe("0",f-S):t=(t.substring(0,f)||"0")+"."+t.substring(f),a+t}function le(e,r,a){if(["","-"].indexOf(e)!==-1)return e;var n=(e.indexOf(".")!==-1||a)&&r,t=oe(e),i=t.beforeDecimal,f=t.afterDecimal,S=t.hasNegation,b=parseFloat("0."+(f||"0")),N=f.length<=r?"0."+f:b.toFixed(r),x=N.split("."),g=i;i&&Number(x[0])&&(g=i.split("").reverse().reduce(function(w,D,d){return w.length>d?(Number(w[0])+Number(D)).toString()+w.substring(1,w.length):D+w},x[0]));var m=me(x[1]||"",r,a),p=S?"-":"",c=n?".":"";return""+p+g+c+m}function Z(e,r){if(e.value=e.value,e!==null){if(e.createTextRange){var a=e.createTextRange();return a.move("character",r),a.select(),!0}return e.selectionStart||e.selectionStart===0?(e.focus(),e.setSelectionRange(r,r),!0):(e.focus(),!1)}}var Se=Ae(function(e,r){for(var a=0,n=0,t=e.length,i=r.length;e[a]===r[a]&&a<t;)a++;for(;e[t-1-n]===r[i-1-n]&&i-n>a&&t-n>a;)n++;return{from:{start:a,end:t-n},to:{start:a,end:i-n}}});function _e(e,r,a){return Math.min(Math.max(e,r),a)}function ie(e){return Math.max(e.selectionStart,e.selectionEnd)}function Fe(){return typeof navigator<"u"&&!(navigator.platform&&/iPhone|iPod/.test(navigator.platform))}function je(e){return{from:{start:0,end:0},to:{start:0,end:e.length},lastValue:""}}function Le(e){var r=e.currentValue,a=e.formattedValue,n=e.currentValueIndex,t=e.formattedValueIndex;return r[n]===a[t]}function Me(e,r,a,n,t,i,f){f===void 0&&(f=Le);var S=t.findIndex(function(P){return P}),b=e.slice(0,S);!r&&!a.startsWith(b)&&(r=b,a=b+a,n=n+b.length);for(var N=a.length,x=e.length,g={},m=new Array(N),p=0;p<N;p++){m[p]=-1;for(var c=0,w=x;c<w;c++){var D=f({currentValue:a,lastValue:r,formattedValue:e,currentValueIndex:p,formattedValueIndex:c});if(D&&g[c]!==!0){m[p]=c,g[c]=!0;break}}}for(var d=n;d<N&&(m[d]===-1||!i(a[d]));)d++;var E=d===N||m[d]===-1?x:m[d];for(d=n-1;d>0&&m[d]===-1;)d--;var B=d===-1||m[d]===-1?0:m[d]+1;return B>E?E:n-B<E-n?B:E}function ve(e,r,a,n){var t=e.length;if(r=_e(r,0,t),n==="left"){for(;r>=0&&!a[r];)r--;r===-1&&(r=a.indexOf(!0))}else{for(;r<=t&&!a[r];)r++;r>t&&(r=a.lastIndexOf(!0))}return r===-1&&(r=t),r}function ke(e){for(var r=Array.from({length:e.length+1}).map(function(){return!0}),a=0,n=r.length;a<n;a++)r[a]=!!(ee(e[a])||ee(e[a-1]));return r}function xe(e,r,a,n,t,i){i===void 0&&(i=W);var f=Oe(function(c,w){var D,d;return de(c)?(d="",D=""):typeof c=="number"||w?(d=typeof c=="number"?he(c):c,D=n(d)):(d=t(c,void 0),D=n(d)),{formattedValue:D,numAsString:d}}),S=M.useState(function(){return f(H(e)?r:e,a)}),b=S[0],N=S[1],x=function(c,w){c.formattedValue!==b.formattedValue&&N({formattedValue:c.formattedValue,numAsString:c.value}),i(c,w)},g=e,m=a;H(e)&&(g=b.numAsString,m=!0);var p=f(g,m);return M.useMemo(function(){N(p)},[p.formattedValue]),[b,x]}function Pe(e){return e.replace(/[^0-9]/g,"")}function Ke(e){return e}function Ue(e){var r=e.type;r===void 0&&(r="text");var a=e.displayType;a===void 0&&(a="input");var n=e.customInput,t=e.renderText,i=e.getInputRef,f=e.format;f===void 0&&(f=Ke);var S=e.removeFormatting;S===void 0&&(S=Pe);var b=e.defaultValue,N=e.valueIsNumericString,x=e.onValueChange,g=e.isAllowed,m=e.onChange;m===void 0&&(m=W);var p=e.onKeyDown;p===void 0&&(p=W);var c=e.onMouseUp;c===void 0&&(c=W);var w=e.onFocus;w===void 0&&(w=W);var D=e.onBlur;D===void 0&&(D=W);var d=e.value,E=e.getCaretBoundary;E===void 0&&(E=ke);var B=e.isValidInputCharacter;B===void 0&&(B=ee);var P=e.isCharacterSame,j=se(e,["type","displayType","customInput","renderText","getInputRef","format","removeFormatting","defaultValue","valueIsNumericString","onValueChange","isAllowed","onChange","onKeyDown","onMouseUp","onFocus","onBlur","value","getCaretBoundary","isValidInputCharacter","isCharacterSame"]),G=xe(d,b,!!N,f,S,x),K=G[0],V=K.formattedValue,L=K.numAsString,U=G[1],k=M.useRef({formattedValue:V,numAsString:L}),q=function(o,u){k.current={formattedValue:o.formattedValue,numAsString:o.value},U(o,u)},$=M.useState(!1),J=$[0],Q=$[1],l=M.useRef(null),v=M.useRef({setCaretTimeout:null,focusTimeout:null});M.useEffect(function(){return Q(!0),function(){clearTimeout(v.current.setCaretTimeout),clearTimeout(v.current.focusTimeout)}},[]);var T=f,C=function(o,u){var s=parseFloat(u);return{formattedValue:o,value:u,floatValue:isNaN(s)?void 0:s}},A=function(o,u,s){o.selectionStart===0&&o.selectionEnd===o.value.length||(Z(o,u),v.current.setCaretTimeout=setTimeout(function(){o.value===s&&o.selectionStart!==u&&Z(o,u)},0))},R=function(o,u,s){return ve(o,u,E(o),s)},O=function(o,u,s){var I=E(u),_=Me(u,V,o,s,I,B,P);return _=ve(u,_,I),_},re=function(o){var u=o.formattedValue;u===void 0&&(u="");var s=o.input,I=o.source,_=o.event,h=o.numAsString,y;if(s){var F=o.inputValue||s.value,X=ie(s);s.value=u,y=O(F,u,X),y!==void 0&&A(s,y,u)}u!==V&&q(C(u,h),{event:_,source:I})};M.useEffect(function(){var o=k.current,u=o.formattedValue,s=o.numAsString;V!==u&&(V!==L||u!==s)&&q(C(V,L),{event:void 0,source:Y.props})},[V,L]);var ne=l.current?ie(l.current):void 0,ae=typeof window<"u"?M.useLayoutEffect:M.useEffect;ae(function(){var o=l.current;if(V!==k.current.formattedValue&&o){var u=O(k.current.formattedValue,V,ne);o.value=V,A(o,u,V)}},[V]);var pe=function(o,u,s){var I=Se(V,o),_=Object.assign(Object.assign({},I),{lastValue:V}),h=S(o,_),y=T(h);if(h=S(y,void 0),g&&!g(C(y,h))){var F=u.target,X=ie(F),Ce=O(o,V,X);return F.value=V,A(F,Ce,V),!1}return re({formattedValue:y,numAsString:h,inputValue:o,event:u,source:s,input:u.target}),!0},Ve=function(o){var u=o.target,s=u.value,I=pe(s,o,Y.event);I&&m(o)},ye=function(o){var u=o.target,s=o.key,I=u.selectionStart,_=u.selectionEnd,h=u.value;h===void 0&&(h="");var y;if(s==="ArrowLeft"||s==="Backspace"?y=Math.max(I-1,0):s==="ArrowRight"?y=Math.min(I+1,h.length):s==="Delete"&&(y=I),y===void 0||I!==_){p(o);return}var F=y;if(s==="ArrowLeft"||s==="ArrowRight"){var X=s==="ArrowLeft"?"left":"right";F=R(h,y,X),F!==y&&o.preventDefault()}else s==="Delete"&&!B(h[y])?F=R(h,y,"right"):s==="Backspace"&&!B(h[y])&&(F=R(h,y,"left"));F!==y&&A(u,F,h),o.isUnitTestRun&&A(u,F,h),p(o)},be=function(o){var u=o.target,s=function(){var I=u.selectionStart,_=u.selectionEnd,h=u.value;if(h===void 0&&(h=""),I===_){var y=R(h,I);y!==I&&A(u,y,h)}};s(),requestAnimationFrame(function(){s()}),c(o)},Ne=function(o){o.persist&&o.persist();var u=o.target,s=o.currentTarget;l.current=u,v.current.focusTimeout=setTimeout(function(){var I=u.selectionStart,_=u.selectionEnd,h=u.value;h===void 0&&(h="");var y=R(h,I);y!==I&&!(I===0&&_===h.length)&&A(u,y,h),w(Object.assign(Object.assign({},o),{currentTarget:s}))},0)},we=function(o){l.current=null,clearTimeout(v.current.focusTimeout),clearTimeout(v.current.setCaretTimeout),D(o)},De=J&&Fe()?"numeric":void 0,ue=Object.assign({inputMode:De},j,{type:r,value:V,onChange:Ve,onKeyDown:ye,onMouseUp:be,onFocus:Ne,onBlur:we});if(a==="text")return t?z.createElement(z.Fragment,null,t(V,j)||null):z.createElement("span",Object.assign({},j,{ref:i}),V);if(n){var Ie=n;return z.createElement(Ie,Object.assign({},ue,{ref:i}))}return z.createElement("input",Object.assign({},ue,{ref:i}))}function ce(e,r){var a=r.decimalScale,n=r.fixedDecimalScale,t=r.prefix;t===void 0&&(t="");var i=r.suffix;i===void 0&&(i="");var f=r.allowNegative,S=r.thousandsGroupStyle;if(S===void 0&&(S="thousand"),e===""||e==="-")return e;var b=te(r),N=b.thousandSeparator,x=b.decimalSeparator,g=a!==0&&e.indexOf(".")!==-1||a&&n,m=oe(e,f),p=m.beforeDecimal,c=m.afterDecimal,w=m.addNegation;return a!==void 0&&(c=me(c,a,!!n)),N&&(p=Ee(p,N,S)),t&&(p=t+p),i&&(c=c+i),w&&(p="-"+p),e=p+(g&&x||"")+c,e}function te(e){var r=e.decimalSeparator;r===void 0&&(r=".");var a=e.thousandSeparator,n=e.allowedDecimalSeparators;return a===!0&&(a=","),n||(n=[r,"."]),{decimalSeparator:r,thousandSeparator:a,allowedDecimalSeparators:n}}function $e(e,r){e===void 0&&(e="");var a=new RegExp("(-)"),n=new RegExp("(-)(.)*(-)"),t=a.test(e),i=n.test(e);return e=e.replace(/-/g,""),t&&!i&&r&&(e="-"+e),e}function We(e,r){return new RegExp("(^-)|[0-9]|"+ge(e),r?"g":void 0)}function Ge(e,r,a){return e===""?!0:!(r!=null&&r.match(/\d/))&&!(a!=null&&a.match(/\d/))&&typeof e=="string"&&!isNaN(Number(e))}function Ze(e,r,a){var n;r===void 0&&(r=je(e));var t=a.allowNegative,i=a.prefix;i===void 0&&(i="");var f=a.suffix;f===void 0&&(f="");var S=a.decimalScale,b=r.from,N=r.to,x=N.start,g=N.end,m=te(a),p=m.allowedDecimalSeparators,c=m.decimalSeparator,w=e[g]===c;if(ee(e)&&(e===i||e===f)&&r.lastValue==="")return e;if(g-x===1&&p.indexOf(e[x])!==-1){var D=S===0?"":c;e=e.substring(0,x)+D+e.substring(x+1,e.length)}var d=function(v,T,C){var A=!1,R=!1;i.startsWith("-")?A=!1:v.startsWith("--")?(A=!1,R=!0):f.startsWith("-")&&v.length===f.length?A=!1:v[0]==="-"&&(A=!0);var O=A?1:0;return R&&(O=2),O&&(v=v.substring(O),T-=O,C-=O),{value:v,start:T,end:C,hasNegation:A}},E=d(e,x,g),B=E.hasNegation;n=E,e=n.value,x=n.start,g=n.end;var P=d(r.lastValue,b.start,b.end),j=P.start,G=P.end,K=P.value,V=e.substring(x,g);e.length&&K.length&&(j>K.length-f.length||G<i.length)&&!(V&&f.startsWith(V))&&(e=K);var L=0;e.startsWith(i)?L+=i.length:x<i.length&&(L=x),e=e.substring(L),g-=L;var U=e.length,k=e.length-f.length;e.endsWith(f)?U=k:(g>k||g>e.length-f.length)&&(U=g),e=e.substring(0,U),e=$e(B?"-"+e:e,t),e=(e.match(We(c,!0))||[]).join("");var q=e.indexOf(c);e=e.replace(new RegExp(ge(c),"g"),function(v,T){return T===q?".":""});var $=oe(e,t),J=$.beforeDecimal,Q=$.afterDecimal,l=$.addNegation;return N.end-N.start<b.end-b.start&&J===""&&w&&!parseFloat(Q)&&(e=l?"-":""),e}function qe(e,r){var a=r.prefix;a===void 0&&(a="");var n=r.suffix;n===void 0&&(n="");var t=Array.from({length:e.length+1}).map(function(){return!0}),i=e[0]==="-";t.fill(!1,0,a.length+(i?1:0));var f=e.length;return t.fill(!1,f-n.length+1,f+1),t}function ze(e){var r=te(e),a=r.thousandSeparator,n=r.decimalSeparator,t=e.prefix;t===void 0&&(t="");var i=e.allowNegative;if(i===void 0&&(i=!0),a===n)throw new Error(`
        Decimal separator can't be same as thousand separator.
        thousandSeparator: `+a+` (thousandSeparator = {true} is same as thousandSeparator = ",")
        decimalSeparator: `+n+` (default value for decimalSeparator is .)
     `);return t.startsWith("-")&&i&&(console.error(`
      Prefix can't start with '-' when allowNegative is true.
      prefix: `+t+`
      allowNegative: `+i+`
    `),i=!1),Object.assign(Object.assign({},e),{allowNegative:i})}function He(e){e=ze(e),e.decimalSeparator,e.allowedDecimalSeparators,e.thousandsGroupStyle;var r=e.suffix,a=e.allowNegative,n=e.allowLeadingZeros,t=e.onKeyDown;t===void 0&&(t=W);var i=e.onBlur;i===void 0&&(i=W);var f=e.thousandSeparator,S=e.decimalScale,b=e.fixedDecimalScale,N=e.prefix;N===void 0&&(N="");var x=e.defaultValue,g=e.value,m=e.valueIsNumericString,p=e.onValueChange,c=se(e,["decimalSeparator","allowedDecimalSeparators","thousandsGroupStyle","suffix","allowNegative","allowLeadingZeros","onKeyDown","onBlur","thousandSeparator","decimalScale","fixedDecimalScale","prefix","defaultValue","value","valueIsNumericString","onValueChange"]),w=te(e),D=w.decimalSeparator,d=w.allowedDecimalSeparators,E=function(l){return ce(l,e)},B=function(l,v){return Ze(l,v,e)},P=H(g)?x:g,j=m??Ge(P,N,r);H(g)?H(x)||(j=j||typeof x=="number"):j=j||typeof g=="number";var G=function(l){return de(l)?l:(typeof l=="number"&&(l=he(l)),j&&typeof S=="number"?le(l,S,!!b):l)},K=xe(G(g),G(x),!!j,E,B,p),V=K[0],L=V.numAsString,U=V.formattedValue,k=K[1],q=function(l){var v=l.target,T=l.key,C=v.selectionStart,A=v.selectionEnd,R=v.value;if(R===void 0&&(R=""),C!==A){t(l);return}T==="Backspace"&&R[0]==="-"&&C===N.length+1&&a&&Z(v,1),S&&b&&(T==="Backspace"&&R[C-1]===D?(Z(v,C-1),l.preventDefault()):T==="Delete"&&R[C]===D&&l.preventDefault()),d!=null&&d.includes(T)&&R[C]===D&&Z(v,C+1);var O=f===!0?",":f;T==="Backspace"&&R[C-1]===O&&Z(v,C-1),T==="Delete"&&R[C]===O&&Z(v,C+1),t(l)},$=function(l){var v=L;if(v.match(/\d/g)||(v=""),n||(v=Be(v)),b&&S&&(v=le(v,S,b)),v!==L){var T=ce(v,e);k({formattedValue:T,value:v,floatValue:parseFloat(v)},{event:l,source:Y.event})}i(l)},J=function(l){return l===D?!0:ee(l)},Q=function(l){var v=l.currentValue,T=l.lastValue,C=l.formattedValue,A=l.currentValueIndex,R=l.formattedValueIndex,O=v[A],re=C[R],ne=Se(T,v),ae=ne.to;return A>=ae.start&&A<ae.end&&d&&d.includes(O)&&re===D?!0:O===re};return Object.assign(Object.assign({},c),{value:U,valueIsNumericString:!1,isValidInputCharacter:J,isCharacterSame:Q,onValueChange:k,format:E,removeFormatting:B,getCaretBoundary:function(l){return qe(l,e)},onKeyDown:q,onBlur:$})}function Qe(e){var r=He(e);return z.createElement(Ue,Object.assign({},r))}export{Qe as N};
