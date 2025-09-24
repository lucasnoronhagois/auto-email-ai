# AutoU - Classificação Inteligente de Emails

Sistema de classificação automática de emails que utiliza Inteligência Artificial e Processamento de Linguagem Natural para categorizar emails como **Produtivo** ou **Improdutivo** e gerar respostas automáticas adequadas.

## 🚀 Tecnologias

### Backend (Python)
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **Transformers** - Modelos de IA para classificação
- **OpenAI API** - Geração de respostas automáticas
- **NLTK & spaCy** - Processamento de linguagem natural
- **PyPDF2 & Textract** - Extração de texto de arquivos

### Frontend (React)
- **React 18** - Biblioteca para interface de usuário
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos

## 📋 Funcionalidades

### Interface Web
- ✅ Upload de arquivos (.txt, .pdf) ou inserção direta de texto
- ✅ Interface moderna com efeitos visuais
- ✅ Exibição de resultados com classificação e confiança
- ✅ Respostas automáticas sugeridas
- ✅ Histórico de classificações
- ✅ Design responsivo

### Backend
- ✅ Processamento de emails em texto ou arquivo
- ✅ Classificação usando IA (OpenAI + NLP)
- ✅ Geração de respostas automáticas
- ✅ Armazenamento em banco de dados
- ✅ API RESTful completa
- ✅ Soft delete para preservar histórico

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL (opcional, SQLite por padrão)

### Backend

1. **Navegue para o diretório do backend:**
```bash
cd backend
```

2. **Crie um ambiente virtual:**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente:**
```bash
# Crie um arquivo .env baseado no .env.example
cp .env.example .env
```

Edite o arquivo `.env`:
```env
DATABASE_URL=sqlite:///./autou.db
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
OPENAI_API_KEY=sua-chave-openai-aqui
```

5. **Execute o servidor:**
```bash
python main.py
```

O backend estará disponível em `http://localhost:8000`

### Frontend

1. **Navegue para o diretório do frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o servidor de desenvolvimento:**
```bash
npm start
```

O frontend estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
Case-AutoU/
├── backend/
│   ├── config/
│   │   └── database.py          # Configuração do banco
│   ├── models/
│   │   ├── email.py            # Modelo Email
│   │   └── classification.py   # Modelo Classification
│   ├── schemas/
│   │   ├── email.py            # Schemas Pydantic
│   │   └── classification.py
│   ├── services/
│   │   ├── email_service.py    # Lógica de negócio
│   │   ├── classification_service.py
│   │   ├── nlp_service.py      # Processamento NLP
│   │   ├── ai_service.py       # Integração IA
│   │   └── file_service.py     # Processamento arquivos
│   ├── controllers/
│   │   └── email_controller.py # Rotas da API
│   ├── main.py                 # Aplicação principal
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── services/           # Serviços de API
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Emails
- `POST /api/emails/upload-text` - Upload de email via texto
- `POST /api/emails/upload-file` - Upload de email via arquivo
- `GET /api/emails` - Listar emails processados
- `GET /api/emails/{id}` - Obter email com classificação

### Documentação
- `GET /docs` - Documentação interativa da API (Swagger)

## 🎯 Como Usar

1. **Acesse a aplicação** em `http://localhost:3000`

2. **Faça upload de um email:**
   - Cole o texto diretamente, ou
   - Faça upload de um arquivo .txt ou .pdf

3. **Visualize os resultados:**
   - Categoria: Produtivo ou Improdutivo
   - Nível de confiança da classificação
   - Resposta automática sugerida

4. **Consulte o histórico** de classificações anteriores

## 🧠 Algoritmo de Classificação

O sistema utiliza uma abordagem híbrida:

1. **Pré-processamento NLP:**
   - Remoção de stop words
   - Stemming/Lemmatização
   - Extração de features

2. **Classificação por IA:**
   - OpenAI GPT-3.5-turbo para análise contextual
   - Fallback com análise de keywords
   - Score de confiança

3. **Geração de Resposta:**
   - Respostas personalizadas baseadas na categoria
   - Tom profissional para emails produtivos
   - Respostas educadas mas firmes para spam

## 🔒 Segurança

- Soft delete para preservar histórico
- Validação de tipos de arquivo
- Limite de tamanho de arquivo (10MB)
- Sanitização de entrada

## 🚀 Deploy

### Backend
```bash
# Usando uvicorn em produção
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
# Build para produção
npm run build
```

## 📝 Licença

Este projeto foi desenvolvido como parte do Case AutoU.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
