var __defProp=Object.defineProperty,__defProps=Object.defineProperties;var __getOwnPropDescs=Object.getOwnPropertyDescriptors;var __getOwnPropSymbols=Object.getOwnPropertySymbols;var __hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable;var __defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a},__spreadProps=(a,b)=>__defProps(a,__getOwnPropDescs(b));var __objRest=(source,exclude)=>{var target={};for(var prop in source)__hasOwnProp.call(source,prop)&&exclude.indexOf(prop)<0&&(target[prop]=source[prop]);if(source!=null&&__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(source))exclude.indexOf(prop)<0&&__propIsEnum.call(source,prop)&&(target[prop]=source[prop]);return target};var __async=(__this,__arguments,generator)=>new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}},rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}},step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())});(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[9296],{11738:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var isEmail=__webpack_require__(29055);module.exports=isEmail},29055:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var isString=__webpack_require__(99301).isPrimitive,RE=/@/;function isEmail(value){return isString(value)&&RE.test(value)}module.exports=isEmail},29239:function(module){"use strict";var exec=RegExp.prototype.exec;module.exports=exec},9180:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var isRegExp=__webpack_require__(51038);module.exports=isRegExp},51038:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var hasToStringTag=__webpack_require__(44627),nativeClass=__webpack_require__(19021),test=__webpack_require__(95979),FLG=hasToStringTag();function isRegExp(value){return typeof value=="object"?value instanceof RegExp?!0:FLG?test(value):nativeClass(value)==="[object RegExp]":!1}module.exports=isRegExp},95979:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var exec=__webpack_require__(29239);function test(value){try{return exec.call(value),!0}catch(err){return!1}}module.exports=test},51594:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var replace=__webpack_require__(75011);module.exports=replace},75011:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var rescape=__webpack_require__(5481),isFunction=__webpack_require__(5726),isString=__webpack_require__(99301).isPrimitive,isRegExp=__webpack_require__(9180);function replace(str,search,newval){if(!isString(str))throw new TypeError("invalid argument. First argument must be a string primitive. Value: `"+str+"`.");if(isString(search))search=rescape(search),search=new RegExp(search,"g");else if(!isRegExp(search))throw new TypeError("invalid argument. Second argument must be a string primitive or regular expression. Value: `"+search+"`.");if(!isString(newval)&&!isFunction(newval))throw new TypeError("invalid argument. Third argument must be a string primitive or replacement function. Value: `"+newval+"`.");return str.replace(search,newval)}module.exports=replace},5481:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var rescape=__webpack_require__(90382);module.exports=rescape},90382:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var isString=__webpack_require__(99301).isPrimitive,RE_CHARS=/[-\/\\^$*+?.()|[\]{}]/g;function rescape(str){var len,s,i;if(!isString(str))throw new TypeError("invalid argument. Must provide a regular expression string. Value: `"+str+"`.");if(str[0]==="/")for(len=str.length,i=len-1;i>=0&&str[i]!=="/";i--);return i===void 0||i<=0?str.replace(RE_CHARS,"\\$&"):(s=str.substring(1,i),s=s.replace(RE_CHARS,"\\$&"),str=str[0]+s+str.substring(i),str)}module.exports=rescape},66485:function(module){module.exports=clipboardCopy;function makeError(){return new DOMException("The request is not allowed","NotAllowedError")}function copyClipboardApi(text){return __async(this,null,function*(){if(!navigator.clipboard)throw makeError();return navigator.clipboard.writeText(text)})}function copyExecCommand(text){return __async(this,null,function*(){const span=document.createElement("span");span.textContent=text,span.style.whiteSpace="pre",span.style.webkitUserSelect="auto",span.style.userSelect="all",document.body.appendChild(span);const selection=window.getSelection(),range=window.document.createRange();selection.removeAllRanges(),range.selectNode(span),selection.addRange(range);let success=!1;try{success=window.document.execCommand("copy")}finally{selection.removeAllRanges(),window.document.body.removeChild(span)}if(!success)throw makeError()})}function clipboardCopy(text){return __async(this,null,function*(){try{yield copyClipboardApi(text)}catch(err){try{yield copyExecCommand(text)}catch(err2){throw err2||err||makeError()}}})}},17346:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(37424),react_redux__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__),components_create_namespace__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(29724),actions_namespace__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(23218),actions_notification__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(16120),actions_lesson__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(36189);function mapStateToProps(state){return{user:state.user}}function mapDispatchToProps(dispatch){return{createNamespace:(0,actions_namespace__WEBPACK_IMPORTED_MODULE_3__.Ll)(dispatch),addNotification:(0,actions_notification__WEBPACK_IMPORTED_MODULE_5__.pP)(dispatch),onNamespace:({title,description,announcements,owners,enableTicketing,_id})=>{dispatch((0,actions_namespace__WEBPACK_IMPORTED_MODULE_3__.Ib)({title,description,announcements,enableTicketing,owners,_id})),dispatch((0,actions_lesson__WEBPACK_IMPORTED_MODULE_4__.ft)({lessons:[],namespaceName:title}))}}}const VisibleCreateNamespace=(0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps,mapDispatchToProps)(components_create_namespace__WEBPACK_IMPORTED_MODULE_2__.ZP);__webpack_exports__.default=VisibleCreateNamespace},51889:function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_ThemeProvider=__webpack_require__(3349),_createWithBsPrefix=_interopRequireDefault(__webpack_require__(20158)),_divWithClassName=_interopRequireDefault(__webpack_require__(3081)),_CardImg=_interopRequireDefault(__webpack_require__(87550)),_CardHeader=_interopRequireDefault(__webpack_require__(6003)),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const DivStyledAsH5=(0,_divWithClassName.default)("h5"),DivStyledAsH6=(0,_divWithClassName.default)("h6"),CardBody=(0,_createWithBsPrefix.default)("card-body"),CardTitle=(0,_createWithBsPrefix.default)("card-title",{Component:DivStyledAsH5}),CardSubtitle=(0,_createWithBsPrefix.default)("card-subtitle",{Component:DivStyledAsH6}),CardLink=(0,_createWithBsPrefix.default)("card-link",{Component:"a"}),CardText=(0,_createWithBsPrefix.default)("card-text",{Component:"p"}),CardFooter=(0,_createWithBsPrefix.default)("card-footer"),CardImgOverlay=(0,_createWithBsPrefix.default)("card-img-overlay"),defaultProps={body:!1},Card=React.forwardRef((_a,ref)=>{var _b=_a,{bsPrefix,className,bg,text,border,body,children,as:Component="div"}=_b,props=__objRest(_b,["bsPrefix","className","bg","text","border","body","children","as"]);const prefix=(0,_ThemeProvider.useBootstrapPrefix)(bsPrefix,"card");return(0,_jsxRuntime.jsx)(Component,__spreadProps(__spreadValues({ref},props),{className:(0,_classnames.default)(className,prefix,bg&&`bg-${bg}`,text&&`text-${text}`,border&&`border-${border}`),children:body?(0,_jsxRuntime.jsx)(CardBody,{children}):children}))});Card.displayName="Card",Card.defaultProps=defaultProps;var _default=Object.assign(Card,{Img:_CardImg.default,Title:CardTitle,Subtitle:CardSubtitle,Body:CardBody,Link:CardLink,Text:CardText,Header:_CardHeader.default,Footer:CardFooter,ImgOverlay:CardImgOverlay});exports.default=_default,module.exports=exports.default},6003:function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_ThemeProvider=__webpack_require__(3349),_CardHeaderContext=_interopRequireDefault(__webpack_require__(88296)),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const CardHeader=React.forwardRef((_a,ref)=>{var _b=_a,{bsPrefix,className,as:Component="div"}=_b,props=__objRest(_b,["bsPrefix","className","as"]);const prefix=(0,_ThemeProvider.useBootstrapPrefix)(bsPrefix,"card-header"),contextValue=(0,React.useMemo)(()=>({cardHeaderBsPrefix:prefix}),[prefix]);return(0,_jsxRuntime.jsx)(_CardHeaderContext.default.Provider,{value:contextValue,children:(0,_jsxRuntime.jsx)(Component,__spreadProps(__spreadValues({ref},props),{className:(0,_classnames.default)(className,prefix)}))})});CardHeader.displayName="CardHeader";var _default=CardHeader;exports.default=_default,module.exports=exports.default},88296:function(module,exports,__webpack_require__){"use strict";exports.__esModule=!0,exports.default=void 0;var React=_interopRequireWildcard(__webpack_require__(67294));function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const context=React.createContext(null);context.displayName="CardHeaderContext";var _default=context;exports.default=_default,module.exports=exports.default},87550:function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_ThemeProvider=__webpack_require__(3349),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const CardImg=React.forwardRef((_a,ref)=>{var _b=_a,{bsPrefix,className,variant,as:Component="img"}=_b,props=__objRest(_b,["bsPrefix","className","variant","as"]);const prefix=(0,_ThemeProvider.useBootstrapPrefix)(bsPrefix,"card-img");return(0,_jsxRuntime.jsx)(Component,__spreadValues({ref,className:(0,_classnames.default)(variant?`${prefix}-${variant}`:prefix,className)},props))});CardImg.displayName="CardImg";var _default=CardImg;exports.default=_default,module.exports=exports.default}}]);

//# sourceMappingURL=9296.df9c3b1e.chunk.js.map