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
    '高さ' : { key: 'heigth' },
    '高' : { key: 'heigth' },
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
    'ノード統合': { key: 'nodeIntegration', isBool: true },
    'NODE統合': { key: 'nodeIntegration', isBool: true },
    'サンドボックス': { key: 'sandbox', isBool: true },
    'コンテキスト分離': { key: 'contextIsolation', isBool: true },
    'ダイアログ保護': { key: 'safeDialogs', isBool: true },
    'DIALOG保護': { key: 'safeDialogs', isBool: true },
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
    'アイコン': { key: 'icon' },
    '有効': { key: 'enabled', isBool: true },
    '表示': { key: 'visible', isBool: true },
    '可視': { key: 'visible', isBool: true },
    'サブメニュー': { isCallback: true },
    'SUBMENU': { isCallback: true },
    'submenu': { isCallback: true },
    'ID': { key: 'id' },
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
    'Eアプリ': { type: 'const', value: app },
    'アプリID設定': {
        type: 'func',
        josi: [['に','を']],
        pure: true,
        fn: function (appId, sys) {
            sys.__enako3.appId = appId
        },
        return_none: true
    },
    'PRELOAD作成': {
        type: 'func',
        josi: [['から','を'], ['に']],
        pure: true,
        fn: function (data, file, sys) {
            
        }
    },
    'QUIT': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            app.quit()
        },
        return_none: true
    },
    '全ウインドウ数取得': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return BrowserWindow.getAllWindows().length
        }
    },
    'フォーカスウインドウ取得': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
            return BrowserWindow.getFocusedWindow()
        }
    },
    'ウインドウ再読込': {
        type: 'func',
        josi: [['を']],
        pure: true,
        fn: function (win, sys) {
            win.reload()
        },
        return_none: true
    },
    '開発ツールトグル': {
        type: 'func',
        josi: [['を','の']],
        pure: true,
        fn: function (win, sys) {
            win.toggleDevTools()
        },
        return_none: true
    },

    'ブラウザウインドウ作成': {
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
    'ブラウザ読込': {
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
    'アプリメニュー設定': {
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
            return this["アプリメニュー設定"].fn(menu, sys)
        },
        return_none: true
    },
    'メニュー設定': {
        type: 'func',
        josi: [['に'],['を']],
        pure: true,
        fn: function (win, menu, sys) {
            win.setMenu(menu)
        },
        return_none: true
    },
    'メニュー一括作成': {
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
    'メニューアイテム取得': {
        type: 'func',
        josi: [['から'],['を','の']],
        pure: true,
        fn: function (menu, id, sys) {
            return menu.getMenuItemById(id)
        },
    },
    'Eアプリ準備完了時': {
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

    'メニューIDクリック時': {
        type: 'func',
        josi: [['で'],['の'],['を']],
        pure: true,
        fn: function (callback, menu, id, sys) {
            const item = menu.getMenuItemById(id)
            item['click'] = callback
        },
        return_none: true
    },

    '発生時': {
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
    '単発発生時': {
        type: 'func',
        josi: [['で'],['の'],['']],
        pure: true,
        fn: function (callback, obj, type, sys) {
            obj.once(type, callback)
        },
        return_none: true
    },
    '呼出時': {
        type: 'func',
        josi: [['で'],['の'],['']],
        pure: true,
        fn: function (callback, obj, type, sys) {
            obj.handle(type, callback)
        },
        return_none: true
    },
    '呼出': {
        type: 'func',
        josi: [['の'],['','を'],['で']],
        pure: true,
        fn: function (obj, type, args, sys) {
            return obj.invoke(type, ...args)
        }
    },

    'データ受信時': {
        type: 'func',
        josi: [['で']],
        pure: true,
        fn: function (callback, sys) {
            ipcMain.on('renderer-send', callback)
        },
        return_none: true
    },
    'データ呼出時': {
        type: 'func',
        josi: [['で'],['の']],
        pure: true,
        fn: function (callback, sys) {
            ipcMain.handle('renderer-invoke', callback)
        },
        return_none: true
    },
    'データ送信': {
        type: 'func',
        josi: [['に'],['で'],['を']],
        pure: true,
        fn: function (obj, key, data, sys) {
            obj.send('main-send', key, data)
        },
        return_none: true
    },
    'データ呼出': {
        type: 'func',
        josi: [['に'],['で'],['を']],
        pure: true,
        fn: function (obj, key, data, sys) {
            return obj.invoke('main-invoke', key, data)
        }
    },

    'URL開': {
        type: 'func',
        josi: [['を','の']],
        pure: true,
        fn: function (url, sys) {
            shell.openExternal(url)
        },
        return_none: true
    },

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

    'PRELOAD作成': {
        type: 'func',
        josi: [['から','を'], ['に']],
        pure: true,
        fn: function (data, file, sys) {
            
        }
    },
}
