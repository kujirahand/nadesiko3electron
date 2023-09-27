// preload.cjs
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nako3api', {
    exec: (command) => ipcRenderer.invoke('exec', command),
    log: (msg) => ipcRenderer.send('log', msg),
    fileSave: (fname, text) => ipcRenderer.invoke('fileSave', fname, text),
    fileLoad: (filename) => ipcRenderer.invoke('fileLoad', filename),
    enumfiles: () => ipcRenderer.invoke('enumfiles'),
    env: (key) => ipcRenderer.invoke('env', key),
    envlist: () => ipcRenderer.invoke('envlist'),
    sendData: (key, data) => ipcRenderer.send('renderer-send', key, data),
    sendDataSync: (key, data) => ipcRenderer.sendSync('renderer-send', key, data),
    invokeData: (key, data) => ipcRenderer.invoke('renderer-invoke', key, data),
    onData: (callback) => ipcRenderer.on('main-send', callback),
    handleData: (callback) => ipcRenederer.handle('main-invoke', callback),
})
