"use strict";(()=>{var a={meta:{type:"const",value:{pluginName:"plugin_webworker",description:"\u30D6\u30E9\u30A6\u30B6\u306EWebWorker\u306E\u305F\u3081\u306E\u30D7\u30E9\u30B0\u30A4\u30F3",pluginVersion:"3.6.0",nakoRuntime:["wnako"],nakoVersion:"3.6.0"}},\u521D\u671F\u5316:{type:"func",josi:[],pure:!0,fn:function(n){n._webworker={setNakoHandler:function(t){t.onmessage=e=>{let o=e.data||{type:"",data:""},r=o.type||"",i=o.data||"";switch(r){case"output":t.onoutput&&t.onoutput.apply(n,[i,e]);break;case"data":t.ondata&&t.ondata.apply(n,[i,e]);break;case"error":n.logger.error(i.noColor);break}},t.onerror=e=>{let o=new Error(typeof e.message<"u"?e.message:"no message");n.logger.error(o)},t.onerrormessage=e=>{let o=new Error(typeof e.message<"u"?e.message:"no message");n.logger.error(o)}},inWorker:()=>typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope,getBaseUrlFromTag:()=>{if(!self.document)return"";let t="plugin_webworker.js",e=location.pathname;if(e.substr(e.length-1,1)!=="/"){let r=e.split("/");e=r.slice(r.length-1,1).join("/")&"/"}let o=document.querySelectorAll("script");for(let r=0;r<o.length;r++){let u=o[r].src||"",f=u.indexOf(t);if(f>=0&&(u.length-f===t.length||"?&#".indexOf(u.substr(f+t.length,1))>=0))return u=u.substring(0,f),u.substring(0,1)==="/"?location.origin+u:/^[a-zA-Z]+:\/\//.test(u)?u:location.origin+e+u}return location.origin+e}},n.__v0.\u30EF\u30FC\u30AB\u30FCURL=n._webworker.getBaseUrlFromTag()}},\u5BFE\u8C61\u30A4\u30D9\u30F3\u30C8:{type:"const",value:""},\u53D7\u4FE1\u30C7\u30FC\u30BF:{type:"const",value:""},\u30EF\u30FC\u30AB\u30FCURL:{type:"const",value:""},\u30EF\u30FC\u30AB\u30FCURL\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078","\u3068"]],pure:!0,fn:function(n,t){n&&n.substring(n.length-1)!=="/"&&(n+="/"),t.__v0.\u30EF\u30FC\u30AB\u30FCURL=n},return_none:!0},\u30EF\u30FC\u30AB\u30FC\u8D77\u52D5:{type:"func",josi:[["\u3067","\u3092","\u306E"]],pure:!0,fn:function(n,t){return new Worker(n)},return_none:!1},\u30EF\u30FC\u30AB\u30FCJS\u8D77\u52D5:{type:"func",josi:[["\u3067","\u3092","\u306E"]],pure:!0,fn:function(n,t){let e=new Blob([n],{type:"application/javascript"}),o=URL.createObjectURL(e);return new Worker(o)},return_none:!1},NAKO\u30EF\u30FC\u30AB\u30FC\u8D77\u52D5:{type:"func",josi:[["\u3067"]],isVariableJosi:!0,pure:!0,fn:function(n,t){let e;if(typeof t>"u"&&(t=n,n=void 0),n!==void 0){if(!(n instanceof Array))throw new Error("\u30D7\u30E9\u30B0\u30A4\u30F3\u306F\u30D5\u30A1\u30A4\u30EB\u540D\u3092\u914D\u5217\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");let r=t.__v0.\u30EF\u30FC\u30AB\u30FCURL,i=`importScripts('${r}wnako3webworker.js')
`,u=n.length,f;for(f=0;f<u;f++)i+=`importScripts('${r}${n[f]}')
`;let s=new Blob([i],{type:"application/javascript"});e=URL.createObjectURL(s)}else e=t.__v0.\u30EF\u30FC\u30AB\u30FCURL+"wnako3webworker.js";let o=new Worker(e);return o&&t._webworker.setNakoHandler(o),o},return_none:!1},NAKO\u30EF\u30FC\u30AB\u30FC\u30CF\u30F3\u30C9\u30E9\u8A2D\u5B9A:{type:"func",josi:[["\u306B","\u3078","\u306E"]],pure:!0,fn:function(n,t){t._webworker.setNakoHandler(n)},return_none:!0},NAKO\u30EF\u30FC\u30AB\u30FC\u30C7\u30FC\u30BF\u53D7\u4FE1\u6642:{type:"func",josi:[["\u3067"],["\u304B\u3089"]],isVariableJosi:!0,pure:!1,fn:function(n,t,e){typeof e>"u"&&(e=t,t=self),n=e.__findVar(n,null),t.ondata=(o,r)=>(e.__v0.\u53D7\u4FE1\u30C7\u30FC\u30BF=o,e.__v0.\u5BFE\u8C61\u30A4\u30D9\u30F3\u30C8=r,n(r,e))},return_none:!0},NAKO\u30EF\u30FC\u30AB\u30FC\u8868\u793A\u6642:{type:"func",josi:[["\u3067"],["\u304B\u3089"]],pure:!1,fn:function(n,t,e){n=e.__findVar(n,null),t.onoutput=(o,r)=>(e.__v0.\u53D7\u4FE1\u30C7\u30FC\u30BF=o,e.__v0.\u5BFE\u8C61\u30A4\u30D9\u30F3\u30C8=r,n(r,e))},return_none:!0},\u30EF\u30FC\u30AB\u30FC\u30E1\u30C3\u30BB\u30FC\u30B8\u53D7\u4FE1\u6642:{type:"func",josi:[["\u3067"],["\u304B\u3089"]],isVariableJosi:!0,pure:!1,fn:function(n,t,e){typeof e>"u"&&(e=t,t=self),n=e.__findVar(n,null),t.onmessage=o=>(e.__v0.\u53D7\u4FE1\u30C7\u30FC\u30BF=o.data,e.__v0.\u5BFE\u8C61\u30A4\u30D9\u30F3\u30C8=o,n(o,e))},return_none:!0},NAKO\u30EF\u30FC\u30AB\u30FC\u30D7\u30ED\u30B0\u30E9\u30E0\u8D77\u52D5:{type:"func",josi:[["\u306B","\u3067"],["\u3092"]],pure:!0,fn:function(n,t,e){let o={type:"run",data:t};n.postMessage(o)},return_none:!0},NAKO\u30EF\u30FC\u30AB\u30FC\u30EA\u30BB\u30C3\u30C8:{type:"func",josi:[["\u3092"]],pure:!0,fn:function(n,t){let e={type:"reset",data:""};n.postMessage(e)},return_none:!0},\u30EF\u30FC\u30AB\u30FC\u7D42\u4E86:{type:"func",josi:[["\u3092"]],isVariableJosi:!0,pure:!0,fn:function(n,t){typeof t>"u"&&(t=n,n=self),n.terminate()},return_none:!0},NAKO\u30EF\u30FC\u30AB\u30FC\u7D42\u4E86:{type:"func",josi:[["\u3092"]],isVariableJosi:!0,pure:!0,fn:function(n,t){if(typeof t>"u"){self.close();return}let e={type:"close",data:""};n.postMessage(e)},return_none:!0},NAKO\u30EF\u30FC\u30AB\u30FC\u30C7\u30FC\u30BF\u9001\u4FE1:{type:"func",josi:[["\u3092"],["\u306B","\u3078"]],isVariableJosi:!0,pure:!0,fn:function(n,t,e){typeof e>"u"&&(e=t,t=self);let o={type:"data",data:n};t.postMessage(o)},return_none:!0},\u30EF\u30FC\u30AB\u30FC\u30E1\u30C3\u30BB\u30FC\u30B8\u9001\u4FE1:{type:"func",josi:[["\u3092"],["\u306B","\u3078"]],isVariableJosi:!0,pure:!0,fn:function(n,t,e){typeof e>"u"&&(e=t,t=self),t.postMessage(n)},return_none:!0},NAKO\u30EF\u30FC\u30AB\u30FC\u8EE2\u9001:{type:"func",josi:[["\u3092"],["\u306B","\u3078"]],isVariableJosi:!0,pure:!1,fn:function(n,t,e){typeof e>"u"&&(e=t,t=self);let o=[],r=[];if(typeof n=="string"&&(n=[n]),n.forEach(i=>{if(i.indexOf("__")===-1)for(let u of e.__modList){let f=u+"__"+i;if(typeof e.__varslist[2].get(f)<"u"||typeof e.__varslist[1].get(f)<"u"){i=f;break}}if(i.indexOf("__")>-1){let u=i.split("__")[0];o.indexOf(u)===-1&&o.push(u)}if(typeof e.__varslist[2].get(i)<"u")r.push({type:"val",name:i,content:e.__varslist[2].get(i)});else if(typeof e.__varslist[1].get(i)<"u")r.push({type:"func",name:i,content:{meta:e.gen.nakoFuncList[i],func:Object.assign({},e.compiler.funclist[i],{fn:null})}});else throw console.error("\u6307\u5B9A\u3057\u305F\u540D\u524D\u306E\u30E6\u30FC\u30B6\u95A2\u6570\u3082\u3057\u304F\u306F\u30B0\u30ED\u30FC\u30D0\u30EB\u5909\u6570\u304C\u3042\u308A\u307E\u305B\u3093:"+i),new Error("\u6307\u5B9A\u3057\u305F\u540D\u524D\u306E\u30E6\u30FC\u30B6\u95A2\u6570\u3082\u3057\u304F\u306F\u30B0\u30ED\u30FC\u30D0\u30EB\u5909\u6570\u304C\u3042\u308A\u307E\u305B\u3093:"+i)}),r.length>0){let i=[];for(let f of o)i.push({name:f,export:e.compiler.moduleExport[f]});r.push({type:"env",name:"modlist",content:i}),r.push({type:"env",name:"constPools",content:e.constPools}),r.push({type:"env",name:"constPoolsTemplate",content:e.constPoolsTemplate});let u={type:"trans",data:r};t.postMessage(u)}},return_none:!0}},p=a;typeof navigator=="object"&&typeof navigator.nako3=="object"&&navigator.nako3.addPluginObject("PluginWebWorker",a);})();
//# sourceMappingURL=plugin_webworker.js.map
