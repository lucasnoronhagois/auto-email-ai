@echo off
echo Configuração PostgreSQL
echo.

echo Escolha a opção:
echo 1. PostgreSQL com Docker (Recomendado)
echo 2. PostgreSQL local (se já tiver instalado)
echo 3. SQLite para desenvolvimento (mais simples)
echo.

set /p choice="Digite sua escolha (1-3): "

if "%choice%"=="1" (
    echo.
    echo Configurando PostgreSQL com Docker...
    echo.
    echo Copiando configuração PostgreSQL...
    copy backend\env_postgresql_example.txt backend\.env
    echo.
    echo Iniciando Docker com PostgreSQL...
    docker-compose up -d postgres redis
    echo.
    echo Aguardando PostgreSQL inicializar...
    timeout /t 15 /nobreak > nul
    echo.
    echo Inicializando banco de dados...
    cd backend
    python db_manager.py init
    echo.
    echo PostgreSQL configurado com Docker!
    echo Para iniciar a aplicação: python run.py
)

if "%choice%"=="2" (
    echo.
    echo Configurando PostgreSQL local...
    echo.
    echo Certifique-se de que o PostgreSQL está rodando na porta 5432
    echo E que o banco 'autou_db' existe
    echo.
    echo Copiando configuração PostgreSQL...
    copy backend\env_postgresql_example.txt backend\.env
    echo.
    echo Inicializando banco de dados...
    cd backend
    python db_manager.py init
    echo.
    echo PostgreSQL local configurado!
    echo Para iniciar a aplicação: python run.py
)

if "%choice%"=="3" (
    echo.
    echo Configurando SQLite para desenvolvimento...
    echo.
    echo Copiando configuração SQLite...
    copy backend\env_sqlite_example.txt backend\.env
    echo.
    echo Inicializando banco de dados...
    cd backend
    python db_manager.py init
    echo.
    echo SQLite configurado!
    echo Para iniciar a aplicação: python run.py
)

echo.
echo Para verificar a configuração:
echo    python db_manager.py info
echo.
pause
