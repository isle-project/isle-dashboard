"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[2769],{92769:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return access}});var react=__webpack_require__(67294),build=__webpack_require__(68391),commonjs=__webpack_require__(81468),querystring=__webpack_require__(17673),Button=__webpack_require__(89876),Button_default=__webpack_require__.n(Button),access=({user})=>{const url=`/logs/access.log?${querystring.stringify({jwt:user.token})}`,{t}=(0,commonjs.$G)(["admin","common"]);return react.createElement(react.Fragment,null,react.createElement("a",{href:url,target:"_blank",download:!0,rel:"noopener noreferrer"},react.createElement(Button_default(),{variant:"success",className:"admin-page-log-side-button"},t("common:save-file"))),react.createElement("div",{className:"access-log-wrapper"},react.createElement(build.ScrollFollow,{startFollowing:!0,render:({follow,onScroll})=>react.createElement(build.LazyLog,{enableSearch:!0,url,stream:!0,follow,onScroll,selectableLines:!0,text:t("access-log")})})))}}}]);

//# sourceMappingURL=2769.548ecb43.chunk.js.map