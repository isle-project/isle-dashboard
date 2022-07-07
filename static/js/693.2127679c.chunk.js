"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[693],{693:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return main}});var react=__webpack_require__(67294),commonjs=__webpack_require__(81468),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),FormGroup=__webpack_require__(34168),FormGroup_default=__webpack_require__.n(FormGroup),Container=__webpack_require__(70448),Container_default=__webpack_require__.n(Container),Form=__webpack_require__(17383),Form_default=__webpack_require__.n(Form),Row=__webpack_require__(28269),Row_default=__webpack_require__.n(Row),Col=__webpack_require__(1266),visible_barrier=__webpack_require__(42432),select_input_field=__webpack_require__(32623),text_select_field=__webpack_require__(95957),Button=__webpack_require__(89876),Button_default=__webpack_require__.n(Button),text_area=({name,defaultValue,rows=10,updateSettings,t})=>{const[value,setValue]=(0,react.useState)(defaultValue),handleChange=(0,react.useCallback)(event=>{const target=event.target;setValue(target.value)},[]),handleReset=(0,react.useCallback)(()=>{setValue(defaultValue)},[defaultValue]),handleConfirm=(0,react.useCallback)(()=>{updateSettings(name,value)},[updateSettings,name,value]);return react.createElement(Form_default().Group,{style:{marginBottom:0}},react.createElement(Form_default().Control,{type:"text",as:"textarea",rows,value,style:{width:"calc(100% - 78px)",float:"left"},onChange:handleChange}),value!==defaultValue?react.createElement(react.Fragment,null,react.createElement(Button_default(),{"aria-label":t("common:confirm"),onClick:handleConfirm,variant:"success",size:"sm",style:{marginRight:6,marginLeft:8}},react.createElement("i",{className:"fas fa-check"})),react.createElement(Button_default(),{"aria-label":t("common:reset"),onClick:handleReset,variant:"warning",size:"sm",style:{width:32}},react.createElement("i",{className:"fas fa-times"}))):null)},checkbox_input_field=__webpack_require__(12123);const AdminSettingsSaml=({admin,updateSettings})=>{const{t}=(0,commonjs.$G)("admin_settings"),settings=admin.settings;return react.createElement(react.Fragment,null,react.createElement(visible_barrier.Z,null,react.createElement(Container_default(),{style:{float:"left"},className:"d-grid gap-3"},react.createElement(FormGroup_default(),{as:Row_default()},react.createElement(Form_default().Label,{column:!0,sm:3},t("status")),react.createElement(Col.default,{sm:4},react.createElement(select_input_field.Z,{name:"saml",defaultValue:settings.saml||"disabled",updateSettings},react.createElement("option",{value:"enabled"},t("enabled")),react.createElement("option",{value:"disabled"},t("disabled")),react.createElement("option",{value:"passive"},t("passive")))),react.createElement(Col.default,{sm:5},react.createElement(Form_default().Text,{muted:!0},t("saml-status-description")))),react.createElement(FormGroup_default(),{as:Row_default()},react.createElement(Form_default().Label,{column:!0,sm:3},t("saml-email-domains")),react.createElement(Col.default,{sm:4},react.createElement(text_select_field.Z,{name:"samlEmailDomains",key:admin.settings.samlEmailDomains,placeholder:t("saml-email-domains-placeholder"),defaultValue:admin.settings.samlEmailDomains,updateSettings})),react.createElement(Col.default,{sm:5},react.createElement(Form_default().Text,{muted:!0},t("saml-email-domains-description")))),react.createElement(Form_default().Group,{as:Row_default()},react.createElement(Form_default().Label,{column:!0,sm:4},t("saml-show-choices")),react.createElement(Col.default,{sm:8},react.createElement(checkbox_input_field.Z,{name:"samlShowLoginChoices",label:t("saml-show-choices-description"),defaultValue:admin.settings.samlShowLoginChoices,updateSettings}))),react.createElement(Form_default().Group,{as:Row_default()},react.createElement(Form_default().Label,{column:!0,sm:2},t("saml-choice-header")),react.createElement(Col.default,{sm:5},react.createElement(text_area,{name:"samlChoiceHeader",key:admin.settings.samlChoiceHeader,defaultValue:admin.settings.samlChoiceHeader,updateSettings,t})),react.createElement(Col.default,{sm:5},react.createElement(Form_default().Text,{muted:!0},t("saml-choice-header-description")))),react.createElement(Form_default().Group,{as:Row_default()},react.createElement(Form_default().Label,{column:!0,sm:2},t("saml-choice-extra-styles")),react.createElement(Col.default,{sm:5},react.createElement(text_area,{name:"samlExtraStyles",key:admin.settings.samlExtraStyles,defaultValue:admin.settings.samlExtraStyles,updateSettings,t})),react.createElement(Col.default,{sm:5},react.createElement(Form_default().Text,{muted:!0},t("saml-choice-extra-styles-description")))),react.createElement(Form_default().Group,{as:Row_default()},react.createElement(Form_default().Label,{column:!0,sm:4},t("saml-authentication-barrier")),react.createElement(Col.default,{sm:8},react.createElement(checkbox_input_field.Z,{name:"samlDisableAuthenticationBarrier",label:t("saml-authentication-barrier-description"),defaultValue:admin.settings.samlDisableAuthenticationBarrier,updateSettings}))),react.createElement(FormGroup_default(),{as:Row_default()},react.createElement(Form_default().Label,{column:!0,sm:3},t("saml-exempt-patterns")),react.createElement(Col.default,{sm:4},react.createElement(text_select_field.Z,{name:"samlExemptPatterns",key:admin.settings.samlExemptPatterns,placeholder:t("saml-exempt-patterns-placeholder"),defaultValue:admin.settings.samlExemptPatterns,updateSettings})),react.createElement(Col.default,{sm:5},react.createElement(Form_default().Text,{muted:!0},t("saml-exempt-patterns-description")))))))};AdminSettingsSaml.propTypes={admin:prop_types_default().object.isRequired,updateSettings:prop_types_default().func.isRequired},AdminSettingsSaml.defaultProps={};var main=AdminSettingsSaml},42432:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return visible_barrier}});var lib=__webpack_require__(37424),react=__webpack_require__(67294),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),commonjs=__webpack_require__(81468);const LicenseBarrier=({admin,user,children})=>{const{t}=(0,commonjs.$G)("common");return!user.licensed&&(!admin.license||!admin.license.valid)?react.createElement("div",{className:"jumbotron",style:{width:"100%",height:"73.7%"}},react.createElement("h3",{style:{textAlign:"center",marginTop:"12%"}},t("not-available-in-community-edition"))):children};LicenseBarrier.propTypes={admin:prop_types_default().object,user:prop_types_default().object},LicenseBarrier.defaultProps={admin:null,user:null};var barrier=LicenseBarrier;function mapStateToProps(state){return{admin:state.admin,user:state.user}}function mapDispatchToProps(){return{}}var visible_barrier=(0,lib.connect)(mapStateToProps,mapDispatchToProps)(barrier)}}]);

//# sourceMappingURL=693.2127679c.chunk.js.map