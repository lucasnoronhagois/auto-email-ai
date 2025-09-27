@echo off
echo Auto Mail IA - Build e Deploy Completo
echo.

echo 📦 Construindo e iniciando todos os serviços...
docker-compose up --build -d

echo.
echo Aguardando serviços ficarem prontos...
timeout /t 10 /nobreak > nul

echo.
echo Status dos serviços:
docker-compose ps

echo.
echo Aplicação disponível em:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo    pgAdmin:  http://localhost:5050
echo.
echo 📝 Para ver logs: docker-compose logs -f
echo 🛑 Para parar: docker-compose down
echo.
pause
