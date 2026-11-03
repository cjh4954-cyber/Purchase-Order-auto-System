@echo off
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%LOCALAPPDATA%\Programs\MinGit\ucrt64\bin;%PATH%"
git push -u origin main
pause
