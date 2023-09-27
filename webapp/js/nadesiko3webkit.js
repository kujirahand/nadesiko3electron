// nadesiko3webkit
// index.htmlで使うJavaScriptの関数を定義

var nako3_info_id = 1

function qs(query) {  
  return document.querySelector(query)
}

function to_html(s) {
  s = '' + s
  return s.replace(/\&/g, '&amp;')
          .replace(/\</g, '&lt;')
          .replace(/\>/g, '&gt;')
}

var nako3_get_resultbox = function () {
  return qs("#nako3result_div_" + nako3_info_id)
}
var nako3_get_info = function () {
  return qs("#nako3_info_" + nako3_info_id)
}
var nako3_get_error = function () {
  return qs("#nako3_error_" + nako3_info_id)
}
var nako3_get_canvas = function () {
  return qs("#nako3_canvas_" + nako3_info_id)
}
var nako3_get_div = function () {
  return qs("#nako3_div_" + nako3_info_id)
}
// 表示
var nako3_print = function (s) {
  console.log("[表示] " + s)
  var info = nako3_get_info()
  if (!info) return
  var box = nako3_get_resultbox()
  box.style.display = 'block'
  s = "" + s // 文字列に変換
  // エラーだった場合
  if (s.substr(0, 9) == "==ERROR==") {
    s = s.substr(9)
    var err = nako3_get_error()
    err.innerHTML = s
    err.style.display = 'block'
    return
  } else {
    info.innerHTML += to_html(s).replace(/\n/, "\n<br>") + "<br>\n"
    info.style.display = 'block'
  }
}
//---------------------------------
var nako3_clear = function (s, use_canvas) {
  var info = nako3_get_info()
  if (!info) return
  info.innerHTML = ''
  info.style.display = 'none'
  var err = nako3_get_error()
  err.innerHTML = ''
  err.style.display = 'none'
  var div = nako3_get_div()
  if (div) div.innerHTML = ''
  if (use_canvas) {
    var canvas = nako3_get_canvas()
    if (canvas) {
      var ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  if (navigator.nako3) {
    navigator.nako3.clearPlugins()
  }
}

//---------------------------------
function makePostData(params, sys) {
  const flist = []
  for (const key in params) {
    const v = params[key]
    const kv = encodeURIComponent(key) + '=' + encodeURIComponent(v)
    flist.push(kv)
  }
  return flist.join('&')
}

function sendPost(url, params, callback, sys) {
  const bodyData = makePostData(params)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyData
  }
  fetch(url, options).then(res => {
    return res.json()
  })
  .then(data => callback(data))
  .catch(err => {
    console.log(err)
    sys.__v0['AJAX:ONERROR'](err)
  })
}

//---------------------------------
// 独自関数の登録
const nako3_add_func = function () {
  //
  navigator.nako3.addFunc("表示", [['の', 'を', 'と']], nako3_print, true)
  navigator.nako3.addFunc("コンソール表示", [['の', 'を', 'と']], (s) => console.log(s), true)
  navigator.nako3.addFunc("表示ログクリア", [], nako3_clear, true)
}
//---------------------------------
