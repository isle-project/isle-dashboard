"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[8026,459],{92451:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_14___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_14__),react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(84420),react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_10__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__(30276),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13__),react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__(94968),react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11___default=__webpack_require__.n(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11__),react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__(25270),_isle_project_components_input_checkbox__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(18946),_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(57082),_isle_project_components_input_slider__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(51754),_isle_project_utils_randomstring_alphanumeric__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(68681),_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(76266),_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_5__),_stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(61635),_stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(_stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_6__),_isle_project_components_plots_heatmap__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(79777),_isle_project_constants_actions_js__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(67033),_question_button_js__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(97113);const HeatMapMenu=props=>{const{variables,groupingVariables,defaultX,defaultY,t}=props,[x,setX]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultX||variables[0]),[y,setY]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultY||variables[1]),[group,setGroup]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),[overlayPoints,setOverlayPoints]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),[commonXAxis,setCommonXAxis]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),[commonYAxis,setCommonYAxis]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),[alternateColor,setAlternateColor]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),[regressionMethod,setRegressionMethod]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),[smoothSpan,setSmoothSpan]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(.66),generateHeatmap=()=>{const plotId=(0,_isle_project_utils_randomstring_alphanumeric__WEBPACK_IMPORTED_MODULE_4__.Z)(6),action={x,y,overlayPoints,regressionMethod,plotId},onShare=()=>{props.session.addNotification({title:t("plot-shared"),message:t("plot-shared-message"),level:"success",position:"tr"}),props.logAction(_isle_project_constants_actions_js__WEBPACK_IMPORTED_MODULE_9__.bb,action)},output=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_plots_heatmap__WEBPACK_IMPORTED_MODULE_7__.Z,{id:plotId,data:props.data,x,y,group,overlayPoints,commonXAxis,commonYAxis,alternateColor,regressionMethod,smoothSpan,action,onShare,onSelected:props.onSelected});props.logAction(_isle_project_constants_actions_js__WEBPACK_IMPORTED_MODULE_9__.uA,action),props.onCreated(output)};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_10___default(),null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_10___default().Header,{as:"h4"},t("Heat Map"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_question_button_js__WEBPACK_IMPORTED_MODULE_8__.Z,{title:t("Heat Map"),content:t("Heat Map-description")})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Card__WEBPACK_IMPORTED_MODULE_10___default().Body,{className:"d-grid gap-3"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11___default(),null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("x-axis-variable"),defaultValue:x,options:variables,onChange:setX})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("y-axis-variable"),defaultValue:y,options:variables,onChange:setY}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11___default(),null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("group-by"),options:groupingVariables,clearable:!0,onChange:setGroup,menuPlacement:"top"}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11___default(),null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_checkbox__WEBPACK_IMPORTED_MODULE_1__.Z,{legend:t("common-x-axis"),defaultValue:commonXAxis,onChange:setCommonXAxis,disabled:!group,style:{opacity:group?1:0,float:"left"}})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_checkbox__WEBPACK_IMPORTED_MODULE_1__.Z,{legend:t("common-y-axis"),defaultValue:commonYAxis,onChange:setCommonYAxis,disabled:!group,style:{opacity:group?1:0,float:"left"}}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11___default(),null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_checkbox__WEBPACK_IMPORTED_MODULE_1__.Z,{legend:t("overlay-observations"),defaultValue:overlayPoints,onChange:setOverlayPoints})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_checkbox__WEBPACK_IMPORTED_MODULE_1__.Z,{legend:t("alternate-color-scheme"),defaultValue:alternateColor,onChange:setAlternateColor}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11___default(),null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_select__WEBPACK_IMPORTED_MODULE_2__.Z,{legend:t("overlay-regression-line"),multi:!0,options:["linear","smooth"],onChange:value=>{_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_5___default()(value)||(value=[value]),setRegressionMethod(value)}}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_11___default(),null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_12__.default,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_isle_project_components_input_slider__WEBPACK_IMPORTED_MODULE_3__.Z,{legend:t("smoothing-parameter"),disabled:!_stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_6___default()(regressionMethod,"smooth"),min:.01,max:1,step:.01,defaultValue:smoothSpan,onChange:setSmoothSpan}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13___default(),{variant:"primary",onClick:generateHeatmap},t("generate"))))};HeatMapMenu.defaultProps={defaultX:null,defaultY:null,groupingVariables:null,logAction(){},onSelected(){}},HeatMapMenu.propTypes={data:prop_types__WEBPACK_IMPORTED_MODULE_14___default().object.isRequired,defaultX:prop_types__WEBPACK_IMPORTED_MODULE_14___default().string,defaultY:prop_types__WEBPACK_IMPORTED_MODULE_14___default().string,groupingVariables:prop_types__WEBPACK_IMPORTED_MODULE_14___default().array,logAction:prop_types__WEBPACK_IMPORTED_MODULE_14___default().func,onCreated:prop_types__WEBPACK_IMPORTED_MODULE_14___default().func.isRequired,onSelected:prop_types__WEBPACK_IMPORTED_MODULE_14___default().func,session:prop_types__WEBPACK_IMPORTED_MODULE_14___default().object.isRequired,variables:prop_types__WEBPACK_IMPORTED_MODULE_14___default().array.isRequired},__webpack_exports__.default=HeatMapMenu},97113:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(30276),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5__),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(67883),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1__),react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(4635),react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2__),react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(65498),react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3__),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(7848),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4__);const QuestionButton=props=>{const popover=react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_1___default(),{id:"popover-positioned-right"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_PopoverHeader__WEBPACK_IMPORTED_MODULE_2___default(),null,props.title),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_PopoverBody__WEBPACK_IMPORTED_MODULE_3___default(),null,props.content));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_4___default(),{trigger:["click","hover","focus"],placement:"left",rootClose:!0,overlay:popover},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_5___default(),{"aria-label":props.title,size:"sm",variant:"outline-secondary",className:"question-button"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"fa fa-question"})))};QuestionButton.propTypes={content:prop_types__WEBPACK_IMPORTED_MODULE_6___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_6___default().string,prop_types__WEBPACK_IMPORTED_MODULE_6___default().node]).isRequired,title:prop_types__WEBPACK_IMPORTED_MODULE_6___default().string.isRequired},__webpack_exports__.Z=QuestionButton},18946:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return input_checkbox}});var react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),lib=__webpack_require__(45503),lib_default=__webpack_require__.n(lib),tooltip=__webpack_require__(77287),context=__webpack_require__(32283),uid=__webpack_require__(6756),__defProp=Object.defineProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a};const main_uid=(0,uid.Z)("checkbox-input"),CheckboxInput=props=>{const{bind,defaultValue,disabled,onChange}=props,id=(0,react.useRef)(props.id||main_uid(props)),session=(0,react.useContext)(context.Z),[value,setValue]=(0,react.useState)(bind&&session.state?session.state[bind]:defaultValue);(0,react.useEffect)(()=>{setValue(defaultValue)},[defaultValue]),(0,react.useEffect)(()=>{bind&&setValue(__webpack_require__.g.lesson.state[bind])},[bind]),(0,react.useEffect)(()=>{if(bind){let globalValue=__webpack_require__.g.lesson.state[bind];globalValue!==value&&setValue(globalValue)}},[bind,value]);const updateValue=(0,react.useCallback)(newValue=>{setValue(newValue),bind&&__webpack_require__.g.lesson.setState({[bind]:newValue})},[bind]),handleChange=(0,react.useCallback)(event=>{const newValue=event.target.checked;onChange(newValue),updateValue(newValue)},[onChange,updateValue]),handleKeyPress=(0,react.useCallback)(event=>{event.which===13&&(onChange(!value),updateValue(!value))},[onChange,updateValue,value]),handleSpanChange=()=>{const newValue=props.value!==null?!props.value:!value;onChange(newValue),updateValue(newValue)},input=react.createElement("input",{className:"checkbox-input",type:"checkbox",checked:props.value!==null?props.value:value,value:"checkbox",onChange:handleChange,onKeyPress:handleKeyPress,disabled,"aria-label":props.legend});if(props.inline===!0)return react.createElement(tooltip.Z,{tooltip:props.tooltip,placement:props.tooltipPlacement},react.createElement("span",{id:id.current,style:__spreadValues({marginLeft:"8px"},props.style)},input,react.createElement("span",{role:"button",tabIndex:0,className:"checkbox-legend",style:{color:disabled?"darkgray":null},onClick:handleSpanChange,onKeyPress:handleSpanChange},props.legend)));const onSpanChange=disabled?lib_default():handleSpanChange;return disabled?react.createElement(tooltip.Z,{tooltip:props.tooltip,placement:props.tooltipPlacement},react.createElement("div",{id:id.current,className:"input checkbox-input-div",style:props.style},input,react.createElement("span",{className:"checkbox-legend",style:{color:"darkgray"}},props.legend))):react.createElement(tooltip.Z,{tooltip:props.tooltip,placement:props.tooltipPlacement},react.createElement("div",{id:id.current,className:"input checkbox-input-div",style:props.style},input,react.createElement("span",{role:"button",tabIndex:0,className:"checkbox-legend",onClick:onSpanChange,onKeyPress:onSpanChange},props.legend)))};CheckboxInput.defaultProps={bind:"",onChange(){},defaultValue:!1,value:null,disabled:!1,inline:!1,legend:"",tooltip:"",tooltipPlacement:"right",style:{}},CheckboxInput.propTypes={bind:prop_types_default().string,defaultValue:prop_types_default().bool,value:prop_types_default().bool,disabled:prop_types_default().bool,inline:prop_types_default().bool,onChange:prop_types_default().func,legend:prop_types_default().oneOfType([prop_types_default().string,prop_types_default().node]),tooltip:prop_types_default().string,tooltipPlacement:prop_types_default().oneOf(["left","top","right","bottom"]),style:prop_types_default().object};var main=CheckboxInput,input_checkbox=main},51754:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return slider}});var react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),browser=__webpack_require__(14946),browser_default=__webpack_require__.n(browser),commonjs=__webpack_require__(81468),Badge=__webpack_require__(95657),Badge_default=__webpack_require__.n(Badge),lib=__webpack_require__(60004),lib_default=__webpack_require__.n(lib),pinf_lib=__webpack_require__(51235),pinf_lib_default=__webpack_require__.n(pinf_lib),ninf_lib=__webpack_require__(58747),ninf_lib_default=__webpack_require__.n(ninf_lib),components_tooltip=__webpack_require__(77287),context=__webpack_require__(32283),__defProp=Object.defineProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a};const debug=browser_default()("isle:slider-input"),SliderInput=props=>{const{bind,defaultValue,legend,disabled,hideTooltip,inline,min,max,onChange,precision,step,minLabel,maxLabel,numberInputStyle,rangeInputStyle,style}=props,{t}=(0,commonjs.$G)("input"),session=(0,react.useContext)(context.Z),[value,setValue]=(0,react.useState)(bind&&session.state?session.state[bind]:defaultValue);(0,react.useEffect)(()=>{if(bind){const globalValue=__webpack_require__.g.lesson.state[bind];globalValue!==value&&setValue(globalValue)}},[bind,value]),(0,react.useEffect)(()=>{setValue(defaultValue)},[defaultValue]),(0,react.useEffect)(()=>{bind&&setValue(__webpack_require__.g.lesson.state[bind])},[bind]);const finishChange=(0,react.useCallback)(event=>{debug("Finalizing change...");let newValue=event.target.value;newValue!==""&&(newValue=parseFloat(newValue)),newValue>max?newValue=max:newValue<min?newValue=min:step===1&&newValue!==""&&(newValue=newValue-newValue%step),debug(`Setting state value to: ${value}...`),newValue!==value&&(setValue(newValue),onChange(newValue),bind&&__webpack_require__.g.lesson.setState({[bind]:value}))},[bind,max,min,step,value,onChange]),handleInputChange=(0,react.useCallback)(event=>{const valid=event.target.validity.valid;let newValue=event.target.value;debug(`Input value changed to ${value}`),setValue(newValue),valid&&newValue!==""?(newValue=parseFloat(newValue),onChange(newValue),bind&&__webpack_require__.g.lesson.setState({[bind]:newValue})):bind&&__webpack_require__.g.lesson.setState({[bind]:newValue})},[bind,value,onChange]);let tooltip=`${t("enter")} ${t(step===1?"integer":"number")} `;max!==pinf_lib_default()&&min!==ninf_lib_default()?tooltip+=`${t("between")} ${min} ${t("and")} ${max}:`:min!==ninf_lib_default()?tooltip+=`${t("larger-or-equal-to")} ${min}:`:max!==pinf_lib_default()?tooltip+=`${t("smaller-or-equal-to")} ${max}:`:tooltip+=":";let roundedValue;value!==""?roundedValue=lib_default()(value,-1*precision):roundedValue=value;const rangeInput=react.createElement("input",{type:"range",className:"slider-range-input",min,max,step,value:roundedValue,disabled,onChange:handleInputChange,style:__spreadValues({float:inline?"none":"left",display:inline?"inline":"block"},rangeInputStyle)}),numberInput=react.createElement("input",{type:"number",name:"input",className:"slider-number-input",disabled,min,max,step,value:roundedValue,onChange:handleInputChange,onBlur:finishChange,style:__spreadValues({float:inline?"none":"right",marginTop:legend&&!inline?-22:0},numberInputStyle),autoComplete:"off"});return inline?react.createElement("span",{className:"input",style:__spreadValues({padding:"5px",opacity:disabled?.2:1},style)},legend?react.createElement("label",null,legend,":"):null,react.createElement("span",{className:"slider-range-wrapper"},react.createElement(Badge_default(),{bg:"secondary"},minLabel||min),rangeInput,react.createElement(Badge_default(),{bg:"secondary"},maxLabel||max)),numberInput):react.createElement(components_tooltip.Z,{id:"sliderTooltip",placement:"top",show:!hideTooltip,tooltip:disabled?t("slider-disabled"):tooltip},react.createElement("div",{className:"slider-outer-div input",style:__spreadValues({opacity:disabled?.2:1},style)},legend?react.createElement("label",null,legend,":"):null,react.createElement("br",null),react.createElement("span",{className:"slider-range-wrapper"},react.createElement(Badge_default(),{bg:"secondary",style:{float:"left"}},minLabel||min),rangeInput,react.createElement(Badge_default(),{bg:"secondary",style:{float:"left"}},maxLabel||max)),numberInput,react.createElement("br",null)))};SliderInput.defaultProps={inline:!1,legend:null,min:0,minLabel:null,max:100,maxLabel:null,step:1,defaultValue:10,onChange(){},precision:10,disabled:!1,hideTooltip:!1,style:{},numberInputStyle:{},rangeInputStyle:{}},SliderInput.propTypes={defaultValue:prop_types_default().number,disabled:prop_types_default().bool,inline:prop_types_default().bool,legend:prop_types_default().oneOfType([prop_types_default().string,prop_types_default().node]),max:prop_types_default().number,maxLabel:prop_types_default().string,min:prop_types_default().number,minLabel:prop_types_default().string,onChange:prop_types_default().func,precision:prop_types_default().number,step:prop_types_default().oneOfType([prop_types_default().number,prop_types_default().string]),hideTooltip:prop_types_default().bool,style:prop_types_default().object,numberInputStyle:prop_types_default().object,rangeInputStyle:prop_types_default().object};var main=SliderInput,slider=main}}]);

//# sourceMappingURL=HeatmapMenu.aa56f595.chunk.js.map