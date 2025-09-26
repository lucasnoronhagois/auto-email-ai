# AutoU - Sistema de Classificação Inteligente de E-mails

Sistema inteligente para classificação automática de e-mails como Produtivo ou Improdutivo, com geração de respostas sugeridas baseadas em contexto e padrões.

## Características

- **Classificação Automática**: Análise contextual usando padrões regex e palavras-chave
- **Geração de Respostas**: Sugestões personalizadas baseadas na categoria e subcategoria
- **Interface Web**: Frontend React com TypeScript e design moderno
- **API REST**: Backend FastAPI com documentação automática
- **Banco de Dados**: PostgreSQL com relacionamentos otimizados
- **Docker**: Deploy completo com containers
- **Gerenciamento de Prompts**: Interface para edição e personalização de prompts

## Arquitetura

### Backend (FastAPI)
- **API REST** com documentação automática
- **Classificação Contextual** usando padrões regex e análise de conteúdo
- **Banco PostgreSQL** com relacionamentos
- **Sistema de Prompts** híbrido (banco com prioridade + fallback para arquivos locais)
- **Geração de respostas** baseada em prompts personalizáveis (banco + fallback)
- **Cache de prompts** com timeout configurável

### Frontend (React + TypeScript)
- **Interface moderna** com Tailwind CSS
- **Upload de arquivos** e texto
- **Visualização de resultados** em tempo real
- **Histórico de classificações** com sistema de expansão
- **Gerenciador de prompts** com edição inline
- **Design responsivo** e acessível
- **Sistema de abas** para organização de conteúdo

### Banco de Dados
- **PostgreSQL** como banco principal
- **Relacionamentos** entre emails, classificações e prompts
- **Sistema de versionamento** para prompts
- **Índices otimizados** para performance

## Instalação e Configuração

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- Docker e Docker Compose
- Git

### Configuração Rápida

#### Opção 1: Docker (Recomendado)
```bash
# Clone o repositório
git clone <repository-url>
cd Case-AutoU

# Configurar e iniciar tudo
.\setup_postgresql.bat
# Escolha opção 1 (PostgreSQL com Docker)

# Ou iniciar tudo de uma vez
.\build_and_run.bat
```

#### Opção 2: Desenvolvimento Local
```bash
# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python run.py

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### Configuração Manual

#### 1. Banco de Dados
```bash
# Iniciar PostgreSQL
.\start_database.bat

# Ou manualmente
docker-compose up -d postgres
```

#### 2. Configurar Ambiente
```bash
# Copiar configuração PostgreSQL
copy backend\env_postgresql_example.txt backend\.env

# Inicializar banco
cd backend
.\venv\Scripts\activate
python db_manager.py init
```

#### 3. Iniciar Serviços
```bash
# Backend
cd backend
.\venv\Scripts\activate
python run.py

