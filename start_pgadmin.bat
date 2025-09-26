@echo off
echo 🐘 pgAdmin - Interface Web para PostgreSQL
echo.

echo 🚀 Iniciando pgAdmin...
docker-compose up -d pgadmin

echo.
echo ⏳ Aguardando pgAdmin inicializar...
timeout /t 10 /nobreak > nul

echo.
echo ✅ pgAdmin iniciado com sucesso!
echo.
echo 🌐 Acesse: http://localhost:5050
echo.
echo 📋 Credenciais de Login:
echo    Email: admin@autou.com
echo    Senha: admin123
echo.
echo 🔗 Configuração do Servidor PostgreSQL:
echo    Host: postgres
echo    Port: 5432
echo    Database: autou_db
echo    Username: autou_user
echo    Password: autou_password
echo.
echo 📝 Para parar: docker-compose stop pgadmin
echo.
pause
