!function(){"use strict";const e={"初期化":{type:"func",josi:[],pure:!0,fn:function(e){}},"漢数字":{type:"func",josi:[["を","の"]],pure:!0,fn:function(e){let i="";"+"!==(e=function(e){if(e=function(e){return e.replace(/[０-９]/g,(e=>String.fromCharCode(e.charCodeAt(0)-65248)))}(e),Number.isNaN(Number(e)))throw new Error("『漢数字』命令の中に無効な文字が含まれています。");const n=function(e){const n=e.match(/[0-9]*\.?[0-9]+[eE][-+]?[0-9]+/);if(n&&n[0]===e){const t=e.match(/[0-9]*\.?[0-9]+[eE]/)[0].slice(0,-1),r=e.match(/[eE][-+]?[0-9]+/)[0].slice(1);function u(e,n){const t=n[0],r=e.includes(".")?e.indexOf("."):e.length,u="-"===t?r-parseInt(n.slice(1)):r+parseInt(n.match(/[0-9]+$/)[0]);return u>0?e.length-r>u?function(e,n,t){return e.slice(0,n)+t+e.slice(n)}(e.replace(".",""),u,"."):e.includes(".")?e.replace(".","")+"0".repeat(u-e.length+r):e+"0".repeat(u-e.length+r-1):"0."+"0".repeat(-u)+e.replace(".","")}e=u(t,r)}return e}(e.toString());if(n>BigInt(1e72))throw new Error("『漢数字』命令の中に含められる数の大きさを超えています。");return n}(String(e))).charAt(0)&&"-"!==e.charAt(0)||(i=e.charAt(0),e=e.substr(1));let s=function(e){function i(e){return u[r.indexOf(e)]}let s=0;const c=e.reverse().reduce(((e,r,u)=>{if("string"==typeof r)"."===r?(e="・"+e,s=u+1):e=i(r)+e;else{const c=r.reduce(((e,n,r,u)=>"0"===n?e:"1"===n&&""!==t[u.length-1-r]?e+t[u.length-1-r]:e+i(n)+t[u.length-1-r]),"");e=(c?c+n[u-s]:"")+e}return e}),"");return"・"===c[0]?"零"+c:c}(function(e){let n=e.includes(".");return e.split("").reverse().reduce(((e,r)=>"."===r?(n=!1,e.splice(1,0,"."),e):n?(e.splice(1,0,r),e):(e[0].length===t.length&&e.unshift([]),e[0].unshift(r),e)),[[]])}(e));return""===s&&(s="零"),i+s}},"算用数字":{type:"func",josi:[["を","の"]],pure:!0,fn:function(e){const r=function(e){let n=[],t=[],r=!1;return e.reduce(((u,i,s)=>("."===i?(0===n.length&&n.push(0,1),1===n.length&&n.push(1),t.push(n),n=[],u.push(t),u.push("."),t=[],r=!0):r?u.push(String(i)):i>1e3?(0===n.length&&n.push(0,1),1===n.length&&n.push(1),t.push(n),n=[],t.push(i),u.push(t),t=[]):i>=10&&i<=1e3?(0===n.length&&n.push(1),n.push(i),t.push(n),n=[]):i<10&&n.push(i),s+1===e.length&&!1===r&&(1===n.length&&(n.push(1),t.push(n)),u.push(t)),u)),[])}(function(e){const r=n.filter((e=>e.length>1)),i=[];for(let s=0;s<e.length;s++){const c=e.slice(s,s+1),l=n.includes(c)?c:r.find((n=>n===e.slice(s,s+n.length))),h=t.includes(c)?c:null,o=u.includes(c)?c:null;if(l)l.length>1&&(s+=l.length-1),i.push(BigInt("1"+"0".repeat(4*n.indexOf(l))));else if(h)i.push(10**t.indexOf(h));else if(o)i.push(u.indexOf(o));else if("・"===c)i.push(".");else{if("零"!==c)throw new Error("『算用数字』命令の中に無効な文字が含まれています。");i.push("0")}}return i}(e.toString())).reduce(((e,n,t)=>"string"==typeof n?e+n:e+n.reduce(((e,n,t)=>n>1e3?e*n:e+BigInt(n[0]*n[1])),BigInt(0))),BigInt(0));return r>Number.MAX_SAFE_INTEGER?r:Number(r)}}},n=["","万","億","兆","京","垓","𥝱","穣","溝","澗","正","載","極","恒河沙","阿僧祇","那由他","不可思議","無量大数"],t=["","十","百","千"],r="0123456789".split(""),u="〇一二三四五六七八九".split("");"object"==typeof navigator&&"object"==typeof navigator.nako3&&navigator.nako3.addPluginObject("PluginKansuji",e)}();
//# sourceMappingURL=plugin_kansuji.js.map