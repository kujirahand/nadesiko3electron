@rem go build .\file_downloader.go
mkdir win-file_downloader
copy .\file_downloader.exe win-file_downloader\
copy .\info.json win-file_downloader\
copy .\README.md win-file_downloader\README.txt

pause
