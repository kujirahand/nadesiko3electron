'use strict'

const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const util = require('util')
const childProcess = require('node:child_process')
const quote = require('shell-quote').quote

// 設定ファイルを読む
const config = loadConfig()
const appId = config.appid

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})

app.on('ready', () => {
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
            win.loadURL('file://' + path.join(__dirname, '..', 'demo', 'version.html'))
            win.on('closed', () => {
              win = null
            })
          }
        }
      ]
    }
  ]))

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
    const fname = path.join(getUserDataDir(), removePathFlag(filename))
    const readFile = util.promisify(fs.readFile)
    return await readFile(fname, {encoding: 'utf-8'})
  })
  ipcMain.handle('fileSave', async (_event, filename, data) => {
    const fname = path.join(getUserDataDir(), removePathFlag(filename))
    const writeFile = util.promisify(fs.writeFile)
    return await writeFile(fname, data, {encoding: 'utf-8'})
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

  // ブラウザ (Chromium) の起動, 初期画面のロード
  let win = new BrowserWindow({
    width: config.width,
    height: config.height,
    title: config.title,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadURL('file://' + path.join(__dirname, 'webapp', 'index.html'))
  win.on('closed', () => {
    win = null
  })
})

function getUserDataDir () {
  const home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]
  const dir = path.join(home, '.nadesiko3', appId)
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  return dir
}
function removePathFlag (fname) {
  fname = fname.replace(/\:/g, '__c__')
  fname = fname.replace(/\\/g, '__y__')
  fname = fname.replace(/\//g, '__p__')
  return fname
}

function loadConfig () {
  const appIdDef = 'nadesiko3electron'
  let config = { appid: appIdDef, width: 800, height: 600, title: 'なでしこ3' }
  try {
    const configFile = path.join(__dirname, 'webapp', 'index.json')
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

