import{r,a as o}from"./app-b2e3bcc2.js";import{c as s}from"./utils-36e2ef84.js";import{N as d}from"./react-number-format.es-82351cdf.js";const m=r.forwardRef(({className:a,...e},t)=>o("table",{ref:t,className:s("w-full caption-bottom text-xs",a),...e}));m.displayName="Table";const c=r.forwardRef(({className:a,...e},t)=>o("thead",{ref:t,className:s("[&_tr]:border-b",a),...e}));c.displayName="TableHeader";const b=r.forwardRef(({className:a,...e},t)=>o("tbody",{ref:t,className:s("[&_tr:last-child]:border-0",a),...e}));b.displayName="TableBody";const i=r.forwardRef(({className:a,...e},t)=>o("tfoot",{ref:t,className:s("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",a),...e}));i.displayName="TableFooter";const f=r.forwardRef(({className:a,...e},t)=>o("tr",{ref:t,className:s("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",a),...e}));f.displayName="TableRow";const n=r.forwardRef(({className:a,...e},t)=>o("th",{ref:t,className:s("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",a),...e}));n.displayName="TableHead";const p=r.forwardRef(({className:a,...e},t)=>o("td",{ref:t,className:s("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",a),...e}));p.displayName="TableCell";const x=r.forwardRef(({className:a,...e},t)=>o("caption",{ref:t,className:s("mt-4 text-sm text-muted-foreground",a),...e}));x.displayName="TableCaption";const y=({value:a=0,prefix:e,suffix:t,className:l="text-end"})=>o("div",{className:`${l}`,children:o(d,{value:a,displayType:"text",thousandSeparator:",",prefix:e??"",suffix:t??""})});export{y as F,m as T,c as a,f as b,n as c,b as d,p as e,i as f};
