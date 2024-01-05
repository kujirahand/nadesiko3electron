# なでしこ3配布キット(Electron版)

なでしこ3のプログラムを実行ファイルに変換するためのツールキットです。

## なでしこ配布キットとの違い

既になでしこ3の配布キットには、OSにインストールされているブラウザを利用した「[なでしこ配布キット](https://github.com/kujirahand/nadesiko3webkit)」があります。この配布キットは配布サイズが小さいのがメリットですが、ユーザーが利用しているブラウザによって依存の問題が生じ可能性や、コンポーネントが正しく動かなかったり、依存ブラウザの警告が表示されることがあります。

そこで、配布キット(Electron版)の出番です。Electron版では配布サイズが220MBと大きいのですが、ブラウザのフル機能を配布するため、ユーザー環境による依存が少なく、安定して動作させることが可能です。

# どのように利用しますか？

以下よりElectron版の配布パッケージをダウンロードします。

- [nadesiko3electron/releases](https://github.com/kujirahand/nadesiko3electron/releases)

そして、解凍したら下記のファイルを編集します。

- (Windows) `resources/app/webapp/main.nako3`
- (macOS) `nadesiko3/Contents/Resources/app/webapp/main.nako3`

このファイルに実行したいなでしこのプログラムを記述します。

なお、macOSではFinderでnadesiko3.appを選択して、右クリックメニューより「パッケージの内容を表示」をクリックしてください。

## (詳細な方法) コマンドラインから最新版をビルドする方法

最初に、[Node.js](https://nodejs.org/ja/)をインストールしてください。インストール後、コマンドライン(PowerShellまたはTerminal.app)で以下を実行しましょう。

```
git clone https://github.com/kujirahand/nadesiko3electron.git
cd nadesiko3electron
npm install
```

そして、webapp/main.nako3 を編集します。これがメインファイルです。
このファイルに実行したいなでしこのプログラムを記述します。

それから、Windowsなら`npm run build:win`を実行します。macOSなら`npm run build:mac`を実行します。

```
$ npm run build:win
$ npm run build:mac
```

すると配布用の実行ファイルが生成されます。

## 利用可能なAPI

なでしこ3のWeb版の命令が全て使えます。
加えて、Electron版の専用の命令が利用できます。

```
"表示", [["の", "を", "と"]]
"コンソール表示", [["の", "を", "と"]]
"表示ログクリア", []
"起動", [["を", "で"]]
"ファイル保存", [["を"], ["へ", "に"]], 
"ファイル読", [["を", "の", "から"]], 
"ファイル一覧取得", [], 
"環境変数取得", [["の"]], 
"環境変数一覧取得", [], 
```






