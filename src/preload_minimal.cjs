// preload.cjs
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nako3api', {
    sendData: (key, data) => ipcRenderer.send('renderer-send', key, data),
    sendDataSync: (key, data) => ipcRenderer.sendSync('renderer-send', key, data),
    invokeData: (key, data) => ipcRenderer.invoke('renderer-invoke', key, data),
    onData: (callback) => ipcRenderer.on('main-send', callback),
    handleData: (callback) => ipcRenederer.handle('main-invoke', callback),
})
