"""
Modelos do Ollama organizados por categoria
"""

# Modelos modernos do Ollama (por ordem de preferência)
OLLAMA_MODELS = [
    "llama3.1:8b-instruct",    # Llama 3.1 8B Instruct
    "llama3.2:3b-instruct",    # Llama 3.2 3B Instruct
    "llama3.2:1b-instruct",    # Llama 3.2 1B Instruct
    "llama3.1:8b",             # Llama 3.1 8B Base
    "phi3:mini",               # Microsoft Phi-3 Mini
    "llama3:8b-instruct",      # Llama 3 8B Instruct
    "llama3:8b",               # Llama 3 8B Base
    "llama2:13b",              # Llama 2 13B (fallback)
    "llama2:7b"                # Llama 2 7B (fallback)
]

# Configurações padrão para Ollama
OLLAMA_DEFAULT_CONFIG = {
    "base_url": "http://localhost:11434",
    "timeout": 30,
    "temperature": 0.7,
    "num_predict": 200
}
