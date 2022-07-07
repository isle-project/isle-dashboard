"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[8498],{23218:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Ib:function(){return changedNamespace},J3:function(){return updateCurrentNamespaceInjector},Ll:function(){return createNamespaceInjector},Tm:function(){return adjustProgressInjector},Vw:function(){return setLessonOrderInjector},hA:function(){return getAllNamespacesInjector},kC:function(){return deleteCurrentNamespaceInjector},qw:function(){return getNamespaceActionsInjector}});var axios__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(9669),axios__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__),querystring__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(17673),i18next__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(41631),utils_file_saver_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(19446),constants_server__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(94204),actions_notification__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(16120),actions_cohort__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(72371),constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(84499),__async=(__this,__arguments,generator)=>new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}},rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}},step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())});function appendCreatedNamespace(namespace){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.$8,payload:{namespace}}}function changedNamespace({title,owners,announcements=[],cohorts=[],description,enableTicketing,_id,completions}){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.WF,payload:{title,announcements,cohorts,description,enableTicketing,owners,completions,_id}}}function deletedCurrentNamespace(id){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.ke,payload:{id}}}function updateStudentProgress({email,lessonID,progress,cohort}){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.LX,payload:{email,lessonID,progress,cohort}}}function updatedOwnedNamespace({title,owners,description,enableTicketing,_id}){return{type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.Rg,payload:{title,description,owners,enableTicketing,_id}}}const createNamespace=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{title,description,owners,props}){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/create_namespace",{title,description,owners});if(!res.data.successful)return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,new Error(res.data.message));const namespace=res.data.namespace;props.onNamespace(namespace),dispatch(appendCreatedNamespace(namespace)),window.location.replace("/dashboard/lessons"),(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{message:res.data.message,level:res.data.successful?"success":"error"})}catch(err){(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),createNamespaceInjector=dispatch=>_0=>__async(void 0,[_0],function*({title,description,owners,props}){yield createNamespace(dispatch,{title,description,owners,props})}),deleteCurrentNamespace=(dispatch,id)=>__async(void 0,null,function*(){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/delete_namespace",{id});window.location.replace("/dashboard/lessons"),dispatch(deletedCurrentNamespace(id)),(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{message:res.data.message,level:"success"})}catch(err){return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),deleteCurrentNamespaceInjector=dispatch=>id=>__async(void 0,null,function*(){yield deleteCurrentNamespace(dispatch,id)}),updateCurrentNamespace=(dispatch,ns)=>__async(void 0,null,function*(){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/update_namespace",{ns});dispatch(changedNamespace(res.data.namespace)),dispatch(updatedOwnedNamespace(res.data.namespace)),(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{message:res.data.message,level:"success"}),(0,actions_cohort__WEBPACK_IMPORTED_MODULE_5__.k$)(dispatch,{namespaceID:ns._id})}catch(err){(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),updateCurrentNamespaceInjector=dispatch=>(id,ns)=>__async(void 0,null,function*(){yield updateCurrentNamespace(dispatch,id,ns)}),getNamespaceActions=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{namespaceID,namespaceTitle}){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().get(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/get_namespace_actions?"+querystring__WEBPACK_IMPORTED_MODULE_1__.stringify({namespaceID})),blob=new Blob([res.data],{type:"application/json"}),name=`actions_${namespaceTitle}.json`;(0,utils_file_saver_js__WEBPACK_IMPORTED_MODULE_3__.Z)(blob,name)}catch(err){(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),getNamespaceActionsInjector=dispatch=>_0=>__async(void 0,[_0],function*({namespaceID,namespaceTitle}){yield getNamespaceActions(dispatch,{namespaceID,namespaceTitle})}),adjustProgress=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{email,lessonID,namespaceID,progress,cohort}){const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/user_adjust_progress",{email,lessonID,namespaceID,progress});(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.wN)(dispatch,{title:i18next__WEBPACK_IMPORTED_MODULE_2__.ZP.t("common:updated"),message:res.data.message,level:"success"}),dispatch(updateStudentProgress({email,lessonID,progress,cohort}))}),adjustProgressInjector=dispatch=>_0=>__async(void 0,[_0],function*({email,lessonID,namespaceID,progress,cohort}){yield adjustProgress(dispatch,{email,lessonID,namespaceID,progress,cohort})}),getAllNamespaces=dispatch=>__async(void 0,null,function*(){try{const res=yield axios__WEBPACK_IMPORTED_MODULE_0___default().get(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/get_all_namespaces");dispatch({type:constants_action_types_js__WEBPACK_IMPORTED_MODULE_6__.XM,payload:{namespaces:res.data.namespaces}})}catch(err){return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),getAllNamespacesInjector=dispatch=>()=>__async(void 0,null,function*(){yield getAllNamespaces(dispatch)}),setLessonOrder=(_0,_1)=>__async(void 0,[_0,_1],function*(dispatch,{lessons,id}){try{yield axios__WEBPACK_IMPORTED_MODULE_0___default().post(constants_server__WEBPACK_IMPORTED_MODULE_4__.ZP+"/set_lesson_order",{lessons,id})}catch(err){return(0,actions_notification__WEBPACK_IMPORTED_MODULE_7__.EG)(dispatch,err)}}),setLessonOrderInjector=dispatch=>_0=>__async(void 0,[_0],function*({lessons,id}){yield setLessonOrder(dispatch,{lessons,id})})},29724:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{ZP:function(){return create_namespace},O5:function(){return validateDescription},OT:function(){return validateOwners},uq:function(){return validateTitle}});var react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),commonjs=__webpack_require__(81468),Button=__webpack_require__(89876),Button_default=__webpack_require__.n(Button),Card=__webpack_require__(51889),Card_default=__webpack_require__.n(Card),FormLabel=__webpack_require__(65903),FormLabel_default=__webpack_require__.n(FormLabel),FormControl=__webpack_require__(26199),FormControl_default=__webpack_require__.n(FormControl),FormGroup=__webpack_require__(34168),FormGroup_default=__webpack_require__.n(FormGroup),Form=__webpack_require__(17383),Form_default=__webpack_require__.n(Form),OverlayTrigger=__webpack_require__(99201),OverlayTrigger_default=__webpack_require__.n(OverlayTrigger),Tooltip=__webpack_require__(18868),Tooltip_default=__webpack_require__.n(Tooltip),browser=__webpack_require__(11227),browser_default=__webpack_require__.n(browser),lib=__webpack_require__(11738),lib_default=__webpack_require__.n(lib),trim_lib=__webpack_require__(87594),trim_lib_default=__webpack_require__.n(trim_lib),contains_lib=__webpack_require__(61635),contains_lib_default=__webpack_require__.n(contains_lib),text_select=__webpack_require__(70264),server=__webpack_require__(94204),check_url_path=__webpack_require__(48297);const debug=browser_default()("isle-dashboard:create-namespace");function validateOwners(owners){let invalid=!1;return owners.length===0?invalid=!0:owners.forEach(owner=>{lib_default()(owner)||(invalid=!0)}),!invalid}function validateTitle(title){return title.length>=3&&!contains_lib_default()(title," ")&&!(0,check_url_path.Z)(title)}function validateDescription(description){return description.length>=3}const CreateNamespace=props=>{const[title,setTitle]=(0,react.useState)(""),[description,setDescription]=(0,react.useState)(""),[owners,setOwners]=(0,react.useState)([props.user.email]),{t}=(0,commonjs.$G)(["namespace","common"]),handleSubmit=()=>{props.createNamespace({title,description,owners,props})},handleOwnerChange=newValue=>{newValue||setOwners([]);const newOwners=newValue.map(x=>trim_lib_default()(x.value));setOwners(newOwners)},handleTitleChange=event=>{const value=event.target.value;setTitle(value)},handleDescriptionChange=event=>{const value=event.target.value;setDescription(value)},validTitle=validateTitle(title),invalidTitleChars=(0,check_url_path.Z)(title),validDescription=validateDescription(description),validOwners=validateOwners(owners);return debug("Validation status of input fields: "),debug(`Title: ${validTitle}`),debug(`Description: ${validDescription}`),debug(`Owners: ${validOwners}`),react.createElement("div",{className:"create-namespace-container"},react.createElement(Card_default(),{className:"create-namespace-card"},react.createElement(Card_default().Header,null,react.createElement(Card_default().Title,{as:"h2"},t("create-course"))),react.createElement(Form_default(),{style:{padding:"20px"}},react.createElement(OverlayTrigger_default(),{placement:"right",overlay:react.createElement(Tooltip_default(),{id:"ownerTooltip"},t("owner-tooltip"))},react.createElement(FormGroup_default(),{controlId:"form-owners"},react.createElement(FormLabel_default(),null,t("common:owners")),react.createElement(text_select.Z,{id:"owners-text-select",onChange:handleOwnerChange,defaultValue:owners,isInvalid:!validOwners,placeholder:t("enter-emails")}),react.createElement(FormControl_default().Feedback,{type:"invalid"},t("invalid-owners")))),react.createElement(OverlayTrigger_default(),{placement:"right",overlay:react.createElement(Tooltip_default(),{id:"courseTooltip"},t("accessible-at"),react.createElement("code",null,server.ZP+"/<course>/<lesson>"))},react.createElement(FormGroup_default(),{controlId:"form-course"},react.createElement(FormLabel_default(),null,t("common:course")),react.createElement(FormControl_default(),{name:"title",type:"text",placeholder:t("course-placeholder"),onChange:handleTitleChange,isInvalid:title&&!validTitle}),react.createElement(FormControl_default().Feedback,{type:"invalid"},invalidTitleChars?"Course identifier contains invalid character(s): "+invalidTitleChars[0]:"Course identifier must be at least three characters long and should not contain any spaces."))),react.createElement(OverlayTrigger_default(),{placement:"right",overlay:react.createElement(Tooltip_default(),{id:"titleTooltip"},t("title-tooltip"))},react.createElement(FormGroup_default(),{controlId:"form-description"},react.createElement(FormLabel_default(),null,t("title-description")),react.createElement(FormControl_default(),{name:"description",type:"text",placeholder:t("title-placeholder"),onChange:handleDescriptionChange,isInvalid:description&&!validDescription}),react.createElement(FormControl_default().Feedback,{type:"invalid"},t("invalid-description"))))),react.createElement(Button_default(),{variant:"success",onClick:handleSubmit,disabled:!validOwners||!validTitle||!validDescription,block:!0},t("common:create"))))};CreateNamespace.propTypes={createNamespace:prop_types_default().func.isRequired,user:prop_types_default().object.isRequired},CreateNamespace.defaultProps={};var create_namespace=CreateNamespace},70264:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return text_select}});var react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),commonjs=__webpack_require__(81468),clipboard_copy=__webpack_require__(66485),clipboard_copy_default=__webpack_require__.n(clipboard_copy),react_select_cjs=__webpack_require__(4665),react_select_cjs_prod=__webpack_require__(87583),Tooltip=__webpack_require__(18868),Tooltip_default=__webpack_require__.n(Tooltip),OverlayTrigger=__webpack_require__(99201),OverlayTrigger_default=__webpack_require__.n(OverlayTrigger),lib=__webpack_require__(90807),lib_default=__webpack_require__.n(lib),is_empty_string_lib=__webpack_require__(16897),is_empty_string_lib_default=__webpack_require__.n(is_empty_string_lib),contains_lib=__webpack_require__(61635),contains_lib_default=__webpack_require__.n(contains_lib),is_null_lib=__webpack_require__(95447),is_null_lib_default=__webpack_require__.n(is_null_lib),trim_lib=__webpack_require__(87594),trim_lib_default=__webpack_require__.n(trim_lib),__defProp=Object.defineProperty,__defProps=Object.defineProperties,__getOwnPropDescs=Object.getOwnPropertyDescriptors,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a},__spreadProps=(a,b)=>__defProps(a,__getOwnPropDescs(b)),__publicField=(obj,key,value)=>(__defNormalProp(obj,typeof key!="symbol"?key+"":key,value),value);const customStyles={clearIndicator:(provided,state)=>__spreadProps(__spreadValues({},provided),{cursor:"pointer"}),multiValueRemove:(provided,state)=>__spreadProps(__spreadValues({},provided),{cursor:"pointer"}),valueContainer:(provided,state)=>__spreadProps(__spreadValues({},provided),{cursor:"text"})},createOption=label=>({label,value:label}),toOptions=arr=>is_null_lib_default()(arr)?null:lib_default()(arr)&&arr[0].label&&arr[0].value?arr:arr.map(createOption);class TextSelect extends react.Component{constructor(props){super(props),__publicField(this,"handleChange",value=>{this.setState({value}),this.props.onChange(value)}),__publicField(this,"handleInputChange",(inputValue,action)=>{action.action==="menu-close"?this.addInputValues():action.action!=="input-blur"&&this.setState({inputValue})}),__publicField(this,"addInputValues",()=>{let{inputValue,value}=this.state;if(!inputValue)return null;contains_lib_default()(inputValue,",")?inputValue=inputValue.split(",").map(x=>trim_lib_default()(x)).filter(x=>!is_empty_string_lib_default()(x)):inputValue=[trim_lib_default()(inputValue)];let newValue;value?newValue=value.concat(inputValue.map(createOption)):newValue=inputValue.map(createOption),this.setState({inputValue:"",value:newValue},()=>{this.props.onChange(this.state.value)})}),__publicField(this,"handleKeyDown",event=>{switch(event.key){case"Enter":case"Tab":this.addInputValues()}}),this.state={inputValue:"",value:toOptions(props.defaultValue)}}componentDidUpdate(prevProps){this.props.defaultValue!==prevProps.defaultValue&&this.setState({value:toOptions(this.props.defaultValue)})}render(){const{inputValue,value}=this.state,isInvalid=this.props.isInvalid,control=(provided,state)=>{const out=__spreadValues({},provided);return state.isFocused&&isInvalid&&(out.boxShadow="0 0 0 0.2rem rgba(220,53,69,0.25)"),out.borderColor=isInvalid?"#dc3545":"#ddd",out["&:hover"]={borderColor:isInvalid?"#dc3545":"#ddd"},out},customComponents={DropdownIndicator:null,MultiValueLabel:props=>{const copyToClipboard=()=>{clipboard_copy_default()(props.data.label)};return react.createElement(OverlayTrigger_default(),{overlay:react.createElement(Tooltip_default(),{id:"copy_tooltip"},this.props.t("copy-tooltip")),placement:"bottom"},react.createElement("span",{role:"button",tabIndex:0,onClick:copyToClipboard,onKeyPress:copyToClipboard,className:"text-select-copy","aria-label":this.props.t("copy-tooltip")},react.createElement(react_select_cjs_prod.wx.MultiValueLabel,__spreadValues({},props))))}};return react.createElement(react_select_cjs.default,{inputId:this.props.id,components:customComponents,inputValue,isClearable:this.props.isClearable,isMulti:!0,menuIsOpen:!1,onChange:this.handleChange,onInputChange:this.handleInputChange,onKeyDown:this.handleKeyDown,placeholder:this.props.placeholder,value,styles:__spreadValues(__spreadProps(__spreadValues({},customStyles),{control}),this.props.styles),t:this.props.t})}}TextSelect.propTypes={defaultValue:prop_types_default().array,id:prop_types_default().string,isClearable:prop_types_default().bool,isInvalid:prop_types_default().bool,onChange:prop_types_default().func,placeholder:prop_types_default().string,styles:prop_types_default().object},TextSelect.defaultProps={defaultValue:[],id:null,isClearable:!1,isInvalid:!1,onChange(){},placeholder:"",styles:{}};var text_select=(0,commonjs.Zh)(["text_select","common"])(TextSelect)},48297:function(__unused_webpack_module,__webpack_exports__){const REGEXP_CHARS=/[‘“!#$%&+^<=>{}()[\]`]/;function checkURLPath(str){return str.match(REGEXP_CHARS)}__webpack_exports__.Z=checkURLPath},19446:function(__unused_webpack_module,__webpack_exports__){const RE_AUTO_BOM=/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i;function click(node){const event=new MouseEvent("click");node.dispatchEvent(event)}function throwOutside(ex){setImmediate(function(){throw ex},0)}function autoBOM(blob){return RE_AUTO_BOM.test(blob.type)?new Blob([String.fromCharCode(65279),blob],{type:blob.type}):blob}function dispatch(filesaver,eventTypes,event){eventTypes=[].concat(eventTypes);let i=eventTypes.length;for(;i--;){let listener=filesaver["on"+eventTypes[i]];if(typeof listener=="function")try{listener.call(filesaver,event||filesaver)}catch(ex){throwOutside(ex)}}}function saveFactory(view){if(typeof view=="undefined"||typeof navigator!="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent))return;const doc=view.document;function getURL(){return view.URL||view.webkitURL||view}function revoke(file){function revoker(){typeof file=="string"?getURL().revokeObjectURL(file):file.remove()}setTimeout(revoker,4e4)}const saveLink=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),canUseSaveLink="download"in saveLink,isSafari=/constructor/i.test(view.HTMLElement)||view.safari,isChromeIOS=/CriOS\/[\d]+/.test(navigator.userAgent),setImmediate2=view.setImmediate||view.setTimeout,forceSavableType="application/octet-stream";function FileSaver(blob,name,noAutoBOM){noAutoBOM||(blob=autoBOM(blob));const self2=this,force=blob.type===forceSavableType;let objectURL;function dispatchAll(){dispatch(self2,"writestart progress write writeend".split(" "))}function fsError(){if((isChromeIOS||force&&isSafari)&&view.FileReader){const reader=new FileReader;reader.onloadend=function(){let url=isChromeIOS?reader.result:reader.result.replace(/^data:[^;]*;/,"data:attachment/file;");view.open(url,"_blank")||(view.location.href=url),url=void 0,self2.readyState=self2.DONE,dispatchAll()},reader.readAsDataURL(blob),self2.readyState=self2.INIT;return}objectURL||(objectURL=getURL().createObjectURL(blob)),force?view.location.href=objectURL:view.open(objectURL,"_blank")||(view.location.href=objectURL),self2.readyState=self2.DONE,dispatchAll(),revoke(objectURL)}if(self2.readyState=self2.INIT,canUseSaveLink){objectURL=getURL().createObjectURL(blob),setImmediate2(function(){saveLink.href=objectURL,saveLink.download=name,click(saveLink),dispatchAll(),revoke(objectURL),self2.readyState=self2.DONE},0);return}fsError()}const proto=FileSaver.prototype;function saveAs2(blob,name,noAutoBOM){return new FileSaver(blob,name||blob.name||"download",noAutoBOM)}return typeof navigator!="undefined"&&navigator.msSaveOrOpenBlob?function(blob,name,noAutoBOM){return name=name||blob.name||"download",noAutoBOM||(blob=autoBOM(blob)),navigator.msSaveOrOpenBlob(blob,name)}:(proto.abort=function(){},proto.readyState=proto.INIT=0,proto.WRITING=1,proto.DONE=2,proto.error=null,proto.onwritestart=null,proto.onprogress=null,proto.onwrite=null,proto.onabort=null,proto.onerror=null,proto.onwriteend=null,saveAs2)}const saveAs=saveFactory(typeof self!="undefined"&&self||typeof window!="undefined"&&window||(void 0).content);__webpack_exports__.Z=saveAs}}]);

//# sourceMappingURL=8498.ebc1fb37.chunk.js.map