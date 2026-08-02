@echo off

:: Start Vite dev server in a new window
start "Vite Dev Server" cmd /c "npm run dev"

:: Wait a few seconds for the server to start (adjust if needed)
timeout /t 5 > nul

:: Open the default browser to the local Vite URL
start "" http://localhost:5173

:: Keep the script window open so you can close the dev server later
pause
