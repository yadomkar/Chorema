import{l as f,a as t}from"./firebase-eea2a2de.js";import{j as u,r as l}from"./react-0e7e8cd5.js";import{c}from"./index-a032844e.js";function $(e,r=[]){const a=u();l.useEffect(()=>{const m=document.title;return document.title=a.pathname==="/"?(e==null?void 0:e.title)??c.app.name:e!=null&&e.title?`${e.title} - ${c.app.name}`:c.app.name,function(){document.title=m}},[...r,a,e==null?void 0:e.title]),l.useEffect(()=>{(e==null?void 0:e.trackPageView)!==!1&&f(t(),"page_view",{page_title:(e==null?void 0:e.title)??c.app.name,page_path:`${a.pathname}${a.search}`})},[a,e==null?void 0:e.title,e==null?void 0:e.trackPageView])}export{$ as u};
