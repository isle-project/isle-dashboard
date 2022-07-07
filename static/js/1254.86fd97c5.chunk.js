"use strict";var __defProp=Object.defineProperty,__defProps=Object.defineProperties;var __getOwnPropDescs=Object.getOwnPropertyDescriptors;var __getOwnPropSymbols=Object.getOwnPropertySymbols;var __hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable;var __defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a},__spreadProps=(a,b)=>__defProps(a,__getOwnPropDescs(b));var __objRest=(source,exclude)=>{var target={};for(var prop in source)__hasOwnProp.call(source,prop)&&exclude.indexOf(prop)<0&&(target[prop]=source[prop]);if(source!=null&&__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(source))exclude.indexOf(prop)<0&&__propIsEnum.call(source,prop)&&(target[prop]=source[prop]);return target};(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[1254],{88608:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),react_i18next__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(81468),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(89876),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2__),react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(89194),react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__);const ConfirmModal=props=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default(),{show:props.show,onHide:props.close},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Header,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Title,{as:"h3"},props.title)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Body,null,props.message),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Footer,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2___default(),{onClick:props.close},props.t("cancel")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2___default(),{variant:"danger",onClick:props.onConfirm},props.t("confirm"))));ConfirmModal.propTypes={close:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,message:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,onConfirm:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,show:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,title:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string},ConfirmModal.defaultProps={close(){},message:"",onConfirm(){},show:!1,title:""},__webpack_exports__.Z=(0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.Zh)(["common"])(ConfirmModal)},1254:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return main}});var react=__webpack_require__(67294),commonjs=__webpack_require__(81468),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),Container=__webpack_require__(70448),Container_default=__webpack_require__.n(Container),Row=__webpack_require__(28269),Row_default=__webpack_require__.n(Row),Col=__webpack_require__(1266),Button=__webpack_require__(89876),Button_default=__webpack_require__.n(Button),Badge=__webpack_require__(86100),Badge_default=__webpack_require__.n(Badge),Form=__webpack_require__(17383),Form_default=__webpack_require__.n(Form),visible_barrier=__webpack_require__(42432),confirm_modal=__webpack_require__(88608),__async=(__this,__arguments,generator)=>new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}},rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}},step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())});const Branding=({logoPath,name,updateSettings,t})=>{const[showModal,setShowModal]=(0,react.useState)(!1),deleteLogo=(0,react.useCallback)(()=>{updateSettings(name,null)},[name,updateSettings]),toggleModal=(0,react.useCallback)(()=>{setShowModal(!showModal)},[showModal]);return react.createElement("div",{style:{position:"relative",width:"fit-content"}},react.createElement("img",{src:logoPath,alt:"Logo",style:{height:"250px",width:"auto"}}),react.createElement(Button_default(),{"aria-label":t("common:delete"),style:{position:"absolute",top:0,right:0},onClick:toggleModal,variant:"danger"},react.createElement("i",{className:"fas fa-trash"})),showModal?react.createElement(confirm_modal.Z,{title:t("delete-logo"),message:react.createElement("span",null,t("delete-logo-confirm")),close:toggleModal,show:showModal,onConfirm:deleteLogo}):null)},BrandingFileUpload=({name,t,uploadLogo,user})=>{const[file,setFile]=(0,react.useState)(null),[imgSrc,setImgSrc]=(0,react.useState)(null),handleFileSelection=(0,react.useCallback)(e=>{const newFile=e.target.files[0];if(newFile){const reader=new FileReader;reader.onload=function(){const dataURL=reader.result;setImgSrc(dataURL)},reader.readAsDataURL(newFile),setFile(newFile)}},[]),handleReset=(0,react.useCallback)(()=>{setFile(null),setImgSrc(null)},[]),handleConfirm=(0,react.useCallback)(()=>__async(void 0,null,function*(){const formData=new FormData;formData.append("branding",file,file.name),formData.append("type",name),(yield uploadLogo({formData,user}))instanceof Error||setFile(null)}),[uploadLogo,name,file,user]);return react.createElement(react.Fragment,null,react.createElement(Form_default().Group,{style:{marginBottom:0}},react.createElement(Form_default().Label,{htmlFor:`${name}Upload`,style:{cursor:"pointer"}},react.createElement("h3",null,react.createElement(Badge_default(),{bg:"success"},t("select-file")))),react.createElement(Form_default().Control,{id:`${name}Upload`,key:imgSrc,style:{display:"none"},type:"file",onChange:handleFileSelection,accept:"image/*"}),file?react.createElement(react.Fragment,null,react.createElement(Button_default(),{"aria-label":t("common:confirm"),className:"branding-confirm-btn",onClick:handleConfirm,bg:"success",size:"sm"},react.createElement("i",{className:"fas fa-check"})),react.createElement(Button_default(),{"aria-label":t("common:reset"),className:"branding-reset-btn",onClick:handleReset,bg:"warning",size:"sm"},react.createElement("i",{className:"fas fa-times"}))):null),react.createElement("br",null),imgSrc?react.createElement("img",{src:imgSrc,alt:"Logo",style:{height:"250px",width:"auto"}}):null)};class AdminSettingsBranding extends react.Component{constructor(props){super(props)}render(){const{admin,uploadLogo,updateSettings,user,t}=this.props,settings=admin.settings;return react.createElement(react.Fragment,null,react.createElement("div",{className:"admin-settings-outer-container"},react.createElement(visible_barrier.Z,null,react.createElement(Container_default(),{style:{float:"left"}},react.createElement(Row_default(),null,react.createElement(Col.default,{sm:2},react.createElement("h3",null,t("logo"))),react.createElement(Col.default,{sm:10},settings.brandingLogo?react.createElement(Branding,{name:"brandingLogo",logoPath:settings.brandingLogo,updateSettings,t}):react.createElement(BrandingFileUpload,{name:"brandingLogo",t,user,uploadLogo}),react.createElement("p",null,t("logo-description")))),react.createElement("hr",null),react.createElement(Row_default(),null,react.createElement(Col.default,{sm:2},react.createElement("h3",null,t("small-logo"))),react.createElement(Col.default,{sm:10},settings.brandingSmallLogo?react.createElement(Branding,{name:"brandingSmallLogo",logoPath:settings.brandingSmallLogo,updateSettings,t}):react.createElement(BrandingFileUpload,{name:"brandingSmallLogo",t,user,uploadLogo}),react.createElement("p",null,"A small version of the logo to be displayed in the header bar of the ISLE dashboard.")))))))}}AdminSettingsBranding.propTypes={admin:prop_types_default().object.isRequired,updateSettings:prop_types_default().func.isRequired,uploadLogo:prop_types_default().func.isRequired,user:prop_types_default().object.isRequired},AdminSettingsBranding.defaultProps={};var main=(0,commonjs.Zh)("admin_settings")(AdminSettingsBranding)},42432:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return visible_barrier}});var lib=__webpack_require__(37424),react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),commonjs=__webpack_require__(81468);const LicenseBarrier=({admin,user,children})=>{const{t}=(0,commonjs.$G)("common");return!user.licensed&&(!admin.license||!admin.license.valid)?react.createElement("div",{className:"jumbotron",style:{width:"100%",height:"73.7%"}},react.createElement("h3",{style:{textAlign:"center",marginTop:"12%"}},t("not-available-in-community-edition"))):children};LicenseBarrier.propTypes={admin:prop_types_default().object,user:prop_types_default().object},LicenseBarrier.defaultProps={admin:null,user:null};var barrier=LicenseBarrier;function mapStateToProps(state){return{admin:state.admin,user:state.user}}function mapDispatchToProps(){return{}}var visible_barrier=(0,lib.connect)(mapStateToProps,mapDispatchToProps)(barrier)},86100:function(module,exports,__webpack_require__){var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_ThemeProvider=__webpack_require__(3349),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const defaultProps={bg:"primary",pill:!1},Badge=React.forwardRef((_a,ref)=>{var _b=_a,{bsPrefix,bg,pill,text,className,as:Component="span"}=_b,props=__objRest(_b,["bsPrefix","bg","pill","text","className","as"]);const prefix=(0,_ThemeProvider.useBootstrapPrefix)(bsPrefix,"badge");return(0,_jsxRuntime.jsx)(Component,__spreadProps(__spreadValues({ref},props),{className:(0,_classnames.default)(className,prefix,pill&&"rounded-pill",text&&`text-${text}`,bg&&`bg-${bg}`)}))});Badge.displayName="Badge",Badge.defaultProps=defaultProps;var _default=Badge;exports.default=_default,module.exports=exports.default},70448:function(module,exports,__webpack_require__){var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_ThemeProvider=__webpack_require__(3349),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const defaultProps={fluid:!1},Container=React.forwardRef((_a,ref)=>{var _b=_a,{bsPrefix,fluid,as:Component="div",className}=_b,props=__objRest(_b,["bsPrefix","fluid","as","className"]);const prefix=(0,_ThemeProvider.useBootstrapPrefix)(bsPrefix,"container"),suffix=typeof fluid=="string"?`-${fluid}`:"-fluid";return(0,_jsxRuntime.jsx)(Component,__spreadProps(__spreadValues({ref},props),{className:(0,_classnames.default)(className,fluid?`${prefix}${suffix}`:prefix)}))});Container.displayName="Container",Container.defaultProps=defaultProps;var _default=Container;exports.default=_default,module.exports=exports.default},28269:function(module,exports,__webpack_require__){var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_ThemeProvider=__webpack_require__(3349),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const Row=React.forwardRef((_a,ref)=>{var _b=_a,{bsPrefix,className,as:Component="div"}=_b,props=__objRest(_b,["bsPrefix","className","as"]);const decoratedBsPrefix=(0,_ThemeProvider.useBootstrapPrefix)(bsPrefix,"row"),breakpoints=(0,_ThemeProvider.useBootstrapBreakpoints)(),sizePrefix=`${decoratedBsPrefix}-cols`,classes=[];return breakpoints.forEach(brkPoint=>{const propValue=props[brkPoint];delete props[brkPoint];let cols;propValue!=null&&typeof propValue=="object"?{cols}=propValue:cols=propValue;const infix=brkPoint!=="xs"?`-${brkPoint}`:"";cols!=null&&classes.push(`${sizePrefix}${infix}-${cols}`)}),(0,_jsxRuntime.jsx)(Component,__spreadProps(__spreadValues({ref},props),{className:(0,_classnames.default)(className,decoratedBsPrefix,...classes)}))});Row.displayName="Row";var _default=Row;exports.default=_default,module.exports=exports.default}}]);

//# sourceMappingURL=1254.86fd97c5.chunk.js.map