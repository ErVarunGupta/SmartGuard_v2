@echo off
cd smartguard-service
start cmd /k venv\Scripts\activate ^&^& uvicorn main:app --host 127.0.0.1 --port 8000

cd ..
timeout /t 3

npx electron .