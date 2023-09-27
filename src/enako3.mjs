#!/usr/bin/env node
/**
 * コマンドライン版のなでしこ3
 */
import { ENako3 } from './enako3mod.mjs';
// メイン
(async () => {
    const enako3 = new ENako3();
    try {
        await enako3.execCommand();
    }
    catch (err) {
        // 何かしらのエラーがあればコンソールに返す
        // ここで出るエラーは致命的なエラー
        console.error('[enako3のエラー]', err);
    }
})();
