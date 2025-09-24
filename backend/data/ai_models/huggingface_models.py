"""
Modelos do Hugging Face organizados por categoria
"""

# Modelos de geração de texto do Hugging Face (por ordem de preferência)
HUGGINGFACE_GENERATION_MODELS = [
    "meta-llama/Llama-3.1-8B-Instruct",    # 8B - muito popular e eficiente
    "meta-llama/Llama-3.2-3B-Instruct",    # 3B - menor e mais rápido
    "meta-llama/Llama-3.2-1B-Instruct",    # 1B - muito leve
    "microsoft/Phi-4-mini-instruct",        # 4B - Microsoft
    "HuggingFaceTB/SmolLM3-3B",            # 3B - Hugging Face
    "meta-llama/Llama-3.2-1B"              # 1B - versão base
]

# Configurações padrão para Hugging Face
HUGGINGFACE_DEFAULT_CONFIG = {
    "max_tokens": 200,
    "temperature": 0.7,
    "base_url": "https://router.huggingface.co/v1"
}
