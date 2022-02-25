(self.webpackChunkisle_dashboard=self.webpackChunkisle_dashboard||[]).push([[9859],{59859:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),prop_types__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(45697),prop_types__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_10__),path__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(26470),path__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__),react_bootstrap_Badge__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(86100),react_bootstrap_Badge__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(react_bootstrap_Badge__WEBPACK_IMPORTED_MODULE_8__),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(89876),react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9___default=__webpack_require__.n(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9__),react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(89194),react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7__),react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(17383),react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3__),react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(26199),react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_6__),react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(1266),react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(28269),react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_4__),react_avatar_editor__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(27011),react_avatar_editor__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_avatar_editor__WEBPACK_IMPORTED_MODULE_2__),__defProp=Object.defineProperty,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__publicField=(obj,key,value)=>(__defNormalProp(obj,typeof key!="symbol"?key+"":key,value),value);function getResizedCanvas(canvas,newWidth,newHeight){const tmpCanvas=document.createElement("canvas");return tmpCanvas.width=newWidth,tmpCanvas.height=newHeight,tmpCanvas.getContext("2d").drawImage(canvas,0,0,canvas.width,canvas.height,0,0,newWidth,newHeight),tmpCanvas}class ProfilePicModal extends react__WEBPACK_IMPORTED_MODULE_0__.Component{constructor(props){super(props);__publicField(this,"handleUpload",()=>{if(this.editor){const canvas=this.editor.getImageScaledToCanvas();canvas.toBlob(img=>{const avatarData=new FormData,thumbnailData=new FormData;getResizedCanvas(canvas,80,80).toBlob(thumbnail=>{const filename=`${this.props.user.id}_${this.state.zoom}_${this.state.rotate}${this.state.ext}`,thumbnailName=filename;avatarData.append("avatar",img,filename),thumbnailData.append("thumbnail",thumbnail,thumbnailName),this.props.uploadProfilePic({avatarData,thumbnailData})})})}}),__publicField(this,"handleFileSelection",e=>{const file=e.target.files[0];if(file){const ext2=path__WEBPACK_IMPORTED_MODULE_1___default().extname(file.name);this.setState({actualFile:file,ext:ext2})}}),__publicField(this,"changeZoom",e=>{this.setState({zoom:Number(e.target.value)})}),__publicField(this,"renderAvatarEditor",()=>{const t=this.props.t;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_avatar_editor__WEBPACK_IMPORTED_MODULE_2___default(),{className:"avatarEditor",ref:editor=>{this.editor=editor},image:this.state.actualFile,width:200,height:200,border:[80,50],crossOrigin:"anonymous",color:[110,98,98,.29],scale:this.state.zoom,rotate:this.state.rotate}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3___default().Group,{as:react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_4___default(),controlId:"form-zoom"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3___default().Label,{column:!0,sm:"2"},t("zoom")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_5__.default,{sm:"10"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_6___default(),{step:.05,type:"range",defaultValue:1,min:.5,max:3,onChange:this.changeZoom}))))}),__publicField(this,"rotateFactory",degrees=>()=>{this.setState({rotate:this.state.rotate+degrees})});let ext;props.user.picture?ext=props.user.picture.substr(props.user.picture.lastIndexOf(".")):ext=null,this.state={actualFile:props.user.picture,zoom:1.2,ext,rotate:0}}componentDidUpdate(prevProps){this.props.user.picture!==prevProps.user.picture&&this.setState({actualFile:this.props.user.picture,rotate:0,zoom:1.2})}render(){const{t}=this.props;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7___default(),{onHide:this.props.onHide,show:this.props.show,dialogClassName:"profile-pic-modal"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7___default().Header,{closeButton:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7___default().Title,{as:"h3"},t("profile-picture"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7___default().Body,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3___default().Group,{style:{marginBottom:0}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3___default().Label,{htmlFor:"imageUpload",style:{cursor:"pointer"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Badge__WEBPACK_IMPORTED_MODULE_8___default(),{bg:"success",style:{fontSize:"1em"}},t("select-file"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_FormControl__WEBPACK_IMPORTED_MODULE_6___default(),{id:"imageUpload",style:{display:"none"},type:"file",onChange:this.handleFileSelection,accept:"image/*"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{style:{paddingLeft:10}},t("click-to-upload"))),this.renderAvatarEditor(),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3___default().Group,{as:react_bootstrap_Row__WEBPACK_IMPORTED_MODULE_4___default(),controlId:"form-rotate"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Form__WEBPACK_IMPORTED_MODULE_3___default().Label,{column:!0,sm:"2"},t("rotate")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_5__.default,{sm:"5"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9___default(),{block:!0,variant:"secondary",onClick:this.rotateFactory(-90)},t("left"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Col__WEBPACK_IMPORTED_MODULE_5__.default,{sm:"5"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9___default(),{block:!0,variant:"secondary",style:{float:"right"},onClick:this.rotateFactory(90)},t("right"))))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Modal__WEBPACK_IMPORTED_MODULE_7___default().Footer,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_bootstrap_Button__WEBPACK_IMPORTED_MODULE_9___default(),{onClick:this.handleUpload},t("save-and-close"))))}}ProfilePicModal.propTypes={onHide:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,show:prop_types__WEBPACK_IMPORTED_MODULE_10___default().bool.isRequired,t:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,uploadProfilePic:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,user:prop_types__WEBPACK_IMPORTED_MODULE_10___default().object.isRequired},__webpack_exports__.default=ProfilePicModal},27011:function(module,__unused_webpack_exports,__webpack_require__){(function(e,t){module.exports=t(__webpack_require__(45697),__webpack_require__(67294))})(this,function(e,t){"use strict";function o(e2){return e2&&typeof e2=="object"&&"default"in e2?e2:{default:e2}}var n=o(e),i=o(t);function r(e2,t2){for(var o2=0;o2<t2.length;o2++){var n2=t2[o2];n2.enumerable=n2.enumerable||!1,n2.configurable=!0,"value"in n2&&(n2.writable=!0),Object.defineProperty(e2,n2.key,n2)}}function s(e2,t2,o2){return t2 in e2?Object.defineProperty(e2,t2,{value:o2,enumerable:!0,configurable:!0,writable:!0}):e2[t2]=o2,e2}function u(){return(u=Object.assign||function(e2){for(var t2=1;t2<arguments.length;t2++){var o2=arguments[t2];for(var n2 in o2)Object.prototype.hasOwnProperty.call(o2,n2)&&(e2[n2]=o2[n2])}return e2}).apply(this,arguments)}function a(t2,e2){var o2,n2=Object.keys(t2);return Object.getOwnPropertySymbols&&(o2=Object.getOwnPropertySymbols(t2),e2&&(o2=o2.filter(function(e3){return Object.getOwnPropertyDescriptor(t2,e3).enumerable})),n2.push.apply(n2,o2)),n2}function y(t2){for(var e2=1;e2<arguments.length;e2++){var o2=arguments[e2]!=null?arguments[e2]:{};e2%2?a(Object(o2),!0).forEach(function(e3){s(t2,e3,o2[e3])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t2,Object.getOwnPropertyDescriptors(o2)):a(Object(o2)).forEach(function(e3){Object.defineProperty(t2,e3,Object.getOwnPropertyDescriptor(o2,e3))})}return t2}function h(e2){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e3){return e3.__proto__||Object.getPrototypeOf(e3)})(e2)}function c(e2,t2){return(c=Object.setPrototypeOf||function(e3,t3){return e3.__proto__=t3,e3})(e2,t2)}function l(e2,t2){if(e2==null)return{};var o2,n2=function(e3,t3){if(e3==null)return{};for(var o3,n3={},a3=Object.keys(e3),r3=0;r3<a3.length;r3++)o3=a3[r3],0<=t3.indexOf(o3)||(n3[o3]=e3[o3]);return n3}(e2,t2);if(Object.getOwnPropertySymbols)for(var a2=Object.getOwnPropertySymbols(e2),r2=0;r2<a2.length;r2++)o2=a2[r2],0<=t2.indexOf(o2)||Object.prototype.propertyIsEnumerable.call(e2,o2)&&(n2[o2]=e2[o2]);return n2}function d(e2){if(e2===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e2}function p(r2){var i2=function(){if(typeof Reflect=="undefined"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e2){return!1}}();return function(){var e2,t2,o2,n2,a2=h(r2);return t2=i2?(e2=h(this).constructor,Reflect.construct(a2,arguments,e2)):a2.apply(this,arguments),o2=this,!(n2=t2)||typeof n2!="object"&&typeof n2!="function"?d(o2):n2}}function m(e2,t2){return function(e3){if(Array.isArray(e3))return e3}(e2)||function(e3,t3){if(!(typeof Symbol=="undefined"||!(Symbol.iterator in Object(e3)))){var o2=[],n2=!0,a2=!1,r2=void 0;try{for(var i2,s2=e3[Symbol.iterator]();!(n2=(i2=s2.next()).done)&&(o2.push(i2.value),!t3||o2.length!==t3);n2=!0);}catch(e4){a2=!0,r2=e4}finally{try{n2||s2.return==null||s2.return()}finally{if(a2)throw r2}}return o2}}(e2,t2)||g(e2,t2)||function(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()}function g(e2,t2){if(e2){if(typeof e2=="string")return f(e2,t2);var o2=Object.prototype.toString.call(e2).slice(8,-1);return o2==="Object"&&e2.constructor&&(o2=e2.constructor.name),o2==="Map"||o2==="Set"?Array.from(e2):o2==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o2)?f(e2,t2):void 0}}function f(e2,t2){(t2==null||t2>e2.length)&&(t2=e2.length);for(var o2=0,n2=new Array(t2);o2<t2;o2++)n2[o2]=e2[o2];return n2}function v(a2,r2){return new Promise(function(e2,t2){var o2,n2=new Image;n2.onload=function(){return e2(n2)},n2.onerror=t2,!((o2=a2)!==null&&!!o2.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i))&&r2&&(n2.crossOrigin=r2),n2.src=a2})}var b,w=!(typeof window=="undefined"||typeof navigator=="undefined"||!("ontouchstart"in window||0<navigator.msMaxTouchPoints)),M=typeof File!="undefined",O={touch:{react:{down:"onTouchStart",mouseDown:"onMouseDown",drag:"onTouchMove",move:"onTouchMove",mouseMove:"onMouseMove",up:"onTouchEnd",mouseUp:"onMouseUp"},native:{down:"touchstart",mouseDown:"mousedown",drag:"touchmove",move:"touchmove",mouseMove:"mousemove",up:"touchend",mouseUp:"mouseup"}},desktop:{react:{down:"onMouseDown",drag:"onDragOver",move:"onMouseMove",up:"onMouseUp"},native:{down:"mousedown",drag:"dragStart",move:"mousemove",up:"mouseup"}}},I=w?O.touch:O.desktop,P=typeof window!="undefined"&&window.devicePixelRatio?window.devicePixelRatio:1,C={x:.5,y:.5},x=function(){(function(e3,t3){if(typeof t3!="function"&&t3!==null)throw new TypeError("Super expression must either be null or a function");e3.prototype=Object.create(t3&&t3.prototype,{constructor:{value:e3,writable:!0,configurable:!0}}),t3&&c(e3,t3)})(a2,i.default.Component);var e2,t2,o2,n2=p(a2);function a2(e3){var v2;return function(e4,t3){if(!(e4 instanceof t3))throw new TypeError("Cannot call a class as a function")}(this,a2),s(d(v2=n2.call(this,e3)),"state",{drag:!1,my:null,mx:null,image:C}),s(d(v2),"handleImageReady",function(e4){var t3=v2.getInitialSize(e4.width,e4.height);t3.resource=e4,t3.x=.5,t3.y=.5,t3.backgroundColor=v2.props.backgroundColor,v2.setState({drag:!1,image:t3},v2.props.onImageReady),v2.props.onLoadSuccess(t3)}),s(d(v2),"clearImage",function(){v2.canvas.getContext("2d").clearRect(0,0,v2.canvas.width,v2.canvas.height),v2.setState({image:C})}),s(d(v2),"handleMouseDown",function(e4){(e4=e4||window.event).preventDefault(),v2.setState({drag:!0,mx:null,my:null})}),s(d(v2),"handleMouseUp",function(){v2.state.drag&&(v2.setState({drag:!1}),v2.props.onMouseUp())}),s(d(v2),"handleMouseMove",function(e4){var t3,o3,n3,a3,r2,i2,s2,u2,h2,c2,l2,d2,p2,g2,f2,m2;e4=e4||window.event,v2.state.drag!==!1&&(e4.preventDefault(),n3={mx:t3=e4.targetTouches?e4.targetTouches[0].pageX:e4.clientX,my:o3=e4.targetTouches?e4.targetTouches[0].pageY:e4.clientY},m2=v2.props.rotate,m2=(m2%=360)<0?m2+360:m2,v2.state.mx&&v2.state.my&&(a3=v2.state.mx-t3,r2=v2.state.my-o3,i2=v2.state.image.width*v2.props.scale,s2=v2.state.image.height*v2.props.scale,h2=(u2=v2.getCroppingRect()).x,c2=u2.y,h2*=i2,c2*=s2,l2=function(e5){return e5*(Math.PI/180)},d2=Math.cos(l2(m2)),g2=c2+-a3*(p2=Math.sin(l2(m2)))+r2*d2,f2={x:(h2+a3*d2+r2*p2)/i2+1/v2.props.scale*v2.getXScale()/2,y:g2/s2+1/v2.props.scale*v2.getYScale()/2},v2.props.onPositionChange(f2),n3.image=y(y({},v2.state.image),f2)),v2.setState(n3),v2.props.onMouseMove(e4))}),s(d(v2),"setCanvas",function(e4){v2.canvas=e4}),v2.canvas=null,v2}return e2=a2,(t2=[{key:"componentDidMount",value:function(){this.props.disableHiDPIScaling&&(P=1);var e3,t3,o3=this.canvas.getContext("2d");this.props.image&&this.loadImage(this.props.image),this.paint(o3),document&&(e3=!!function(){var t4=!1;try{var e4=Object.defineProperty({},"passive",{get:function(){t4=!0}});window.addEventListener("test",e4,e4),window.removeEventListener("test",e4,e4)}catch(e5){t4=!1}return t4}()&&{passive:!1},t3=I.native,document.addEventListener(t3.move,this.handleMouseMove,e3),document.addEventListener(t3.up,this.handleMouseUp,e3),w&&(document.addEventListener(t3.mouseMove,this.handleMouseMove,e3),document.addEventListener(t3.mouseUp,this.handleMouseUp,e3)))}},{key:"componentDidUpdate",value:function(e3,t3){this.props.image&&this.props.image!==e3.image||this.props.width!==e3.width||this.props.height!==e3.height||this.props.backgroundColor!==e3.backgroundColor?this.loadImage(this.props.image):this.props.image||t3.image===C||this.clearImage();var o3=this.canvas.getContext("2d");o3.clearRect(0,0,this.canvas.width,this.canvas.height),this.paint(o3),this.paintImage(o3,this.state.image,this.props.border),e3.image===this.props.image&&e3.width===this.props.width&&e3.height===this.props.height&&e3.position===this.props.position&&e3.scale===this.props.scale&&e3.rotate===this.props.rotate&&t3.my===this.state.my&&t3.mx===this.state.mx&&t3.image.x===this.state.image.x&&t3.image.y===this.state.image.y&&t3.backgroundColor===this.state.backgroundColor||this.props.onImageChange()}},{key:"componentWillUnmount",value:function(){var e3;document&&(e3=I.native,document.removeEventListener(e3.move,this.handleMouseMove,!1),document.removeEventListener(e3.up,this.handleMouseUp,!1),w&&(document.removeEventListener(e3.mouseMove,this.handleMouseMove,!1),document.removeEventListener(e3.mouseUp,this.handleMouseUp,!1)))}},{key:"isVertical",value:function(){return!this.props.disableCanvasRotation&&this.props.rotate%180!=0}},{key:"getBorders",value:function(e3){var t3=0<arguments.length&&e3!==void 0?e3:this.props.border;return Array.isArray(t3)?t3:[t3,t3]}},{key:"getDimensions",value:function(){var e3=this.props,t3=e3.width,o3=e3.height,n3=e3.rotate,a3=e3.border,r2={},i2=m(this.getBorders(a3),2),s2=i2[0],u2=i2[1],h2=t3,c2=o3;return this.isVertical()?(r2.width=c2,r2.height=h2):(r2.width=h2,r2.height=c2),r2.width+=2*s2,r2.height+=2*u2,{canvas:r2,rotate:n3,width:t3,height:o3,border:a3}}},{key:"getImage",value:function(){var e3=this.getCroppingRect(),t3=this.state.image;e3.x*=t3.resource.width,e3.y*=t3.resource.height,e3.width*=t3.resource.width,e3.height*=t3.resource.height;var o3=document.createElement("canvas");this.isVertical()?(o3.width=e3.height,o3.height=e3.width):(o3.width=e3.width,o3.height=e3.height);var n3=o3.getContext("2d");return n3.translate(o3.width/2,o3.height/2),n3.rotate(this.props.rotate*Math.PI/180),n3.translate(-o3.width/2,-o3.height/2),this.isVertical()&&n3.translate((o3.width-o3.height)/2,(o3.height-o3.width)/2),t3.backgroundColor&&(n3.fillStyle=t3.backgroundColor,n3.fillRect(-e3.x,-e3.y,t3.resource.width,t3.resource.height)),n3.drawImage(t3.resource,-e3.x,-e3.y),o3}},{key:"getImageScaledToCanvas",value:function(){var e3=this.getDimensions(),t3=e3.width,o3=e3.height,n3=document.createElement("canvas");return this.isVertical()?(n3.width=o3,n3.height=t3):(n3.width=t3,n3.height=o3),this.paintImage(n3.getContext("2d"),this.state.image,0,1),n3}},{key:"getXScale",value:function(){var e3=this.props.width/this.props.height,t3=this.state.image.width/this.state.image.height;return Math.min(1,e3/t3)}},{key:"getYScale",value:function(){var e3=this.props.height/this.props.width,t3=this.state.image.height/this.state.image.width;return Math.min(1,e3/t3)}},{key:"getCroppingRect",value:function(){var e3=this.props.position||{x:this.state.image.x,y:this.state.image.y},t3=1/this.props.scale*this.getXScale(),o3=1/this.props.scale*this.getYScale(),n3={x:e3.x-t3/2,y:e3.y-o3/2,width:t3,height:o3},a3=0,r2=1-n3.width,i2=0,s2=1-n3.height;return(this.props.disableBoundaryChecks||1<t3||1<o3)&&(a3=-n3.width,i2=-n3.height,s2=r2=1),y(y({},n3),{},{x:Math.max(a3,Math.min(n3.x,r2)),y:Math.max(i2,Math.min(n3.y,s2))})}},{key:"loadImage",value:function(e3){var t3;M&&e3 instanceof File?this.loadingImage=(t3=e3,new Promise(function(o3,n3){var e4=new FileReader;e4.onload=function(e5){try{var t4=v(e5.target.result);o3(t4)}catch(e6){n3(e6)}},e4.readAsDataURL(t3)}).then(this.handleImageReady).catch(this.props.onLoadFailure)):typeof e3=="string"&&(this.loadingImage=v(e3,this.props.crossOrigin).then(this.handleImageReady).catch(this.props.onLoadFailure))}},{key:"getInitialSize",value:function(e3,t3){var o3,n3,a3=this.getDimensions();return t3/e3<a3.height/a3.width?n3=e3*((o3=this.getDimensions().height)/t3):o3=t3*((n3=this.getDimensions().width)/e3),{height:o3,width:n3}}},{key:"paintImage",value:function(e3,t3,o3,n3){var a3,r2=3<arguments.length&&n3!==void 0?n3:P;t3.resource&&(a3=this.calculatePosition(t3,o3),e3.save(),e3.translate(e3.canvas.width/2,e3.canvas.height/2),e3.rotate(this.props.rotate*Math.PI/180),e3.translate(-e3.canvas.width/2,-e3.canvas.height/2),this.isVertical()&&e3.translate((e3.canvas.width-e3.canvas.height)/2,(e3.canvas.height-e3.canvas.width)/2),e3.scale(r2,r2),e3.globalCompositeOperation="destination-over",e3.drawImage(t3.resource,a3.x,a3.y,a3.width,a3.height),t3.backgroundColor&&(e3.fillStyle=t3.backgroundColor,e3.fillRect(a3.x,a3.y,a3.width,a3.height)),e3.restore())}},{key:"calculatePosition",value:function(e3,t3){e3=e3||this.state.image;var o3=m(this.getBorders(t3),2),n3=o3[0],a3=o3[1],r2=this.getCroppingRect(),i2=e3.width*this.props.scale,s2=e3.height*this.props.scale,u2=-r2.x*i2,h2=-r2.y*s2;return this.isVertical()?(u2+=a3,h2+=n3):(u2+=n3,h2+=a3),{x:u2,y:h2,height:s2,width:i2}}},{key:"paint",value:function(e3){e3.save(),e3.scale(P,P),e3.translate(0,0),e3.fillStyle="rgba("+this.props.color.slice(0,4).join(",")+")";var t3,o3,n3,a3,r2,i2,s2,u2,h2=this.props.borderRadius,c2=this.getDimensions(),l2=m(this.getBorders(c2.border),2),d2=l2[0],p2=l2[1],g2=c2.canvas.height,f2=c2.canvas.width,h2=Math.max(h2,0);h2=Math.min(h2,f2/2-d2,g2/2-p2),e3.beginPath(),t3=e3,a3=f2-2*(o3=d2),r2=g2-2*(n3=p2),(i2=h2)===0?t3.rect(o3,n3,a3,r2):(s2=a3-i2,u2=r2-i2,t3.translate(o3,n3),t3.arc(i2,i2,i2,Math.PI,1.5*Math.PI),t3.lineTo(s2,0),t3.arc(s2,i2,i2,1.5*Math.PI,2*Math.PI),t3.lineTo(a3,u2),t3.arc(s2,u2,i2,2*Math.PI,.5*Math.PI),t3.lineTo(i2,r2),t3.arc(i2,u2,i2,.5*Math.PI,Math.PI),t3.translate(-o3,-n3)),e3.rect(f2,0,-f2,g2),e3.fill("evenodd"),e3.restore()}},{key:"render",value:function(){var e3=this.props,t3=(e3.scale,e3.rotate,e3.image,e3.border,e3.borderRadius,e3.width,e3.height,e3.position,e3.color,e3.backgroundColor,e3.style),o3=(e3.crossOrigin,e3.onLoadFailure,e3.onLoadSuccess,e3.onImageReady,e3.onImageChange,e3.onMouseUp,e3.onMouseMove,e3.onPositionChange,e3.disableBoundaryChecks,e3.disableHiDPIScaling,e3.disableCanvasRotation,l(e3,["scale","rotate","image","border","borderRadius","width","height","position","color","backgroundColor","style","crossOrigin","onLoadFailure","onLoadSuccess","onImageReady","onImageChange","onMouseUp","onMouseMove","onPositionChange","disableBoundaryChecks","disableHiDPIScaling","disableCanvasRotation"])),n3=this.getDimensions(),a3={width:n3.canvas.width,height:n3.canvas.height,cursor:this.state.drag?"grabbing":"grab",touchAction:"none"},r2={width:n3.canvas.width*P,height:n3.canvas.height*P,style:y(y({},a3),t3)};return r2[I.react.down]=this.handleMouseDown,w&&(r2[I.react.mouseDown]=this.handleMouseDown),i.default.createElement("canvas",u({ref:this.setCanvas},r2,o3))}}])&&r(e2.prototype,t2),o2&&r(e2,o2),a2}();return s(x,"propTypes",{scale:n.default.number,rotate:n.default.number,image:n.default.oneOfType([n.default.string].concat(function(e2){if(Array.isArray(e2))return f(e2)}(b=M?[n.default.instanceOf(File)]:[])||function(e2){if(typeof Symbol!="undefined"&&Symbol.iterator in Object(e2))return Array.from(e2)}(b)||g(b)||function(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}())),border:n.default.oneOfType([n.default.number,n.default.arrayOf(n.default.number)]),borderRadius:n.default.number,width:n.default.number,height:n.default.number,position:n.default.shape({x:n.default.number,y:n.default.number}),color:n.default.arrayOf(n.default.number),backgroundColor:n.default.string,crossOrigin:n.default.oneOf(["","anonymous","use-credentials"]),onLoadFailure:n.default.func,onLoadSuccess:n.default.func,onImageReady:n.default.func,onImageChange:n.default.func,onMouseUp:n.default.func,onMouseMove:n.default.func,onPositionChange:n.default.func,disableBoundaryChecks:n.default.bool,disableHiDPIScaling:n.default.bool,disableCanvasRotation:n.default.bool}),s(x,"defaultProps",{scale:1,rotate:0,border:25,borderRadius:0,width:200,height:200,color:[0,0,0,.5],onLoadFailure:function(){},onLoadSuccess:function(){},onImageReady:function(){},onImageChange:function(){},onMouseUp:function(){},onMouseMove:function(){},onPositionChange:function(){},disableBoundaryChecks:!1,disableHiDPIScaling:!1,disableCanvasRotation:!0}),x})}}]);

//# sourceMappingURL=9859.1eaff58b.chunk.js.map