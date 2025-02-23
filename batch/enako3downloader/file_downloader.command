#!/bin/bash
SCRIPT_DIR=$(cd $(dirname $0); pwd)
cd $SCRIPT_DIR
$SCRIPT_DIR/file_downloader
read -n 1 -p "pause" char


