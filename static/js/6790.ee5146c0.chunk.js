var __defProp=Object.defineProperty,__defProps=Object.defineProperties;var __getOwnPropDescs=Object.getOwnPropertyDescriptors;var __getOwnPropSymbols=Object.getOwnPropertySymbols;var __hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable;var __defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a},__spreadProps=(a,b)=>__defProps(a,__getOwnPropDescs(b));var __objRest=(source,exclude)=>{var target={};for(var prop in source)__hasOwnProp.call(source,prop)&&exclude.indexOf(prop)<0&&(target[prop]=source[prop]);if(source!=null&&__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(source))exclude.indexOf(prop)<0&&__propIsEnum.call(source,prop)&&(target[prop]=source[prop]);return target};(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[6790],{18798:function(module){"use strict";var FLOAT64_MAX_SAFE_INTEGER=9007199254740991;module.exports=FLOAT64_MAX_SAFE_INTEGER},89256:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var isInfinite=__webpack_require__(12344);module.exports=isInfinite},12344:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var PINF=__webpack_require__(51235),NINF=__webpack_require__(58747);function isInfinite(x){return x===PINF||x===NINF}module.exports=isInfinite},28549:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var abs=__webpack_require__(10351);module.exports=abs},10351:function(module){"use strict";function abs(x){return Math.abs(x)}module.exports=abs},87594:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var trim=__webpack_require__(84001);module.exports=trim},84001:function(module,__unused_webpack_exports,__webpack_require__){"use strict";var isString=__webpack_require__(99301).isPrimitive,replace=__webpack_require__(51594),RE=/^[\u0020\f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*([\S\s]*?)[\u0020\f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*$/;function trim(str){if(!isString(str))throw new TypeError("invalid argument. Must provide a string primitive. Value: `"+str+"`.");return replace(str,RE,"$1")}module.exports=trim},93390:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var _stdlib_string_trim__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(87594),_stdlib_string_trim__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_stdlib_string_trim__WEBPACK_IMPORTED_MODULE_0__),_stdlib_utils_keys__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(25351),_stdlib_utils_keys__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_stdlib_utils_keys__WEBPACK_IMPORTED_MODULE_1__);const RE_NUMBER=/^\s*[+-]?[\d.]+e?[+-]?\d*\s*$/;function obsToVar(arr){const data={},keymap={},columnNames=_stdlib_utils_keys__WEBPACK_IMPORTED_MODULE_1___default()(arr[0]).filter(x=>x!=="");for(let i=0;i<columnNames.length;i++){const col=_stdlib_string_trim__WEBPACK_IMPORTED_MODULE_0___default()(columnNames[i]);keymap[columnNames[i]]=col,data[col]=new Array(arr.length)}for(let i=0;i<arr.length;i++)for(let j=0;j<columnNames.length;j++){const col=columnNames[j];let val=arr[i][col];RE_NUMBER.test(val)&&(val=Number(val)),data[keymap[col]][i]=val}return data}__webpack_exports__.Z=obsToVar},35287:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_14___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_14__),react_i18next__WEBPACK_IMPORTED_MODULE_15__=__webpack_require__(81468),moment__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(30381),moment__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__(89876),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13__),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__(99201),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_11___default=__webpack_require__.n(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_11__),react_bootstrap_Tooltip__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__(18868),react_bootstrap_Tooltip__WEBPACK_IMPORTED_MODULE_12___default=__webpack_require__.n(react_bootstrap_Tooltip__WEBPACK_IMPORTED_MODULE_12__),_stdlib_constants_float64_pinf__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(51235),_stdlib_constants_float64_pinf__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_stdlib_constants_float64_pinf__WEBPACK_IMPORTED_MODULE_2__),components_confirm_modal__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(88608),components_dashboard_table__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(1624),_isle_project_utils_obs_to_var__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(93390),ev_components_data_explorer__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(63787),utils_create_boolean_column_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(3902),utils_create_numeric_column_js__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(56739),utils_create_date_column_js__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(30691),utils_create_text_column_js__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(90501),__defProp2=Object.defineProperty,__defNormalProp2=(obj,key,value)=>key in obj?__defProp2(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__publicField=(obj,key,value)=>(__defNormalProp2(obj,typeof key!="symbol"?key+"":key,value),value),__async=(__this,__arguments,generator)=>new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}},rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}},step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())});class CohortTable extends react__WEBPACK_IMPORTED_MODULE_0__.Component{constructor(props){super(props),__publicField(this,"createColumns",()=>{const{t}=this.props;let maxStudents=0;const cohorts=this.props.admin.cohorts;let minTime=_stdlib_constants_float64_pinf__WEBPACK_IMPORTED_MODULE_2___default(),maxTime=0;for(let i=0;i<cohorts.length;i++){const nMembers=cohorts[i].members.length;nMembers&&nMembers>maxStudents&&(maxStudents=nMembers),cohorts[i].startDate>maxTime&&(maxTime=cohorts[i].startDate),cohorts[i].endDate>maxTime&&(maxTime=cohorts[i].endDate),cohorts[i].startDate<minTime&&(minTime=cohorts[i].startDate),cohorts[i].endDate<minTime&&(minTime=cohorts[i].endDate)}return maxTime=moment__WEBPACK_IMPORTED_MODULE_1___default()(maxTime),minTime=moment__WEBPACK_IMPORTED_MODULE_1___default()(minTime),[(0,utils_create_text_column_js__WEBPACK_IMPORTED_MODULE_10__.Z)({Header:t("common:title"),id:"title",accessor:"title",maxWidth:200,style:{marginTop:"8px",color:"darkslategrey"}}),(0,utils_create_text_column_js__WEBPACK_IMPORTED_MODULE_10__.Z)({Header:t("common:course"),id:"namespace",accessor:"namespace.title",maxWidth:200,style:{marginTop:"8px",color:"darkslategrey"}}),(0,utils_create_text_column_js__WEBPACK_IMPORTED_MODULE_10__.Z)({Header:t("namespace:email-filter"),id:"emailFilter",accessor:"emailFilter",maxWidth:200,style:{marginTop:"8px",color:"darkslategrey"}}),(0,utils_create_boolean_column_js__WEBPACK_IMPORTED_MODULE_7__.Z)({Header:t("enrollment"),accessor:"private",trueLabel:t("open-enrollment"),falseLabel:t("manual-enrollment"),printLabels:!0}),(0,utils_create_date_column_js__WEBPACK_IMPORTED_MODULE_9__.Z)({Header:t("start-date"),accessor:"startDate",startDate:minTime,endDate:maxTime,t}),(0,utils_create_date_column_js__WEBPACK_IMPORTED_MODULE_9__.Z)({Header:t("end-date"),accessor:"endDate",startDate:minTime,endDate:maxTime,t}),(0,utils_create_numeric_column_js__WEBPACK_IMPORTED_MODULE_8__.Z)({Header:t("common:number-of-students"),accessor:"members.length",style:{marginTop:"2px",color:"darkslategrey"},maxWidth:150,minValue:0,maxValue:maxStudents}),{Header:t("common:actions"),Cell:row=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_11___default(),{placement:"bottom",overlay:react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Tooltip__WEBPACK_IMPORTED_MODULE_12___default(),{id:"delete_cohort"},t("namespace:delete-cohort"))},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_13___default(),{variant:"outline-secondary",style:{marginLeft:8},onClick:this.askToDeleteSelectedCohortFactory(row.row._original),"aria-label":t("namespace:delete-cohort")},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"fa fa-trash-alt"})))),resizable:!1,filterable:!1,sortable:!1}]}),__publicField(this,"askToDeleteSelectedCohortFactory",cohort=>()=>{this.setState({showDeleteModal:!this.state.showDeleteModal,selectedCohort:cohort})}),__publicField(this,"deleteSelectedCohort",()=>{this.setState({showDeleteModal:!1},()=>__async(this,null,function*(){yield this.props.deleteCohort(this.state.selectedCohort._id),this.props.getAllCohorts()}))}),__publicField(this,"toggleDeleteModal",()=>{this.setState({showDeleteModal:!this.state.showDeleteModal})}),__publicField(this,"toggleExplorer",()=>{this.setState({showExplorer:!this.state.showExplorer})}),this.state={selectedCohort:null,showDeleteModal:!1,columns:this.createColumns()}}componentDidMount(){this.props.getAllCohorts()}componentDidUpdate(prevProps){prevProps.admin.cohorts!==this.props.admin.cohorts&&this.setState({columns:this.createColumns()})}render(){const{t}=this.props;if(this.state.showExplorer){const cohorts=this.props.admin.cohorts;let data=[];for(let i=0;i<cohorts.length;i++){const cohort=cohorts[i],replacement={};replacement.title=cohort.title,replacement.members=cohort.members.length,replacement.namespace=cohort.namespace?cohort.namespace.title:null,replacement.private=cohort.private,replacement.emailFilter=cohort.emailFilter?cohort.emailFilter:null,replacement.startDate=cohort.startDate,replacement.endDate=cohort.endDate,data.push(replacement)}return data=(0,_isle_project_utils_obs_to_var__WEBPACK_IMPORTED_MODULE_5__.Z)(data),react__WEBPACK_IMPORTED_MODULE_0__.createElement(ev_components_data_explorer__WEBPACK_IMPORTED_MODULE_6__.Z,{title:t("explorer-cohorts-title"),data,categorical:["title","namespace","private","startDate","endDate","emailFilter"],quantitative:["members"],close:this.toggleExplorer})}return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_dashboard_table__WEBPACK_IMPORTED_MODULE_4__.Z,{data:this.props.admin.cohorts,columns:this.state.columns,onButtonClick:this.toggleExplorer,t:this.props.t}),this.state.showDeleteModal?react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_confirm_modal__WEBPACK_IMPORTED_MODULE_3__.Z,{title:t("namespace:delete-cohort"),message:react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,t("namespace:delete-cohort-confirm"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{style:{color:"red"}},this.state.selectedCohort.title)),close:this.toggleDeleteModal,show:this.state.showDeleteModal,onConfirm:this.deleteSelectedCohort}):null)}}CohortTable.propTypes={admin:prop_types__WEBPACK_IMPORTED_MODULE_14___default().object.isRequired,deleteCohort:prop_types__WEBPACK_IMPORTED_MODULE_14___default().func.isRequired,getAllCohorts:prop_types__WEBPACK_IMPORTED_MODULE_14___default().func.isRequired,t:prop_types__WEBPACK_IMPORTED_MODULE_14___default().func.isRequired},__webpack_exports__.default=(0,react_i18next__WEBPACK_IMPORTED_MODULE_15__.Zh)(["admin","namespace","common"])(CohortTable)},88608:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),react_i18next__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(81468),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(89876),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2__),react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(89194),react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1__);const ConfirmModal=props=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default(),{show:props.show,onHide:props.close},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Header,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Title,{as:"h3"},props.title)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Body,null,props.message),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_1___default().Footer,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2___default(),{onClick:props.close},props.t("cancel")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_2___default(),{variant:"danger",onClick:props.onConfirm},props.t("confirm"))));ConfirmModal.propTypes={close:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,message:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,onConfirm:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,show:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,title:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string},ConfirmModal.defaultProps={close(){},message:"",onConfirm(){},show:!1,title:""},__webpack_exports__.Z=(0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.Zh)(["common"])(ConfirmModal)},1624:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return dashboard_table}});var react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),lib=__webpack_require__(86199),Button=__webpack_require__(89876),Button_default=__webpack_require__.n(Button),ButtonGroup=__webpack_require__(63319),ButtonGroup_default=__webpack_require__.n(ButtonGroup),OverlayTrigger=__webpack_require__(99201),OverlayTrigger_default=__webpack_require__.n(OverlayTrigger),Tooltip=__webpack_require__(18868),Tooltip_default=__webpack_require__.n(Tooltip),react_table=__webpack_require__(94064),__defProp2=Object.defineProperty,__defProps2=Object.defineProperties,__getOwnPropDescs2=Object.getOwnPropertyDescriptors,__getOwnPropSymbols2=Object.getOwnPropertySymbols,__hasOwnProp2=Object.prototype.hasOwnProperty,__propIsEnum2=Object.prototype.propertyIsEnumerable,__defNormalProp2=(obj,key,value)=>key in obj?__defProp2(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues2=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp2.call(b,prop)&&__defNormalProp2(a,prop,b[prop]);if(__getOwnPropSymbols2)for(var prop of __getOwnPropSymbols2(b))__propIsEnum2.call(b,prop)&&__defNormalProp2(a,prop,b[prop]);return a},__spreadProps2=(a,b)=>__defProps2(a,__getOwnPropDescs2(b));const DashboardTable=(0,react.forwardRef)((props,ref)=>{const{id,t}=props,getProps=(0,react.useCallback)(()=>({id:id||"dashboard-table"}),[id]);return react.createElement(react.Fragment,null,react.createElement(lib.ZP,__spreadProps2(__spreadValues2({},props),{filterable:!0,className:`dashboard-table ${props.className}`,data:props.data,columns:props.columns,previousText:t("common:previous"),nextText:t("common:next"),loadingText:t("common:loading"),noDataText:t("common:no-rows-found"),pageText:t("common:page"),ofText:t("common:of"),rowsText:t("common:rows"),getProps,ref})),props.onButtonClick?react.createElement(ButtonGroup_default(),{vertical:!0,style:{float:"right",marginRight:-9}},react.createElement(OverlayTrigger_default(),{placement:"left",overlay:react.createElement(Tooltip_default(),{id:"explorer-tooltip"},t("common:data-explorer"))},react.createElement(Button_default(),{"aria-label":t("common:data-explorer"),variant:"primary",style:{marginBottom:8},onClick:props.onButtonClick,disabled:props.disabled},react.createElement("i",{className:"fas fa-chart-bar"})))):null)});DashboardTable.propTypes={className:prop_types_default().string,columns:prop_types_default().array.isRequired,data:prop_types_default().oneOfType([prop_types_default().object,prop_types_default().array]).isRequired,disabled:prop_types_default().bool,onButtonClick:prop_types_default().func.isRequired,t:prop_types_default().func},DashboardTable.defaultProps={className:"",disabled:!1,t(){}};var dashboard_table=DashboardTable},63787:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var components_async__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(15052);const DashboardDataExplorer=(0,components_async__WEBPACK_IMPORTED_MODULE_0__.Z)(()=>Promise.all([__webpack_require__.e(8234),__webpack_require__.e(1419)]).then(__webpack_require__.bind(__webpack_require__,72186)));__webpack_exports__.Z=DashboardDataExplorer},3902:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294);function createBooleanColumn({Header,accessor,trueLabel,falseLabel,printLabels=!1,maxWidth=150}){let Cell,style;return printLabels?(Cell=row=>row.value===!0?trueLabel:row.value===!1?falseLabel:null,style={marginTop:"8px",color:"darkslategrey"}):(Cell=row=>row.value?react__WEBPACK_IMPORTED_MODULE_0__.createElement("i",{className:"far fa-check-square"}):null,style={marginTop:"2px",color:"darkslategrey",fontSize:24,textAlign:"center"}),{Header,accessor,style,Cell,filterMethod:(filter,row)=>{if(filter.value==="all")return!0;const id=filter.pivotId||filter.id;return row[id]===void 0?!0:String(row[id])===filter.value},Filter:({filter,onChange})=>{const handleChange=event=>{const newValue=event.target.value;onChange(newValue)};let value;return filter?value=filter.value:value="all",react__WEBPACK_IMPORTED_MODULE_0__.createElement("select",{onBlur:handleChange,onChange:handleChange,style:{width:"100%",backgroundColor:"ghostwhite"},value},react__WEBPACK_IMPORTED_MODULE_0__.createElement("option",{value:"all"},"Show All"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("option",{value:!0},trueLabel),react__WEBPACK_IMPORTED_MODULE_0__.createElement("option",{value:!1},falseLabel))},maxWidth}}__webpack_exports__.Z=createBooleanColumn},30691:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),react_dates__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(76141),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(99201),react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_5__),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(44981),react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_4__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(89876),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_3__),react_dates_lib_css_datepicker_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(71990),__defProp2=Object.defineProperty,__defNormalProp2=(obj,key,value)=>key in obj?__defProp2(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__publicField=(obj,key,value)=>(__defNormalProp2(obj,typeof key!="symbol"?key+"":key,value),value);class CustomDatePicker extends react__WEBPACK_IMPORTED_MODULE_0__.Component{constructor(props){super(props),__publicField(this,"handleDatesChange",({startDate,endDate})=>{this.setState({startDate,endDate},()=>{this.props.onDatesChange(this.state)})}),__publicField(this,"handleReset",()=>{this.setState({startDate:this.props.minDate,endDate:this.props.maxDate},()=>{this.props.onDatesChange(this.state)})}),this.state={startDate:props.startDate,endDate:props.endDate}}componentDidUpdate(prevProps){(this.props.startDate!==prevProps.startDate||this.props.endDate!==prevProps.endDate)&&this.setState({startDate:this.props.startDate,endDate:this.props.endDate})}render(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_dates__WEBPACK_IMPORTED_MODULE_1__.DateRangePicker,{startDate:this.state.startDate,endDate:this.state.endDate,startDateId:"start_date_input",endDateId:"end_date_input",onDatesChange:this.handleDatesChange,focusedInput:this.state.focusedInput,onFocusChange:focusedInput=>this.setState({focusedInput}),isOutsideRange:()=>!1}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_3___default(),{"aria-label":this.props.t("common:close"),variant:"warning",onClick:this.handleReset,style:{paddingTop:8,paddingLeft:16,paddingRight:16,paddingBottom:8,fontSize:20}},"x"))}}const DefaultCell=row=>new Date(row.value).toLocaleString();function createBooleanColumn({Header,accessor,Cell,style,startDate,endDate,t,maxWidth=150}){return{Header,accessor,style,Cell:Cell||DefaultCell,filterMethod:(filter,row)=>{if(!filter.value)return!0;const{startDate:startDate2,endDate:endDate2}=filter.value,id=filter.pivotId||filter.id,value=row[id].getTime();return startDate2&&endDate2?value>=startDate2.valueOf()&&value<=endDate2.valueOf():startDate2?value>=startDate2.valueOf():endDate2?value<=endDate2.valueOf():!0},Filter:({filter,onChange})=>{const filterValue=filter?filter.value||{}:{},popover=react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_4___default(),{id:"popover-data",style:{maxWidth:400}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_4___default().Header,{as:"h3"},t("common:dates")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Popover__WEBPACK_IMPORTED_MODULE_4___default().Body,{style:{backgroundColor:"grey"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(CustomDatePicker,{startDate:filterValue.startDate||startDate,minDate:startDate,maxDate:endDate,endDate:filterValue.endDate||endDate,onDatesChange:({startDate:startDate2,endDate:endDate2})=>{onChange({startDate:startDate2,endDate:endDate2})},t})));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_OverlayTrigger__WEBPACK_IMPORTED_MODULE_5___default(),{trigger:"click",placement:"right",overlay:popover},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_3___default(),{"aria-label":t("common:toggle-calendar"),size:"sm",style:{float:"left",marginLeft:6},variant:"secondary"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("i",{className:"far fa-calendar-alt"})))},maxWidth}}__webpack_exports__.Z=createBooleanColumn},56739:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),react_input_range__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(9322),react_input_range__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_input_range__WEBPACK_IMPORTED_MODULE_1__),_stdlib_string_replace__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(51594),_stdlib_string_replace__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_stdlib_string_replace__WEBPACK_IMPORTED_MODULE_2__),_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(86361),_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_3__),_stdlib_math_base_special_roundn__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(60004),_stdlib_math_base_special_roundn__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(_stdlib_math_base_special_roundn__WEBPACK_IMPORTED_MODULE_4__),css_input_range_css__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(53860);const defaultFilterMethod=(filter,row)=>{const id=filter.pivotId||filter.id,val=row[id];return val>=filter.value.min&&val<=filter.value.max},defaultFormatLabel=value=>_stdlib_math_base_special_roundn__WEBPACK_IMPORTED_MODULE_4___default()(value,-2);function createNumericColumn({Header,accessor,Cell,minValue=0,maxValue=1,maxWidth=150,filterMethod,formatLabel}){const id=`header-${_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_3___default()(_stdlib_string_replace__WEBPACK_IMPORTED_MODULE_2___default()(Header," ","-"))}`;return{Header:react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{id},Header),accessor,Cell:Cell||(row=>row.value?`${_stdlib_math_base_special_roundn__WEBPACK_IMPORTED_MODULE_4___default()(row.value,-3)}`:"NA"),filterMethod:filterMethod||defaultFilterMethod,Filter:({filter,onChange})=>{minValue===maxValue&&(maxValue=minValue+=1);const defaultVal={max:maxValue,min:minValue};return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{paddingLeft:"4px",paddingRight:"4px",paddingTop:"8px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_input_range__WEBPACK_IMPORTED_MODULE_1___default(),{ariaLabelledby:id,ariaControls:"dashboard-table",allowSameValues:!0,maxValue,minValue,step:.1,value:filter?filter.value:defaultVal,onChange:newValue=>{onChange(newValue)},formatLabel:formatLabel||defaultFormatLabel}))},maxWidth}}__webpack_exports__.Z=createNumericColumn},90501:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(26199),react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_2__),_text_filter_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(31190);function createTextColumn({id,Header,Cell,accessor,maxWidth=150,minWidth,filterMethod}){minWidth>maxWidth&&(maxWidth=minWidth);const spec={id,Header,accessor,Cell,filterMethod:filterMethod||_text_filter_js__WEBPACK_IMPORTED_MODULE_1__.Z,Filter:({filter,onChange})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_2___default(),{"aria-label":Header,autoComplete:"none",onChange:event=>{onChange(event.target.value)}})};return maxWidth&&(spec.maxWidth=maxWidth),minWidth&&(spec.minWidth=minWidth),spec}__webpack_exports__.Z=createTextColumn},31190:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var _stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(61635),_stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_0__),_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(86361),_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_1__);const textFilter=(filter,row)=>{const str=row[filter.id]||"";return _stdlib_assert_contains__WEBPACK_IMPORTED_MODULE_0___default()(_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_1___default()(str),_stdlib_string_lowercase__WEBPACK_IMPORTED_MODULE_1___default()(filter.value))};__webpack_exports__.Z=textFilter},53860:function(){"use strict"},80405:function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_propTypes=_interopRequireDefault(__webpack_require__(45697)),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const propTypes={type:_propTypes.default.string,tooltip:_propTypes.default.bool,as:_propTypes.default.elementType},Feedback=React.forwardRef((_a,ref)=>{var _b=_a,{as:Component="div",className,type="valid",tooltip=!1}=_b,props=__objRest(_b,["as","className","type","tooltip"]);return(0,_jsxRuntime.jsx)(Component,__spreadProps(__spreadValues({},props),{ref,className:(0,_classnames.default)(className,`${type}-${tooltip?"tooltip":"feedback"}`)}))});Feedback.displayName="Feedback",Feedback.propTypes=propTypes;var _default=Feedback;exports.default=_default,module.exports=exports.default},1409:function(module,exports,__webpack_require__){"use strict";exports.__esModule=!0,exports.default=void 0;var React=_interopRequireWildcard(__webpack_require__(67294));function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}var _default=React.createContext({});exports.default=_default,module.exports=exports.default},26199:function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.__esModule=!0,exports.default=void 0;var _classnames=_interopRequireDefault(__webpack_require__(94184)),React=_interopRequireWildcard(__webpack_require__(67294)),_warning=_interopRequireDefault(__webpack_require__(42473)),_Feedback=_interopRequireDefault(__webpack_require__(80405)),_FormContext=_interopRequireDefault(__webpack_require__(1409)),_ThemeProvider=__webpack_require__(3349),_jsxRuntime=__webpack_require__(85893);function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!="function")return null;var cacheBabelInterop=new WeakMap,cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop2){return nodeInterop2?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule)return obj;if(obj===null||typeof obj!="object"&&typeof obj!="function")return{default:obj};var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj))return cache.get(obj);var newObj={},hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj)if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;desc&&(desc.get||desc.set)?Object.defineProperty(newObj,key,desc):newObj[key]=obj[key]}return newObj.default=obj,cache&&cache.set(obj,newObj),newObj}const FormControl=React.forwardRef((_a,ref)=>{var _b=_a,{bsPrefix,type,size,htmlSize,id,className,isValid=!1,isInvalid=!1,plaintext,readOnly,as:Component="input"}=_b,props=__objRest(_b,["bsPrefix","type","size","htmlSize","id","className","isValid","isInvalid","plaintext","readOnly","as"]);const{controlId}=(0,React.useContext)(_FormContext.default);bsPrefix=(0,_ThemeProvider.useBootstrapPrefix)(bsPrefix,"form-control");let classes;return plaintext?classes={[`${bsPrefix}-plaintext`]:!0}:classes={[bsPrefix]:!0,[`${bsPrefix}-${size}`]:size},(0,_jsxRuntime.jsx)(Component,__spreadProps(__spreadValues({},props),{type,size:htmlSize,ref,readOnly,id:id||controlId,className:(0,_classnames.default)(className,classes,isValid&&"is-valid",isInvalid&&"is-invalid",type==="color"&&`${bsPrefix}-color`)}))});FormControl.displayName="FormControl";var _default=Object.assign(FormControl,{Feedback:_Feedback.default});exports.default=_default,module.exports=exports.default},63405:function(module,__unused_webpack_exports,__webpack_require__){var arrayLikeToArray=__webpack_require__(73897);function _arrayWithoutHoles(arr){if(Array.isArray(arr))return arrayLikeToArray(arr)}module.exports=_arrayWithoutHoles,module.exports.__esModule=!0,module.exports.default=module.exports},79498:function(module){function _iterableToArray(iter){if(typeof Symbol!="undefined"&&iter[Symbol.iterator]!=null||iter["@@iterator"]!=null)return Array.from(iter)}module.exports=_iterableToArray,module.exports.__esModule=!0,module.exports.default=module.exports},42281:function(module){function _nonIterableSpread(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}module.exports=_nonIterableSpread,module.exports.__esModule=!0,module.exports.default=module.exports},861:function(module,__unused_webpack_exports,__webpack_require__){var arrayWithoutHoles=__webpack_require__(63405),iterableToArray=__webpack_require__(79498),unsupportedIterableToArray=__webpack_require__(86116),nonIterableSpread=__webpack_require__(42281);function _toConsumableArray(arr){return arrayWithoutHoles(arr)||iterableToArray(arr)||unsupportedIterableToArray(arr)||nonIterableSpread()}module.exports=_toConsumableArray,module.exports.__esModule=!0,module.exports.default=module.exports}}]);

//# sourceMappingURL=6790.ee5146c0.chunk.js.map