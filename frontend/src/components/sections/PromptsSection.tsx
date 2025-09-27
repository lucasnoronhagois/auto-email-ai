import React from 'react';
import { CheckCircle, XCircle, Settings, Edit3, Save, X } from 'lucide-react';
import { PromptItem, PromptTab } from '../../types';

interface PromptsSectionProps {
  promptsLoading: boolean;
  promptsData: PromptItem[];
  activePromptTab: PromptTab;
  setActivePromptTab: (tab: PromptTab) => void;
  editingPrompt: number | null;
  promptEditContent: string;
  setPromptEditContent: (content: string) => void;
  startEditingPrompt: (id: number, content: string) => void;
  savePrompt: (id: number) => void;
  cancelEditingPrompt: () => void;
}

const PromptsSection: React.FC<PromptsSectionProps> = ({
  promptsLoading,
  promptsData,
  activePromptTab,
  setActivePromptTab,
  editingPrompt,
  promptEditContent,
  setPromptEditContent,
  startEditingPrompt,
  savePrompt,
  cancelEditingPrompt
}) => {
  const renderPromptCard = (prompt: PromptItem, category: 'produtivo' | 'improdutivo') => {
    const isEditing = editingPrompt === prompt.id;
    const borderColor = category === 'produtivo' ? 'border-green-500/20' : 'border-red-500/20';
    const categoryBgColor = category === 'produtivo' ? 'bg-green-600' : 'bg-red-600';
    const categoryBgColorLight = category === 'produtivo' ? 'bg-green-500' : 'bg-red-500';
    
    return (
      <div key={prompt.id} className={`glass-effect rounded-xl p-6 border ${borderColor}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  {prompt.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
                <span className={`${categoryBgColor} text-white px-3 py-1 rounded-lg text-sm font-medium`}>
                  {prompt.category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
                {prompt.subcategory && (
                  <span className={`${categoryBgColorLight} text-white px-3 py-1 rounded-lg text-sm font-medium`}>
                    {prompt.subcategory.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                )}
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => {
                    startEditingPrompt(prompt.id, prompt.content);
                  }}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="text-sm">Editar</span>
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={promptEditContent}
                  onChange={(e) => setPromptEditContent(e.target.value)}
                  className="w-full bg-black/20 border border-white/20 rounded-lg p-4 text-white text-sm resize-none focus:outline-none focus:border-blue-500/50"
                  rows={8}
                  placeholder="Digite o conteúdo do prompt..."
                />
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => savePrompt(prompt.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={cancelEditingPrompt}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-white text-sm whitespace-pre-wrap">{prompt.content}</p>
              </div>
            )}
            
            <p className="text-white/60 text-xs mt-4">
              Criado em: {new Date(prompt.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Gerenciador de Prompts</h2>
          <p className="text-gray-300 text-lg">Visualize e gerencie todos os prompts do sistema</p>
        </div>

        {promptsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/80">Carregando prompts...</p>
          </div>
        ) : promptsData.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 text-lg">Nenhum prompt encontrado</p>
            <p className="text-white/60 text-sm">Os prompts serão carregados automaticamente</p>
          </div>
        ) : (
          <div>
            {/* Tabs Navigation */}
            <div className="flex space-x-1 mb-8 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActivePromptTab('productive')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all ${
                  activePromptTab === 'productive'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Produtivos</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activePromptTab === 'productive'
                    ? 'bg-white/20 text-white'
                    : 'bg-green-600/20 text-green-400'
                }`}>
                  {promptsData.filter(p => p.category === 'produtivo').length}
                </span>
              </button>
              
              <button
                onClick={() => setActivePromptTab('unproductive')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all ${
                  activePromptTab === 'unproductive'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Improdutivos</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activePromptTab === 'unproductive'
                    ? 'bg-white/20 text-white'
                    : 'bg-red-600/20 text-red-400'
                }`}>
                  {promptsData.filter(p => p.category === 'improdutivo').length}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activePromptTab === 'productive' ? (
                // Prompts Produtivos
                promptsData.filter(p => p.category === 'produtivo').length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/80 text-lg">Nenhum prompt produtivo encontrado</p>
                    <p className="text-white/60 text-sm">Os prompts produtivos aparecerão aqui</p>
                  </div>
                ) : (
                  promptsData.filter(p => p.category === 'produtivo').map(prompt => 
                    renderPromptCard(prompt, 'produtivo')
                  )
                )
              ) : (
                // Prompts Improdutivos
                promptsData.filter(p => p.category === 'improdutivo').length === 0 ? (
                  <div className="text-center py-12">
                    <XCircle className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/80 text-lg">Nenhum prompt improdutivo encontrado</p>
                    <p className="text-white/60 text-sm">Os prompts improdutivos aparecerão aqui</p>
                  </div>
                ) : (
                  promptsData.filter(p => p.category === 'improdutivo').map(prompt => 
                    renderPromptCard(prompt, 'improdutivo')
                  )
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromptsSection;
