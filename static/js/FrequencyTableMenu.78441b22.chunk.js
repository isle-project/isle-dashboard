"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[7424,459],{93883:function(e,t,n){n.r(t);var l=n(70885),a=n(41488),o=n(29530),i=n(70048),u=n(72945),r=n(23596),c=n(72731),s=n(87950),p=n(87914),m=n(39175),d=n(10724),f=n(64001),b=function(e){var t=e.defaultValue,n=e.variables,b=e.groupingVariables,g=e.t,v=(0,a.useState)(!1),y=(0,l.Z)(v,2),E=y[0],Z=y[1],h=(0,a.useState)(!0),x=(0,l.Z)(h,2),C=x[0],k=x[1],P=(0,a.useState)(t||n[0]),K=(0,l.Z)(P,2),S=K[0],w=K[1],V=(0,a.useState)(null),F=(0,l.Z)(V,2),N=F[0],q=F[1],D=(0,a.useState)(3),B=(0,l.Z)(D,2),U=B[0],L=B[1];return a.createElement(o.Z,null,a.createElement(o.Z.Header,{as:"h4"},g("Frequency Table"),a.createElement(f.Z,{title:g("Frequency Table"),content:g("Frequency Table-description")})),a.createElement(o.Z.Body,null,a.createElement(s.Z,{legend:g("variable"),defaultValue:S,options:n,onChange:w}),a.createElement(s.Z,{legend:g("group-by"),options:b,clearable:!0,menuPlacement:"top",onChange:q,tooltip:g("freq-table-group-by-tooltip")}),a.createElement(r.Z,null,a.createElement(u.Z,null,a.createElement(c.Z,{legend:g("counts"),defaultValue:C,onChange:function(){k(!C)}})),a.createElement(u.Z,null,a.createElement(c.Z,{legend:g("relative-frequency"),defaultValue:E,onChange:function(){Z(!E)}}))),E?a.createElement("p",null,g("report-relative-frequencies"),a.createElement(p.Z,{inline:!0,width:50,max:16,min:0,defaultValue:U,onChange:L}),g("decimal-places")):null,a.createElement(i.Z,{variant:"primary",block:!0,onClick:function(){var t=a.createElement(m.Z,{variable:S,group:N,calculateCounts:C,calculateRelative:E,nDecimalPlaces:U,data:e.data});e.logAction(d.Fk,{variable:S,group:N,calculateRelative:E,calculateCounts:C,nDecimalPlaces:U}),e.onCreated(t)},disabled:!C&&!E},g("generate"))))};b.defaultProps={defaultValue:null,groupingVariables:null,logAction:function(){}},t.default=b},64001:function(e,t,n){var l=n(41488),a=n(70048),o=n(92637),i=n(60145),u=n(52299),r=n(66734);t.Z=function(e){var t=l.createElement(o.Z,{id:"popover-positioned-right"},l.createElement(i.Z,null,e.title),l.createElement(u.Z,null,e.content));return l.createElement(r.Z,{trigger:["click","hover","focus"],placement:"left",rootClose:!0,overlay:t},l.createElement(a.Z,{size:"sm",variant:"outline-secondary",className:"question-button"},l.createElement("div",{className:"fa fa-question"})))}},72731:function(e,t,n){n.d(t,{Z:function(){return d}});var l=n(1413),a=n(4942),o=n(70885),i=n(41488),u=n(37691),r=n.n(u),c=n(84972),s=n(87651),p=(0,n(20216).Z)("checkbox-input"),m=function(e){var t=e.bind,u=e.defaultValue,m=e.disabled,d=e.onChange,f=(0,i.useRef)(e.id||p(e)),b=(0,i.useContext)(s.Z),g=(0,i.useState)(t&&b.state?b.state[t]:u),v=(0,o.Z)(g,2),y=v[0],E=v[1];(0,i.useEffect)((function(){E(u)}),[u]),(0,i.useEffect)((function(){t&&E(n.g.lesson.state[t])}),[t]),(0,i.useEffect)((function(){if(t){var e=n.g.lesson.state[t];e!==y&&E(e)}}),[t,y]);var Z=(0,i.useCallback)((function(e){E(e),t&&n.g.lesson.setState((0,a.Z)({},t,e))}),[t]),h=(0,i.useCallback)((function(e){var t=e.target.checked;d(t),Z(t)}),[d,Z]),x=function(){var t=null!==e.value?!e.value:!y;d(t),Z(t)},C=i.createElement("input",{className:"checkbox-input",type:"checkbox",checked:null!==e.value?e.value:y,value:"checkbox",onChange:h,disabled:m,"aria-label":e.tooltip});if(!0===e.inline)return i.createElement(c.Z,{tooltip:e.tooltip,placement:e.tooltipPlacement},i.createElement("span",{id:f.current,style:(0,l.Z)({marginLeft:"8px"},e.style)},C,i.createElement("span",{role:"button",tabIndex:0,className:"checkbox-legend",style:{color:m?"darkgray":null},onClick:x,onKeyPress:x},e.legend)));var k=m?r():x;return i.createElement(c.Z,{tooltip:e.tooltip,placement:e.tooltipPlacement},i.createElement("div",{id:f.current,className:"input checkbox-input-div",style:e.style},C,i.createElement("span",{role:"button",tabIndex:0,className:"checkbox-legend",style:{color:m?"darkgray":null},onClick:k,onKeyPress:k},e.legend)))};m.defaultProps={bind:"",onChange:function(){},defaultValue:!1,value:null,disabled:!1,inline:!1,legend:"",tooltip:"",tooltipPlacement:"right",style:{}};var d=m},87914:function(e,t,n){n.d(t,{Z:function(){return V}});var l=n(1413),a=n(4942),o=n(70885),i=n(41488),u=n(44996),r=n.n(u),c=n(26180),s=n(33837),p=n.n(s),m=n(62423),d=n.n(m),f=n(20842),b=n(81064),g=n.n(b),v=n(37221),y=n(14444),E=n.n(y),Z=n(27394),h=n.n(Z),x=n(84972),C=n(87651),k=n(20216);var P=function(e){var t=e.min,n=e.max,l=e.step,a=e.t,o="".concat(a("enter")," ").concat(a(1===l?"integer":"number")," ");return n!==E()&&t!==h()?o+="".concat(a("between")," ").concat(t," ").concat(a("and")," ").concat(n):t!==h()?o+="".concat(a("larger-or-equal-to")," ").concat(t):n!==E()&&(o+="".concat(a("smaller-or-equal-to")," ").concat(n)),o},K=r()("isle:number-input"),S=(0,k.Z)("number-input"),w=function(e){var t=(0,i.useRef)(e.id||S(e)),u=e.bind,r=e.defaultValue,s=e.min,m=e.max,b=e.step,y=e.value,E=e.onBlur,Z=e.onChange,h=(0,c.$)("input").t,k=(0,i.useContext)(C.Z),w=(0,i.useState)(y||(u&&k.state?k.state[u]:r)),V=(0,o.Z)(w,2),F=V[0],N=V[1];(0,i.useEffect)((function(){if(u){var e=n.g.lesson.state[u];e!==F&&(0,v.isPrimitive)(F)&&N(e)}}),[u,F]),(0,i.useEffect)((function(){N(r)}),[r]),(0,i.useEffect)((function(){u&&N(n.g.lesson.state[u])}),[u]);var q=(0,i.useCallback)((function(e){K("Handle change of input field...");var t=e.target.validity.valid,l=e.target.value;N(l),y||t&&""!==l&&"-"!==l&&"."!==l&&"-."!==l?(l=parseFloat(l),d()(l)&&(l=""),Z(l),u&&n.g.lesson.setState((0,a.Z)({},u,l))):u&&n.g.lesson.setState((0,a.Z)({},u,l))}),[u,y,Z]),D=(0,i.useCallback)((function(e){K("Finished change...");var t=e.target.value;if(p()(t,"/")){K("Encountered a fraction...");var l=t.split("/");""!==l[0]&&""!==l[1]&&(t=parseFloat(l[0])/parseFloat(l[1]))}d()(t)?t="":""!==t&&"-"!==t&&"."!==t&&"-."!==t&&(t=parseFloat(t)),t>m?t=m:t<s?t=s:1===b&&""!==t&&"-"!==t&&"."!==t&&"-."!==t&&(t-=t%b),Z(t),E(t),t!==F&&(N(t),u&&n.g.lesson.setState((0,a.Z)({},u,t)))}),[u,s,m,b,F,E,Z]),B=g()(e.tooltip)?P({min:s,max:m,step:b,t:h}):e.tooltip;if(!0===e.inline){var U=i.createElement("span",{className:"input",style:(0,l.Z)({padding:"5px"},e.style)},e.legend?i.createElement("label",{htmlFor:t.current}," ",e.legend," =  "):null,i.createElement("input",{id:t.current,type:e.numbersOnly?"number":"text",name:"input",className:"number-number-input",disabled:e.disabled,value:null!==y?y:F,step:e.step,min:e.min,max:e.max,style:(0,l.Z)({width:"80px",paddingLeft:"6px",marginLeft:"3px"},e.inputStyle),onChange:q,onBlur:D,onKeyPress:e.onKeyPress,onKeyDown:e.onKeyDown,onKeyUp:e.onKeyUp,autoComplete:"off"}),e.description?i.createElement("span",null,"(",e.description,")"):i.createElement("span",null));return e.disabled?U:i.createElement(x.Z,{id:"number-input-tooltip-inline",placement:"top",show:!e.disabled,tooltip:B},U)}var L=i.createElement("input",{id:t.current,type:e.numbersOnly?"number":"text",name:"input",className:"number-number-input",disabled:e.disabled,value:null!==y?y:F,step:e.step,min:e.min,max:e.max,style:(0,l.Z)({width:"80px",marginLeft:"24px"},e.inputStyle),onChange:q,onBlur:D,onKeyPress:e.onKeyPress,onKeyDown:e.onKeyDown,onKeyUp:e.onKeyUp,autoComplete:"off"});return i.createElement("div",{className:"input",style:(0,l.Z)({marginBottom:"4px",marginTop:"4px"},e.style)},e.legend?i.createElement("span",null,i.createElement("label",{htmlFor:t.current},(0,f.isPrimitive)(e.legend)?e.legend+":":e.legend),e.description?i.createElement("span",null," ",e.description):null):null,i.createElement(x.Z,{id:"number-input-tooltip",placement:e.tooltipPlacement,tooltip:B,show:!e.disabled},i.createElement("span",{className:"number-input-span"},L)))};w.defaultProps={bind:"",disabled:!1,legend:null,min:h(),max:E(),step:1,defaultValue:0,onBlur:function(){},onChange:function(){},onKeyDown:function(){},onKeyPress:function(){},onKeyUp:function(){},inline:!1,numbersOnly:!0,style:{},inputStyle:{},value:null,tooltip:null,tooltipPlacement:"left"};var V=w}}]);
//# sourceMappingURL=FrequencyTableMenu.78441b22.chunk.js.map