import { app, BrowserWindow, Menu, shell } from 'electron'
import path from 'path'

export function createMenu (win) {
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
                        win.loadURL('file://' + path.join(__dirname, 'webapp', 'version.html'))
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