/**
 * file: plugin_electron_node.js
 * electronのメインプロセスのためのプラグイン
 */
import url from 'url'
import path from 'path'
import fs from 'fs'
import util from 'util'
import childProcess from 'node:child_process'

import { app, BrowserWindow, Menu, MenuItem, ipcMain, shell } from 'electron'
import { quote } from 'shell-quote'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const appIdDef = 'nadesiko3electron'

export default {
    '初期化': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            sys.__enako3 = {
                appId: appIdDef,
                convertBrowserWindow: {
    '幅' : { key: 'width' },
    '高さ' : { key: 'height' },
    '高' : { key: 'height' },
    'コンテントサイズ適用': { key: 'useContentSize', isBool: true },
    '中央表示': { key: 'center', isBool: true },
    'センタリング': { key: 'center', isBool: true },
    '最小幅': { key: 'minWidth' },
    '最大幅': { key: 'maxWidth' },
    '最小高さ': { key: 'minHeight' },
    '最小高': { key: 'minHeight' },
    '最大高さ': { key: 'maxHeight' },
    '最大高': { key: 'maxHeight' },
    'サイズ変更可能': { key: 'resizable', isBool: true },
    '移動可能': { key: 'movable', isBool: true },
    '最小化可能': { key: 'minimizable', isBool: true },
    '最大化可能': { key: 'maximizable', isBool: true },
    'タイトル': { key: 'title' },
    'アイコン': { key: 'icon' },
    '親': { key: 'parent' },
    '親ウインドウ': { key: 'parent' },
    'モーダル': { key: 'modal' },
    '背景色': { key: 'backgroundColor' },
    'webPreferences': { isCallback: true },
    'WEB設定': { isCallback: true },
                },
                convertWebPreferences: {
    '開発ツール': { key: 'devTools', isBool: true },
    '開発者ツール': { key: 'devTools', isBool: true },
    'ノード統合': { key: 'nodeIntegration', isBool: true },
    'NODE統合': { key: 'nodeIntegration', isBool: true },
    'サンドボックス': { key: 'sandbox', isBool: true },
    'コンテキスト分離': { key: 'contextIsolation', isBool: true },
    'ダイアログ保護': { key: 'safeDialogs', isBool: true },
    'DIALOG保護': { key: 'safeDialogs', isBool: true },
    'WEBGL': { key: 'webgl', isBool: true },
                },
                convertMenuTemplate: {
    'ロール': { key: 'role' },
    '役割': { key: 'role' },
    '種類': { key: 'type' },
    'ラベル': { key: 'label' },
    'LABEL': { key: 'label' },
    'サブラベル': { key: 'sublabel' },
    'SUBLABEL': { key: 'sublabel' },
    'ツールチップ': { key: 'toolTip' },
    'アクセラレータ': { key: 'accelerator' },
    'アクセラレーター': { key: 'accelerator' },
    'アイコン': { key: 'icon' },
    '有効': { key: 'enabled', isBool: true },
    '表示': { key: 'visible', isBool: true },
    '可視': { key: 'visible', isBool: true },
    'サブメニュー': { isCallback: true },
    'SUBMENU': { isCallback: true },
    'submenu': { isCallback: true },
    'ID': { key: 'id' },
                },
                convertMenuPopupOptions: {
    'ウインドウ': { key: 'window' },
    'WINDOW': { key: 'window' },
    'X': { key: 'x' },
    'Y': { key: 'y' },
    '項目位置': { key: 'positioningItem' },
    'コールバック': { key: 'callback' },
    'CALLBACK': { key: 'callback' },
                },
                convertRelaunchOptions: {
    '引数': { key: 'args' },
    'ARGS': { key: 'args' },
    '実行ファイル': { key: 'execPath' },
    'EXECPATH': { key: 'execPath' },
                },
                p2point: (p) => {
                    let point = p
                    if (Array.isArray(p) && p.length === 2) {
                        point = { x: p[0], y: p[1] }
                    } else {
                        const point = {
                            x: p.x!=null?p.x:p.X!=null?p.X:undefined,
                            y: p.y!=null?p.y:p.Y!=null?p.Y:undefined,
                        }
                    }
                    return point
                },
                r2rect: (r) => {
                    let rect = r
                    if (Array.isArray(r) && p.length === 4) {
                        rect = { x: r[0], y: r[1], width: r[2], height: r[3] }
                    } else {
                        rect = {
                            x: r.x!=null?r.x:r.X!=null?r.X:undefined,
                            y: r.y!=null?r.y:r.Y!=null?r.Y:undefined,
                            width: r.w!=null?r.w:r.WIDTH!=null?r.WIDTH:r.width!=null?r.width:undefined,
                            height: r.h!=null?r.h:r.HEIGHT!=null?r.HEIGHT:r.height!=null?r.height:undefined,
                        }
                    }
                    return rect
                },
                convertOptions: (opts, tbl, popts, callback) => {
                    for (const key of Object.keys(popts)) {
                        let v = popts[key]
                        if (tbl[key] != null) {
                            if (tbl[key].isBool) { v = !!v }
                            if (tbl[key].isCallback && callback) {
                                callback(opts, key, v)
                            } else {
                                opts[tbl[key].key != null ? tbl[key].key : key] = v
                            }
                        } else {
                            opts[key] = v
                        }
                    }
                },
                getUserDataDir: () => {
                  const enako3 = sys.__enako3
                  const home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]
                  const dir = path.join(home, '.nadesiko3', enako3.appId)
                  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
                  return dir
                },
                removePathFlag: (fname) => {
                  fname = fname.replace(/\:/g, '__c__')
                  fname = fname.replace(/\\/g, '__y__')
                  fname = fname.replace(/\//g, '__p__')
                  return fname
                },
                setIPCHandleStandard: () => {
                    const enako3 = sys.__enako3
                    // ipc通信
                    ipcMain.handle('exec', async (_event, args) => {
                      // args
                      let command = ''
                      if (typeof args === 'string') {
                        command = args
                      } else {
                        command = quote(args)
                      }
                      const exec = util.promisify(childProcess.exec)
                      return await exec(command)
                    })
                    ipcMain.handle('fileLoad', async (_event, filename) => {
                      const fname = path.join(enako3.getUserDataDir(), enako3.removePathFlag(filename))
                      const readFile = util.promisify(fs.readFile)
                      return await readFile(fname, { encoding: 'utf-8' })
                    })
                    ipcMain.handle('fileSave', async (_event, filename, data) => {
                      const fname = path.join(enako3.getUserDataDir(), enako3.removePathFlag(filename))
                      const writeFile = util.promisify(fs.writeFile)
                      return await writeFile(fname, data, { encoding: 'utf-8' })
                    })
                    ipcMain.handle('enumfiles', async (_event) => {
                      const dir = getUserDataDir()
                      const files = fs.readdirSync(dir)
                      return files
                    })
                    ipcMain.handle('env', async (_event, key) => {
                      return process.env[key]
                    })
                    ipcMain.handle('envlist', async (_event) => {
                      return JSON.parse(JSON.stringify(process.env))
                    })
                    ipcMain.on('log', (_event, msg) => {
                      console.log(msg)
                    })
                }
            }
        }
    },
    // @システム定数
    'Eアプリ': { type: 'const', value: app }, // @Eあぷり
    'IPCメイン': { type: 'const', value: ipcMain }, // @IPCめいん
    // @Electronアプリ
    'アプリID設定': { // @アプリIDを設定する // @あぷりIDせってい
        type: 'func',
        josi: [['に','を']],
        pure: true,
        fn: function (appId, sys) {
            sys.__enako3.appId = appId
        },
        return_none: true
    },
    'QUIT': { // @Electronのアプリを終了する // @QUIT
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            app.quit()
        },
        return_none: true
    },
    '終了': { // @Electronのアプリを終了する // @しゅうりょう
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            app.quit()
        },
        return_none: true
    },
    '強制終了': { // @Electronのアプリを強制終了する // @きょうせいしゅうりょう
        type: 'func',
        josi: [['で']],
        pure: true,
        fn: function (code, sys) {
            app.exit(code)
        },
        return_none: true
    },
    '再起動予約': { // @アプリが終了した際に自動的に起動する // @さいきどうよやく
        type: 'func',
        josi: [['で']],
        pure: true,
        fn: function (popts, sys) {
            const opts = {}
            const tbl = sys.__enako3.convertRelaunchOptions
            sys.__enako3.convertOptions(opts, tbl, popts, null)
            app.relaunch(opts)
        },
        return_none: true
    },
    'Eアプリ準備完了': { // @アプリの準備が完了していれば真を返す // @Eあぷりじゅんびかんりょう
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return app.isReady()
        }
    },
    'Eアプリ準備完了時': { // @アプリの準備が完了した際に呼び去られる処理を登録する // @Eあぷりじゅんびかんりょうしたとき
        type: 'func',
        josi: [['で']],
        pure: true,
        fn: function (callback, sys) {
            app.whenReady().then(() => {
                callback(sys)
            })
        },
        return_none: true
    },
    'Eアプリフォーカス獲得': { // @アプリがフォーカスの獲得を試みる // @Eあぷりふぉーかすかくとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            app.focus()
        },
        return_none: true
    },
    'Eアプリバージョン取得': { // @package.jsonで設定しているアプリのバージョンを返す // @Eあぷりばーじょんしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return app.getVersion()
        }
    },
    'Eアプリ名取得': { // @package.jsonで設定しているアプリの名前(name,productName)を返す // @Eあぷりめいしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return app.getName()
        }
    },
    // @ElectronのBrowserWindow
    'ブラウザウインドウ作成': { // @オプションに従いブラウザウインドウを作成して返す // @ぶらうざういんどうさくせい
        type: 'func',
        josi: [['で','から']],
        pure: true,
        fn: function (popts, sys) {
            const opts = {}
            const tbl = sys.__enako3.convertBrowserWindow
            sys.__enako3.convertOptions(opts, tbl, popts, (opts, key, value) => {
                if (key === 'webPreferences' || key === 'WEB設定') {
                    opts['webPreferences'] = {}
                    const tbl = sys.__enako3.convertWebPreferences
                    sys.__enako3.convertOptions(opts['webPreferences'], tbl, value, null)
                    if (opts['webPreferences']['preload'] == null) {
                        if (value['最小API']) {
                            delete opts['webPreferences']['最小API']
                            opts['webPreferences']['preload'] = path.join(__dirname, 'preload_minimal.cjs')
                        }
                        if (value['標準API'] || value['NAKO3API']) {
                            delete opts['webPreferences']['標準API']
                            delete opts['webPreferences']['NAKO3API']
                            opts['webPreferences']['preload'] = path.join(__dirname, 'preload_nako3api.cjs')
                        }
                    }
                }
            })
            // ブラウザ (Chromium) の起動, 初期画面のロード
            return new BrowserWindow(opts)
        }
    },
    'ブラウザ読込': { // @ウインドウに指定のURLから読み込みを行う // @ぶらうざよみこみ
        type: 'func',
        josi: [['に','へ'], ['から','を']],
        pure: true,
        fn: function (win, purl, sys) {
            let lurl = null
            if (purl.startsWith('http:') || purl.startsWith('https:') || purl.startsWith('file:')) {
                lurl = purl
            } else {
                lurl = 'file://' + path.join(__dirname, '..', 'webapp', purl)
            }
            win.loadURL(lurl)
        },
        return_none: true
    },
    '全ウインドウ数取得': { // @アプリに存在する全てのWindowの数を返す // @ぜんういんどうすうしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return BrowserWindow.getAllWindows().length
        }
    },
    'フォーカスウインドウ取得': { // @フォーカスを獲得しているWindowを返す // @ふぉーかすういんどうしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return BrowserWindow.getFocusedWindow()
        }
    },
    'ウインドウ再読込': { // @指定したウインドウの再読み込みを行う // @ういんどうさいよみこみ
        type: 'func',
        josi: [['を']],
        pure: true,
        fn: function (win, sys) {
            win.reload()
        },
        return_none: true
    },
    'ウインドウ表示': { // @指定したウインドウを表示状態にする // @ういんどうひょうじ
        type: 'func',
        josi: [['を','の']],
        pure: true,
        fn: function (win, sys) {
            win.show()
        },
        return_none: true
    },
    '開発ツールトグル': { // @指定したウインドウの開発者ツールの表示状態をトグルする // @かいはつつーるとぐる
        type: 'func',
        josi: [['を','の']],
        pure: true,
        fn: function (win, sys) {
            win.toggleDevTools()
        },
        return_none: true
    },
    'メニュー設定': { // @menuをウインドウのメニューに設定する // @めにゅーせってい
        type: 'func',
        josi: [['に'],['を']],
        pure: true,
        fn: function (win, menu, sys) {
            win.setMenu(menu)
        },
        return_none: true
    },
    // @Electronのメニュー
    'アプリメニュー設定': { // @menuをアプリのメインメニューに設定する // @あぷりめにゅーせってい
        type: 'func',
        josi: [['を']],
        pure: true,
        fn: function (menu, sys) {
            Menu.setApplicationMenu(menu)
        },
        return_none: true
    },
    'アプリケーションメニュー設定': {
        type: 'func',
        josi: [['を']],
        pure: true,
        fn: function (menu, sys) {
            Menu.setApplicationMenu(menu)
        },
        return_none: true
    },
    'アプリメニュー取得': { // @アプリのメインメニューに取得して返す // @あぷりめにゅーしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return Menu.getApplicationMenu()
        }
    },
    'アプリケーションメニュー取得': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return Menu.getApplicationMenu()
        }
    },
    'メニュー一括作成': { // @メニューをテンプレートから一括作成し作成したメニューを返す // @めにゅーいっかつさくせい
        type: 'func',
        josi: [['から']],
        pure: true,
        fn: function (template, sys) {
            const convertMenu = (opts, template) => {
                const tbl = sys.__enako3.convertMenuTemplate
                for (const popts of template) {
                    const opt = {}
                    sys.__enako3.convertOptions(opt, tbl, popts, (opt, key, value) => {
                        if (key === 'submenu' || key === 'SUBMENU' || key === 'サブメニュー') {
                            opt['submenu'] = []
                            convertMenu(opt['submenu'], value)
                        }
                    })
                    opts.push(opt)
                }
            }
            const opts = []
            convertMenu(opts, template)
            return Menu.buildFromTemplate(opts)
        },
    },
    'メニューポップアップ開': { // @メニューをポップアップメニューとして開く // @めにゅーぽっぷあっぷひらく
        type: 'func',
        josi: [['を'],['で']],
        pure: true,
        fn: function (menu, popts, sys) {
            const opts = {}
            const tbl = sys.__enako3.convertMenuPopupOptions
            sys.__enako3.convertOptions(opts, tbl, popts, null)
            menu.popup(opts)
        },
        return_none: true
    },
    'メニューポップアップ閉': { // @ポップアップメニューとして開かれたこのメニューを閉じる // @めにゅーぽっぷあっぷとじる
        type: 'func',
        josi: [['を'],['の']],
        pure: true,
        fn: function (menu, win, sys) {
            if (win == null) { win = undefined }
            menu.closePopup(win)
        },
        return_none: true
    },
    'メニューアイテム追加': { // @メニューにメニュー項目を追加する // @めにゅーあいてむついか
        type: 'func',
        josi: [['に'],['を']],
        pure: true,
        fn: function (menu, item, sys) {
            menu.append(item)
        },
        return_none: true
    },
    'メニュー項目追加': { // @メニューにメニュー項目を追加する // @めにゅーこうもくついか
        type: 'func',
        josi: [['に'],['を']],
        pure: true,
        fn: function (menu, item, sys) {
            menu.append(item)
        },
        return_none: true
    },
    'メニューアイテム挿入': { // @メニューの指定位置にメニュー項目を挿入する // @めにゅーあいてむそうにゅう
        type: 'func',
        josi: [['の'],['に'],['を']],
        pure: true,
        fn: function (menu, pos, item, sys) {
            menu.insert(pos, item)
        },
        return_none: true
    },
    'メニュー項目挿入': { // @メニューの指定位置にメニュー項目を挿入する // @めにゅーこうもくそうにゅう
        type: 'func',
        josi: [['の'],['に'],['を']],
        pure: true,
        fn: function (menu, pos, item, sys) {
            menu.insert(pos, item)
        },
        return_none: true
    },
    'メニューアイテム取得': { // @メニューから指定したIDを持つメニューアイテムを返す // @めにゅーあいてむしゅとく
        type: 'func',
        josi: [['から'],['を','の']],
        pure: true,
        fn: function (menu, id, sys) {
            return menu.getMenuItemById(id)
        },
    },
    'メニューIDクリック時': { // @メニューから指定したIDを持つ項目をクリックした時の処理を登録する // @めにゅーIDくりっくしたとき
        type: 'func',
        josi: [['で'],['の'],['を']],
        pure: true,
        fn: function (callback, menu, id, sys) {
            const item = menu.getMenuItemById(id)
            item['click'] = callback
        },
        return_none: true
    },
    'メニュー項目作成': { // @メニュー項目を作成して返す // @めにゅーこうもくさくせい
        type: 'func',
        josi: [['から','の']],
        pure: true,
        fn: function (popts, sys) {
            const convertMenu = (opts, template) => {
                const tbl = sys.__enako3.convertMenuTemplate
                for (const popts of template) {
                    const opt = {}
                    sys.__enako3.convertOptions(opt, tbl, popts, (opt, key, value) => {
                        if (key === 'submenu' || key === 'SUBMENU' || key === 'サブメニュー') {
                            opt['submenu'] = []
                            convertMenu(opt['submenu'], value)
                        }
                    })
                    opts.push(opt)
                }
            }
            const opts = []
            convertMenu(opts, [popts])
            return new MenuItem(opts[0])
        },
    },
    // @Electronのイベント処理
    '発生時': { // @対象にて指定のイベントが発生した時の処理を登録する // @はっせいしたとき
        type: 'func',
        josi: [['で'],['の'],['']],
        pure: true,
        fn: function (callback, obj, type, sys) {
            if (obj instanceof MenuItem) {
                obj[type] = callback
            } else {
                obj.on(type, callback)
            }
        },
        return_none: true
    },
    '単発発生時': { // @対象にて指定のイベントが発生した時の処理を登録する。イベント発生時に自動削除される // @たんぱつはっせいしたとき
        type: 'func',
        josi: [['で'],['の'],['']],
        pure: true,
        fn: function (callback, obj, type, sys) {
            obj.once(type, callback)
        },
        return_none: true
    },
    '呼出時': { // @対象にて指定のInvoke呼び出しを受けた時の処理を登録する(evt, ...args) // @よびだされたとき
        type: 'func',
        josi: [['で'],['の'],['']],
        pure: true,
        fn: function (callback, obj, type, sys) {
            obj.handle(type, callback)
        },
        return_none: true
    },
    '呼出': { // @対象のInvokeを呼び出す // @よびだす
        type: 'func',
        josi: [['の'],['','を'],['で']],
        pure: true,
        fn: function (obj, type, args, sys) {
            return obj.invoke(type, ...args)
        }
    },
    // @Electronのshell
    'URL開': {
        type: 'func',
        josi: [['を','の']],
        pure: true,
        fn: function (url, sys) {
            shell.openExternal(url)
        },
        return_none: true
    },
    // @Electronのdialog
    'ファイル選択': { // @ファイルを選択するダイアログを表示して結果を返す // @ふぁいるせんたく
        type: 'func',
        josi: [['に'],['で']],
        pure: true,
        asyncFn: true,
        fn: function (win, popts, sys) {
            const opts = Object.assing({}, popts)
            opts.properties.push('openFile')
            return dialog.showOpenDialog(win, opts)
        }
    },
    'フォルダ選択': { // @フォルダを選択するダイアログを表示して結果を返す // @ふぉるだせんたく
        type: 'func',
        josi: [['に'],['で']],
        pure: true,
        asyncFn: true,
        fn: function (win, popts, sys) {
            const opts = Object.assing({}, popts)
            opts.properties.push('openDirectory')
            return dialog.showOpenDialog(win, opts)
        }
    },
    '保存ファイル選択': { // @ファイルを保存するためのダイアログを表示して結果を返す // @ほぞんふぁいるせんたく
        type: 'func',
        josi: [['に'],['で']],
        pure: true,
        asyncFn: true,
        fn: function (win, opts, sys) {
            return dialog.showSaveDialog(win, opts)
        }
    },
    // @Electronのscreen
    'カーソル絶対位置取得': { // @マウスポインタの絶対位置をDIPポイント単位で返す // @かーそるぜったいいちしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return screen.getCursorScreenPoint()
        }
    },
    '主モニター取得': { // @主画面に指定されているモニターのDisplayを返す // @しゅもにたーしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return screen.getPrimaryDisplay()
        }
    },
    '全モニター取得': { // @全てのモニターをDisplayの配列で返す // @ぜんもにたーしゅとく
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return screen.getAllDisplays()
        }
    },
    '付近モニター取得': { // @指定した点に最も近いモニターのDisplayを返す // @ふきんもにたーしゅとく
        type: 'func',
        josi: [['の','から']],
        pure: true,
        fn: function (p, sys) {
            const point = sys.__enako3.p2point(p)
            return screen.getDisplayNearestPoint(point)
        }
    },
    '該当モニター取得': { // @指定した矩形に最も近いモニターのDisplayを返す // @がいとうもにたーしゅとく
        type: 'func',
        josi: [['の','から']],
        pure: true,
        fn: function (r, sys) {
            const rect = sys.__enako3.r2rect(r)
            return screen.getDisplayMatching(rect)
        }
    },
    'PX2DIP点変換': { // @Pointを物理的な単位からDIP単位に変換して返す // @PX2DIPてんへんかん
        type: 'func',
        josi: [['の','から']],
        pure: true,
        fn: function (p, sys) {
            const point = sys.__enako3.p2point(p)
            return screen.screenToDipPoint(point)
        }
    },
    'DIP2PX点変換': { // @PointをDIP単位から物理的な単位に変換して返す // @DIP2PXてんへんかん
        type: 'func',
        josi: [['の','から']],
        pure: true,
        fn: function (p, sys) {
            const point = sys.__enako3.p2point(p)
            return screen.dipToScreenPoint(point)
        }
    },
    'PX2DIP矩形変換': { // @Rectangleを物理的な単位からDIP単位に変換して返す。DPIは指定したウインドウと相対的に計算する // @PX2DIPくけいへんかん
        type: 'func',
        josi: [['の','から'],['で']],
        pure: true,
        fn: function (r, win, sys) {
            const rect = sys.__enako3.r2rect(r)
            return screen.screenToDipRect(win, rect)
        }
    },
    'DIP2PXP矩形変換': { // @RectangleをDIP単位から物理的な単位に変換して返す。DPIは指定したウインドウと相対的に計算する // @DIP2PXくけいへんかん
        type: 'func',
        josi: [['の','から'],['で']],
        pure: true,
        fn: function (r, win, sys) {
            const rect = sys.__enako3.r2rect(r)
            return screen.dipToScreenRect(win, rect)
        }
    },
    // @Electronのユーザ用IPC通信
    'データ受信時': { // @レンダラからのデータ送信を受けた時の処理を登録する(evt, key, msg) // @でーたじゅしんしたとき
        type: 'func',
        josi: [['で']],
        pure: true,
        fn: function (callback, sys) {
            ipcMain.on('renderer-send', callback)
        },
        return_none: true
    },
    'データ呼出時': { // @レンダラからの呼び出しを受けた時の処理を登録する(evt, key, msg) // @でーたよびだされたとき
        type: 'func',
        josi: [['で'],['の']],
        pure: true,
        fn: function (callback, sys) {
            ipcMain.handle('renderer-invoke', callback)
        },
        return_none: true
    },
    'データ送信': { // @レンダラにデータを送信する(webContent, key, data) // @でーたそうしん
        type: 'func',
        josi: [['に'],['で'],['を']],
        pure: true,
        fn: function (obj, key, data, sys) {
            obj.send('main-send', key, data)
        },
        return_none: true
    },
    'データ呼出': { // @レンダラにデータを呼び出す(webContent, key, data) // @でーたよびだし
        type: 'func',
        josi: [['に'],['で'],['を']],
        pure: true,
        fn: function (obj, key, data, sys) {
            return obj.invoke('main-invoke', key, data)
        }
    },
    // @ElectronのNode側の標準機能セット
    '標準API登録': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            sys.__enako3.setIPCHandleStandard()
        },
        return_none: true
    },
    '標準アプリ実行': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            // 設定ファイルを読む
            const config = loadConfig()
            const appId = config.appid
            sys.__enako3.appId = appId

            function createWindow() {
              // ブラウザ (Chromium) の起動, 初期画面のロード
              let win = new BrowserWindow({
                width: config.width,
                height: config.height,
                title: config.title,
                webPreferences: {
                  preload: path.join(__dirname, 'preload_nako3api.cjs')
                }
              })
              win.loadURL('file://' + path.join(__dirname, '..', 'webapp', 'index.html'))
              win.on('closed', () => {
                win = null
              })
              // 新しいウィンドウを開こうとした際の処理
              win.webContents.on('new-window', (e, url) => {
                console.log(url)
                shell.openExternal(url)
              });
              win.webContents.on('will-navigate', (e, url) => {
                // リンククリック時の処理
                console.log(url)
                shell.openExternal(url)
              });
              return win
           }

           function loadConfig () {
             let config = { appid: appIdDef, width: 800, height: 600, title: 'なでしこ3' }
             try {
               const configFile = path.join(__dirname, '..', 'webapp', 'index.json')
               const configData = fs.readFileSync(configFile, {encoding: 'utf-8'})
               config = JSON.parse(configData)
               if (typeof config.appid !== 'string') {
                 config.appid = appIdDef
               }
             } catch (err) {
               console.error(err)
             }
             return config
           }

           function createMenu (win) {
               // メニューをアプリケーションに追加
               Menu.setApplicationMenu(Menu.buildFromTemplate([
                   {
                       label: 'ファイル',
                       submenu: [
                           {
                               label: '終了',
                               accelerator: 'Ctrl+Q',
                               click: () => app.quit()
                           }
                       ]
                   },
                   {
                       label: '表示',
                       submenu: [
                           {
                               label: '更新',
                               accelerator: 'F5',
                               click: () => BrowserWindow.getFocusedWindow().reload()
                           }
                       ]
                   },
                   {
                       label: 'ツール',
                       submenu: [
                           {
                               label: '開発者ツール',
                               accelerator: 'Ctrl+Shift+I',
                               click: () => BrowserWindow.getFocusedWindow().toggleDevTools()
                           }
                       ]
                   },
                   {
                       label: 'ヘルプ',
                       submenu: [
                           {
                               label: 'バージョン情報',
                               click: () => {
                                   let win = new BrowserWindow({ width: 325, height: 100 })
                                   win.setMenu(null)
                                   win.loadURL('file://' + path.join(__dirname, '..', 'webapp', 'version.html'))
                                   win.on('closed', () => {
                                       win = null
                                   })
                                   // 新しいウィンドウを開こうとした際の処理
                                   win.webContents.on('new-window', (e, url) => {
                                       console.log(url)
                                       shell.openExternal(url)
                                   });
                                   win.webContents.on('will-navigate', (e, url) => {
                                       // リンククリック時の処理
                                       console.log(url)
                                       shell.openExternal(url)
                                   });
                               }
                           }
                       ]
                   }
               ]))
           }

           app.whenReady().then(() => {
             let win = createWindow()
             sys.__enako3.setIPCHandleStandard()
             createMenu(win)

             app.on('activate', function () {
               // On macOS it's common to re-create a window in the app when the
               // dock icon is clicked and there are no other windows open.
               if (BrowserWindow.getAllWindows().length === 0) createWindow()
             })
             app.on('window-all-closed', () => {
               if (process.platform !== 'darwin') { app.quit() }
             })
           })
        },
        return_none: true
    },
}
