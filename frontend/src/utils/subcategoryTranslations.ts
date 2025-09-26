// Traduções das subcategorias para português
export const SUBCATEGORY_TRANSLATIONS: Record<string, string> = {
  // Subcategorias produtivas
  'meetings': 'Reuniões',
  'projects': 'Projetos',
  'sales_business': 'Vendas & Negócios',
  'financial': 'Financeiro',
  'hr_recruitment': 'RH & Recrutamento',
  'technology': 'Tecnologia',
  'strategy_planning': 'Estratégia & Planejamento',
  'urgent_important': 'Urgente & Importante',
  
  // Subcategorias improdutivas
  'spam_promotions': 'Spam & Promoções',
  'personal_greetings': 'Cumprimentos Pessoais',
  'scams_fraud': 'Golpes & Fraudes',
  'adult_content': 'Conteúdo Adulto',
  'social_media': 'Redes Sociais'
};

// Função para traduzir subcategoria
export const translateSubcategory = (subcategory: string | null | undefined): string | null => {
  if (!subcategory) return null;
  return SUBCATEGORY_TRANSLATIONS[subcategory] || subcategory;
};
