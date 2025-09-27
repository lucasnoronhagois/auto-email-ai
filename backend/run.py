#!/usr/bin/env python3
"""
Script para executar o servidor
"""

import uvicorn
import os
import sys
from dotenv import load_dotenv

# Adiciona o diretório atual ao Python path para resolver imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Adiciona também o diretório pai para imports absolutos
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Carrega variáveis de ambiente
load_dotenv()

# Importa o app diretamente após configurar o path
from main import app

if __name__ == "__main__":
    # Configurações do servidor
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"Iniciando Auto Server...")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Debug: {debug}")
    print(f"Docs: http://{host}:{port}/docs")
    
    uvicorn.run(
        app,  # Passa o app diretamente em vez de string
        host=host,
        port=port,
        reload=False,  # Desabilitar reload em produção
        log_level="info"
    )
