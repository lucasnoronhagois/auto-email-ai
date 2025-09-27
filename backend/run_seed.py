#!/usr/bin/env python3
"""
Script simples para executar o seed do banco de dados
"""

import sys
import os

# Adiciona o diretório backend ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from seed_prompts_templates import main

if __name__ == "__main__":
    print("🌱 Executando seed do banco de dados...")
    main()
    print("✅ Seed concluído!")
