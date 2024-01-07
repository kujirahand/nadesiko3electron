rem get script_path
for %%i in (%0) do set script_path=%%~dpi
rem get root_dir
set "root_dir=%script_path%\.."

cd %root_dir%

rem    --arch=x64,ia32 ^
npx electron-packager . ^
    --icon=%root_dir%\res\nako.ico ^
    --platform=win32 ^
    --arch=x64 ^
    --overwrite ^
    --ignore="^batch" ^
    --ignore="^nadesiko3-win32-" ^
    --ignore="^nadesiko3-darwin-"

pause

