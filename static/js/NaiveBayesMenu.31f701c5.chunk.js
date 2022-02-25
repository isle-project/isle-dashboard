"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[8523,459],{28338:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_9___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__),uniq__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(38706),uniq__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(uniq__WEBPACK_IMPORTED_MODULE_1__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(30276),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_8__),react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(84420),react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_7__),_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(57082),_isle_project_components_input_checkbox__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(18946),_isle_project_constants_actions_js__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(67033),_isle_project_components_models_naive_bayes__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(20456),_question_button_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(97113);const NaiveBayesMenu=props=>{const[y,setY]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.categorical[0]),[x,setX]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.quantitative[0]),[omitMissing,setOmitMissing]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),{categorical,quantitative,t}=props,compute=()=>{const output=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_models_naive_bayes__WEBPACK_IMPORTED_MODULE_4__.Z,{x,y,omitMissing,data:props.data,quantitative:props.quantitative,categorical:props.categorical,onPredict:props.onPredict});props.logAction(_isle_project_constants_actions_js__WEBPACK_IMPORTED_MODULE_6__.go,{y,x,omitMissing}),props.onCreated(output)};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_7___default(),{style:{fontSize:"14px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_7___default().Header,{as:"h4"},t("Naive Bayes"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_question_button_js__WEBPACK_IMPORTED_MODULE_5__.Z,{title:t("Naive Bayes"),content:t("Naive Bayes-description")})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_7___default().Body,{className:"d-grid gap-3"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("outcome-y"),options:categorical,defaultValue:y,onChange:setY}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("predictors-x"),multi:!0,options:uniq__WEBPACK_IMPORTED_MODULE_1___default()(quantitative.concat(categorical)),defaultValue:x||"",onChange:setX}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_checkbox__WEBPACK_IMPORTED_MODULE_3__.Z,{legend:t("omit-missing"),defaultValue:!1,onChange:setOmitMissing}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_8___default(),{disabled:!x||x.length===0,variant:"primary",onClick:compute},t("calculate"))))};NaiveBayesMenu.defaultProps={logAction(){}},NaiveBayesMenu.propTypes={categorical:prop_types__WEBPACK_IMPORTED_MODULE_9___default().array.isRequired,quantitative:prop_types__WEBPACK_IMPORTED_MODULE_9___default().array.isRequired,data:prop_types__WEBPACK_IMPORTED_MODULE_9___default().object.isRequired,logAction:prop_types__WEBPACK_IMPORTED_MODULE_9___default().func,onCreated:prop_types__WEBPACK_IMPORTED_MODULE_9___default().func.isRequired,onPredict:prop_types__WEBPACK_IMPORTED_MODULE_9___default().func.isRequired},__webpack_exports__.default=NaiveBayesMenu},97113:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(30276),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5__),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(67883),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1__),react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4635),react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2__),react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(65498),react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3__),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(7848),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4__);const QuestionButton=props=>{const popover=react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1___default(),{id:"popover-positioned-right"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2___default(),null,props.title),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3___default(),null,props.content));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4___default(),{trigger:["click","hover","focus"],placement:"left",rootClose:!0,overlay:popover},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5___default(),{"aria-label":props.title,size:"sm",variant:"outline-secondary",className:"question-button"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"fa fa-question"})))};QuestionButton.propTypes={content:prop_types__WEBPACK_IMPORTED_MODULE_6___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_6___default().string,prop_types__WEBPACK_IMPORTED_MODULE_6___default().node]).isRequired,title:prop_types__WEBPACK_IMPORTED_MODULE_6___default().string.isRequired},__webpack_exports__.Z=QuestionButton},18946:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return input_checkbox}});var react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),lib=__webpack_require__(45503),lib_default=__webpack_require__.n(lib),tooltip=__webpack_require__(77287),context=__webpack_require__(32283),uid=__webpack_require__(6756),__defProp=Object.defineProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a};const main_uid=(0,uid.Z)("checkbox-input"),CheckboxInput=props=>{const{bind,defaultValue,disabled,onChange}=props,id=(0,react.useRef)(props.id||main_uid(props)),session=(0,react.useContext)(context.Z),[value,setValue]=(0,react.useState)(bind&&session.state?session.state[bind]:defaultValue);(0,react.useEffect)(()=>{setValue(defaultValue)},[defaultValue]),(0,react.useEffect)(()=>{bind&&setValue(__webpack_require__.g.lesson.state[bind])},[bind]),(0,react.useEffect)(()=>{if(bind){let globalValue=__webpack_require__.g.lesson.state[bind];globalValue!==value&&setValue(globalValue)}},[bind,value]);const updateValue=(0,react.useCallback)(newValue=>{setValue(newValue),bind&&__webpack_require__.g.lesson.setState({[bind]:newValue})},[bind]),handleChange=(0,react.useCallback)(event=>{const newValue=event.target.checked;onChange(newValue),updateValue(newValue)},[onChange,updateValue]),handleKeyPress=(0,react.useCallback)(event=>{event.which===13&&(onChange(!value),updateValue(!value))},[onChange,updateValue,value]),handleSpanChange=()=>{const newValue=props.value!==null?!props.value:!value;onChange(newValue),updateValue(newValue)},input=react.createElement("input",{className:"checkbox-input",type:"checkbox",checked:props.value!==null?props.value:value,value:"checkbox",onChange:handleChange,onKeyPress:handleKeyPress,disabled,"aria-label":props.legend});if(props.inline===!0)return react.createElement(tooltip.Z,{tooltip:props.tooltip,placement:props.tooltipPlacement},react.createElement("span",{id:id.current,style:__spreadValues({marginLeft:"8px"},props.style)},input,react.createElement("span",{role:"button",tabIndex:0,className:"checkbox-legend",style:{color:disabled?"darkgray":null},onClick:handleSpanChange,onKeyPress:handleSpanChange},props.legend)));const onSpanChange=disabled?lib_default():handleSpanChange;return disabled?react.createElement(tooltip.Z,{tooltip:props.tooltip,placement:props.tooltipPlacement},react.createElement("div",{id:id.current,className:"input checkbox-input-div",style:props.style},input,react.createElement("span",{className:"checkbox-legend",style:{color:"darkgray"}},props.legend))):react.createElement(tooltip.Z,{tooltip:props.tooltip,placement:props.tooltipPlacement},react.createElement("div",{id:id.current,className:"input checkbox-input-div",style:props.style},input,react.createElement("span",{role:"button",tabIndex:0,className:"checkbox-legend",onClick:onSpanChange,onKeyPress:onSpanChange},props.legend)))};CheckboxInput.defaultProps={bind:"",onChange(){},defaultValue:!1,value:null,disabled:!1,inline:!1,legend:"",tooltip:"",tooltipPlacement:"right",style:{}},CheckboxInput.propTypes={bind:prop_types_default().string,defaultValue:prop_types_default().bool,value:prop_types_default().bool,disabled:prop_types_default().bool,inline:prop_types_default().bool,onChange:prop_types_default().func,legend:prop_types_default().oneOfType([prop_types_default().string,prop_types_default().node]),tooltip:prop_types_default().string,tooltipPlacement:prop_types_default().oneOf(["left","top","right","bottom"]),style:prop_types_default().object};var main=CheckboxInput,input_checkbox=main}}]);

//# sourceMappingURL=NaiveBayesMenu.31f701c5.chunk.js.map