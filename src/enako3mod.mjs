/**
 * Electron版のなでしこ3をモジュールとして定義
 * 実際には enako3.mjs から読み込まれる
 */
import fs from 'fs';
// import fse from 'fs-extra';
// import { exec } from 'child_process';
import path from 'path';
import { NakoCompiler, newCompilerOptions } from 'nadesiko3/core/src/nako3.mjs';
import { NakoImportError } from 'nadesiko3/core/src/nako_errors.mjs';
import nakoVersion from 'nadesiko3/src/nako_version.mjs';
import PluginNode from 'nadesiko3/src/plugin_node.mjs';
import PluginElectronNode from './plugin_electron_node.mjs';
import app from 'nadesiko3/src/commander_ja.mjs';
import fetch from 'node-fetch';
import { NakoGenOptions } from 'nadesiko3/core/src/nako_gen.mjs';
// __dirname のために
import url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** ENako3 */
export class ENako3 extends NakoCompiler {
    constructor(opts = { nostd: false }) {
        super({ useBasicPlugin: !opts.nostd });
        this.debug = false;
        this.filename = path.join(__dirname, '..', 'node.nako3');
        this.version = nakoVersion.version;
        this.addPluginFile('PluginNode', path.join(__dirname, 'plugin_node.mjs'), PluginNode);
        this.addPluginFile('PluginElectronNode', path.join(__dirname, 'plugin_electron_node.mjs'), PluginElectronNode);
        // 必要な定数を設定
        this.addListener('beforeRun', (g) => {
            g.__varslist[0]['ナデシコ種類'] = 'enako3';
            g.__varslist[0]['ナデシコバージョン'] = this.version;
        });
    }

