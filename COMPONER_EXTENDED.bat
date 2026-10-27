@echo off
chcp 65001 >nul
title Componer Extended Art
cd /d "%~dp0"
where py >nul 2>nul && (set PY=py) || (set PY=python)
%PY% --version
if errorlevel 1 (echo NO SE ENCONTRO PYTHON & pause & exit /b)
%PY% componer_extended.py
echo.
pause
