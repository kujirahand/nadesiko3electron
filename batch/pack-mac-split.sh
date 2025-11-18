#!/bin/bash
DIR_SCRIPT="$(cd "$(dirname "$0")" && pwd)"
DIR_ROOT="$(cd "$DIR_SCRIPT/.." && pwd)"
SPLIT_EXE=$DIR_SCRIPT/enako3splitter/file_splitter
DIR_ENAKO3=$DIR_ROOT/nadesiko3-darwin-arm64
TARGET_ENAKO3_ZIP=$DIR_ROOT/nadesiko3-darwin-arm64.zip

rm -f $TARGET_ENAKO3_ZIP
zip -9 -r $TARGET_ENAKO3_ZIP $DIR_ENAKO3

$SPLIT_EXE $TARGET_ENAKO3_ZIP 50
