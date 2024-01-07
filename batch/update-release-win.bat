@echo off
@echo "setup environment"
set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%\.."
set "NAKO3NODE_DIR=%ROOT_DIR%nadesiko3"
set "NAKO3WEB_DIR=%ROOT_DIR%webapp\nadesiko3"
@echo "create and clean nadesiko3 folder for web"
if not exist "%NAKO3WEB_DIR%" mkdir "%NAKO3WEB_DIR%"
cd /D "%NAKO3WEB_DIR%"
del /Q *
for /f %%a in ('dir /ad /b /w *') do rmdir /S /q %%a
@echo "create and clean nadesiko3 folder for node"
if not exist "%NAKO3NODE_DIR%" mkdir "%NAKO3NODE_DIR%"
cd /D "%NAKO3NODE_DIR%"
del /Q *
for /f %%a in ('dir /ad /b /w *') do rmdir /S /q %%a
@echo "build nadesiko3"
cd /D "%ROOT_DIR%"
cd ..\nadesiko3
call npm run build
@echo "copy nadesiko3 for web folder from release"
xcopy release\* "%NAKO3WEB_DIR%" /I /Q /Y /S
del "%NAKO3WEB_DIR%\stats.json"
@echo "copy nadesiko3 for node folder from src and core/src"
xcopy src "%NAKO3NODE_DIR%\src" /I /Q /Y /S /EXCLUDE:%SCRIPT_DIR%exclude_copy.txt
xcopy core\src "%NAKO3NODE_DIR%\core\src" /I /Q /Y /S /EXCLUDE:%SCRIPT_DIR%exclude_copy.txt
cd /D "%ROOT_DIR%"
