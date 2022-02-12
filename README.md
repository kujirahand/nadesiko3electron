# nadesiko3electron

Nadesiko3 packager for electron

# どのように利用しますか？

最初に、Node.jsをインストールしてください。
コマンドラインで以下を実行しましょう。

```
$ npm install
```

webapp以下に梱包したいファイルを配置します。
webapp/main.nako3がメインファイルです。
このファイルに実行したいなでしこのプログラムを記述します。

# ビルドしよう

Windowsなら`npm run build:win`を実行します。macOSなら`npm run build:mac`を実行します。

```
$ npm run build:win
$ npm run build:mac
```

すると実行ファイルが生成されます。


