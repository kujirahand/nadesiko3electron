#!/bin/bash
# スクリプト自体のパスを取得する
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)"
ROOT_PATH="$(cd "$SCRIPT_PATH/.." && pwd)"

# 既存のビルド成果物を削除
rm -f -r $ROOT_PATH/nadesiko3-darwin-arm64
rm -f $ROOT_PATH/nadesiko3-darwin-arm64.zip

cd $ROOT_PATH
npx @electron/packager . \
    --icon="$ROOT_PATH/res/AppIcon.icns" \
    --platform=darwin \
    --arch=arm64 \
    --overwrite \
    --ignore="^batch" \
    --ignore="^nadesiko3-win32-" \
    --ignore="^nadesiko3-darwin-"

