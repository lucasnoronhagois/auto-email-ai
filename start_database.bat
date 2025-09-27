@echo off
echo Iniciando banco de dados com Docker...
docker-compose up -d postgres redis
echo.
echo Banco de dados iniciado!
echo PostgreSQL: localhost:5432
echo Redis: localhost:6379
echo.
echo Para parar: docker-compose down
pause
