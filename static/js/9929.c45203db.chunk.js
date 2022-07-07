"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[9929],{87925:function(module,__unused_webpack_exports,__webpack_require__){var isNegativeZero=__webpack_require__(29552);module.exports=isNegativeZero},29552:function(module,__unused_webpack_exports,__webpack_require__){var NINF=__webpack_require__(58747);function isNegativeZero(x){return x===0&&1/x===NINF}module.exports=isNegativeZero},40311:function(module,__unused_webpack_exports,__webpack_require__){var clamp=__webpack_require__(96688);module.exports=clamp},96688:function(module,__unused_webpack_exports,__webpack_require__){var isnan=__webpack_require__(64529),isNegativeZero=__webpack_require__(87925);function clamp(v,min,max){return isnan(v)||isnan(min)||isnan(max)?NaN:v<min?min:v>max?max:min===0&&isNegativeZero(v)?min:v===0&&isNegativeZero(max)?max:v}module.exports=clamp},39929:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_8__),react_plotly_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(58660),_stdlib_math_base_special_clamp__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(40311),_stdlib_math_base_special_clamp__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_stdlib_math_base_special_clamp__WEBPACK_IMPORTED_MODULE_2__),_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(76266),_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_3__),_stdlib_stats_iter_mean__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(24322),_stdlib_stats_iter_mean__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(_stdlib_stats_iter_mean__WEBPACK_IMPORTED_MODULE_4__),_stdlib_stats_iter_stdev__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(21558),_stdlib_stats_iter_stdev__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_stdlib_stats_iter_stdev__WEBPACK_IMPORTED_MODULE_5__),_stdlib_array_to_iterator__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(29378),_stdlib_array_to_iterator__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(_stdlib_array_to_iterator__WEBPACK_IMPORTED_MODULE_6__),utils_format_time_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(27505);class ProgressStats extends react__WEBPACK_IMPORTED_MODULE_0__.Component{render(){if(!this.props.selectedNamespace)return null;const lessons=this.props.selectedNamespace.lessons;if(!_stdlib_assert_is_array__WEBPACK_IMPORTED_MODULE_3___default()(lessons))return null;const data=this.props.user.lessonData;let values=[];const names=[],texts=[];for(let i=0;i<lessons.length;i++){const lesson=lessons[i];data[lesson._id]&&(values.push(_stdlib_math_base_special_clamp__WEBPACK_IMPORTED_MODULE_2___default()(data[lesson._id].progress*100,0,100)),names.push(lesson.title),texts.push(`Time spent: ${(0,utils_format_time_js__WEBPACK_IMPORTED_MODULE_7__.Z)(data[lesson._id].spentTime)}`))}let it=_stdlib_array_to_iterator__WEBPACK_IMPORTED_MODULE_6___default()(values);const avg=_stdlib_stats_iter_mean__WEBPACK_IMPORTED_MODULE_4___default()(it);it=_stdlib_array_to_iterator__WEBPACK_IMPORTED_MODULE_6___default()(values);const stdev=_stdlib_stats_iter_stdev__WEBPACK_IMPORTED_MODULE_5___default()(it);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{padding:"5px",overflow:"hidden"}},avg?react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:"title"},"Average progress: "),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,` ${avg.toFixed(3)}`),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,` (SD: ${stdev.toFixed(3)})`)):null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_plotly_js__WEBPACK_IMPORTED_MODULE_1__.Z,{data:[{x:names,y:values,text:texts,type:"bar",marker:{color:"#0069d9",opacity:.6,line:{color:"rgb(8,48,107)",width:1.5}}}],config:{displayModeBar:!1,displaylogo:!1},layout:{plot_bgcolor:"rgba(0,0,0,0.0)",paper_bgcolor:"rgba(0,0,0,0.0)",xaxis:{title:"Lesson Name",fixedrange:!0},yaxis:{title:"Completed (in percent)",fixedrange:!0},autosize:!0,margin:{l:50,r:50,b:50,t:50}},useResizeHandler:!0,style:{width:"100%",height:"17vw"}}))}}ProgressStats.propTypes={selectedNamespace:prop_types__WEBPACK_IMPORTED_MODULE_8___default().object,user:prop_types__WEBPACK_IMPORTED_MODULE_8___default().object.isRequired},ProgressStats.defaultProps={selectedNamespace:null},__webpack_exports__.default=ProgressStats}}]);

//# sourceMappingURL=9929.c45203db.chunk.js.map