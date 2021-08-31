"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[2762],{92729:function(e,t,a){a.r(t),a.d(t,{default:function(){return V}});var n=a(15671),l=a(43144),r=a(97326),o=a(60136),s=a(29388),i=a(4942),c=a(1413),m=a(87757),d=a.n(m),u=a(15861),p=a(70885),h=a(41488),f=a(25472),v=a(18306),Z=a(67583),E=a.n(Z),g=a(75314),w=a(66734),b=a(70048),y=a(92637),x=a(85840),k=a(54544),R=a(54012),C=a(51189),N=a(75018),P=a(73230),_=a(52787),S=a(23596),z=a(72945),M=a(89308),D=a(5557),I=a(42263),F=JSON.parse('[{"name":"Announcements","actions":[{"name":"create_announcement","description":""},{"name":"edit_announcement","description":""},{"name":"delete_announcement","description":""}]},{"name":"Cohorts","actions":[{"name":"create_cohort","description":""},{"name":"delete_cohort","description":""},{"name":"update_cohort","description":""}]},{"name":"Lessons","actions":[{"name":"create_lesson","description":""},{"name":"delete_lesson","description":""},{"name":"update_lesson","description":""},{"name":"activate_lesson","description":""},{"name":"deactivate_lesson","description":""},{"name":"show_lesson","description":""},{"name":"hide_lesson","description":""}]},{"name":"Namespaces","actions":[{"name":"create_namespace","description":""},{"name":"delete_namespace","description":""},{"name":"update_namespace","description":""}]},{"name":"Admin","actions":[{"name":"upload_file","description":""},{"name":"custom-fields","description":""},{"name":"backups","description":""},{"name":"license","description":""}]},{"name":"Roles","actions":[{"name":"viewRoles","description":""},{"name":"assignRoles","description":""},{"name":"editRoles","description":""}]},{"name":"Views","actions":[{"name":"gallery","description":""},{"name":"progress","description":""},{"name":"grades","description":""},{"name":"tickets","description":""}]},{"name":"Views","actions":[{"name":"gallery","description":""},{"name":"progress","description":""},{"name":"grades","description":""},{"name":"tickets","description":""}]},{"name":"Views","actions":[{"name":"gallery","description":""},{"name":"progress","description":""},{"name":"grades","description":""},{"name":"tickets","description":""}]}]'),T=[{label:"course",value:"course"},{label:"program",value:"program"},{label:"global",value:"global"}],G=function(e){var t=e.createRole,a=e.modal,n=e.roles,l=e.onHide,r=e.selectedRole,o=e.updateRole,s=e.t,i=(0,h.useState)("edit"===a?r.title:""),m=(0,p.Z)(i,2),f=m[0],Z=m[1],E=(0,h.useState)(null),g=(0,p.Z)(E,2),w=g[0],y=g[1],k=(0,h.useState)("edit"===a?{label:r.searchContext,value:r.searchContext}:T[2]),I=(0,p.Z)(k,2),G=I[0],A=I[1],B=(0,h.useState)("edit"===a?r.permissions:{}),H=(0,p.Z)(B,2),V=H[0],j=H[1],L=(0,h.useState)("all"),Y=(0,p.Z)(L,2),J=Y[0],K=Y[1],O=(0,h.useState)("edit"===a?r.authorizedRoles.map((function(e){return{label:e.title,value:e}})):[]),W=(0,p.Z)(O,2),X=W[0],q=W[1],Q=function(e){var t=e.target.checked,a=e.target.dataset.show;t&&K(a)},U=function(){var e=(0,u.Z)(d().mark((function e(){return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({id:r._id,title:f,authorizedRoles:X.map((function(e){return e.value._id})),searchContext:G.value,permissions:V||{}});case 2:e.sent instanceof Error===!1&&l();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),$=function(){var e=(0,u.Z)(d().mark((function e(){return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t({title:f,authorizedRoles:X.map((function(e){return e.value._id})),searchContext:G.value,permissions:V});case 2:e.sent instanceof Error===!1&&l();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return h.createElement(x.Z,{show:null!==a,dialogClassName:"modal-75w",onHide:l},h.createElement(x.Z.Header,{closeButton:!0},h.createElement(x.Z.Title,{as:"h3"},s("common:"+a))),h.createElement(x.Z.Body,null,h.createElement(S.Z,null,h.createElement(P.Z,{controlId:"form-title",as:z.Z},h.createElement(R.Z,null,s("common:title")),h.createElement(N.Z,{name:"title",type:"text",value:f,onChange:function(e){Z(e.target.value)},autoComplete:"none"})),h.createElement(P.Z,{controlId:"form-authorized-roles",as:z.Z},h.createElement(R.Z,null,s("authorized-roles"),":"),h.createElement(M.ZP,{options:n.map((function(e){return{label:e.title,value:e}})),isMulti:!0,value:X,onChange:function(e){q(e||[])}})),h.createElement(P.Z,{controlId:"form-context",as:z.Z},h.createElement(R.Z,null,s("search-context")),h.createElement(M.ZP,{options:T,onChange:A,value:G}))),h.createElement("div",{style:{height:50}},h.createElement("h4",{style:{float:"left",width:150}},s("permissions")),h.createElement(C.Z,{"data-show":"all",type:"radio",inline:!0,checked:"all"===J,label:s("show-all"),name:"radioGroup",onChange:Q}),h.createElement(C.Z,{"data-show":"allowed",type:"radio",inline:!0,checked:"allowed"===J,label:s("show-allowed"),name:"radioGroup",onChange:Q}),h.createElement(C.Z,{"data-show":"disallowed",type:"radio",inline:!0,checked:"disallowed"===J,label:s("show-disallowed"),name:"radioGroup",onChange:Q}),h.createElement(C.Z,{"data-show":"inactive",type:"radio",inline:!0,checked:"inactive"===J,label:s("show-inactive"),name:"radioGroup",onChange:Q}),h.createElement(D.Z,{onChange:function(e){y(e.target.value)},value:w||"",placeholder:s("search-permissions"),style:{float:"right"}})),h.createElement("div",{key:J,style:{height:"calc(100vh - 400px)",overflowY:"auto",overflowX:"hidden",backgroundColor:"rgba(255,128,0,0.04)",padding:12}},F.map((function(e,t){var a=e.actions.filter((function(e){return!(w&&!e.name.includes(w))&&!("allowed"===J&&!V[e.name]||"disallowed"===J&&!1!==V[e.name]||"inactive"===J&&(0,v.isPrimitive)(V[e.name]))})).map((function(e,t){var a;return a=!0===V[e.name]?"green":!1===V[e.name]?"red":"black",h.createElement(z.Z,{key:t,sm:3},h.createElement(C.Z,{inline:!0,id:e.name},h.createElement(C.Z.Input,{type:"checkbox",checked:!0===V[e.name],key:"".concat(e.name,"-").concat(t,"-input"),ref:function(t){t&&(t.indeterminate=!1===V[e.name])},onChange:function(t){var a=(0,c.Z)({},V);switch(V[e.name]){case!0:a[e.name]=!1,t.target.indeterminate=!0;break;case!1:a[e.name]=null,t.target.indeterminate=!1;break;default:a[e.name]=!0,t.target.indeterminate=!1}j(a)}}),h.createElement("span",{style:{color:a}},e.name)),h.createElement(_.Z.Text,null,e.description||"Description comes here..."))}));return 0===a.length?null:h.createElement(h.Fragment,{key:"".concat(e.name,"-").concat(t)},h.createElement("h5",null,e.name),h.createElement(_.Z.Row,{style:{marginBottom:16}},a),h.createElement("hr",null))})))),h.createElement(x.Z.Footer,null,h.createElement(b.Z,{onClick:l},s("common:cancel")),h.createElement(b.Z,{onClick:"create"===a?$:U,disabled:!f},s("create"===a?"common:create":"common:update"))))},A=function(e){var t=e.permissions,a=e.status,n=e.t,l=E()(t),r=[];if("allowed"===a)for(var o=0;o<l.length;o++){var s=l[o];!0===t[s]&&r.push(h.createElement(k.Z.Item,null,s))}else if("disallowed"===a)for(var i=0;i<l.length;i++){var c=l[i];!1===t[c]&&r.push(h.createElement(k.Z.Item,null,c))}return 0===r.length?h.createElement(k.Z,{variant:"flush"},h.createElement(k.Z.Item,null,n("common:none"))):h.createElement(k.Z,{variant:"flush",style:{fontSize:"0.8em"}},r.length>0?r:h.createElement(k.Z.Item,null,n("common:none")))},B=function(e){for(var t=e.roles,a=e.askToDeleteSelectedRoleFactory,n=e.toggleEditModalFactory,l=e.t,r=[],o=0;o<t.length;o++){var s=t[o],i=h.createElement("tr",{key:o},h.createElement("td",null,h.createElement("b",null,s.title)),h.createElement("td",null,s.createdBy?"".concat(s.createdBy.name," (").concat(s.createdBy.email,")"):""),h.createElement("td",null,h.createElement(w.Z,{placement:"left",delay:{show:250,hide:400},overlay:h.createElement(y.Z,{id:"popover-allowed-".concat(o)},h.createElement(y.Z.Title,{as:"h3"},l("allowed-permissions")),h.createElement(y.Z.Content,{style:{maxHeight:"40vh",overflowY:"auto"}},h.createElement(A,{status:"allowed",permissions:s.permissions,t:l}))),trigger:"click"},h.createElement(b.Z,{"aria-label":l("show-allowed-permissions"),variant:"success",style:{marginRight:8}},h.createElement("i",{className:"fas fa-check-circle"}))),h.createElement(w.Z,{placement:"right",delay:{show:250,hide:400},overlay:h.createElement(y.Z,{id:"popover-disallowed-".concat(o)},h.createElement(y.Z.Title,{as:"h3"},l("disallowed-permissions")),h.createElement(y.Z.Content,{style:{maxHeight:"40vh",overflowY:"auto"}},h.createElement(A,{status:"disallowed",permissions:s.permissions,t:l}))),trigger:"click"},h.createElement(b.Z,{"aria-label":l("show-disallowed-permissions"),variant:"danger"},h.createElement("i",{className:"far fa-times-circle"})))),h.createElement("td",null,s.searchContext),h.createElement("td",null,s.authorizedRoles.map((function(e){return e.title})).join(", ")),h.createElement("td",null,h.createElement(b.Z,{"aria-label":l("common:edit"),size:"sm",onClick:n(s),style:{marginRight:6}},h.createElement("i",{className:"fas fa-edit"})),h.createElement(b.Z,{"aria-label":l("common:delete"),variant:"danger",size:"sm",onClick:a(s)},h.createElement("i",{className:"fas fa-trash"}))));r.push(i)}return r},H=function(e){(0,o.Z)(a,e);var t=(0,s.Z)(a);function a(e){var l;return(0,n.Z)(this,a),l=t.call(this,e),(0,i.Z)((0,r.Z)(l),"toggleEditModalFactory",(function(e){return function(){l.setState({modal:l.state.modal?null:"edit",selectedRole:l.state.modal?null:e})}})),(0,i.Z)((0,r.Z)(l),"toggleCreateModal",(function(){l.setState({modal:l.state.modal?null:"create",selectedRole:null})})),(0,i.Z)((0,r.Z)(l),"toggleDeleteModal",(function(){l.setState({showDeleteModal:!l.state.showDeleteModal})})),(0,i.Z)((0,r.Z)(l),"askToDeleteSelectedRoleFactory",(function(e){return function(){l.setState({showDeleteModal:!l.state.showDeleteModal,selectedRole:e})}})),(0,i.Z)((0,r.Z)(l),"deleteSelectedRole",(function(){l.setState({showDeleteModal:!1},(0,u.Z)(d().mark((function e(){return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.props.deleteRole(l.state.selectedRole._id);case 2:case"end":return e.stop()}}),e)}))))})),l.state={modal:null,selectedRole:null,showDeleteModal:!1},l}return(0,l.Z)(a,[{key:"componentDidMount",value:function(){this.props.getAllRoles()}},{key:"render",value:function(){var e=this.props,t=e.admin,a=e.t;return h.createElement(h.Fragment,null,h.createElement("div",{className:"admin-settings-outer-container"},h.createElement("h1",null,a("roles")),h.createElement(g.Z,{striped:!0,bordered:!0,hover:!0},h.createElement("thead",null,h.createElement("tr",null,h.createElement("th",null,a("common:name")),h.createElement("th",null,a("common:created-by")),h.createElement("th",null,a("common:permissions")),h.createElement("th",null,a("search-context")),h.createElement("th",null,a("authorized-roles")),h.createElement("th",null,a("common:actions")))),h.createElement("tbody",null,h.createElement(B,{roles:t.roles||[],toggleEditModalFactory:this.toggleEditModalFactory,askToDeleteSelectedRoleFactory:this.askToDeleteSelectedRoleFactory,t:a}))),h.createElement(b.Z,{size:"lg",onClick:this.toggleCreateModal},h.createElement("i",{className:"fas fa-plus",style:{marginRight:12}}),a("create-role"))),null!==this.state.modal?h.createElement(G,{key:this.state.selectedRole?this.state.selectedRole.title:"new-role",onHide:this.toggleCreateModal,modal:this.state.modal,t:a,createRole:this.props.createRole,updateRole:this.props.updateRole,roles:this.props.admin.roles,selectedRole:this.state.selectedRole}):null,this.state.showDeleteModal?h.createElement(I.Z,{title:"".concat(a("common:delete-role"),"?"),message:h.createElement("div",null,h.createElement("p",null,a("common:delete-role-confirm")),h.createElement("span",{style:{color:"red"}},this.state.selectedRole.title)),close:this.toggleDeleteModal,show:this.state.showDeleteModal,onConfirm:this.deleteSelectedRole}):null)}}]),a}(h.Component),V=(0,f.Z)(["admin_settings","common"])(H)},42263:function(e,t,a){var n=a(41488),l=a(25472),r=a(70048),o=a(85840),s=function(e){return n.createElement(o.Z,{show:e.show,onHide:e.close},n.createElement(o.Z.Header,null,n.createElement(o.Z.Title,{as:"h3"},e.title)),n.createElement(o.Z.Body,null,e.message),n.createElement(o.Z.Footer,null,n.createElement(r.Z,{onClick:e.close},e.t("cancel")),n.createElement(r.Z,{variant:"danger",onClick:e.onConfirm},e.t("confirm"))))};s.defaultProps={close:function(){},message:"",onConfirm:function(){},show:!1,title:""},t.Z=(0,l.Z)(["common"])(s)},5557:function(e,t,a){var n=a(1413),l=a(41488),r=a(25472),o=a(73230),s=a(75018),i=a(33226),c=a(70048);t.Z=(0,r.Z)(["header_bar","common"])((function(e){return l.createElement(o.Z,{style:(0,n.Z)({width:"14vw",minWidth:"120px",float:"left",marginBottom:"4px",marginRight:"5px"},e.style)},l.createElement(i.Z,null,l.createElement(s.Z,{className:"header-bar-search",type:"text",placeholder:e.placeholder,value:e.value,onChange:e.onChange,"aria-label":e.t("search-field"),style:{height:"38px"}}),l.createElement(i.Z.Append,null,l.createElement(c.Z,{"aria-label":e.t("search-field-icon"),disabled:!0,variant:"secondary",style:{cursor:"auto"}},l.createElement("i",{className:"fa fa-search"})))))}))},33226:function(e,t,a){var n=a(63366),l=a(87462),r=a(78265),o=a.n(r),s=a(41488),i=a(60665),c=a(38674),m=["bsPrefix","size","hasValidation","className","as"],d=(0,i.Z)("input-group-append"),u=(0,i.Z)("input-group-prepend"),p=(0,i.Z)("input-group-text",{Component:"span"}),h=s.forwardRef((function(e,t){var a=e.bsPrefix,r=e.size,i=e.hasValidation,d=e.className,u=e.as,p=void 0===u?"div":u,h=(0,n.Z)(e,m);return a=(0,c.vE)(a,"input-group"),s.createElement(p,(0,l.Z)({ref:t},h,{className:o()(d,a,r&&a+"-"+r,i&&"has-validation")}))}));h.displayName="InputGroup";var f=(0,l.Z)({},h,{Text:p,Radio:function(e){return s.createElement(p,null,s.createElement("input",(0,l.Z)({type:"radio"},e)))},Checkbox:function(e){return s.createElement(p,null,s.createElement("input",(0,l.Z)({type:"checkbox"},e)))},Append:d,Prepend:u});t.Z=f},54544:function(e,t,a){var n=a(87462),l=a(63366),r=a(78265),o=a.n(r),s=a(41488),i=(a(47815),a(41309)),c=a(38674),m=a(45183),d=a(66070),u=["className","bsPrefix","variant","horizontal","as"],p={variant:void 0,horizontal:void 0},h=s.forwardRef((function(e,t){var a,r=(0,i.Ch)(e,{activeKey:"onSelect"}),d=r.className,p=r.bsPrefix,h=r.variant,f=r.horizontal,v=r.as,Z=void 0===v?"div":v,E=(0,l.Z)(r,u),g=(0,c.vE)(p,"list-group");return a=f?!0===f?"horizontal":"horizontal-"+f:null,s.createElement(m.Z,(0,n.Z)({ref:t},E,{as:Z,className:o()(d,g,h&&g+"-"+h,a&&g+"-"+a)}))}));h.defaultProps=p,h.displayName="ListGroup",h.Item=d.Z,t.Z=h},66070:function(e,t,a){var n=a(87462),l=a(63366),r=a(78265),o=a.n(r),s=a(41488),i=a(45571),c=a(38674),m=["bsPrefix","active","disabled","className","variant","action","as","onClick"],d={variant:void 0,active:!1,disabled:!1},u=s.forwardRef((function(e,t){var a=e.bsPrefix,r=e.active,d=e.disabled,u=e.className,p=e.variant,h=e.action,f=e.as,v=e.onClick,Z=(0,l.Z)(e,m);a=(0,c.vE)(a,"list-group-item");var E=(0,s.useCallback)((function(e){if(d)return e.preventDefault(),void e.stopPropagation();v&&v(e)}),[d,v]);return d&&void 0===Z.tabIndex&&(Z.tabIndex=-1,Z["aria-disabled"]=!0),s.createElement(i.Z,(0,n.Z)({ref:t},Z,{as:f||(h?Z.href?"a":"button":"div"),onClick:E,className:o()(u,a,r&&"active",d&&"disabled",p&&a+"-"+p,h&&a+"-action")}))}));u.defaultProps=d,u.displayName="ListGroupItem",t.Z=u},92637:function(e,t,a){var n=a(87462),l=a(63366),r=a(78265),o=a.n(r),s=a(41488),i=(a(90427),a(38674)),c=a(60145),m=a(52299),d=["bsPrefix","placement","className","style","children","content","arrowProps","popper","show"],u=s.forwardRef((function(e,t){var a=e.bsPrefix,r=e.placement,c=e.className,u=e.style,p=e.children,h=e.content,f=e.arrowProps,v=(e.popper,e.show,(0,l.Z)(e,d)),Z=(0,i.vE)(a,"popover"),E=((null==r?void 0:r.split("-"))||[])[0];return s.createElement("div",(0,n.Z)({ref:t,role:"tooltip",style:u,"x-placement":E,className:o()(c,Z,E&&"bs-popover-"+E)},v),s.createElement("div",(0,n.Z)({className:"arrow"},f)),h?s.createElement(m.Z,null,p):p)}));u.defaultProps={placement:"right"},u.Title=c.Z,u.Content=m.Z,t.Z=u},52299:function(e,t,a){var n=a(87462),l=a(63366),r=a(78265),o=a.n(r),s=a(41488),i=a(38674),c=["as","bsPrefix","className","children"],m=s.forwardRef((function(e,t){var a=e.as,r=void 0===a?"div":a,m=e.bsPrefix,d=e.className,u=e.children,p=(0,l.Z)(e,c);return m=(0,i.vE)(m,"popover-body"),s.createElement(r,(0,n.Z)({ref:t},p,{className:o()(d,m)}),u)}));t.Z=m},60145:function(e,t,a){var n=a(87462),l=a(63366),r=a(78265),o=a.n(r),s=a(41488),i=a(38674),c=["as","bsPrefix","className","children"],m=s.forwardRef((function(e,t){var a=e.as,r=void 0===a?"div":a,m=e.bsPrefix,d=e.className,u=e.children,p=(0,l.Z)(e,c);return m=(0,i.vE)(m,"popover-header"),s.createElement(r,(0,n.Z)({ref:t},p,{className:o()(m,d)}),u)}));t.Z=m},23596:function(e,t,a){var n=a(87462),l=a(63366),r=a(78265),o=a.n(r),s=a(41488),i=a(38674),c=["bsPrefix","className","noGutters","as"],m=["xl","lg","md","sm","xs"],d=s.forwardRef((function(e,t){var a=e.bsPrefix,r=e.className,d=e.noGutters,u=e.as,p=void 0===u?"div":u,h=(0,l.Z)(e,c),f=(0,i.vE)(a,"row"),v=f+"-cols",Z=[];return m.forEach((function(e){var t,a=h[e];delete h[e];var n="xs"!==e?"-"+e:"";null!=(t=null!=a&&"object"===typeof a?a.cols:a)&&Z.push(""+v+n+"-"+t)})),s.createElement(p,(0,n.Z)({ref:t},h,{className:o().apply(void 0,[r,f,d&&"no-gutters"].concat(Z))}))}));d.displayName="Row",d.defaultProps={noGutters:!1},t.Z=d},75314:function(e,t,a){var n=a(87462),l=a(63366),r=a(78265),o=a.n(r),s=a(41488),i=a(38674),c=["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"],m=s.forwardRef((function(e,t){var a=e.bsPrefix,r=e.className,m=e.striped,d=e.bordered,u=e.borderless,p=e.hover,h=e.size,f=e.variant,v=e.responsive,Z=(0,l.Z)(e,c),E=(0,i.vE)(a,"table"),g=o()(r,E,f&&E+"-"+f,h&&E+"-"+h,m&&E+"-striped",d&&E+"-bordered",u&&E+"-borderless",p&&E+"-hover"),w=s.createElement("table",(0,n.Z)({},Z,{className:g,ref:t}));if(v){var b=E+"-responsive";return"string"===typeof v&&(b=b+"-"+v),s.createElement("div",{className:b},w)}return w}));t.Z=m},89308:function(e,t,a){var n=a(89259),l=a(56091),r=a(15671),o=a(43144),s=a(60136),i=a(66301),c=a(41488),m=a(70807),d=a(94067),u=a(41728),p=(a(5347),a(15272),c.Component,(0,l.m)(n.S));t.ZP=p},42982:function(e,t,a){a.d(t,{Z:function(){return r}});var n=a(30907);var l=a(40181);function r(e){return function(e){if(Array.isArray(e))return(0,n.Z)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||(0,l.Z)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}}}]);
//# sourceMappingURL=2762.c041f45b.chunk.js.map