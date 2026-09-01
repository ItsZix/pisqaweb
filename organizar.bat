@echo off
echo Organizando y limpiando el proyecto...
powershell.exe -ExecutionPolicy Bypass -File organizar.ps1
echo =======================================================
echo ¡Todo listo! 
echo El proyecto final ahora esta unicamente en la carpeta pisqa-vercel.
echo Los archivos de afuera han sido limpiados.
echo =======================================================
pause