    /** コマンドライン引数を解析 */
    checkArguments() {
        let logLevel = 'error';
        this.getLogger().addListener(logLevel, ({ level, nodeConsole }) => {
            console.log(nodeConsole);
        });
        const args = {
            run: true,
            mainfile: this.filename
        };
        return args;
    }
    // 実行する
    async execCommand() {
        // コマンドを解析
        const opt = this.checkArguments();
        // メインプログラムを読み込む
        this.filename = opt.mainfile;
        const src = fs.readFileSync(opt.mainfile, 'utf-8');
        // ファイルを読んで実行する
        try {
            // コンパイルと実行を行うメソッド
            const g = await this.runAsync(src, opt.mainfile);
            return g;
        }
        catch (e) {
            // 文法エラーなどがあった場合
            if (opt.debug || opt.trace) {
                throw e;
            }
        }
    }
    quit() {
        PluginElectronNode.QUIT.fn(null)
    }
    // (js|nako3) loader
    getLoaderTools() {
        /** @type {string[]} */
        const log = [];
        const tools = {
            resolvePath: (name, token, fromFile) => {
                // 最初に拡張子があるかどうかをチェック
                // JSプラグインか？
                if (/\.(js|mjs)(\.txt)?$/.test(name)) {
                   const jspath = ENako3.findJSPluginFile(name, fromFile, __dirname, log);
                    if (jspath === '') {
                        throw new NakoImportError(`JSプラグイン『${name}』が見つかりません。以下のパスを検索しました。\n${log.join('\n')}`, token.file, token.line);
                    }
                    return { filePath: jspath, type: 'js' };
                }
                // なでしこプラグインか？
                if (/\.(nako3|nako)(\.txt)?$/.test(name)) {
                    // ファイルかHTTPか
                    if (name.startsWith('http://') || name.startsWith('https://')) {
                        return { filePath: name, type: 'nako3' };
                    }
                    if (path.isAbsolute(name)) {
                        return { filePath: path.resolve(name), type: 'nako3' };
                    }
                    else {
                        // filename が undefined のとき token.file が undefined になる。
                        if (token.file === undefined) {
                            throw new Error('ファイル名を指定してください。');
                        }
                        const dir = path.dirname(fromFile);
                        return { filePath: path.resolve(path.join(dir, name)), type: 'nako3' };
                    }
                }
                // 拡張子がない、あるいは、(.js|.mjs|.nako3|.nako)以外はJSモジュールと見なす
                const jspath2 = ENako3.findJSPluginFile(name, fromFile, __dirname, log);
                if (jspath2 === '') {
                    throw new NakoImportError(`JSプラグイン『${name}』が見つかりません。以下のパスを検索しました。\n${log.join('\n')}`, token.file, token.line);
                }
                return { filePath: jspath2, type: 'js' };
            },
            readNako3: (name, token) => {
                const loader = { task: null };
                // ファイルかHTTPか
                if (name.startsWith('http://') || name.startsWith('https://')) {
                    // Webのファイルを非同期で読み込む
                    loader.task = (async () => {
                        const res = await fetch(name);
                        if (!res.ok) {
                            throw new NakoImportError(`『${name}』からのダウンロードに失敗しました: ${res.status} ${res.statusText}`, token.file, token.line);
                        }
                        return await res.text();
                    })();
                }
                else {
                    // ファイルを非同期で読み込む
                    // ファイルチェックだけ先に実行
                    if (!fs.existsSync(name)) {
                        throw new NakoImportError(`ファイル ${name} が存在しません。`, token.file, token.line);
                    }
                    loader.task = (new Promise((resolve, reject) => {
                        fs.readFile(name, { encoding: 'utf-8' }, (err, data) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(data);
                        });
                    }));
                }
                // 非同期で読み込む
                return loader;
            },
            readJs: (filePath, token) => {
                const loader = { task: null };
                if (process.platform === 'win32') {
                    if (filePath.substring(1, 3) === ':\\') {
                        filePath = 'file://' + filePath;
                    }
                }
                // + プラグインの読み込みタスクを生成する
                // | プラグインがWeb(https?://...)に配置されている場合
                if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                    // 動的 import が http 未対応のため、一度、Webのファイルを非同期で読み込んで/tmpに保存してから動的importを行う
                    loader.task = (new Promise((resolve, reject) => {
                        // 一時フォルダを得る
                        const osTmpDir = (process.platform === 'win32') ? process.env.TEMP : '/tmp';
                        const osTmpDir2 = (osTmpDir) || path.join('./tmp');
                        const tmpDir = path.join(osTmpDir2, 'com.nadesi.v3.enako');
                        const tmpFile = path.join(tmpDir, filePath.replace(/[^a-zA-Z0-9_.]/g, '_'));
                        if (!fs.existsSync(tmpDir)) {
                            fs.mkdirSync(tmpDir, { recursive: true });
                        }
                        // WEBからダウンロード
                        fetch(filePath)
                            .then((res) => {
                            return res.text();
                        })
                            .then((txt) => {
                            // 一時ファイルに保存
                            try {
                                fs.writeFileSync(tmpFile, txt, 'utf-8');
                            }
                            catch (err) {
                                const err2 = new NakoImportError(`URL『${filePath}』からダウンロードしたJSファイルがキャッシュに書き込めません。${err}`, token.file, token.line);
                                reject(err2);
                            }
                        })
                            .then(() => {
                            // 一時ファイルから読み込む
                            import(tmpFile).then((mod) => {
                                // プラグインは export default で宣言
                                const obj = Object.assign({}, mod);
                                resolve(() => {
                                    return obj.default;
                                });
                            }).catch((err) => {
                                const err2 = new NakoImportError(`URL『${filePath}』からダウンロードしたはずのJSファイル読み込めません。${err}`, token.file, token.line);
                                reject(err2);
                            });
                        })
                            .catch((err) => {
                            const err2 = new NakoImportError(`URL『${filePath}』からJSファイルが読み込めません。${err}`, token.file, token.line);
                            reject(err2);
                        });
                    }));
                    return loader;
                }
                // | プラグインがファイル上に配置されている場合
                loader.task = (new Promise((resolve, reject) => {
                    import(filePath).then((mod) => {
                        // プラグインは export default で宣言
                        const obj = Object.assign({}, mod);
                        resolve(() => { return obj.default; });
                    }).catch((err) => {
                        const err2 = new NakoImportError(`ファイル『${filePath}』が読み込めません。${err}`, token.file, token.line);
                        reject(err2);
                    });
                }));
                return loader;
            }
        };
        return tools;
    }
    /** 『!「xxx」を取込』の処理 */
    async loadDependencies(code, filename, preCode) {
        const tools = this.getLoaderTools();
        await super._loadDependencies(code, filename, preCode, tools);
    }
    /**
     * 非同期でなでしこのコードを実行する
     */
    async runAsync(code, fname, options = undefined) {
        // オプション
        const opt = newCompilerOptions(options);
        // 取り込む文
        await this.loadDependencies(code, fname, opt.preCode);
        // 実行
        return await super.runAsync(code, fname, options);
    }
    /**
     * プラグインファイルの検索を行う
     * @param pname プラグインの名前
     * @param filename 取り込み元ファイル名
     * @param srcDir このファイルが存在するディレクトリ
     * @param log
     * @return フルパス、失敗した時は、''を返す
     */
    static findJSPluginFile(pname, filename, srcDir, log = []) {
        log.length = 0;
        const cachePath = {};
        /** キャッシュ付きでファイルがあるか検索 */
        const exists = (f) => {
            // 同じパスを何度も検索することがないように
            if (cachePath[f]) {
                return cachePath[f];
            }
            try {
                // ファイルがないと例外が出る
                const stat = fs.statSync(f);
                const b = !!(stat && stat.isFile());
                cachePath[f] = b;
                return b;
            }
            catch (err) {
                return false;
            }
        };
        /** 普通にファイルをチェック */
        const fCheck = (pathTest, desc) => {
            // 素直に指定されたパスをチェック
            const bExists = exists(pathTest);
            log.push(`- (${desc}) ${pathTest}, ${bExists}`);
            return bExists;
        };
        /** 通常 + package.json のパスを調べる */
        const fCheckEx = (pathTest, desc) => {
            // 直接JSファイルが指定された？
            if (/\.(js|mjs)$/.test(pathTest)) {
                if (fCheck(pathTest, desc)) {
                    return pathTest;
                }
            }
            // 指定パスのpackage.jsonを調べる
            const json = path.join(pathTest, 'package.json');
            if (fCheck(json, desc + '/package.json')) {
                // package.jsonを見つけたので、メインファイルを調べて取り込む (CommonJSモジュール対策)
                const jsonText = fs.readFileSync(json, 'utf-8');
                const obj = JSON.parse(jsonText);
                if (!obj.main) {
                    return '';
                }
                const mainFile = path.resolve(path.join(pathTest, obj.main));
                return mainFile;
            }
            return '';
        };
        // URL指定か?
        if (pname.substring(0, 8) === 'https://') {
            return pname;
        }
        // 各パスを検索していく
        const p1 = pname.substring(0, 1);
        // フルパス指定か?
        if (p1 === '/' || pname.substring(1, 3).toLowerCase() === ':\\' || pname.substring(0, 6) === 'file:/') {
            const fileFullpath = fCheckEx(pname, 'フルパス');
            if (fileFullpath) {
                return fileFullpath;
            }
            return ''; // フルパスの場合別のフォルダは調べない
        }
        // 相対パスか?
        if (p1 === '.' || pname.indexOf('/') >= 0) {
            // 相対パス指定なので、なでしこのプログラムからの相対指定を調べる
            const pathRelative = path.join(path.resolve(path.dirname(filename)), pname);
            const fileRelative = fCheckEx(pathRelative, '相対パス');
            if (fileRelative) {
                return fileRelative;
            }
            return ''; // 相対パスの場合も別のフォルダは調べない
        }
        // plugin_xxx.mjs のようにファイル名のみが指定された場合のみ、いくつかのパスを調べる
        // 母艦パス(元ファイルと同じフォルダ)か?
        const testScriptPath = path.join(path.resolve(path.dirname(filename)), pname);
        const fileScript = fCheckEx(testScriptPath, '母艦パス');
        if (fileScript) {
            return fileScript;
        }
        // ランタイムパス/src/<plugin>
        if (pname.match(/^plugin_[a-z0-9_]+\.mjs/)) {
            // enako3mod.mjs は ランタイム/src に配置されていることが前提
            const pathRoot = path.resolve(__dirname, '..');
            const pathRuntimeSrc = path.join(pathRoot, 'nadesiko3', 'src', pname);
            const fileRuntimeSrc = fCheckEx(pathRuntimeSrc, 'ENAKO3パス');
            if (fileRuntimeSrc) {
                return fileRuntimeSrc;
            }
            // ランタイム/core/src/<plugin>
            const pathCore = path.join(pathRoot, 'nadesiko3', 'core', 'src', pname);
            const fileCore = fCheckEx(pathCore, 'ENAKO3パス');
            if (fileCore) {
                return fileCore;
            }
        }
        // 環境変数をチェック
        // 環境変数 NAKO_LIB か?
        if (process.env.NAKO_LIB) {
            const NAKO_LIB = path.join(path.resolve(process.env.NAKO_LIB), pname);
            const fileLib = fCheckEx(NAKO_LIB, 'NAKO_LIB');
            if (fileLib) {
                return fileLib;
            }
        }
        // ランタイムパス/node_modules/<plugin>
        const pathRuntime = path.join(path.dirname(path.resolve(__dirname)));
        const pathRuntimePname = path.join(pathRuntime, 'node_modules', pname);
        const fileRuntime = fCheckEx(pathRuntimePname, 'runtime');
        if (fileRuntime) {
            return fileRuntime;
        }
        // ランタイムと同じ配置 | ランタイムパス/../<plugin>
        const runtimeLib = path.join(pathRuntime, '..', pname);
        const fileLib = fCheckEx(runtimeLib, 'runtimeLib');
        if (fileLib) {
            return fileLib;
        }
        // nadesiko3core | ランタイムパス/node_modules/nadesiko3core/src/<plugin>
        const pathRuntimeSrc2 = path.join(pathRuntime, 'node_modules', 'nadesiko3core', 'src', pname); // enako3mod.mjs は ランタイム/src に配置されていることが前提
        const fileRuntimeSrc2 = fCheckEx(pathRuntimeSrc2, 'nadesiko3core');
        if (fileRuntimeSrc2) {
            return fileRuntimeSrc2;
        }
        // 環境変数 NAKO_HOMEか?
        if (process.env.NAKO_HOME) {
            const NAKO_HOME = path.join(path.resolve(process.env.NAKO_HOME), 'node_modules', pname);
            const fileHome = fCheckEx(NAKO_HOME, 'NAKO_HOME');
            if (fileHome) {
                return fileHome;
            }
            // NAKO_HOME/src ?
            const pathNakoHomeSrc = path.join(NAKO_HOME, 'src', pname);
            const fileNakoHomeSrc = fCheckEx(pathNakoHomeSrc, 'NAKO_HOME/src');
            if (fileNakoHomeSrc) {
                return fileNakoHomeSrc;
            }
        }
        // 環境変数 NODE_PATH (global) 以下にあるか？
        if (process.env.NODE_PATH) {
            const pathNode = path.join(path.resolve(process.env.NODE_PATH), pname);
            const fileNode = fCheckEx(pathNode, 'NODE_PATH');
            if (fileNode) {
                return fileNode;
            }
        }
        // Nodeのパス検索には任せない(importで必ず失敗するので)
        return '';
    }
}
