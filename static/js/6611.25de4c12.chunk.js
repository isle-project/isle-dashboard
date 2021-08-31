/*! For license information please see 6611.25de4c12.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[6611],{6611:function(e,t,n){n.r(t),n.d(t,{default:function(){return N}});var r=n(41488),a=n(9251),o=n(15671),i=n(43144),l=n(97326),c=n(60136),s=n(29388),u=n(4942),f=n(25472),m=n(70048),d=n(29530),v=n(54012),p=n(75018),g=n(73230),Z=n(52787),y=n(14657),b=n(61562),h=n.n(b),E=(n(27184),function(e){(0,c.Z)(n,e);var t=(0,s.Z)(n);function n(e){var r;return(0,o.Z)(this,n),r=t.call(this,e),(0,u.Z)((0,l.Z)(r),"handleClick",(function(e){e.preventDefault(),r.props.forgotPassword({email:r.state.email})})),r.state={email:""},r}return(0,i.Z)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.t,a=t.settings;return r.createElement("div",{className:"login"},r.createElement(d.Z,{style:{boxShadow:"0 0 8px rgba(0,0,0,0.3)",borderRadius:"6px",opacity:.98,background:"rgba(255,255,255,0.75)"}},r.createElement(d.Z.Header,null,r.createElement(d.Z.Title,{as:"h3"},n("common:forgot-password"))),r.createElement(d.Z.Body,null,r.createElement(Z.Z,{inline:!0},r.createElement(g.Z,{controlId:"form-email"},r.createElement(v.Z,null,n("common:email-address")),r.createElement(p.Z,{type:"email",placeholder:n("common:enter-email"),value:this.state.email,onChange:function(t){var n=t.target.value;e.setState({email:n})},style:{marginLeft:"10px",marginRight:"6px"}}),r.createElement(m.Z,{disabled:!h()(this.state.email),onClick:this.handleClick,variant:"primary",type:"submit"},n("common:reset"))))),r.createElement(d.Z.Footer,{style:{background:"rgba(255,255,255,0.6)",textAlign:"right"}},a.allowUserRegistrations?r.createElement(r.Fragment,null,r.createElement(y.rU,{to:"/signup"},n("common:register")),r.createElement("span",null," | ")):null,r.createElement(y.rU,{to:"/login"},n("common:login")))),a.brandingLogo?r.createElement("img",{className:"login-branding-logo",src:a.brandingLogo,alt:"Branded Logo"}):null)}}]),n}(r.Component));E.defaultProps={settings:{}};var C=(0,f.Z)(["forgot_password","common"])(E),x=n(60299);var N=(0,a.$j)((function(e){return{user:e.user,settings:e.settings}}),(function(e){return{forgotPassword:(0,x.Vz)(e)}}))(C)},61562:function(e,t,n){var r=n(27859);e.exports=r},27859:function(e,t,n){var r=n(20842).isPrimitive,a=/@/;e.exports=function(e){return r(e)&&a.test(e)}},29530:function(e,t,n){n.d(t,{Z:function(){return w}});var r=n(87462),a=n(63366),o=n(78265),i=n.n(o),l=n(41488),c=n(38674),s=n(60665),u=n(90855),f=n(40539),m=["bsPrefix","className","variant","as"],d=l.forwardRef((function(e,t){var n=e.bsPrefix,o=e.className,s=e.variant,u=e.as,f=void 0===u?"img":u,d=(0,a.Z)(e,m),v=(0,c.vE)(n,"card-img");return l.createElement(f,(0,r.Z)({ref:t,className:i()(s?v+"-"+s:v,o)},d))}));d.displayName="CardImg",d.defaultProps={variant:null};var v=d,p=["bsPrefix","className","bg","text","border","body","children","as"],g=(0,u.Z)("h5"),Z=(0,u.Z)("h6"),y=(0,s.Z)("card-body"),b=(0,s.Z)("card-title",{Component:g}),h=(0,s.Z)("card-subtitle",{Component:Z}),E=(0,s.Z)("card-link",{Component:"a"}),C=(0,s.Z)("card-text",{Component:"p"}),x=(0,s.Z)("card-header"),N=(0,s.Z)("card-footer"),P=(0,s.Z)("card-img-overlay"),R=l.forwardRef((function(e,t){var n=e.bsPrefix,o=e.className,s=e.bg,u=e.text,m=e.border,d=e.body,v=e.children,g=e.as,Z=void 0===g?"div":g,b=(0,a.Z)(e,p),h=(0,c.vE)(n,"card"),E=(0,l.useMemo)((function(){return{cardHeaderBsPrefix:h+"-header"}}),[h]);return l.createElement(f.Z.Provider,{value:E},l.createElement(Z,(0,r.Z)({ref:t},b,{className:i()(o,h,s&&"bg-"+s,u&&"text-"+u,m&&"border-"+m)}),d?l.createElement(y,null,v):v))}));R.displayName="Card",R.defaultProps={body:!1},R.Img=v,R.Title=b,R.Subtitle=h,R.Body=y,R.Link=E,R.Text=C,R.Header=x,R.Footer=N,R.ImgOverlay=P;var w=R},40539:function(e,t,n){var r=n(41488).createContext(null);r.displayName="CardContext",t.Z=r},60665:function(e,t,n){n.d(t,{Z:function(){return m}});var r=n(87462),a=n(63366),o=n(78265),i=n.n(o),l=/-(.)/g;var c=n(41488),s=n(38674),u=["className","bsPrefix","as"],f=function(e){return e[0].toUpperCase()+(t=e,t.replace(l,(function(e,t){return t.toUpperCase()}))).slice(1);var t};function m(e,t){var n=void 0===t?{}:t,o=n.displayName,l=void 0===o?f(e):o,m=n.Component,d=n.defaultProps,v=c.forwardRef((function(t,n){var o=t.className,l=t.bsPrefix,f=t.as,d=void 0===f?m||"div":f,v=(0,a.Z)(t,u),p=(0,s.vE)(l,e);return c.createElement(d,(0,r.Z)({ref:n,className:i()(o,p)},v))}));return v.defaultProps=d,v.displayName=l,v}},90855:function(e,t,n){var r=n(87462),a=n(41488),o=n(78265),i=n.n(o);t.Z=function(e){return a.forwardRef((function(t,n){return a.createElement("div",(0,r.Z)({},t,{ref:n,className:i()(t.className,e)}))}))}},14657:function(e,t,n){n.d(t,{rU:function(){return p}});var r=n(59486),a=n(94578),o=n(41488),i=n(86358),l=(n(83603),n(87462)),c=n(63366),s=n(83697);o.Component;o.Component;var u=function(e,t){return"function"===typeof e?e(t):e},f=function(e,t){return"string"===typeof e?(0,i.ob)(e,null,null,t):e},m=function(e){return e},d=o.forwardRef;"undefined"===typeof d&&(d=m);var v=d((function(e,t){var n=e.innerRef,r=e.navigate,a=e.onClick,i=(0,c.Z)(e,["innerRef","navigate","onClick"]),s=i.target,u=(0,l.Z)({},i,{onClick:function(e){try{a&&a(e)}catch(t){throw e.preventDefault(),t}e.defaultPrevented||0!==e.button||s&&"_self"!==s||function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e)||(e.preventDefault(),r())}});return u.ref=m!==d&&t||n,o.createElement("a",u)}));var p=d((function(e,t){var n=e.component,a=void 0===n?v:n,p=e.replace,g=e.to,Z=e.innerRef,y=(0,c.Z)(e,["component","replace","to","innerRef"]);return o.createElement(r.s6.Consumer,null,(function(e){e||(0,s.Z)(!1);var n=e.history,r=f(u(g,e.location),e.location),c=r?n.createHref(r):"",v=(0,l.Z)({},y,{href:c,navigate:function(){var t=u(g,e.location),r=(0,i.Ep)(e.location)===(0,i.Ep)(f(t));(p||r?n.replace:n.push)(t)}});return m!==d?v.ref=t||Z:v.innerRef=Z,o.createElement(a,v)}))})),g=function(e){return e},Z=o.forwardRef;"undefined"===typeof Z&&(Z=g);Z((function(e,t){var n=e["aria-current"],a=void 0===n?"page":n,i=e.activeClassName,m=void 0===i?"active":i,d=e.activeStyle,v=e.className,y=e.exact,b=e.isActive,h=e.location,E=e.sensitive,C=e.strict,x=e.style,N=e.to,P=e.innerRef,R=(0,c.Z)(e,["aria-current","activeClassName","activeStyle","className","exact","isActive","location","sensitive","strict","style","to","innerRef"]);return o.createElement(r.s6.Consumer,null,(function(e){e||(0,s.Z)(!1);var n=h||e.location,i=f(u(N,n),n),c=i.pathname,w=c&&c.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),k=w?(0,r.LX)(n.pathname,{path:w,exact:y,sensitive:E,strict:C}):null,L=!!(b?b(k,n):k),U=L?function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((function(e){return e})).join(" ")}(v,m):v,S=L?(0,l.Z)({},x,d):x,A=(0,l.Z)({"aria-current":L&&a||null,className:U,style:S,to:i},R);return g!==Z?A.ref=t||P:A.innerRef=P,o.createElement(p,A)}))}))},27184:function(){}}]);
//# sourceMappingURL=6611.25de4c12.chunk.js.map