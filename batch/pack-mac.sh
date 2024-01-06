#!/bin/bash
# スクリプト自体のパスを取得する
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)"
ROOT_PATH="$(cd "$SCRIPT_PATH/.." && pwd)"

cd $ROOT_PATH
npx electron-packager . \
    --icon="$ROOT_PATH/res/AppIcon.icns" \
    --platform=darwin \
    --arch=x64,arm64 \
    --overwrite \
    --ignore="^batch" \
    --ignore="^nadesiko3-win32-" \
    --ignore="^nadesiko3-darwin-"

