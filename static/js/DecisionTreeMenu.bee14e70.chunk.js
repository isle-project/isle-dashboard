"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[5501],{16400:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var _isle_project_components_internal_loadable__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(29209);const Collapse=(0,_isle_project_components_internal_loadable__WEBPACK_IMPORTED_MODULE_0__.Z)(()=>__webpack_require__.e(1438).then(__webpack_require__.bind(__webpack_require__,43225)));__webpack_exports__.Z=Collapse},18509:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_10__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(30276),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9__),react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(84420),react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_8__),uniq__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(38706),uniq__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(uniq__WEBPACK_IMPORTED_MODULE_1__),_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(57082),_isle_project_components_input_number__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(34136),_isle_project_components_collapse__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(16400),_isle_project_components_models_decision_tree__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(90257),_isle_project_constants_actions_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(67033),_question_button_js__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(97113);const DecisionTreeMenu=props=>{const{categorical,quantitative,t}=props,[y,setY]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),[x,setX]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),[type,setType]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("Classification"),[impurityMeasure,setImpurityMeasure]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("gini"),[scoreThreshold,setScoreThreshold]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(.0075),[maxTreeDepth,setMaxTreeDepth]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(5),[minItemsCount,setMinItemsCount]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(50),compute=()=>{const output=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_models_decision_tree__WEBPACK_IMPORTED_MODULE_5__.Z,{x,y,type,impurityMeasure,data:props.data,quantitative:props.quantitative,scoreThreshold,maxTreeDepth,minItemsCount,onPredict:props.onPredict});props.logAction(_isle_project_constants_actions_js__WEBPACK_IMPORTED_MODULE_7__.Ch,{y,x,type}),props.onCreated(output)};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_8___default(),{style:{fontSize:"14px",maxWidth:600}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_8___default().Header,{as:"h4"},t("Decision Tree"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_question_button_js__WEBPACK_IMPORTED_MODULE_6__.Z,{title:t("Decision Tree"),content:t("Decision Tree-description")})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_8___default().Body,{className:"d-grid gap-3"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("type"),options:["Classification","Regression"],defaultValue:type,onChange:newType=>{newType!==type&&(setType(newType),setY(newType==="Classification"?categorical[0]:quantitative[0]))}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("outcome-y"),options:type==="Classification"?categorical:quantitative,defaultValue:y,onChange:setY}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("predictors-x"),multi:!0,options:uniq__WEBPACK_IMPORTED_MODULE_1___default()(quantitative.concat(categorical)),defaultValue:x||"",onChange:setX,closeMenuOnSelect:!1}),type==="Classification"?react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("impurity-measure"),defaultValue:impurityMeasure,options:["gini","entropy"],onChange:setImpurityMeasure}):null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_collapse__WEBPACK_IMPORTED_MODULE_4__.Z,{header:t("change-tree-features"),headerStyle:{fontSize:"1rem"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_number__WEBPACK_IMPORTED_MODULE_3__.Z,{legend:t("score-threshold-for-split"),min:0,max:1,step:.001,defaultValue:scoreThreshold,onChange:setScoreThreshold}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_number__WEBPACK_IMPORTED_MODULE_3__.Z,{legend:t("maximum-tree-depth"),min:1,max:50,defaultValue:maxTreeDepth,onChange:setMaxTreeDepth}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_number__WEBPACK_IMPORTED_MODULE_3__.Z,{legend:t("min-obs-leafs"),min:1,defaultValue:minItemsCount,onChange:setMinItemsCount})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9___default(),{disabled:!x||x.length===0,variant:"primary",onClick:compute},t("calculate"))))};DecisionTreeMenu.defaultProps={logAction(){}},DecisionTreeMenu.propTypes={categorical:prop_types__WEBPACK_IMPORTED_MODULE_10___default().array.isRequired,quantitative:prop_types__WEBPACK_IMPORTED_MODULE_10___default().array.isRequired,data:prop_types__WEBPACK_IMPORTED_MODULE_10___default().object.isRequired,logAction:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func,onCreated:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,onPredict:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired},__webpack_exports__.default=DecisionTreeMenu},97113:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(30276),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5__),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(67883),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1__),react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4635),react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2__),react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(65498),react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3__),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(7848),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4__);const QuestionButton=props=>{const popover=react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1___default(),{id:"popover-positioned-right"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2___default(),null,props.title),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3___default(),null,props.content));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4___default(),{trigger:["click","hover","focus"],placement:"left",rootClose:!0,overlay:popover},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5___default(),{"aria-label":props.title,size:"sm",variant:"outline-secondary",className:"question-button"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"fa fa-question"})))};QuestionButton.propTypes={content:prop_types__WEBPACK_IMPORTED_MODULE_6___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_6___default().string,prop_types__WEBPACK_IMPORTED_MODULE_6___default().node]).isRequired,title:prop_types__WEBPACK_IMPORTED_MODULE_6___default().string.isRequired},__webpack_exports__.Z=QuestionButton},34136:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return number}});var react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),browser=__webpack_require__(14946),browser_default=__webpack_require__.n(browser),commonjs=__webpack_require__(81468),lib=__webpack_require__(61635),lib_default=__webpack_require__.n(lib),is_nan_lib=__webpack_require__(64529),is_nan_lib_default=__webpack_require__.n(is_nan_lib),is_string_lib=__webpack_require__(99301),is_null_lib=__webpack_require__(95447),is_null_lib_default=__webpack_require__.n(is_null_lib),is_number_lib=__webpack_require__(91317),pinf_lib=__webpack_require__(51235),pinf_lib_default=__webpack_require__.n(pinf_lib),ninf_lib=__webpack_require__(58747),ninf_lib_default=__webpack_require__.n(ninf_lib),components_tooltip=__webpack_require__(77287),context=__webpack_require__(32283),uid=__webpack_require__(6756);function createTooltip({min,max,step,t}){let tooltip=`${t("enter")} ${t(step===1?"integer":"number")} `;return max!==pinf_lib_default()&&min!==ninf_lib_default()?tooltip+=`${t("between")} ${min} ${t("and")} ${max}`:min!==ninf_lib_default()?tooltip+=`${t("larger-or-equal-to")} ${min}`:max!==pinf_lib_default()&&(tooltip+=`${t("smaller-or-equal-to")} ${max}`),tooltip}var create_tooltip=createTooltip,__defProp=Object.defineProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a};const debug=browser_default()("isle:number-input"),main_uid=(0,uid.Z)("number-input"),NumberInput=props=>{const id=(0,react.useRef)(props.id||main_uid(props)),{bind,defaultValue,min,max,step,value:propValue,onBlur,onChange}=props,{t}=(0,commonjs.$G)("input"),session=(0,react.useContext)(context.Z),[value,setValue]=(0,react.useState)(propValue||(bind&&session.state?session.state[bind]:defaultValue));(0,react.useEffect)(()=>{if(bind){const globalValue=__webpack_require__.g.lesson.state[bind];globalValue!==value&&(0,is_number_lib.isPrimitive)(value)&&setValue(globalValue)}},[bind,value]),(0,react.useEffect)(()=>{setValue(defaultValue)},[defaultValue]),(0,react.useEffect)(()=>{bind&&setValue(__webpack_require__.g.lesson.state[bind])},[bind]);const handleChange=(0,react.useCallback)(event=>{debug("Handle change of input field...");let valid=event.target.validity.valid,newValue=event.target.value;setValue(newValue),propValue||valid&&newValue!==""&&newValue!=="-"&&newValue!=="."&&newValue!=="-."?(newValue=parseFloat(newValue),is_nan_lib_default()(newValue)&&(newValue=""),onChange(newValue),bind&&__webpack_require__.g.lesson.setState({[bind]:newValue})):bind&&__webpack_require__.g.lesson.setState({[bind]:newValue})},[bind,propValue,onChange]),finishChange=(0,react.useCallback)(event=>{debug("Finished change...");let newValue=event.target.value;if(lib_default()(newValue,"/")){debug("Encountered a fraction...");const splitted=newValue.split("/");splitted[0]!==""&&splitted[1]!==""&&(newValue=parseFloat(splitted[0])/parseFloat(splitted[1]))}is_nan_lib_default()(newValue)?newValue="":newValue!==""&&newValue!=="-"&&newValue!=="."&&newValue!=="-."&&(newValue=parseFloat(newValue)),newValue>max?newValue=max:newValue<min?newValue=min:step===1&&newValue!==""&&newValue!=="-"&&newValue!=="."&&newValue!=="-."&&(newValue=newValue-newValue%step),onChange(newValue),onBlur(newValue),newValue!==value&&(setValue(newValue),bind&&__webpack_require__.g.lesson.setState({[bind]:newValue}))},[bind,min,max,step,value,onBlur,onChange]),tooltip=is_null_lib_default()(props.tooltip)?create_tooltip({min,max,step,t}):props.tooltip;if(props.inline===!0){const input2=react.createElement("span",{className:"input",style:__spreadValues({padding:"5px"},props.style)},props.legend?react.createElement("label",{htmlFor:id.current}," ",props.legend," =  "):null,react.createElement("input",{id:id.current,type:props.numbersOnly?"number":"text",name:"input",className:"number-number-input",disabled:props.disabled,value:propValue!==null?propValue:value,step:props.step,min:props.min,max:props.max,style:__spreadValues({width:"80px",paddingLeft:"6px",marginLeft:"3px"},props.inputStyle),onChange:handleChange,onBlur:finishChange,onKeyPress:props.onKeyPress,onKeyDown:props.onKeyDown,onKeyUp:props.onKeyUp,autoComplete:"off"}),props.description?react.createElement("span",null,"(",props.description,")"):react.createElement("span",null));return props.disabled?input2:react.createElement(components_tooltip.Z,{id:"number-input-tooltip-inline",placement:"top",show:!props.disabled,tooltip},input2)}const input=react.createElement("input",{id:id.current,type:props.numbersOnly?"number":"text",name:"input",className:"number-number-input",disabled:props.disabled,value:propValue!==null?propValue:value,step:props.step,min:props.min,max:props.max,style:__spreadValues({width:"80px",marginLeft:"24px"},props.inputStyle),onChange:handleChange,onBlur:finishChange,onKeyPress:props.onKeyPress,onKeyDown:props.onKeyDown,onKeyUp:props.onKeyUp,autoComplete:"off"});return react.createElement("div",{className:"input",style:__spreadValues({marginBottom:"4px",marginTop:"4px"},props.style)},props.legend?react.createElement("span",null,react.createElement("label",{htmlFor:id.current},(0,is_string_lib.isPrimitive)(props.legend)?props.legend+":":props.legend),props.description?react.createElement("span",null," ",props.description):null):null,react.createElement(components_tooltip.Z,{id:"number-input-tooltip",placement:props.tooltipPlacement,tooltip,show:!props.disabled},react.createElement("span",{className:"number-input-span"},input)))};NumberInput.defaultProps={bind:"",disabled:!1,legend:null,min:ninf_lib_default(),max:pinf_lib_default(),step:1,defaultValue:0,onBlur(){},onChange(){},onKeyDown(){},onKeyPress(){},onKeyUp(){},inline:!1,numbersOnly:!0,style:{},inputStyle:{},value:null,tooltip:null,tooltipPlacement:"left"},NumberInput.propTypes={bind:prop_types_default().string,defaultValue:prop_types_default().number,disabled:prop_types_default().bool,inline:prop_types_default().bool,legend:prop_types_default().oneOfType([prop_types_default().string,prop_types_default().node]),max:prop_types_default().number,min:prop_types_default().number,numbersOnly:prop_types_default().bool,onBlur:prop_types_default().func,onChange:prop_types_default().func,onKeyDown:prop_types_default().func,onKeyPress:prop_types_default().func,onKeyUp:prop_types_default().func,step:prop_types_default().oneOfType([prop_types_default().number,prop_types_default().string]),style:prop_types_default().object,inputStyle:prop_types_default().object,value:prop_types_default().number,tooltip:prop_types_default().string,tooltipPlacement:prop_types_default().oneOf(["top","right","bottom","left"])};var main=NumberInput;const number_createTooltip=null;var number=main}}]);

//# sourceMappingURL=DecisionTreeMenu.bee14e70.chunk.js.map