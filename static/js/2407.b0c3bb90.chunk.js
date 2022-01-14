"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[2407],{62407:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return visible_admin_settings}});var react=__webpack_require__(67294),lib=__webpack_require__(37424),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),commonjs=__webpack_require__(81468),react_router_dom_production_min=__webpack_require__(59685),Nav=__webpack_require__(75655),Nav_default=__webpack_require__.n(Nav),components_async=__webpack_require__(15052),user_fields=(0,components_async.Z)(()=>Promise.all([__webpack_require__.e(9810),__webpack_require__.e(7583),__webpack_require__.e(8181),__webpack_require__.e(7521)]).then(__webpack_require__.bind(__webpack_require__,73461))),branding=(0,components_async.Z)(()=>Promise.all([__webpack_require__.e(9810),__webpack_require__.e(7383),__webpack_require__.e(1254)]).then(__webpack_require__.bind(__webpack_require__,1254))),texts=(0,components_async.Z)(()=>Promise.all([__webpack_require__.e(9810),__webpack_require__.e(7583),__webpack_require__.e(626),__webpack_require__.e(6119)]).then(__webpack_require__.bind(__webpack_require__,6119)));const Configuration=(0,components_async.Z)(()=>Promise.all([__webpack_require__.e(9810),__webpack_require__.e(7383),__webpack_require__.e(7583),__webpack_require__.e(8181),__webpack_require__.e(286)]).then(__webpack_require__.bind(__webpack_require__,75233))),License=(0,components_async.Z)(()=>__webpack_require__.e(444).then(__webpack_require__.bind(__webpack_require__,40444))),Backups=(0,components_async.Z)(()=>__webpack_require__.e(3589).then(__webpack_require__.bind(__webpack_require__,63589))),Roles=(0,components_async.Z)(()=>Promise.all([__webpack_require__.e(9810),__webpack_require__.e(7383),__webpack_require__.e(7583),__webpack_require__.e(3830)]).then(__webpack_require__.bind(__webpack_require__,63830))),Settings=props=>{const[activePage,setActivePage]=(0,react.useState)(window.location.pathname),{t}=(0,commonjs.$G)(["admin_settings","common"]),navigate=(0,react_router_dom_production_min.useNavigate)(),handleSelect=selectedKey=>{navigate(selectedKey),setActivePage(selectedKey)};return react.createElement(react.Fragment,null,react.createElement("div",{className:"admin-settings-navbar"},react.createElement(Nav_default(),{variant:"pills",activeKey:activePage,onSelect:handleSelect},react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{eventKey:"/admin/settings/license",title:"License"},t("license"))),react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{eventKey:"/admin/settings/configuration",title:"Configuration"},t("configuration"))),react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{eventKey:"/admin/settings/branding",title:"Branding"},t("branding"))),react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{eventKey:"/admin/settings/texts",title:"Texts"},t("common:texts"))),react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{eventKey:"/admin/settings/credentials",title:"Roles"},t("roles"))),react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{disabled:!0,eventKey:"/admin/settings/badges",title:"Badges"},t("common:badges"))),react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{eventKey:"/admin/settings/user-fields",title:"User Fields"},t("user-fields"))),react.createElement(Nav_default().Item,null,react.createElement(Nav_default().Link,{eventKey:"/admin/settings/backups",title:"Backups"},t("backups"))))),react.createElement(react_router_dom_production_min.Routes,null,react.createElement(react_router_dom_production_min.Route,{path:"license",element:react.createElement(License,{admin:props.admin,uploadLicense:props.uploadLicense,getLicense:props.getLicense,user:props.user,removeLicense:props.removeLicense,getUsers:props.getUsers})}),react.createElement(react_router_dom_production_min.Route,{path:"configuration",element:react.createElement(Configuration,{admin:props.admin,user:props.user,getSettings:props.getSettings,updateSettings:props.updateSettings})}),react.createElement(react_router_dom_production_min.Route,{path:"branding",element:react.createElement(branding,{admin:props.admin,user:props.user,uploadLogo:props.uploadLogo,updateSettings:props.updateSettings})}),react.createElement(react_router_dom_production_min.Route,{path:"texts",element:react.createElement(texts,{addCustomTranslation:props.addCustomTranslation,translations:props.translations,removeCustomTranslation:props.removeCustomTranslation})}),react.createElement(react_router_dom_production_min.Route,{path:"credentials",element:react.createElement(Roles,{admin:props.admin,createRole:props.createRole,getAllRoles:props.getAllRoles,deleteRole:props.deleteRole,updateRole:props.updateRole})}),react.createElement(react_router_dom_production_min.Route,{path:"user-fields",element:react.createElement(user_fields,{admin:props.admin,user:props.user,createCustomField:props.createCustomField,deleteCustomField:props.deleteCustomField,getCustomFields:props.getCustomFields,incrementFieldPosition:props.incrementFieldPosition,decrementFieldPosition:props.decrementFieldPosition})}),react.createElement(react_router_dom_production_min.Route,{path:"backups",element:react.createElement(Backups,{admin:props.admin,user:props.user,createBackup:props.createBackup,getBackups:props.getBackups,deleteBackup:props.deleteBackup})})))};Settings.propTypes={addCustomTranslation:prop_types_default().func.isRequired,admin:prop_types_default().object.isRequired,createBackup:prop_types_default().func.isRequired,createCustomField:prop_types_default().func.isRequired,createRole:prop_types_default().func.isRequired,decrementFieldPosition:prop_types_default().func.isRequired,deleteBackup:prop_types_default().func.isRequired,deleteCustomField:prop_types_default().func.isRequired,deleteRole:prop_types_default().func.isRequired,getAllRoles:prop_types_default().func.isRequired,getBackups:prop_types_default().func.isRequired,getCustomFields:prop_types_default().func.isRequired,getLicense:prop_types_default().func.isRequired,getSettings:prop_types_default().func.isRequired,getUsers:prop_types_default().func.isRequired,incrementFieldPosition:prop_types_default().func.isRequired,removeCustomTranslation:prop_types_default().func.isRequired,removeLicense:prop_types_default().func.isRequired,translations:prop_types_default().object.isRequired,updateRole:prop_types_default().func.isRequired,updateSettings:prop_types_default().func.isRequired,uploadLicense:prop_types_default().func.isRequired,uploadLogo:prop_types_default().func.isRequired,user:prop_types_default().object.isRequired};var admin_settings=Settings,user=__webpack_require__(37344),notification=__webpack_require__(16120),file=__webpack_require__(7534),custom_field=__webpack_require__(1446),axios=__webpack_require__(9669),axios_default=__webpack_require__.n(axios),server=__webpack_require__(94204),i18next=__webpack_require__(41631),action_types=__webpack_require__(84499),__async=(__this,__arguments,generator)=>new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}},rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}},step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())});const getBackups=dispatch=>__async(void 0,null,function*(){try{const res=yield axios_default().get(server.ZP+"/get_backups");dispatch({type:action_types.MI,payload:{backups:res.data.backups}})}catch(err){return(0,notification.EG)(dispatch,err)}}),getBackupsInjector=dispatch=>()=>__async(void 0,null,function*(){yield getBackups(dispatch)}),createBackup=dispatch=>__async(void 0,null,function*(){try{const res=yield axios_default().post(server.ZP+"/create_backup");(0,notification.wN)(dispatch,{title:i18next.ZP.t("common:created"),message:res.data.message,level:"success"}),dispatch({type:action_types.uv,payload:{backup:res.data.backup}})}catch(err){return(0,notification.EG)(dispatch,err)}}),createBackupInjector=dispatch=>()=>__async(void 0,null,function*(){yield createBackup(dispatch)}),deleteBackup=(dispatch,id)=>__async(void 0,null,function*(){try{const res=yield axios_default().post(server.ZP+"/delete_backup",{id});(0,notification.wN)(dispatch,{title:i18next.ZP.t("common:deleted"),message:res.data.message,level:"success"}),dispatch({type:action_types.pA,payload:{id}})}catch(err){return(0,notification.EG)(dispatch,err)}}),deleteBackupInjector=dispatch=>id=>__async(void 0,null,function*(){yield deleteBackup(dispatch,id)});var settings=__webpack_require__(90637),helpers_axios=__webpack_require__(9908),role_async=(__this,__arguments,generator)=>new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}},rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}},step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())});const getAllRoles=dispatch=>role_async(void 0,null,function*(){try{const res=yield helpers_axios.Yy.get(server.ZP+"/get_all_roles");dispatch({type:action_types.Qd,payload:{roles:res.data.roles}})}catch(err){return(0,notification.EG)(dispatch,err)}}),getAllRolesInjector=dispatch=>()=>role_async(void 0,null,function*(){yield getAllRoles(dispatch)}),createRole=(_0,_1)=>role_async(void 0,[_0,_1],function*(dispatch,{title,authorizedRoles,searchContext,permissions}){try{const res=yield helpers_axios.Yy.post(server.ZP+"/create_role",{title,authorizedRoles,searchContext,permissions});return(0,notification.wN)(dispatch,{title:i18next.ZP.t("common:created"),message:res.data.message,level:"success"}),dispatch({type:action_types._R,payload:res.data}),res}catch(err){return(0,notification.EG)(dispatch,err),err}}),createRoleInjector=dispatch=>_0=>role_async(void 0,[_0],function*({title,authorizedRoles,searchContext,permissions}){return yield createRole(dispatch,{title,authorizedRoles,searchContext,permissions})}),updateRole=(_0,_1)=>role_async(void 0,[_0,_1],function*(dispatch,{id,title,authorizedRoles,searchContext,permissions}){try{const res=yield helpers_axios.Yy.post(server.ZP+"/update_role",{id,title,authorizedRoles,searchContext,permissions});return(0,notification.wN)(dispatch,{title:i18next.ZP.t("common:updated"),message:res.data.message,level:"success"}),dispatch({type:action_types.Py,payload:res.data}),res}catch(err){return(0,notification.EG)(dispatch,err),err}}),updateRoleInjector=dispatch=>_0=>role_async(void 0,[_0],function*({id,title,authorizedRoles,searchContext,permissions}){return yield updateRole(dispatch,{id,title,authorizedRoles,searchContext,permissions})}),deleteRole=(dispatch,id)=>role_async(void 0,null,function*(){try{const res=yield helpers_axios.Yy.post(server.ZP+"/delete_role",{id});(0,notification.wN)(dispatch,{title:i18next.ZP.t("common:deleted"),message:res.data.message,level:"success"}),dispatch({type:action_types.s_,payload:{id}})}catch(err){return(0,notification.EG)(dispatch,err)}}),deleteRoleInjector=dispatch=>id=>role_async(void 0,null,function*(){yield deleteRole(dispatch,id)});function mapStateToProps(state){return{admin:state.admin,user:state.user,translations:state.translations}}function mapDispatchToProps(dispatch){return{addCustomTranslation:(0,settings.qn)(dispatch),addNotification:(0,notification.pP)(dispatch),getAllRoles:getAllRolesInjector(dispatch),getBackups:getBackupsInjector(dispatch),getUsers:(0,user.fP)(dispatch),createBackup:createBackupInjector(dispatch),createCustomField:(0,custom_field.mm)(dispatch),createRole:createRoleInjector(dispatch),deleteBackup:deleteBackupInjector(dispatch),deleteRole:deleteRoleInjector(dispatch),deleteCustomField:(0,custom_field.hb)(dispatch),getCustomFields:(0,custom_field.Qi)(dispatch),getLicense:(0,file.rt)(dispatch),getSettings:(0,settings.px)(dispatch),removeCustomTranslation:(0,settings.Jw)(dispatch),uploadLogo:(0,file.B_)(dispatch),updateRole:updateRoleInjector(dispatch),updateSettings:(0,settings.Pj)(dispatch),uploadLicense:(0,file.z0)(dispatch),removeLicense:(0,file.i1)(dispatch),incrementFieldPosition:(0,custom_field.CP)(dispatch),decrementFieldPosition:(0,custom_field.Np)(dispatch)}}var visible_admin_settings=(0,lib.connect)(mapStateToProps,mapDispatchToProps)(admin_settings)}}]);

//# sourceMappingURL=2407.b0c3bb90.chunk.js.map