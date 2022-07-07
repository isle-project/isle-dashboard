"use strict";var __defProp=Object.defineProperty,__defProps=Object.defineProperties;var __getOwnPropDescs=Object.getOwnPropertyDescriptors;var __getOwnPropSymbols=Object.getOwnPropertySymbols;var __hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable;var __defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a},__spreadProps=(a,b)=>__defProps(a,__getOwnPropDescs(b));var __objRest=(source,exclude)=>{var target={};for(var prop in source)__hasOwnProp.call(source,prop)&&exclude.indexOf(prop)<0&&(target[prop]=source[prop]);if(source!=null&&__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(source))exclude.indexOf(prop)<0&&__propIsEnum.call(source,prop)&&(target[prop]=source[prop]);return target};(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[2025],{87925:function(module,__unused_webpack_exports,__webpack_require__){var isNegativeZero=__webpack_require__(29552);module.exports=isNegativeZero},29552:function(module,__unused_webpack_exports,__webpack_require__){var NINF=__webpack_require__(58747);function isNegativeZero(x){return x===0&&1/x===NINF}module.exports=isNegativeZero},27813:function(module,__unused_webpack_exports,__webpack_require__){var min=__webpack_require__(2328);module.exports=min},2328:function(module,__unused_webpack_exports,__webpack_require__){var isNegativeZero=__webpack_require__(87925),isnan=__webpack_require__(64529),NINF=__webpack_require__(58747),PINF=__webpack_require__(51235);function min(x,y){var len,m,v,i;if(len=arguments.length,len===2)return isnan(x)||isnan(y)?NaN:x===NINF||y===NINF?NINF:x===y&&x===0?isNegativeZero(x)?x:y:x<y?x:y;for(m=PINF,i=0;i<len;i++){if(v=arguments[i],isnan(v)||v===NINF)return v;(v<m||v===m&&v===0&&isNegativeZero(v))&&(m=v)}return m}module.exports=min},23218:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Ib:function(){return changedNamespace},J3:function(){return updateCurrentNamespaceInjector},Ll:function(){return createNamespaceInjector},Tm:function(){return adjustProgressInjector},Vw:function(){return setLessonOrderInjector},hA:function(){return getAllNamespacesInjector},kC:function(){return deleteCurrentNamespaceInjector},qw:function(){return getNamespaceActionsInjector}});var axios__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(9669),axios__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__),querystring__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(17673),i18next__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(41631),utils_file_saver_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(19446),constants_server__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(94204),actions_notification__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(16120),actions_cohort__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(72371),constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(84499),__async=(__this,__arguments,generator)=>new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}},rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}},step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())});function appendCreatedNamespace(namespace){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.$8,payload:{namespace}}}function changedNamespace({title,owners,announcements=[],cohorts=[],description,enableTicketing,_id,completions}){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.WF,payload:{title,announcements,cohorts,description,enableTicketing,owners,completions,_id}}}function deletedCurrentNamespace(id){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.ke,payload:{id}}}function updateStudentProgress({email,lessonID,progress,cohort}){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.LX,payload:{email,lessonID,progress,cohort}}}function updatedOwnedNamespace({title,owners,description,enableTicketing,_id}){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.Rg,payload:{title,description,owners,enableTicketing,_id}}}const createNamespace=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{title,description,owners,props}){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/create_namespace",{title,description,owners});if(!res.data.successful)return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,new Error(res.data.message));const namespace=res.data.namespace;props.onNamespace(namespace),dispatch(appendCreatedNamespace(namespace)),window.location.replace("/dashboard/lessons"),(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{message:res.data.message,level:res.data.successful?"success":"error"})}catch(err){(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),createNamespaceInjector=dispatch=>_0=>__async(void 0,[_0],function*({title,description,owners,props}){yield createNamespace(dispatch,{title,description,owners,props})}),deleteCurrentNamespace=(dispatch,id)=>__async(void 0,null,function*(){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/delete_namespace",{id});window.location.replace("/dashboard/lessons"),dispatch(deletedCurrentNamespace(id)),(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{message:res.data.message,level:"success"})}catch(err){return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),deleteCurrentNamespaceInjector=dispatch=>id=>__async(void 0,null,function*(){yield deleteCurrentNamespace(dispatch,id)}),updateCurrentNamespace=(dispatch,ns)=>__async(void 0,null,function*(){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/update_namespace",{ns});dispatch(changedNamespace(res.data.namespace)),dispatch(updatedOwnedNamespace(res.data.namespace)),(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{message:res.data.message,level:"success"}),(0,actions_cohort__WEBPACK_IMPORTED_MODULE_5__.k$)(dispatch,{namespaceID:ns._id})}catch(err){(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),updateCurrentNamespaceInjector=dispatch=>(id,ns)=>__async(void 0,null,function*(){yield updateCurrentNamespace(dispatch,id,ns)}),getNamespaceActions=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{namespaceID,namespaceTitle}){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().get(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/get_namespace_actions?"+querystring__WEBPACK_IMPORTED_MODULE_1__.stringify({namespaceID})),blob=new Blob([res.data],{type:"application/json"}),name=`actions_${namespaceTitle}.json`;(0,utils_file_saver_js__WEBPACK_IMPORTED_MODULE_3__.Z)(blob,name)}catch(err){(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),getNamespaceActionsInjector=dispatch=>_0=>__async(void 0,[_0],function*({namespaceID,namespaceTitle}){yield getNamespaceActions(dispatch,{namespaceID,namespaceTitle})}),adjustProgress=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{email,lessonID,namespaceID,progress,cohort}){const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/user_adjust_progress",{email,lessonID,namespaceID,progress});(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{title:i18next__WEBPACK_IMPORTED_MODULE_2__.ZP.t("common:updated"),message:res.data.message,level:"success"}),dispatch(updateStudentProgress({email,lessonID,progress,cohort}))}),adjustProgressInjector=dispatch=>_0=>__async(void 0,[_0],function*({email,lessonID,namespaceID,progress,cohort}){yield adjustProgress(dispatch,{email,lessonID,namespaceID,progress,cohort})}),getAllNamespaces=dispatch=>__async(void 0,null,function*(){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().get(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/get_all_namespaces");dispatch({type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.XM,payload:{namespaces:res.data.namespaces}})}catch(err){return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),getAllNamespacesInjector=dispatch=>()=>__async(void 0,null,function*(){yield getAllNamespaces(dispatch)}),setLessonOrder=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{lessons,id}){try{yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/set_lesson_order",{lessons,id})}catch(err){return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),setLessonOrderInjector=dispatch=>_0=>__async(void 0,[_0],function*({lessons,id}){yield setLessonOrder(dispatch,{lessons,id})})},19446:function(__unused_webpack_module,__webpack_exports__){const RE_AUTO_BOM=/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i;function click(node){const event=new MouseEvent("click");node.dispatchEvent(event)}function throwOutside(ex){setImmediate(function(){throw ex},0)}function autoBOM(blob){return RE_AUTO_BOM.test(blob.type)?new Blob([String.fromCharCode(65279),blob],{type:blob.type}):blob}function dispatch(filesaver,eventTypes,event){eventTypes=[].concat(eventTypes);let i=eventTypes.length;for(;i--;){let listener=filesaver["on"+eventTypes[i]];if(typeof listener=="function")try{listener.call(filesaver,event||filesaver)}catch(ex){throwOutside(ex)}}}function saveFactory(view){if(typeof view=="undefined"||typeof navigator!="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent))return;const doc=view.document;function getURL(){return view.URL||view.webkitURL||view}function revoke(file){function revoker(){typeof file=="string"?getURL().revokeObjectURL(file):file.remove()}setTimeout(revoker,4e4)}const saveLink=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),canUseSaveLink="download"in saveLink,isSafari=/constructor/i.test(view.HTMLElement)||view.safari,isChromeIOS=/CriOS\/[\d]+/.test(navigator.userAgent),setImmediate2=view.setImmediate||view.setTimeout,forceSavableType="application/octet-stream";function FileSaver(blob,name,noAutoBOM){noAutoBOM||(blob=autoBOM(blob));const self2=this,force=blob.type===forceSavableType;let objectURL;function dispatchAll(){dispatch(self2,"writestart progress write writeend".split(" "))}function fsError(){if((isChromeIOS||force&&isSafari)&&view.FileReader){const reader=new FileReader;reader.onloadend=function(){let url=isChromeIOS?reader.result:reader.result.replace(/^data:[^;]*;/,"data:attachment/file;");view.open(url,"_blank")||(view.location.href=url),url=void 0,self2.readyState=self2.DONE,dispatchAll()},reader.readAsDataURL(blob),self2.readyState=self2.INIT;return}objectURL||(objectURL=getURL().createObjectURL(blob)),force?view.location.href=objectURL:view.open(objectURL,"_blank")||(view.location.href=objectURL),self2.readyState=self2.DONE,dispatchAll(),revoke(objectURL)}if(self2.readyState=self2.INIT,canUseSaveLink){objectURL=getURL().createObjectURL(blob),setImmediate2(function(){saveLink.href=objectURL,saveLink.download=name,click(saveLink),dispatchAll(),revoke(objectURL),self2.readyState=self2.DONE},0);return}fsError()}const proto=FileSaver.prototype;function saveAs2(blob,name,noAutoBOM){return new FileSaver(blob,name||blob.name||"download",noAutoBOM)}return typeof navigator!="undefined"&&navigator.msSaveOrOpenBlob?function(blob,name,noAutoBOM){return name=name||blob.name||"download",noAutoBOM||(blob=autoBOM(blob)),navigator.msSaveOrOpenBlob(blob,name)}:(proto.abort=function(){},proto.readyState=proto.INIT=0,proto.WRITING=1,proto.DONE=2,proto.error=null,proto.onwritestart=null,proto.onprogress=null,proto.onwrite=null,proto.onabort=null,proto.onerror=null,proto.onwriteend=null,saveAs2)}const saveAs=saveFactory(typeof self!="undefined"&&self||typeof window!="undefined"&&window||(void 0).content);__webpack_exports__.Z=saveAs},82082:function(module,exports,__webpack_require__){var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_ThemeProvider=__webpack_require__(3349),_ElementChildren=__webpack_require__(43269),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const ROUND_PRECISION=1e3;function onlyProgressBar(props,propName,componentName){const children=props[propName];if(!children)return null;let error=null;return React.Children.forEach(children,child=>{if(error)return;const element=(0,_jsxRuntime.jsx)(ProgressBar,{});if(child.type===element.type)return;const childType=child.type,childIdentifier=React.isValidElement(child)?childType.displayName||childType.name||childType:child;error=new Error(`Children of ${componentName} can contain only ProgressBar components. Found ${childIdentifier}.`)}),error}const defaultProps={min:0,max:100,animated:!1,isChild:!1,visuallyHidden:!1,striped:!1};function getPercentage(now,min,max){const percentage=(now-min)/(max-min)*100;return Math.round(percentage*ROUND_PRECISION)/ROUND_PRECISION}function renderProgressBar(_a,ref){var _b=_a,{min,now,max,label,visuallyHidden,striped,animated,className,style,variant,bsPrefix}=_b,props=__objRest(_b,["min","now","max","label","visuallyHidden","striped","animated","className","style","variant","bsPrefix"]);return(0,_jsxRuntime.jsx)("div",__spreadProps(__spreadValues({ref},props),{role:"progressbar",className:(0,_classnames.default)(className,`${bsPrefix}-bar`,{[`bg-${variant}`]:variant,[`${bsPrefix}-bar-animated`]:animated,[`${bsPrefix}-bar-striped`]:animated||striped}),style:__spreadValues({width:`${getPercentage(now,min,max)}%`},style),"aria-valuenow":now,"aria-valuemin":min,"aria-valuemax":max,children:visuallyHidden?(0,_jsxRuntime.jsx)("span",{className:"visually-hidden",children:label}):label}))}const ProgressBar=React.forwardRef((_c,ref)=>{var _d=_c,{isChild}=_d,props=__objRest(_d,["isChild"]);if(props.bsPrefix=(0,_ThemeProvider.useBootstrapPrefix)(props.bsPrefix,"progress"),isChild)return renderProgressBar(props,ref);const _a=props,{min,now,max,label,visuallyHidden,striped,animated,bsPrefix,variant,className,children}=_a,wrapperProps=__objRest(_a,["min","now","max","label","visuallyHidden","striped","animated","bsPrefix","variant","className","children"]);return(0,_jsxRuntime.jsx)("div",__spreadProps(__spreadValues({ref},wrapperProps),{className:(0,_classnames.default)(className,bsPrefix),children:children?(0,_ElementChildren.map)(children,child=>(0,React.cloneElement)(child,{isChild:!0})):renderProgressBar({min,now,max,label,visuallyHidden,striped,animated,bsPrefix,variant},ref)}))});ProgressBar.displayName="ProgressBar",ProgressBar.defaultProps=defaultProps;var _default=ProgressBar;exports.default=_default,module.exports=exports.default}}]);

//# sourceMappingURL=2025.9b6dd77a.chunk.js.map