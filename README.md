# AutoU - Sistema de Classificação Automática de Emails

Sistema inteligente para classificação automática de emails como Produtivo ou Improdutivo, com geração de respostas sugeridas usando IA.

## Características

- **Classificação Automática**: IA + NLP para classificar emails
- **Geração de Respostas**: Sugestões personalizadas baseadas no conteúdo
- **Interface Web**: Frontend React com design moderno
- **API REST**: Backend FastAPI com documentação automática
- **Banco de Dados**: PostgreSQL com relacionamentos otimizados
- **Docker**: Deploy completo com containers
- **Interface de Banco**: pgAdmin para gerenciamento visual

## Arquitetura

### Backend (FastAPI)
- **API REST** com documentação automática
- **Classificação IA** usando Hugging Face e Ollama
- **Banco PostgreSQL** com relacionamentos
- **Processamento NLP** para análise de conteúdo
- **Geração de respostas** baseada em templates e IA

### Frontend (React + Vite)
- **Interface moderna** com Tailwind CSS
- **Upload de arquivos** e texto
- **Visualização de resultados** em tempo real
- **Histórico de classificações**
- **Design responsivo**

### Banco de Dados
- **PostgreSQL** como banco principal
- **Redis** para cache e sessões
- **Relacionamentos** entre emails e classificações
- **pgAdmin** para interface visual

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
# Iniciar PostgreSQL e Redis
.\start_database.bat

# Ou manualmente
docker-compose up -d postgres redis
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
- **pgAdmin**: http://localhost:5050

### Credenciais pgAdmin
- **Email**: admin@autou.com
- **Senha**: admin123

### Configuração do Servidor PostgreSQL no pgAdmin
- **Host**: postgres
- **Port**: 5432
- **Database**: autou_db
- **Username**: autou_user
- **Password**: autou_password

### Como Usar
1. **Acesse** http://localhost:3000
2. **Cole um texto** de email ou faça upload de arquivo
3. **Aguarde** a classificação automática
4. **Veja o resultado** com confiança e resposta sugerida
5. **Copie** a resposta sugerida se necessário

## Estrutura do Projeto

```
Case-AutoU/
├── backend/                 # API FastAPI
│   ├── config/             # Configurações
│   ├── controllers/        # Controladores da API
│   ├── models/            # Modelos do banco
│   ├── services/          # Serviços de negócio
│   ├── schemas/           # Schemas Pydantic
│   ├── data/              # Dados e templates
│   └── requirements.txt   # Dependências Python
├── frontend/              # Interface React
│   ├── src/              # Código fonte
│   ├── components/       # Componentes React
│   └── package.json      # Dependências Node
├── docker-compose.yml    # Orquestração Docker
├── setup_postgresql.bat  # Script de configuração
└── build_and_run.bat     # Script de deploy
```

## Banco de Dados

### Tabelas

#### emails
- `id` - Chave primária
- `subject` - Assunto do email
- `content` - Conteúdo do email
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
- `confidence_score` - Score de confiança (0-100%)
- `suggested_response` - Resposta sugerida
- `processing_time` - Tempo de processamento
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Relacionamentos
- Um email pode ter múltiplas classificações
- Uma classificação pertence a um email
- Relacionamento 1:N entre emails e classifications

## Scripts Disponíveis

### Windows (.bat)
- `setup_postgresql.bat` - Configurar ambiente PostgreSQL
- `build_and_run.bat` - Build e deploy completo
- `start_database.bat` - Iniciar apenas banco de dados
- `start_pgadmin.bat` - Iniciar interface do banco

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

# AI Services
OPENAI_API_KEY=your_key_here
HF_TOKEN=your_token_here

# Security
SECRET_KEY=your_secret_key
```

## Docker

### Serviços
- **postgres**: Banco PostgreSQL
- **redis**: Cache Redis
- **backend**: API FastAPI
- **frontend**: Interface React + Nginx
- **pgadmin**: Interface do banco

### Comandos Docker
```bash
# Iniciar tudo
docker-compose up --build -d

# Apenas banco
docker-compose up -d postgres redis

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## Desenvolvimento

### Estrutura de Desenvolvimento
- **Backend**: FastAPI com hot reload
- **Frontend**: Vite com hot reload
- **Banco**: PostgreSQL com pgAdmin
- **Logs**: Reduzidos para desenvolvimento

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

#### 4. pgAdmin Não Acessa
```bash
# Verificar se está rodando
docker-compose ps pgadmin

# Reiniciar pgAdmin
docker-compose restart pgadmin
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
- **Frontend**: Minificação, code splitting, gzip
- **Backend**: Connection pooling, cache
- **Banco**: Índices otimizados, relacionamentos
- **Docker**: Multi-stage builds, layers otimizadas

### Métricas
- **Tempo de classificação**: ~1-2 segundos
- **Confiança**: 60-95%
- **Tamanho da imagem**: ~250MB total
- **Tempo de build**: ~3-5 minutos

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
- Sistema de classificação automática
- Interface web completa
- Integração com PostgreSQL
- Deploy com Docker
- Interface pgAdmin
- Geração de respostas com IA