@echo off

:: Start Spring Boot backend in a new window
start "Spring Boot Backend" cmd /c "cd backend && mvnw spring-boot:run"

:: Start Vite dev server in a new window (exposed to network)
start "Vite Dev Server" cmd /c "npm run dev -- --host"

:: Wait a few seconds for the servers to start
timeout /t 10 > nul

:: Open the default browser to the local Vite URL
start "" http://localhost:5173

:: Keep the script window open so you can close the dev server later
pause
