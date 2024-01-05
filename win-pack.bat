rem    --arch=x64,ia32 ^
npx electron-packager . ^
    --icon=res/nako.ico ^
    --platform=win32 ^
    --arch=x64 ^
    --overwrite ^
    --ignore="^file_splitter" ^
    --ignore="^file_downloader" ^
    --ignore="^output" ^
    --ignore="^nadesiko3-win32-ia32" ^
    --ignore="^nadesiko3-win32-x64"

pause

