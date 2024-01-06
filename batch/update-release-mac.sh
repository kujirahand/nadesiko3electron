#!/bin/bash
SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)"
ROOT_PATH="$(cd "$SCRIPT_PATH/.." && pwd)"


# UPDATE WEB version
rm -f $ROOT_PATH/webapp/nadesiko3/*
cd ../nadesiko3
npm run build
cp ./release/* $ROOT_PATH/webapp/nadesiko3/
