import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { promptService } from '../services/promptService.js';

export const PromptManager = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState('productive'); // 'productive' ou 'unproductive'
  const [formData, setFormData] = useState({
    type: 'classification',
    category: 'produtivo',
    subcategory: 'general',
    content: '',
    description: '',
    version: 1
  });
  const [promptTypes, setPromptTypes] = useState({ types: [], categories: [], subcategories: [] });

  useEffect(() => {
    loadPrompts();
    loadPromptTypes();
  }, []);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showForm) {
        resetForm();
      }
    };

    if (showForm) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [showForm]);

  const loadPrompts = async () => {
    try {
      const data = await promptService.getPrompts();
      // Ordenar por ID para manter ordem consistente
      const sortedData = data.sort((a, b) => a.id - b.id);
      setPrompts(sortedData);
    } catch (error) {
      console.error('Erro ao carregar prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPromptTypes = async () => {
    try {
      const data = await promptService.getPromptTypes();
      setPromptTypes(data);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Atualizar prompt existente
        const updatedPrompt = await promptService.updatePrompt(editingId, formData);
        
        // Atualizar o prompt na lista mantendo a ordem original
        setPrompts(prevPrompts => 
          prevPrompts.map(p => 
            p.id === editingId ? updatedPrompt : p
          )
        );
      } else {
        // Criar novo prompt
        const newPrompt = await promptService.createPrompt(formData);
        setPrompts(prevPrompts => [...prevPrompts, newPrompt]);
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
    }
  };

  const handleEdit = (prompt) => {
    setFormData({
      type: prompt.type,
      category: prompt.category,
      subcategory: prompt.subcategory || 'general',
      content: prompt.content,
      description: prompt.description || '',
      version: prompt.version
    });
    setEditingId(prompt.id);
    setShowForm(true);
  };

  const handleDelete = async (promptId) => {
    if (window.confirm('Tem certeza que deseja remover este prompt?')) {
      try {
        await promptService.deletePrompt(promptId);
        await loadPrompts();
      } catch (error) {
        console.error('Erro ao remover prompt:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'classification',
      category: 'produtivo',
      subcategory: 'general',
      content: '',
      description: '',
      version: 1
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getTypeLabel = (type) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryLabel = (category) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };


  const getFilteredSubcategories = () => {
    const productiveSubcategories = ['meetings', 'projects', 'sales_business', 'customer_service', 'collaboration', 'training', 'reporting', 'financial', 'hr_recruitment', 'technology', 'strategy_planning', 'urgent_important'];
    const unproductiveSubcategories = ['spam', 'promotions', 'social_media', 'entertainment', 'personal', 'advertisements'];
    const generalSubcategories = ['general', 'other'];

    if (formData.category === 'produtivo') {
      return promptTypes.subcategories?.filter(sub => productiveSubcategories.includes(sub.value)) || [];
    } else if (formData.category === 'improdutivo') {
      return promptTypes.subcategories?.filter(sub => unproductiveSubcategories.includes(sub.value)) || [];
    } else {
      return promptTypes.subcategories?.filter(sub => generalSubcategories.includes(sub.value)) || [];
    }
  };

  const getFilteredPrompts = () => {
    if (activeSection === 'productive') {
      return prompts.filter(p => p.category === 'produtivo');
    } else if (activeSection === 'unproductive') {
      return prompts.filter(p => p.category === 'improdutivo');
    }
    return prompts;
  };

  const handleNewPrompt = (category) => {
    setFormData({
      type: 'classification',
      category: category === 'productive' ? 'produtivo' : 'improdutivo',
      subcategory: 'general',
      content: '',
      description: '',
      version: 1
    });
    setEditingId(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">Carregando prompts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Gerenciador de Prompts</h2>
        </div>
        
        {/* Navegação por seções */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveSection('productive')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSection === 'productive' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'text-white hover:bg-white/20 hover:text-white'
            }`}
          >
            <span className="font-medium">Prompts Produtivos</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeSection === 'productive' 
                ? 'bg-white/20' 
                : 'bg-green-600'
            }`}>
              {prompts.filter(p => p.category === 'produtivo').length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('unproductive')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSection === 'unproductive' 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'text-white hover:bg-white/20 hover:text-white'
            }`}
          >
            <span className="font-medium">Prompts Improdutivos</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeSection === 'unproductive' 
                ? 'bg-white/20' 
                : 'bg-red-600'
            }`}>
              {prompts.filter(p => p.category === 'improdutivo').length}
            </span>
          </button>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetForm();
            }
          }}
        >
          <div className="glass-effect rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {editingId ? 'Editar Prompt' : 'Novo Prompt'}
              </h3>
              <button
                onClick={resetForm}
                className="text-white/60 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ colorScheme: 'dark' }}
                >
                  {promptTypes.types?.map(type => (
                    <option key={type.value} value={type.value} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: 'general'})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!promptTypes.categories || promptTypes.categories.length === 0}
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Selecione uma categoria...</option>
                  {promptTypes.categories?.map(category => (
                    <option key={category.value} value={category.value} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Subcategoria</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.category || getFilteredSubcategories().length === 0}
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Selecione uma subcategoria...</option>
                  {getFilteredSubcategories().map(subcategory => (
                    <option key={subcategory.value} value={subcategory.value} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                      {subcategory.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Descrição</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição do prompt..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Conteúdo do Prompt</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Digite o conteúdo do prompt..."
                rows={6}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="h-5 w-5" />
                <span>{editingId ? 'Atualizar' : 'Criar'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* Lista de Prompts */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            Prompts {activeSection === 'productive' ? 'Produtivos' : 'Improdutivos'}
          </h3>
          <button
            onClick={() => handleNewPrompt(activeSection)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'productive' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            <Plus className="h-5 w-5" />
            <span>Novo Prompt {activeSection === 'productive' ? 'Produtivo' : 'Improdutivo'}</span>
          </button>
        </div>
        
        {getFilteredPrompts().length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/80">
              Nenhum prompt {activeSection === 'productive' ? 'produtivo' : 'improdutivo'} encontrado
            </p>
            <button
              onClick={() => handleNewPrompt(activeSection)}
              className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'productive' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              Criar primeiro prompt {activeSection === 'productive' ? 'produtivo' : 'improdutivo'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredPrompts().map((prompt) => (
              <div key={prompt.id} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2 flex-wrap">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {getTypeLabel(prompt.type)}
                      </span>
                      <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {getCategoryLabel(prompt.subcategory || 'general')}
                      </span>
                    </div>
                    
                    {prompt.description && (
                      <p className="text-white/80 text-sm mb-2">{prompt.description}</p>
                    )}
                    
                    <div className="bg-black/20 rounded p-3">
                      <p className="text-white text-sm whitespace-pre-wrap">{prompt.content}</p>
                    </div>
                    
                    <p className="text-white/60 text-xs mt-2">
                      Criado em: {new Date(prompt.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(prompt)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prompt.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
