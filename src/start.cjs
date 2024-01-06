// このファイルは、Electron のメインプロセスである
//
// # start.cjs を使う理由
// メインプログラムの enako3.mjs は、ESM で書かれている
// しかし、Electronのメインプロセスは、ESM に対応していないため、
// import関数を使って、ESMのファイルを読み込む
//
// # enako.mjs と node.nako3 の関係
// メインプログラムの enako3.mjs は、node.nako3 を呼び出して実行する
// 実際に、node.nako3 を読み込んでいるのは、enako3mod.mjs
//
const path = require('path')

global.require = require
global.__dirname = __dirname

try {
    import('./enako3.mjs').then(() => {
        console.log("[start.cjs] ok.")
    }).catch((e) => {
        console.error('[ERROR::import(enako3.mjs)] start.cjs', e)
    })
} catch (e) {
    console.error('[ERROR::catch] start.cjs', e)
}
