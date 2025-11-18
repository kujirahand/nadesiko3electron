/**
 * file: plugin_electron_nako3api.js
 * electronのレンダラプロセスのためのプラグイン
 */
const PluginElectronNako3api = {
    'meta': {
        type: 'const',
        value: { // プラグインに関する情報を指定する
        pluginName: 'nadesiko3-electron-api', // プラグインの名前
        description: 'Electron API', // プラグインの説明
        pluginVersion: '3.7.9', // プラグインのバージョン
        nakoRuntime: ['enako'], // 対象ランタイム
        nakoVersion: '3.7.9' // 要求なでしこバージョン
        }
    },
    '初期化': {
        type: 'func',
        josi: [],
        pure: true,
        fn: function (sys) {
        }
    },
    '起動': {
        type: 'func',
        josi: [['を','で']],
        pure: true,
        asyncFn: true,
        fn: async function (cmd, sys) {
            return await window.nako3api.exec(cmd)
        }
    },
    'ファイル保存': {
        type: 'func',
        josi: [['を'], ['へ', 'に']],
        pure: true,
        asyncFn: true,
        fn: async function (value, name, sys) {
            return await window.nako3api.fileSave(name, value)
        }
    },
    'ファイル読': {
        type: 'func',
        josi: [['を', 'の', 'から']],
        pure: true,
        asyncFn: true,
        fn: async function (name, sys) {
            return await window.nako3api.fileLoad(name)
        }
    },
    'ファイル一覧取得': {
        type: 'func',
        josi: [],
        pure: true,
        asyncFn: true,
        fn: async function (sys) {
            return await window.nako3api.enumfiles()
        }
    },
    '環境変数取得': {
        type: 'func',
        josi: [['の']],
        pure: true,
        asyncFn: true,
        fn: async function (key, sys) {
            return await window.nako3api.env(key)
        }
    },
    '環境変数一覧取得': {
        type: 'func',
        josi: [],
        pure: true,
        asyncFn: true,
        fn: async function (sys) {
            return await window.nako3api.envlist()
        }
    },

    'データ受信時': {
        type: 'func',
        josi: [['で']],
        pure: true,
        asyncFn: true,
        fn: async function (callback, sys) {
            await window.nako3api.onData(callback)
        },
        return_none: true
    },
    'データ呼出時': {
        type: 'func',
        josi: [['で'],['の']],
        pure: true,
        asyncFn: true,
        fn: async function (callback, sys) {
            await window.nako3api.handleData(callback)
        },
        return_none: true
    },
    'データ送信': {
        type: 'func',
        josi: [['で'],['を']],
        pure: true,
        fn: function (key, data, sys) {
            window.nako3api.sendData(key, data)
        },
        return_none: true
    },
    'データ呼出': {
        type: 'func',
        josi: [['で'],['を']],
        pure: true,
        fn: function (key, data, sys) {
            return window.nako3api.invokeData(key, data)
        }
    },
}
// export default PluginElectronNako3api

// scriptタグで取り込んだ時、自動で登録する
/* istanbul ignore else */
if (typeof (navigator) === 'object' && typeof (navigator.nako3)) { navigator.nako3.addPluginObject('PluginElectronNako3api', PluginElectronNako3api) }
