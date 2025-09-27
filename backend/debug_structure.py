#!/usr/bin/env python3
"""
Script para debug da estrutura de diretórios no Railway
"""

import os
import sys

def print_directory_structure(path, prefix="", max_depth=3, current_depth=0):
    """Imprime a estrutura de diretórios recursivamente"""
    if current_depth >= max_depth:
        return
    
    try:
        items = sorted(os.listdir(path))
        for i, item in enumerate(items):
            if item.startswith('.'):
                continue
                
            item_path = os.path.join(path, item)
            is_last = i == len(items) - 1
            
            current_prefix = "└── " if is_last else "├── "
            print(f"{prefix}{current_prefix}{item}")
            
            if os.path.isdir(item_path):
                next_prefix = prefix + ("    " if is_last else "│   ")
                print_directory_structure(item_path, next_prefix, max_depth, current_depth + 1)
    except PermissionError:
        print(f"{prefix}└── [Permission Denied]")

def main():
    print("=== DEBUG: Estrutura de Diretórios no Railway ===")
    print(f"Diretório atual: {os.getcwd()}")
    print(f"Script executado de: {os.path.abspath(__file__)}")
    print(f"Python path: {sys.path}")
    print()
    
    print("Estrutura do diretório atual:")
    print_directory_structure(".", max_depth=2)
    print()
    
    print("Verificando arquivos específicos:")
    files_to_check = [
        "main.py",
        "models/__init__.py",
        "models/email.py",
        "services/__init__.py",
        "services/email_service.py",
        "controllers/__init__.py",
        "config/__init__.py",
        "schemas/__init__.py"
    ]
    
    for file_path in files_to_check:
        exists = os.path.exists(file_path)
        print(f"  {file_path}: {'✓' if exists else '✗'}")
        if exists:
            try:
                with open(file_path, 'r') as f:
                    first_line = f.readline().strip()
                    print(f"    Primeira linha: {first_line}")
            except Exception as e:
                print(f"    Erro ao ler: {e}")
    
    print()
    print("Tentando importar models.email:")
    try:
        from models.email import Email
        print("✓ Import bem-sucedido!")
    except Exception as e:
        print(f"✗ Erro no import: {e}")
    
    print()
    print("Tentando importar services.email_service:")
    try:
        from services.email_service import EmailService
        print("✓ Import bem-sucedido!")
    except Exception as e:
        print(f"✗ Erro no import: {e}")

if __name__ == "__main__":
    main()
