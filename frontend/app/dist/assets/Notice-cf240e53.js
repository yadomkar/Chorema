import{u as h,r as l}from"./react-0e7e8cd5.js";import{c as f,j as g,d as S,a as c,L as p,T as b}from"./index-db3dade8.js";function k(e){const a=h();return l.useCallback(async s=>{s.preventDefault(),console.log(e);const{email:t,password:n,first_name:u,last_name:o}=e,r={email:t,password:n,first_name:u,last_name:o};console.log("useHandleSignup");try{const i=await f.post("/api/signup/",r,{baseURL:"http://localhost/"});console.log(i),alert("Signup successful!... Redirecting to login page.!!"),a("/login")}catch{alert("Signup failed! Please try again.")}},[e,a])}const x=e=>{const a=h();return l.useCallback(async s=>{s.preventDefault();const{email:t,password:n}=e,u=await f.post("/api/login/",{email:t,password:n},{baseURL:"http://localhost/"}),{session_id:o,token:r,first_name:i,last_name:m,user_id:d}=u.data;localStorage.setItem("session_id",o),localStorage.setItem("token",r),localStorage.setItem("user_id",d);const y={email:t,first_name:i,last_name:m,token:r,session_id:o,user_id:d};localStorage.setItem("user",JSON.stringify(y)),alert("Login successful!... Redirecting to dashboard.!!"),a("/dashboard")},[e,a])};function w(){return l.useState({email:"",password:"",first_name:"",last_name:"",saml:!1,otpSent:!1,code:"",error:null})}function C(e){return l.useCallback(function(a){const{name:s,value:t}=a.target;e(n=>n[s]===t?n:{...n,[s]:t})},[e])}function L(e){const{sx:a,...s}=e;return g(b,{sx:{color:"text.secondary","& span":{opacity:.6},"& a":{fontWeight:500,opacity:.7},"& a:hover":{opacity:1},...a},variant:"body2",...s,children:[g("span",{children:["By clicking Continue above, your acknowledge that your have read and understood, and agree to ",S.app.name,"'s"]})," ",c(p,{color:"inherit",href:"/terms",children:"Terms & Conditions"}),c("span",{children:" and "}),c(p,{color:"inherit",href:"/privacy",children:"Privacy Policy"}),c("span",{children:"."})]})}export{L as N,C as a,x as b,k as c,w as u};
