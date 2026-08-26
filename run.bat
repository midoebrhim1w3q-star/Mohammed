@echo off
setlocal
cd /d %~dp0
where javac >nul 2>nul
if errorlevel 1 (
  echo Java JDK 21+ is required. Install it then rerun this file.
  pause
  exit /b 1
)
if not exist out mkdir out
javac -encoding UTF-8 -d out src\main\java\com\careerfuture\CareerFutureServer.java
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)
set PORT=8080
netstat -ano | findstr /R /C:":8080 .*LISTENING" >nul 2>nul
if not errorlevel 1 set PORT=8090
start "FutureScope" cmd /k "java -cp out com.careerfuture.CareerFutureServer %PORT%"
timeout /t 2 >nul
start "" http://localhost:%PORT%
echo FutureScope is running on http://localhost:%PORT%
