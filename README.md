# なでしこ3配布キット(Electron版)

なでしこ3のプログラムを実行ファイルに変換するためのツールキットです。

## なでしこ配布キットとの違い

既になでしこ3の配布キットには、OSにインストールされているブラウザを利用した「[なでしこ配布キット](https://github.com/kujirahand/nadesiko3webkit)」があります。この配布キットは配布サイズが小さいのがメリットですが、ユーザーが利用しているブラウザによって依存の問題が生じ可能性や、コンポーネントが正しく動かなかったり、依存ブラウザの警告が表示されることがあります。

そこで、配布キット(Electron版)の出番です。Electron版では配布サイズが220MBと大きいのですが、ブラウザのフル機能を配布するため、ユーザー環境による依存が少なく、安定して動作させることが可能です。

# どのように利用しますか？

最初に、[Node.js](https://nodejs.org/ja/)をインストールしてください。インストール後、コマンドライン(PowerShellまたはTerminal.app)で以下を実行しましょう。

```
git clone https://github.com/kujirahand/nadesiko3electron.git
cd nadesiko3electron
npm install
```

そして、webapp以下に梱包したいファイルを配置します。
webapp/main.nako3がメインファイルです。
このファイルに実行したいなでしこのプログラムを記述します。

# ビルドしよう

Windowsなら`npm run build:win`を実行します。macOSなら`npm run build:mac`を実行します。

```
$ npm run build:win
$ npm run build:mac
```

すると配布用の実行ファイルが生成されます。


