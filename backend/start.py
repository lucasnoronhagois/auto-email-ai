#!/usr/bin/env python3
"""
Script de inicialização para Railway
Configura o sys.path antes de importar o app
"""

import sys
import os

# Adiciona o diretório atual ao Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Força a configuração do path para todos os imports
os.environ['PYTHONPATH'] = current_dir

# Importa e executa o app
if __name__ == "__main__":
    import uvicorn
    from main import app
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