# Frontend
cd frontend
npm run dev
```

## Uso

### Acessos
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs

### Como Usar
1. **Acesse** http://localhost:3000
2. **Cole um texto** de e-mail ou faça upload de arquivo
3. **Aguarde** a classificação automática
4. **Veja o resultado** com categoria, subcategoria e resposta sugerida
5. **Copie** a resposta sugerida ou gere uma nova
6. **Gerencie prompts** através da aba "Prompts"

## Funcionalidades

### Classificação de E-mails
- **Categorias**: Produtivo / Improdutivo
- **Subcategorias**: 
  - Produtivos: meetings, projects, sales_business, financial, hr_recruitment, technology, strategy_planning, urgent_important
  - Improdutivos: spam_promotions, personal_greetings, scams_fraud, adult_content, social_media
- **Análise contextual** baseada em padrões regex
- **Score de confiança** para cada classificação

### Geração de Respostas
- **Prompts personalizáveis** por categoria e subcategoria
- **Respostas contextualizadas** baseadas no conteúdo do e-mail
- **Sistema de regeneração** para múltiplas opções
- **Cópia facilitada** com feedback visual

### Gerenciamento de Prompts
- **Interface de edição** inline
- **Sistema híbrido** (banco de dados + arquivos locais)
- **Organização por abas** (Produtivos / Improdutivos)
- **Versionamento** e histórico de alterações

### Histórico e Analytics
- **Visualização completa** de todas as classificações
- **Sistema de expansão** para detalhes
- **Filtros por categoria** e data
- **Métricas de performance**

## Estrutura do Projeto

```
Case-AutoU/
├── backend/                 # API FastAPI
│   ├── config/             # Configurações
│   ├── controllers/        # Controladores da API
│   ├── models/            # Modelos do banco
│   ├── services/          # Serviços de negócio
│   ├── schemas/           # Schemas Pydantic
│   ├── data/              # Dados e prompts locais
│   └── requirements.txt   # Dependências Python
├── frontend/              # Interface React
│   ├── src/              # Código fonte
│   │   ├── components/   # Componentes React
│   │   ├── services/     # Serviços de API
│   │   ├── hooks/        # Hooks personalizados
│   │   └── utils/        # Utilitários
│   └── package.json      # Dependências Node
├── docker-compose.yml    # Orquestração Docker
├── setup_postgresql.bat  # Script de configuração
└── build_and_run.bat     # Script de deploy
```

## Banco de Dados

### Tabelas

#### emails
- `id` - Chave primária
- `subject` - Assunto do e-mail
- `content` - Conteúdo do e-mail
- `sender` - Remetente
- `recipient` - Destinatário
- `file_name` - Nome do arquivo
- `file_type` - Tipo do arquivo
- `created_at` - Data de criação
- `updated_at` - Data de atualização

#### classifications
- `id` - Chave primária
- `email_id` - FK para emails
- `category` - Categoria (Produtivo/Improdutivo)
- `subcategory` - Subcategoria específica
- `confidence_score` - Score de confiança (0-100%)
- `suggested_response` - Resposta sugerida
- `processing_time` - Tempo de processamento
- `created_at` - Data de criação
- `updated_at` - Data de atualização

#### prompts
- `id` - Chave primária
- `type` - Tipo do prompt (classification/response_generation)
- `category` - Categoria (produtivo/improdutivo)
- `subcategory` - Subcategoria específica
- `content` - Conteúdo do prompt
- `description` - Descrição do prompt
- `version` - Versão do prompt
- `is_active` - Status ativo
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Relacionamentos
- Um e-mail pode ter múltiplas classificações
- Uma classificação pertence a um e-mail
- Prompts são independentes mas referenciados por categoria/subcategoria

## Scripts Disponíveis

### Windows (.bat)
- `setup_postgresql.bat` - Configurar ambiente PostgreSQL
- `build_and_run.bat` - Build e deploy completo
- `start_database.bat` - Iniciar apenas banco de dados

### Comandos Manuais
```bash
# Backend
cd backend
python run.py

# Frontend
cd frontend
npm run dev

# Docker
docker-compose up --build -d

# Banco
python db_manager.py init
python db_manager.py info
```

## Configuração de Ambiente

### Variáveis de Ambiente (.env)
```env
# Database
DATABASE_URL=postgresql://autou_user:autou_password@localhost:5432/autou_db

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Security
SECRET_KEY=your_secret_key
```

## Docker

### Serviços
- **postgres**: Banco PostgreSQL
- **backend**: API FastAPI
- **frontend**: Interface React + Nginx

### Comandos Docker
```bash
# Iniciar tudo
docker-compose up --build -d

# Apenas banco
docker-compose up -d postgres

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## Desenvolvimento

### Estrutura de Desenvolvimento
- **Backend**: FastAPI com hot reload
- **Frontend**: Vite com hot reload e TypeScript
- **Banco**: PostgreSQL com relacionamentos otimizados
- **Logs**: Configurados para desenvolvimento

### Comandos de Desenvolvimento
```bash
# Backend com hot reload
cd backend
python run.py

# Frontend com hot reload
cd frontend
npm run dev

# Verificar banco
python db_manager.py info
```

## Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Reiniciar banco
docker-compose restart postgres
```

#### 2. Frontend Não Carrega
```bash
# Reinstalar dependências
cd frontend
npm install

# Limpar cache
npm run build
```

#### 3. Backend Não Inicia
```bash
# Verificar ambiente virtual
cd backend
.\venv\Scripts\activate

# Reinstalar dependências
pip install -r requirements.txt
```

### Logs e Debug
```bash
# Ver logs do Docker
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend

# Verificar status
docker-compose ps
```

## Performance

### Otimizações Implementadas
- **Frontend**: Minificação, code splitting, TypeScript
- **Backend**: Connection pooling, cache de prompts
- **Banco**: Índices otimizados, relacionamentos eficientes
- **Docker**: Multi-stage builds, layers otimizadas

### Métricas
- **Tempo de classificação**: ~1-2 segundos
- **Confiança**: 60-95%
- **Tamanho da imagem**: ~200MB total
- **Tempo de build**: ~2-3 minutos

## Segurança

### Implementado
- Usuários não-root nos containers
- Headers de segurança no Nginx
- Network isolada
- Health checks
- Restart policies

### Recomendações para Produção
- Use secrets para senhas
- Configure SSL/TLS
- Implemente rate limiting
- Configure backup automático
- Monitore logs de segurança

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Changelog

### v1.0.0
- Sistema de classificação automática contextual
- Interface web completa com TypeScript
- Integração com PostgreSQL
- Deploy com Docker
- Sistema de prompts personalizáveis
- Geração de respostas baseada em prompts híbridos
- Histórico de classificações
- Sistema de abas para organização