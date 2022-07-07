"use strict";(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[674],{87195:function(module,__unused_webpack_exports,__webpack_require__){var objectKeys=__webpack_require__(25351),isObject=__webpack_require__(21405),hasOwnProp=__webpack_require__(10813),isBuffer=__webpack_require__(19750),isFunction=__webpack_require__(5726),typeOf=__webpack_require__(38882),deepCopy=__webpack_require__(58140);function deepMerge(target,source,level,copy,override,extend){var hasProp,isFunc,name,keys,curr,key,val,tmp,i;for(isFunc=isFunction(override),level-=1,keys=objectKeys(source),i=0;i<keys.length;i++)if(key=keys[i],hasProp=hasOwnProp(target,key),!(!hasProp&&!extend))if(val=source[key],hasProp){if(curr=target[key],name=typeOf(curr),!isBuffer(curr)&&name==="object"&&isObject(val)&&level){deepMerge(curr,val,level,copy,override,extend);continue}isFunc?(tmp=override(curr,val,key),copy&&tmp!==curr&&tmp===val&&(tmp=deepCopy(tmp)),target[key]=tmp):override&&(copy?target[key]=deepCopy(val):target[key]=val)}else copy?target[key]=deepCopy(val):target[key]=val}module.exports=deepMerge},26792:function(module,__unused_webpack_exports,__webpack_require__){var PINF=__webpack_require__(51235),DEFAULTS={level:PINF,override:!0,extend:!0,copy:!0};module.exports=DEFAULTS},75798:function(module,__unused_webpack_exports,__webpack_require__){var copy=__webpack_require__(58140),validate=__webpack_require__(26076),defaults=__webpack_require__(26792),mergefcn=__webpack_require__(47490);function factory(options){var opts,err;if(opts=copy(defaults),err=validate(opts,options),err)throw err;return mergefcn(opts)}module.exports=factory},28495:function(module,__unused_webpack_exports,__webpack_require__){var setReadOnly=__webpack_require__(93127),merge=__webpack_require__(38605),factory=__webpack_require__(75798);setReadOnly(merge,"factory",factory),module.exports=merge},38605:function(module,__unused_webpack_exports,__webpack_require__){var defaults=__webpack_require__(26792),mergefcn=__webpack_require__(47490),merge=mergefcn(defaults);module.exports=merge},47490:function(module,__unused_webpack_exports,__webpack_require__){var isObject=__webpack_require__(21405),deepMerge=__webpack_require__(87195);function mergefcn(opts){return merge;function merge(target){var nargs,arg,src,i;if(nargs=arguments.length-1,nargs<1)throw new Error("insufficient input arguments. Must provide both a target object and one or more source objects.");if(!isObject(target))throw new TypeError("invalid argument. First argument must be an object. Value: `"+target+"`.");for(src=new Array(nargs),i=0;i<nargs;i++){if(arg=arguments[i+1],!isObject(arg))throw new TypeError("invalid argument. A merge source must be an object. Value: `"+arg+"`.");src[i]=arg}for(i=0;i<nargs;i++)deepMerge(target,src[i],opts.level,opts.copy,opts.override,opts.extend);return target}}module.exports=mergefcn},26076:function(module,__unused_webpack_exports,__webpack_require__){var isObject=__webpack_require__(28586),hasOwnProp=__webpack_require__(10813),isBoolean=__webpack_require__(33276).isPrimitive,isFunction=__webpack_require__(5726),isPositiveInteger=__webpack_require__(19957).isPrimitive;function validate(opts,options){return isObject(options)?hasOwnProp(options,"level")&&(opts.level=options.level,!isPositiveInteger(opts.level))?new TypeError("invalid option. `level` option must be a positive integer. Option: `"+opts.level+"`."):hasOwnProp(options,"copy")&&(opts.copy=options.copy,!isBoolean(opts.copy))?new TypeError("invalid option. `copy` option must be a boolean primitive. Option: `"+opts.copy+"`."):hasOwnProp(options,"override")&&(opts.override=options.override,!isBoolean(opts.override)&&!isFunction(opts.override))?new TypeError("invalid option. `override` option must be either a boolean primitive or a function. Option: `"+opts.override+"`."):hasOwnProp(options,"extend")&&(opts.extend=options.extend,!isBoolean(opts.extend))?new TypeError("invalid option. `extend` option must be a boolean primitive. Option: `"+opts.extend+"`."):null:new TypeError("invalid argument. Options argument must be an object. Value: `"+options+"`.")}module.exports=validate},13509:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return main}});var react=__webpack_require__(45254),prop_types=__webpack_require__(45697),prop_types_default=__webpack_require__.n(prop_types),lib=__webpack_require__(5757),commonjs=__webpack_require__(81468),merge_lib=__webpack_require__(28495),lib_default=__webpack_require__.n(merge_lib);function zIndexAdjustment(child){if(!child)return 0;let node=child.parentNode;for(;node instanceof HTMLElement;){const zIndex=window.getComputedStyle(node).getPropertyValue("z-index");if(zIndex!=="auto")return zIndex;node=node.parentNode}return 0}var z_index_adjustment=zIndexAdjustment,__defProp=Object.defineProperty,__defProps=Object.defineProperties,__getOwnPropDescs=Object.getOwnPropertyDescriptors,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a},__spreadProps=(a,b)=>__defProps(a,__getOwnPropDescs(b));const STYLES={options:{arrowColor:"#fff",backgroundColor:"#fff",primaryColor:"#ca5800",textColor:"#333",overlayColor:"rgba(0, 0, 0, 0.5)",spotlightShadow:"0 0 15px rgba(0, 0, 0, 0.5)",beaconSize:36,zIndex:100},tooltipContainer:{textAlign:"left"}},Wrapper=props=>{const{t}=(0,commonjs.$G)("joyride"),{parentNode}=props,zIndex=(0,react.useRef)();(0,react.useEffect)(()=>{zIndex.current=z_index_adjustment(parentNode)},[parentNode]);const styles=lib_default()({},STYLES,props.styles);return styles.options&&styles.options.zIndex===100&&(styles.options.zIndex=zIndex.current+100),react.createElement(lib.ZP,__spreadProps(__spreadValues({showSkipButton:!0},props),{run:props.run,steps:props.steps,styles,locale:{back:t("back"),close:t("close"),last:t("last"),next:t("next"),skip:t("skip")}}))};Wrapper.propTypes={run:prop_types_default().bool,scrollToSteps:prop_types_default().bool,steps:prop_types_default().array.isRequired,parentNode:prop_types_default().node,styles:prop_types_default().object},Wrapper.defaultProps={run:!1,scrollToSteps:!0,parentNode:null,styles:{}};var main=Wrapper}}]);

//# sourceMappingURL=Joyride.7430db70.chunk.js.map