@echo off
echo Stopping and removing existing container...
docker rm -f resume-container

echo Compiling SCSS to CSS...
powershell.exe -ExecutionPolicy Bypass -Command "npm run scss:build"

echo Building new Docker image...
docker build -t mi-resume-app .

echo Running new container...
docker run -p 3000:3000 --env-file .env --name resume-container -d mi-resume-app

echo.
echo Application is running on http://localhost:3000
pause