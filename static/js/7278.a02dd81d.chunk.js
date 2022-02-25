"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[7278],{77278:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return visible_confirm_email}});var react=__webpack_require__(67294),lib=__webpack_require__(37424),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),commonjs=__webpack_require__(81468),Card=__webpack_require__(51889),Card_default=__webpack_require__.n(Card),react_router_dom_production_min=__webpack_require__(59685),query_string=__webpack_require__(17563),login=__webpack_require__(97847);const ConfirmEmail=({confirmEmail,settings})=>{const{t}=(0,commonjs.$G)("common"),[message,setMessage]=(0,react.useState)("");return(0,react.useEffect)(()=>{const search=window.location.search||window.location.hash.substring(16),token=query_string.parse(search).token;confirmEmail(token).then(newMessage=>{setMessage(newMessage)})},[confirmEmail]),react.createElement("div",{className:"login"},react.createElement(Card_default(),{style:{boxShadow:"0 0 8px rgba(0,0,0,0.3)",borderRadius:"6px",opacity:.98,background:"rgba(255,255,255,0.75)"}},react.createElement(Card_default().Header,null,react.createElement(Card_default().Title,{as:"h3"},t("common:confirm-email"))),react.createElement(Card_default().Body,null,react.createElement("p",{"data-testid":"message"},message)),react.createElement(Card_default().Footer,{style:{background:"rgba(255,255,255,0.6)",textAlign:"right"}},react.createElement(react_router_dom_production_min.Link,{to:"/signup"},t("common:register")),react.createElement("span",null," | "),react.createElement(react_router_dom_production_min.Link,{to:"/login"},t("common:login")))),settings.brandingLogo?react.createElement("img",{className:"login-branding-logo",src:settings.brandingLogo,alt:"Branded Logo"}):null)};ConfirmEmail.propTypes={confirmEmail:prop_types_default().func.isRequired,settings:prop_types_default().object},ConfirmEmail.defaultProps={settings:{}};var confirm_email=ConfirmEmail,user=__webpack_require__(37344);function mapStateToProps(state){return{settings:state.settings}}function mapDispatchToProps(dispatch){return{confirmEmail:user.UG}}var visible_confirm_email=(0,lib.connect)(mapStateToProps,mapDispatchToProps)(confirm_email)},97847:function(){}}]);

//# sourceMappingURL=7278.a02dd81d.chunk.js.map