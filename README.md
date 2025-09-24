# Auto Email AI

Sistema inteligente de classificação e resposta automática de emails usando IA. Desenvolvido para automatizar o processamento de emails corporativos, classificando-os como produtivos ou improdutivos e gerando respostas automáticas contextuais.

## Funcionalidades

### **Classificação Inteligente**
- **Análise por palavras-chave** organizadas por categorias
- **Detecção de tópicos específicos** (reuniões, projetos, vendas, etc.)
- **Classificação multilíngue** (português, inglês e outros idiomas)
- **Sistema de pontuação** baseado na importância empresarial

### **Respostas Automáticas**
- **IA para geração dinâmica** (Hugging Face, Ollama)
- **Templates organizados por categoria** como fallback
- **Respostas contextualizadas** por tipo de email
- **Tom corporativo profissional** em todas as respostas

### **Arquitetura Robusta**
- **Backend**: Python + FastAPI
- **Frontend**: React + Vite
- **Banco de dados**: MySQL/SQLite
- **IA**: Hugging Face Inference API + Ollama
- **Estrutura organizacional** profissional

## Tecnologias

### **Backend**
- **Python 3.11+**
- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para banco de dados
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

### **Frontend**
- **React 18**
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP

### **IA e NLP**
- **Hugging Face** - Modelos de IA gratuitos
- **Ollama** - Modelos locais
- **Classificação por palavras-chave** - Sistema próprio
- **Prompts estruturados** - Respostas contextualizadas

### **Banco de Dados**
- **MySQL** - Produção
- **SQLite** - Desenvolvimento
- **Docker** - Containerização

## Estrutura do Projeto

```
auto-email-ai/
├── backend/                    # Backend Python
│   ├── data/                   # Dados estáticos organizados
│   │   ├── keywords/           # Palavras-chave por categoria
│   │   ├── prompts/            # Prompts para IA
│   │   ├── templates/          # Templates de resposta
│   │   └── ai_models/          # Configurações de modelos
│   ├── services/               # Lógica de negócio
│   ├── models/                 # Modelos de banco
│   ├── schemas/                # Schemas Pydantic
│   ├── controllers/            # Endpoints da API
│   └── config/                 # Configurações
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── services/           # Serviços de API
│   │   └── styles/             # Estilos CSS
│   └── public/                 # Arquivos estáticos
├── .vscode/                    # Configurações do VS Code
└── README.md                   # Documentação
```

## Instalação

### **Pré-requisitos**
- Python 3.11+
- Node.js 18+
- Docker (opcional)

### **1. Clone o repositório**
```bash
git clone https://github.com/lucasnoronhagois/auto-email-ai.git
cd auto-email-ai
```

### **2. Backend Setup**
```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### **3. Frontend Setup**
```bash
cd frontend

# Instalar dependências
npm install
```

### **4. Configuração do Banco**
```bash
# Usar SQLite (padrão) ou MySQL com Docker
docker run --name mysql-autou -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=autou_db -p 3308:3306 -d mysql:8.0
```

### **5. Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=sqlite:///./autou.db
# ou para MySQL:
# DATABASE_URL=mysql+pymysql://root:password@localhost:3308/autou_db

SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True

# Opcional - Hugging Face Token
HF_TOKEN=seu-token-huggingface
```

## Execução

### **Backend**
```bash
cd backend
venv\Scripts\activate  # Windows
python run.py
```
Servidor rodando em: `http://localhost:8000`

### **Frontend**
```bash
cd frontend
npm run dev
```
Aplicação rodando em: `http://localhost:5173`

### **Scripts Automatizados**
```bash
# Windows
start_backend.bat
start_frontend.bat
```

## Como Funciona

### **1. Classificação de Emails**
- **Upload** de arquivo (.txt, .pdf) ou texto direto
- **Análise** por palavras-chave organizadas por categoria
- **Detecção** de tópicos específicos (reuniões, projetos, etc.)
- **Classificação** como "Produtivo" ou "Improdutivo"

### **2. Geração de Respostas**
- **IA primeiro**: Tenta gerar resposta contextualizada
- **Fallback**: Usa templates organizados por categoria
- **Respostas específicas**: Por tipo de email detectado
- **Tom corporativo**: Profissional em todos os casos

### **3. Categorias Suportadas**

#### **Emails Produtivos**
- **Meetings** - Reuniões e compromissos
- **Projects** - Projetos e tarefas
- **Sales/Business** - Propostas comerciais
- **Financial** - Questões financeiras
- **HR/Recruitment** - Recrutamento
- **Technology** - Questões técnicas
- **Strategy/Planning** - Planejamento estratégico
- **Urgent/Important** - Assuntos urgentes

#### **Emails Improdutivos**
- **Spam/Promotions** - Promoções e spam
- **Personal Greetings** - Mensagens pessoais
- **Scams/Fraud** - Golpes e fraudes
- **Adult Content** - Conteúdo inadequado
- **Social Media** - Convites de redes sociais

## Configuração Avançada

### **Modelos de IA**
O sistema suporta múltiplos provedores:

#### **Hugging Face (Gratuito)**
- Llama 3.1/3.2 Instruct
- Microsoft Phi-4 Mini
- SmolLM3
- Configurável em `data/ai_models/huggingface_models.py`

#### **Ollama (Local)**
- Modelos Llama locais
- Phi-3 Mini
- Configurável em `data/ai_models/ollama_models.py`

### **Personalização**
- **Palavras-chave**: Editar em `data/keywords/`
- **Prompts**: Modificar em `data/prompts/`
- **Templates**: Ajustar em `data/templates/`

## API Endpoints

### **Emails**
- `POST /api/emails/upload-file` - Upload de arquivo
- `POST /api/emails/upload-text` - Texto direto
- `GET /api/emails/` - Listar emails
- `GET /api/emails/{id}` - Buscar email específico

### **Classificações**
- `GET /api/classifications/` - Listar classificações
- `GET /api/classifications/{id}` - Buscar classificação

## Exemplos de Uso

### **Email de Reunião**
```
Input: "Olá, gostaria de agendar uma reunião para discutir o projeto X"
Output: "Produtivo - Meetings"
Resposta: "Prezado(a), agradecemos o convite para a reunião. Nossa equipe analisará a proposta e retornaremos com nossa disponibilidade em até 24 horas. Atenciosamente, Equipe Comercial."
```

### **Email de Natal**
```
Input: "Feliz Natal e um próspero ano novo!"
Output: "Improdutivo - Personal Greetings"
Resposta: "Prezado(a), agradecemos suas felicitações e carinho. Atenciosamente, Departamento de Relacionamento."
```

## Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

**Lucas Noronha Gois**
- GitHub: [@lucasnoronhagois](https://github.com/lucasnoronhagois)
- LinkedIn: [Lucas Noronha](https://linkedin.com/in/lucasnoronhagois)

## Agradecimentos

- **Hugging Face** - Modelos de IA gratuitos
- **FastAPI** - Framework web moderno
- **React** - Biblioteca para interfaces
- **Tailwind CSS** - Framework CSS utilitário

## Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. **Verifique** os [Issues](https://github.com/lucasnoronhagois/auto-email-ai/issues)
2. **Crie** um novo issue se necessário
3. **Entre em contato** via LinkedIn

---

**Se este projeto foi útil para você, considere dar uma estrela!**