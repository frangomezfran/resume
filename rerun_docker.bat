@echo off
echo Stopping existing container...
docker stop resume-container

echo Compiling SCSS to CSS...
powershell.exe -ExecutionPolicy Bypass -Command "npm run scss:build"

echo Building new Docker image...
docker build -t resume-app .

echo Running new container...
docker run -d -p 3000:3000 --rm --name resume-container resume-app

echo.
echo Application is running on http://localhost:3000
pause