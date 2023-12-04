import{g as W,e as H,s as w,f as ot,r as mt,_ as c,h as b,u as Y,i as F,k as $,l as nt,m as it,n as d,o as L,p as q,q as ft,t as tt,v as J,w as gt,a,x as bt,j as g,T as P,D as U,y as E,B as et,C as st,F as T,I as at,z as vt,A as xt,E as yt}from"./index-9a381654.js";import{r as l,u as Ct}from"./react-089206b9.js";import{u as It}from"./page-b38f01e8.js";import"./firebase-eea2a2de.js";function ht(t){return H("MuiListItem",t)}const $t=W("MuiListItem",["root","container","focusVisible","dense","alignItemsFlexStart","disabled","divider","gutters","padding","button","secondaryAction","selected"]),I=$t;function Lt(t){return H("MuiListItemButton",t)}const Rt=W("MuiListItemButton",["root","focusVisible","dense","alignItemsFlexStart","disabled","divider","gutters","selected"]),h=Rt,Gt=["alignItems","autoFocus","component","children","dense","disableGutters","divider","focusVisibleClassName","selected","className"],St=(t,e)=>{const{ownerState:s}=t;return[e.root,s.dense&&e.dense,s.alignItems==="flex-start"&&e.alignItemsFlexStart,s.divider&&e.divider,!s.disableGutters&&e.gutters]},At=t=>{const{alignItems:e,classes:s,dense:n,disabled:i,disableGutters:o,divider:r,selected:u}=t,p=q({root:["root",n&&"dense",!o&&"gutters",r&&"divider",i&&"disabled",e==="flex-start"&&"alignItemsFlexStart",u&&"selected"]},Lt,s);return c({},s,p)},kt=w(ot,{shouldForwardProp:t=>mt(t)||t==="classes",name:"MuiListItemButton",slot:"Root",overridesResolver:St})(({theme:t,ownerState:e})=>c({display:"flex",flexGrow:1,justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minWidth:0,boxSizing:"border-box",textAlign:"left",paddingTop:8,paddingBottom:8,transition:t.transitions.create("background-color",{duration:t.transitions.duration.shortest}),"&:hover":{textDecoration:"none",backgroundColor:(t.vars||t).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${h.selected}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:b(t.palette.primary.main,t.palette.action.selectedOpacity),[`&.${h.focusVisible}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.focusOpacity}))`:b(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.focusOpacity)}},[`&.${h.selected}:hover`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.hoverOpacity}))`:b(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:b(t.palette.primary.main,t.palette.action.selectedOpacity)}},[`&.${h.focusVisible}`]:{backgroundColor:(t.vars||t).palette.action.focus},[`&.${h.disabled}`]:{opacity:(t.vars||t).palette.action.disabledOpacity}},e.divider&&{borderBottom:`1px solid ${(t.vars||t).palette.divider}`,backgroundClip:"padding-box"},e.alignItems==="flex-start"&&{alignItems:"flex-start"},!e.disableGutters&&{paddingLeft:16,paddingRight:16},e.dense&&{paddingTop:4,paddingBottom:4})),Pt=l.forwardRef(function(e,s){const n=Y({props:e,name:"MuiListItemButton"}),{alignItems:i="center",autoFocus:o=!1,component:r="div",children:u,dense:m=!1,disableGutters:p=!1,divider:R=!1,focusVisibleClassName:O,selected:j=!1,className:z}=n,f=F(n,Gt),G=l.useContext($),y=l.useMemo(()=>({dense:m||G.dense||!1,alignItems:i,disableGutters:p}),[i,G.dense,m,p]),S=l.useRef(null);nt(()=>{o&&S.current&&S.current.focus()},[o]);const B=c({},n,{alignItems:i,dense:y.dense,disableGutters:p,divider:R,selected:j}),A=At(B),N=it(S,s);return d.jsx($.Provider,{value:y,children:d.jsx(kt,c({ref:N,href:f.href||f.to,component:(f.href||f.to)&&r==="div"?"button":r,focusVisibleClassName:L(A.focusVisible,O),ownerState:B,className:L(A.root,z)},f,{classes:A,children:u}))})}),Ot=Pt;function jt(t){return H("MuiListItemSecondaryAction",t)}W("MuiListItemSecondaryAction",["root","disableGutters"]);const Bt=["className"],Nt=t=>{const{disableGutters:e,classes:s}=t;return q({root:["root",e&&"disableGutters"]},jt,s)},Mt=w("div",{name:"MuiListItemSecondaryAction",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:s}=t;return[e.root,s.disableGutters&&e.disableGutters]}})(({ownerState:t})=>c({position:"absolute",right:16,top:"50%",transform:"translateY(-50%)"},t.disableGutters&&{right:0})),rt=l.forwardRef(function(e,s){const n=Y({props:e,name:"MuiListItemSecondaryAction"}),{className:i}=n,o=F(n,Bt),r=l.useContext($),u=c({},n,{disableGutters:r.disableGutters}),m=Nt(u);return d.jsx(Mt,c({className:L(m.root,i),ownerState:u,ref:s},o))});rt.muiName="ListItemSecondaryAction";const Vt=rt,Ft=["className"],wt=["alignItems","autoFocus","button","children","className","component","components","componentsProps","ContainerComponent","ContainerProps","dense","disabled","disableGutters","disablePadding","divider","focusVisibleClassName","secondaryAction","selected","slotProps","slots"],zt=(t,e)=>{const{ownerState:s}=t;return[e.root,s.dense&&e.dense,s.alignItems==="flex-start"&&e.alignItemsFlexStart,s.divider&&e.divider,!s.disableGutters&&e.gutters,!s.disablePadding&&e.padding,s.button&&e.button,s.hasSecondaryAction&&e.secondaryAction]},_t=t=>{const{alignItems:e,button:s,classes:n,dense:i,disabled:o,disableGutters:r,disablePadding:u,divider:m,hasSecondaryAction:p,selected:R}=t;return q({root:["root",i&&"dense",!r&&"gutters",!u&&"padding",m&&"divider",o&&"disabled",s&&"button",e==="flex-start"&&"alignItemsFlexStart",p&&"secondaryAction",R&&"selected"],container:["container"]},ht,n)},Dt=w("div",{name:"MuiListItem",slot:"Root",overridesResolver:zt})(({theme:t,ownerState:e})=>c({display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",width:"100%",boxSizing:"border-box",textAlign:"left"},!e.disablePadding&&c({paddingTop:8,paddingBottom:8},e.dense&&{paddingTop:4,paddingBottom:4},!e.disableGutters&&{paddingLeft:16,paddingRight:16},!!e.secondaryAction&&{paddingRight:48}),!!e.secondaryAction&&{[`& > .${h.root}`]:{paddingRight:48}},{[`&.${I.focusVisible}`]:{backgroundColor:(t.vars||t).palette.action.focus},[`&.${I.selected}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:b(t.palette.primary.main,t.palette.action.selectedOpacity),[`&.${I.focusVisible}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.focusOpacity}))`:b(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.focusOpacity)}},[`&.${I.disabled}`]:{opacity:(t.vars||t).palette.action.disabledOpacity}},e.alignItems==="flex-start"&&{alignItems:"flex-start"},e.divider&&{borderBottom:`1px solid ${(t.vars||t).palette.divider}`,backgroundClip:"padding-box"},e.button&&{transition:t.transitions.create("background-color",{duration:t.transitions.duration.shortest}),"&:hover":{textDecoration:"none",backgroundColor:(t.vars||t).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${I.selected}:hover`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.hoverOpacity}))`:b(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:b(t.palette.primary.main,t.palette.action.selectedOpacity)}}},e.hasSecondaryAction&&{paddingRight:48})),Ut=w("li",{name:"MuiListItem",slot:"Container",overridesResolver:(t,e)=>e.container})({position:"relative"}),Et=l.forwardRef(function(e,s){const n=Y({props:e,name:"MuiListItem"}),{alignItems:i="center",autoFocus:o=!1,button:r=!1,children:u,className:m,component:p,components:R={},componentsProps:O={},ContainerComponent:j="li",ContainerProps:{className:z}={},dense:f=!1,disabled:G=!1,disableGutters:y=!1,disablePadding:S=!1,divider:B=!1,focusVisibleClassName:A,secondaryAction:N,selected:ct=!1,slotProps:lt={},slots:dt={}}=n,pt=F(n.ContainerProps,Ft),ut=F(n,wt),K=l.useContext($),_=l.useMemo(()=>({dense:f||K.dense||!1,alignItems:i,disableGutters:y}),[i,K.dense,f,y]),D=l.useRef(null);nt(()=>{o&&D.current&&D.current.focus()},[o]);const C=l.Children.toArray(u),Q=C.length&&ft(C[C.length-1],["ListItemSecondaryAction"]),M=c({},n,{alignItems:i,autoFocus:o,button:r,dense:_.dense,disabled:G,disableGutters:y,disablePadding:S,divider:B,hasSecondaryAction:Q,selected:ct}),X=_t(M),Z=it(D,s),V=dt.root||R.Root||Dt,k=lt.root||O.root||{},v=c({className:L(X.root,k.className,m),disabled:G},ut);let x=p||"li";return r&&(v.component=p||"div",v.focusVisibleClassName=L(I.focusVisible,A),x=ot),Q?(x=!v.component&&!p?"div":x,j==="li"&&(x==="li"?x="div":v.component==="li"&&(v.component="div")),d.jsx($.Provider,{value:_,children:d.jsxs(Ut,c({as:j,className:L(X.container,z),ref:Z,ownerState:M},pt,{children:[d.jsx(V,c({},k,!tt(V)&&{as:x,ownerState:c({},M,k.ownerState)},v,{children:C})),C.pop()]}))})):d.jsx($.Provider,{value:_,children:d.jsxs(V,c({},k,{as:x,ref:Z},!tt(V)&&{ownerState:c({},M,k.ownerState)},v,{children:[C,N&&d.jsx(Vt,{children:N})]}))})}),Tt=Et,Wt=J(d.jsx("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"}),"Create"),Ht=J(d.jsx("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"}),"Delete"),Yt=J(d.jsx("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage"),qt=()=>{const[t,e]=l.useState([]),[s,n]=l.useState(!0);return l.useEffect(()=>{(async()=>{const r=(await yt()).data;e(r),n(!1)})()},[]),{groups:t,loading:s}};function Jt(){It({title:"Chorema"});const t=gt(),e=Ct(),{groups:s,loading:n}=qt(),i=l.useCallback(()=>{e("/group/create")},[e]);return n?a(bt,{}):(s==null?void 0:s.length)===0?g(st,{sx:{py:"20px"},maxWidth:"sm",children:[g(P,{sx:{mb:2},variant:"h3",align:"center",children:["Welcome ",(t==null?void 0:t.first_name)??"to Chorema"]}),a(U,{sx:{mb:2}}),a(E,{sx:{display:"flex",justifyContent:"center"},children:a(Yt,{fontSize:"large"})}),a(P,{sx:{my:2},variant:"h5",align:"center",children:"You are not currently in any groups."}),a(P,{sx:{my:2},variant:"h5",align:"center",children:"Go ahead and create one!"}),a(E,{sx:{justifyContent:"center",display:"flex"},children:a(et,{variant:"outlined",onClick:i,children:"Create group"})})]}):g(T,{children:[g(st,{sx:{py:"20px"},maxWidth:"sm",children:[g(P,{sx:{mb:2},variant:"h3",align:"center",children:["Welcome ",(t==null?void 0:t.first_name)??"to Chorema"]}),a(U,{}),a("br",{}),g(E,{sx:{justifyContent:"center",gridGap:"1rem"},children:[a(P,{sx:{my:2},variant:"h4",align:"center",children:"Your Groups"}),a("br",{}),a(xt,{sx:{width:"100%"},children:s==null?void 0:s.map(o=>{var r;return g(T,{children:[a(Tt,{secondaryAction:g(T,{children:[a(at,{edge:"end","aria-label":"edit",children:a(Wt,{onClick:()=>{e(`/group/edit/${o==null?void 0:o.id}`)}})}),a(at,{edge:"end","aria-label":"edit",sx:{ml:1},children:a(Ht,{onClick:()=>{}})})]}),sx:{border:"0.8px solid cornflowerblue",borderRadius:3,backgroundColor:"white"},children:a(Ot,{sx:{padding:0},children:a(vt,{primary:o.group_name,onClick:()=>{e(`/group/view/${o==null?void 0:o.id}`)},secondary:`${((r=o.members)==null?void 0:r.length)??0} members`})})}),a(U,{sx:{my:2}})]})})})]})]}),a("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",position:"fixed",width:"100%",bottom:"40px"},children:a(et,{children:"Create Group",variant:"outlined",onClick:i,fullWidth:!0,sx:{mx:4}})})]})}Jt.displayName="Dashboard";export{Jt as Component,Jt as default};
