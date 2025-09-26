/**
 * Utilitário para operações de clipboard
 */

/**
 * Copia texto para a área de transferência
 * @param text - Texto a ser copiado
 * @returns Promise que resolve quando a cópia for concluída
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Erro ao copiar texto:', error);
    throw error;
  }
};

/** 
 * @returns 
 */
export const isClipboardSupported = (): boolean => {
  return !!navigator.clipboard;
};

/**
 * Fallback para navegadores que não suportam a API de clipboard
 * @param text
 */
export const copyToClipboardFallback = (text: string): void => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
  } catch (error) {
    console.error('Erro ao copiar texto (fallback):', error);
  } finally {
    document.body.removeChild(textArea);
  }
};

/**
 * Função universal para copiar texto com fallback
 * @param text - Texto a ser copiado
 * @returns Promise que resolve quando a cópia for concluída
 */
export const copyText = async (text: string): Promise<void> => {
  if (isClipboardSupported()) {
    await copyToClipboard(text);
  } else {
    copyToClipboardFallback(text);
  }
};
