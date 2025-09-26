-- Script de inicialização do banco PostgreSQL para AutoU
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Comentários sobre o banco
COMMENT ON DATABASE autou_db IS 'Banco de dados para o sistema AutoU - Classificação automática de emails';

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'Banco de dados AutoU inicializado com sucesso!';
    RAISE NOTICE 'Timezone configurado para: %', current_setting('timezone');
END $$;
