import path from 'path'
import fs from 'fs'
import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import util from 'util'
import childProcess from 'node:child_process'
import { quote } from 'shell-quote'
import { createMenu } from './menu.js'

// 設定ファイルを読む
const config = loadConfig()
const appId = config.appid

function createWindow() {
  // ブラウザ (Chromium) の起動, 初期画面のロード
  let win = new BrowserWindow({
    width: config.width,
    height: config.height,
    title: config.title,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  })
  win.loadURL('file://' + path.join(__dirname, 'webapp', 'index.html'))
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

function setIPCHandle () {
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
    return await readFile(fname, { encoding: 'utf-8' })
  })
  ipcMain.handle('fileSave', async (_event, filename, data) => {
    const fname = path.join(getUserDataDir(), removePathFlag(filename))
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

app.whenReady().then(() => {
  let win = createWindow()
  setIPCHandle()
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

