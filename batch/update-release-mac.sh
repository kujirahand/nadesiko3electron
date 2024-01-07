#!/bin/bash
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)"
ROOT_PATH="$(cd "$SCRIPT_PATH/.." && pwd)"
NAKO3_PATH="$(cd "$SCRIPT_PATH/../../nadesiko3" && pwd)"

# UPDATE WEB version
echo "--- SCRIPT_PATH: $SCRIPT_PATH"
echo "--- ROOT_PATH: $ROOT_PATH"
rm -f $ROOT_PATH/webapp/nadesiko3/*

echo "--- NAKO3_PATH: $NAKO3_PATH"
cd $NAKO3_PATH
npm run hello
npm run build
cp $NAKO3_PATH/release/* $ROOT_PATH/webapp/nadesiko3/
ls $ROOT_PATH/webapp/nadesiko3/*

