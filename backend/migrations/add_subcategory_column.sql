-- Migração para adicionar coluna subcategory à tabela classifications
-- Execute este script no seu banco de dados

ALTER TABLE classifications ADD COLUMN subcategory VARCHAR(50);

-- Comentário para documentar a nova coluna
COMMENT ON COLUMN classifications.subcategory IS 'Subcategoria específica detectada (ex: meetings, projects, spam_promotions, etc.)';
