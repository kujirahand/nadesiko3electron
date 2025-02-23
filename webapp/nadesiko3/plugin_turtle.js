"use strict";(()=>{var g="data:image/png;base64,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",f="data:image/png;base64,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",A="data:image/png;base64,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";var u=class{constructor(t,s){this.sys=t,this.id=s,this.img=null,this.canvas=null,this.ctx=null,this.dir=270,this.cx=32,this.cy=32,this.x=0,this.y=0,this.color="black",this.lineWidth=4,this.flagDown=!0,this.flagBegeinPath=!1,this.f_update=!0,this.flagLoaded=!1,this.f_visible=!0,this.mlist=[]}clear(){this.mlist=[],document.body.removeChild(this.canvas)}loadImage(t,s){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.canvas.id=this.id,this.img=document.createElement("img"),this.img.onload=()=>{this.cx=this.img.width/2,this.cy=this.img.height/2,this.canvas.width=this.img.width,this.canvas.height=this.img.height,this.flagLoaded=!0,this.f_update=!0,this.canvas.style.position="absolute",document.body.appendChild(this.canvas),s(this)},this.img.onerror=()=>{console.log("\u30AB\u30E1\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557"),this.flagLoaded=!0,this.f_visible=!1,this.f_update=!0,s(this)},this.img.src=t}},c=class e{static getInstance(t){e.instance===void 0&&(e.instance=new e(t));let s=e.instance;return s.instanceCount+=1,e.instance}constructor(t){this.sys=t,this.turtles=[],this.target=-1,this.ctx=null,this.canvas=null,this.canvas_r={left:0,top:0,width:640,height:400},this.flagSetTimer=!1,this.instanceCount=0,this.timerId=null}clearAll(){for(let t=0;t<this.turtles.length;t++)this.turtles[t].clear();this.turtles=[],this.canvas!==null&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.target=-1,this.flagSetTimer=!1}drawTurtle(t){let s=this.turtles[t];if(!s)return;let r=this.canvas_r;if(s.canvas.style.left=r.left+s.x-s.cx+"px",s.canvas.style.top=r.top+s.y-s.cx+"px",!!s.f_update&&s.flagLoaded&&(s.f_update=!1,s.ctx.clearRect(0,0,s.canvas.width,s.canvas.height),!!s.f_visible))if(s.dir!==270){let n=(s.dir+90)*.017453292519943295;s.ctx.save(),s.ctx.translate(s.cx,s.cy),s.ctx.rotate(n),s.ctx.translate(-s.cx,-s.cy),s.ctx.drawImage(s.img,0,0),s.ctx.restore()}else s.ctx.drawImage(s.img,0,0)}getCur(){if(this.turtles.length===0)throw Error("\u6700\u521D\u306B\u300E\u30AB\u30E1\u4F5C\u6210\u300F\u547D\u4EE4\u3092\u547C\u3073\u51FA\u3057\u3066\u304F\u3060\u3055\u3044\u3002");return this.turtles[this.target]}setTimer(){this.flagSetTimer||(this.flagSetTimer=!0,this.timerId&&clearTimeout(this.timerId),this.timerId=setTimeout(()=>{console.log("[TURTLE] Let's go!"),this.play()},1))}line(t,s,r,n,a){if(t&&!t.flagDown)return;let i=this.ctx;t.flagBegeinPath?i.lineTo(n,a):(i.beginPath(),i.lineWidth=t.lineWidth,i.strokeStyle=t.color,i.moveTo(s,r),i.lineTo(n,a),i.stroke())}addMacro(t){this.getCur().mlist.push(t),this.setTimer()}doMacro(t,s){if(!t.flagLoaded&&s>0)return!0;let r=t.mlist.shift();switch(r!==void 0?r[0]:""){case"xy":t.x=r[1],t.y=r[2];break;case"begin":this.ctx.beginPath(),this.ctx.moveTo(t.x,t.y),t.flagBegeinPath=!0;break;case"close":this.ctx.closePath(),t.flagBegeinPath=!1;break;case"fill":t.flagBegeinPath&&(this.ctx.closePath(),t.flagBegeinPath=!1),this.ctx.fill();break;case"stroke":t.flagBegeinPath&&(this.ctx.closePath(),t.flagBegeinPath=!1),this.ctx.stroke();break;case"text":this.ctx.fillText(r[1],t.x,t.y);break;case"textset":this.ctx.font=r[1];break;case"fillStyle":this.ctx.fillStyle=r[1];break;case"mv":{this.line(t,t.x,t.y,r[1],r[2]);let a=Math.atan2(r[2]-t.y,r[1]-t.x);t.dir=a*57.29577951308232,t.f_update=!0,t.x=r[1],t.y=r[2];break}case"fd":{let a=r[1]*r[2],i=t.dir*.017453292519943295,o=t.x+Math.cos(i)*a,l=t.y+Math.sin(i)*a;this.line(t,t.x,t.y,o,l),t.x=o,t.y=l;break}case"angle":{let a=r[1];t.dir=(a-90+360)%360,t.f_update=!0;break}case"rotr":{let a=r[1];t.dir=(t.dir+a)%360,t.f_update=!0;break}case"rotl":{let a=r[1];t.dir=(t.dir-a+360)%360,t.f_update=!0;break}case"color":t.color=r[1],this.ctx.strokeStyle=t.color;break;case"size":t.lineWidth=r[1],this.ctx.lineWidth=t.lineWidth;break;case"penOn":t.flagDown=r[1];break;case"visible":t.f_visible=r[1],t.f_update=!0;break;case"changeImage":t.flagLoaded=!1,t.img.src=r[1];break}return t.flagLoaded&&this.drawTurtle(t.id),t.mlist.length>0}doMacroAll(t){let s=!1;for(let r=0;r<this.turtles.length;r++){let n=this.turtles[r];this.doMacro(n,t)&&(s=!0)}return s}play(){let t=this.sys.__getSysVar("\u30AB\u30E1\u901F\u5EA6"),s=this.doMacroAll(t);if(t<=0)for(;s;)s=this.doMacroAll(t);else if(s){this.timerId&&clearTimeout(this.timerId),this.timerId=setTimeout(()=>this.play(),t);return}console.log("[TURTLE] finished."),this.flagSetTimer=!1}setupCanvas(){let t=this.sys.__getSysVar("\u30AB\u30E1\u63CF\u753B\u5148");typeof t=="string"&&(t=document.getElementById(t)||document.querySelector(t),this.sys.__setSysVar("\u30AB\u30E1\u63CF\u753B\u5148",t)),console.log("\u30AB\u30E1\u63CF\u753B\u5148=",t);let s=this.canvas=t;if(!s)throw console.log("[ERROR] \u30AB\u30E1\u63CF\u753B\u5148\u304C\u898B\u5F53\u305F\u308A\u307E\u305B\u3093\u3002"+t),Error("\u30AB\u30E1\u63CF\u753B\u5148\u304C\u898B\u5F53\u305F\u308A\u307E\u305B\u3093\u3002");let r=this.ctx=s.getContext("2d");r.lineWidth=4,r.strokeStyle="black",r.lineCap="round",this.resizeCanvas()}resizeCanvas(){let s=this.canvas.getBoundingClientRect(),r=s.left+window.scrollX,n=s.top+window.scrollY;this.canvas_r={left:r,top:n,width:s.width,height:s.height}}createTurtle(t){this.setupCanvas();let s=this.turtles.length,r=new u(this.sys,s);return this.turtles.push(r),this.target=s,r.loadImage(t,n=>{this.drawTurtle(n.id),console.log(`tutrle.onload(id=${n.id})`)}),r.x=this.canvas_r.width/2,r.y=this.canvas_r.height/2,s}},h={meta:{type:"const",value:{pluginName:"plugin_turtle",description:"\u30BF\u30FC\u30C8\u30EB\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF\u30B9\u7528\u306E\u30D7\u30E9\u30B0\u30A4\u30F3",pluginVersion:"3.6.0",nakoRuntime:["wnako"],nakoVersion:"3.6.3"}},\u521D\u671F\u5316:{type:"func",josi:[],pure:!0,fn:function(e){let t=c.getInstance(e);e.tags.turtles=t}},"!\u30AF\u30EA\u30A2":{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.clearAll()}},\u30AB\u30E1\u4F5C\u6210:{type:"func",josi:[],pure:!0,fn:function(e){let t=e.__getSysVar("\u30AB\u30E1\u753B\u50CFURL");return e.tags.turtles.createTurtle(t)}},\u30BE\u30A6\u4F5C\u6210:{type:"func",josi:[],pure:!0,fn:function(e){let t=f;return e.tags.turtles.createTurtle(t)}},\u30D1\u30F3\u30C0\u4F5C\u6210:{type:"func",josi:[],pure:!0,fn:function(e){let t=A;return e.tags.turtles.createTurtle(t)}},\u30AB\u30E1\u64CD\u4F5C\u5BFE\u8C61\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078","\u306E"]],pure:!0,fn:function(e,t){t.tags.turtles.target=e},return_none:!0},\u30AB\u30E1\u63CF\u753B\u5148:{type:"var",value:"#turtle_cv"},\u30AB\u30E1\u753B\u50CFURL:{type:"var",value:g},\u30AB\u30E1\u753B\u50CF\u5909\u66F4:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["changeImage",e])},return_none:!0},\u30AB\u30E1\u901F\u5EA6:{type:"const",value:100},\u30AB\u30E1\u901F\u5EA6\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.__setSysVar("\u30AB\u30E1\u901F\u5EA6",e)}},\u30AB\u30E1\u79FB\u52D5:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["mv",e[0],e[1]])},return_none:!0},\u30AB\u30E1\u8D77\u70B9\u79FB\u52D5:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["xy",e[0],e[1]])},return_none:!0},\u30AB\u30E1\u9032:{type:"func",josi:[["\u3060\u3051"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["fd",e,1])},return_none:!0},\u30AB\u30E1\u623B:{type:"func",josi:[["\u3060\u3051"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["fd",e,-1])},return_none:!0},\u30AB\u30E1\u89D2\u5EA6\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078","\u306E"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["angle",e])},return_none:!0},\u30AB\u30E1\u53F3\u56DE\u8EE2:{type:"func",josi:[["\u3060\u3051"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["rotr",e])},return_none:!0},\u30AB\u30E1\u5DE6\u56DE\u8EE2:{type:"func",josi:[["\u3060\u3051"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["rotl",e])},return_none:!0},\u30AB\u30E1\u30DA\u30F3\u8272\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["color",e])},return_none:!0},\u30AB\u30E1\u30DA\u30F3\u30B5\u30A4\u30BA\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["size",e])}},\u30AB\u30E1\u30DA\u30F3\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["penOn",e])}},\u30AB\u30E1\u30D1\u30B9\u958B\u59CB:{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.addMacro(["begin"])}},\u30AB\u30E1\u30D1\u30B9\u9589:{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.addMacro(["close"])}},\u30AB\u30E1\u30D1\u30B9\u7DDA\u5F15:{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.addMacro(["stroke"])}},\u30AB\u30E1\u30D1\u30B9\u5857:{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.addMacro(["fill"])}},\u30AB\u30E1\u6587\u5B57\u63CF\u753B:{type:"func",josi:[["\u3092","\u3068","\u306E"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["text",e])}},\u30AB\u30E1\u6587\u5B57\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078","\u3067"]],pure:!0,fn:function(e,t){e=""+e,e.match(/^\d+$/)?e=e+"px serif":e.match(/^\d+(px|em)$/)&&(e=e+" serif"),t.tags.turtles.addMacro(["textset",e])}},\u30AB\u30E1\u5857\u8272\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078"]],pure:!0,fn:function(e,t){t.tags.turtles.addMacro(["fillStyle",e])},return_none:!0},\u30AB\u30E1\u5168\u6D88\u53BB:{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.clearAll()},return_none:!0},\u30AB\u30E1\u30B3\u30DE\u30F3\u30C9\u5B9F\u884C:{type:"func",josi:[["\u306E","\u3092"]],pure:!0,fn:function(e,t){let s=t.tags.turtles,r=e.split(/(\n|;)/);for(let n=0;n<r.length;n++){let a=r[n];a=a.replace(/^([a-zA-Z_]+)\s*(\d+)/,"$1,$2"),a=a.replace(/^([a-zA-Z_]+)\s*=/,"$1,");let i=a.split(/\s*,\s*/);s.addMacro(i)}},return_none:!0},\u30AB\u30E1\u975E\u8868\u793A:{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.addMacro(["visible",!1])},return_none:!0},\u30AB\u30E1\u8868\u793A:{type:"func",josi:[],pure:!0,fn:function(e){e.tags.turtles.addMacro(["visible",!0])},return_none:!0},\u30AB\u30E1\u30AF\u30EA\u30C3\u30AF\u6642:{type:"func",josi:[["\u3092"]],pure:!1,fn:function(e,t){if(e=t.__findVar(e,null),typeof e!="function")return;let s=t.tags.turtles.target,r=t.tags.turtles.list[s];r.canvas.onclick=n=>(t.__setSysVar("\u5BFE\u8C61",n.target),e(n,t))},return_none:!0}},y=h;typeof navigator=="object"&&typeof navigator.nako3&&navigator.nako3.addPluginObject("PluginTurtle",h);})();
//# sourceMappingURL=plugin_turtle.js.map
