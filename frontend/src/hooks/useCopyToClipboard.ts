import { useState } from 'react';
import { copyText } from '../utils/clipboard';

/**
 * Hook personalizado para gerenciar operações de cópia com feedback visual
 * @param timeout - Tempo em ms para limpar o estado de "copiado" (padrão: 2000)
 * @returns Objeto com função de cópia e estado
 */
export const useCopyToClipboard = (timeout: number = 2000) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = async (text: string): Promise<void> => {
    try {
      await copyText(text);
      setCopiedText(text);
      
      // Limpar o estado após o timeout
      setTimeout(() => {
        setCopiedText(null);
      }, timeout);
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
    }
  };

  const isCopied = (text: string): boolean => {
    return copiedText === text;
  };

  return {
    copy,
    isCopied,
    copiedText
  };
};
