import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  CheckCircle,
  Zap,
  Target,
  BarChart3,
  Users,
  Upload,
  FileText,
  Send,
  Loader2,
  Copy,
  RefreshCw,
  XCircle,
  Clock,
  History,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save
} from 'lucide-react';
import { emailService, promptService } from '../services';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface ClassificationResult {
  email: {
    id: number;
    subject: string;
    content: string;
    sender: string;
    recipient: string;
    file_name: string;
    file_type: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  };
  classification: {
    id: number;
    email_id: number;
    category: string;
    subcategory: string;
    confidence_score: number;
    suggested_response: string;
    processing_time: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  };
}

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [uploadType, setUploadType] = useState<'text' | 'file'>('text');
  const [emailContent, setEmailContent] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailSender, setEmailSender] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingNewResponse, setIsGeneratingNewResponse] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [activeSection, setActiveSection] = useState<'main' | 'history' | 'prompts'>('main');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [promptsData, setPromptsData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [promptsLoading, setPromptsLoading] = useState<boolean>(false);
  const [expandedHistoryItems, setExpandedHistoryItems] = useState<Set<number>>(new Set());
  const [editingPrompt, setEditingPrompt] = useState<number | null>(null);
  const [promptEditContent, setPromptEditContent] = useState<string>('');
  const [activePromptTab, setActivePromptTab] = useState<'productive' | 'unproductive'>('productive');
  
  // Hook para gerenciar cópia com feedback visual
  const { copy: copyToClipboard, isCopied } = useCopyToClipboard();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileSelect = (file: File | null): void => {
    if (file && (file.type === 'text/plain' || file.type === 'application/pdf')) {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecione um arquivo .txt ou .pdf');
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result: ClassificationResult;
      
      if (uploadType === 'text') {
        if (!emailContent.trim()) {
          alert('Por favor, insira o conteúdo do e-mail');
          setIsLoading(false);
          return;
        }
        
        result = await emailService.uploadTextEmail({
          content: emailContent,
          subject: emailSubject,
          sender: emailSender,
          recipient: emailRecipient
        });
      } else {
        if (!selectedFile) {
          alert('Por favor, selecione um arquivo');
          setIsLoading(false);
          return;
        }
        
        result = await emailService.uploadFileEmail(selectedFile, {
          subject: emailSubject,
          sender: emailSender,
          recipient: emailRecipient
        });
      }

      setClassificationResult(result);
      
      // Scroll automático para os resultados após um pequeno delay
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
      
      // Reset form
      setEmailContent('');
      setEmailSubject('');
      setEmailSender('');
      setEmailRecipient('');
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Erro ao processar e-mail:', error);
      alert('Erro ao processar o e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };


  const generateNewResponse = async (): Promise<void> => {
    if (!classificationResult) return;
    
    setIsGeneratingNewResponse(true);
    
    try {
      // Fazer uma nova chamada para gerar resposta
      const result = await emailService.uploadTextEmail({
        content: classificationResult.email.content,
        subject: classificationResult.email.subject || '',
        sender: classificationResult.email.sender || '',
        recipient: classificationResult.email.recipient || ''
      });
      
      // Atualizar apenas a resposta sugerida
      setClassificationResult(prev => prev ? {
        ...prev,
        classification: {
          ...prev.classification,
          suggested_response: result.classification.suggested_response
        }
      } : null);
      
    } catch (error) {
      console.error('Erro ao gerar nova resposta:', error);
      alert('Erro ao gerar nova resposta. Tente novamente.');
    } finally {
      setIsGeneratingNewResponse(false);
    }
  };

  const loadHistory = async (): Promise<void> => {
    setHistoryLoading(true);
    try {
      const data = await emailService.getHistorico();
      setHistoryData(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadPrompts = async (): Promise<void> => {
    setPromptsLoading(true);
    try {
      console.log('🔄 Carregando prompts...');
      const data = await promptService.getPrompts();
      console.log('📊 Dados recebidos:', data);
      console.log('📊 Tipo dos dados:', typeof data);
      console.log('📊 É array?', Array.isArray(data));
      console.log('📊 Tamanho:', data?.length);
      setPromptsData(data);
      console.log('✅ Prompts carregados no estado');
    } catch (error) {
      console.error('❌ Erro ao carregar prompts:', error);
    } finally {
      setPromptsLoading(false);
    }
  };

  const openHistorySection = (): void => {
    setActiveSection('history');
    loadHistory();
  };

  const openPromptsSection = (): void => {
    setActiveSection('prompts');
    loadPrompts();
  };

  const backToMain = (): void => {
    setActiveSection('main');
  };

  const toggleHistoryItem = (itemId: number): void => {
    const newExpanded = new Set(expandedHistoryItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedHistoryItems(newExpanded);
  };

  const startEditingPrompt = (promptId: number, currentContent: string): void => {
    setEditingPrompt(promptId);
    setPromptEditContent(currentContent);
  };

  const cancelEditingPrompt = (): void => {
    setEditingPrompt(null);
    setPromptEditContent('');
  };

  const savePrompt = async (promptId: number): Promise<void> => {
    try {
      await promptService.updatePrompt(promptId, {
        content: promptEditContent
      });
      setEditingPrompt(null);
      setPromptEditContent('');
      // Recarregar prompts após edição
      loadPrompts();
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
    }
  };


  const resetForm = (): void => {
    setClassificationResult(null);
    setEmailContent('');
    setEmailSubject('');
    setEmailSender('');
    setEmailRecipient('');
    setSelectedFile(null);
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-white" />,
      title: "IA Avançada",
      description: "Classificação inteligente usando análise de contexto e padrões semânticos para identificar e-mails produtivos e improdutivos",
      benefits: [
        "Análise de contexto profunda",
        "Detecção de subcategorias específicas",
        "Classificação automática"
      ]
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Tempo Real",
      description: "Processamento instantâneo com respostas sugeridas personalizadas para cada tipo de e-mail",
      benefits: [
        "Classificação em segundos",
        "Respostas automáticas",
        "Interface intuitiva"
      ]
    },
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Precisão",
      description: "Algoritmo avançado com alta taxa de acerto na classificação",
      benefits: [
        "Classificação precisa por contexto",
        "Validação em tempo real",
        "Análise de padrões avançada"
      ]
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      title: "Analytics",
      description: "Histórico completo de classificações e métricas de performance",
      benefits: [
        "Histórico detalhado",
        "Métricas de uso",
        "Relatórios simples"
      ]
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Colaboração",
      description: "Interface simples e intuitiva para toda a equipe usar",
      benefits: [
        "Interface amigável",
        "Fácil de usar",
        "Sem treinamento necessário"
      ]
    },
    {
      icon: <Settings className="h-6 w-6 text-white" />,
      title: "Prompts Inteligentes",
      description: "Sistema de prompts adaptativos para respostas personalizadas",
      benefits: [
        "Templates por categoria de e-mail",
        "Prompts personalizáveis",
        "Respostas contextualizadas"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navbar */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AutoU</h1>
                <p className="text-white/60 text-xs">Classificação Inteligente</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {activeSection !== 'main' && (
                <button
                  onClick={backToMain}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Voltar</span>
                </button>
              )}
              <button
                onClick={openHistorySection}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                  activeSection === 'history' 
                    ? 'bg-green-600/20 border border-green-500/30 text-green-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <History className="h-4 w-4" />
                <span>Histórico</span>
              </button>
              <button
                onClick={openPromptsSection}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                  activeSection === 'prompts' 
                    ? 'bg-orange-600/20 border border-orange-500/30 text-orange-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Prompts</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {activeSection === 'main' && (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Classificação Inteligente
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                de e-mails
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Sistema de classificação automática de e-mails com IA que identifica e-mails produtivos e improdutivos, 
              gerando respostas sugeridas personalizadas
            </p>
          </div>
        </div>
      </section>

      {/* Classification Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Teste Agora
            </h2>
            <p className="text-gray-300 text-lg">
              Cole o conteúdo do e-mail ou faça upload de um arquivo para classificação instantânea
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-8 border border-white/10">
            {/* Upload Type Selection */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 rounded-lg p-1 flex">
                <button
                  onClick={() => setUploadType('text')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    uploadType === 'text' 
                      ? 'bg-white text-gray-900' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Texto Direto
                </button>
                <button
                  onClick={() => setUploadType('file')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    uploadType === 'file' 
                      ? 'bg-white text-gray-900' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload de Arquivo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Assunto (opcional)
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Assunto do e-mail"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Remetente (opcional)
                  </label>
                  <input
                    type="text"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              {/* Content Upload */}
              {uploadType === 'text' ? (
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Conteúdo do e-mail *
                  </label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    placeholder="Cole aqui o conteúdo do e-mail que deseja classificar..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Arquivo (.txt ou .pdf) *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-white bg-white/20' 
                        : 'border-white/30 hover:border-white/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {selectedFile ? (
                      <div className="text-white">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-white/60" />
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-white/60">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="mt-2 text-sm text-white/60 hover:text-white underline"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    ) : (
                      <div className="text-white">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-white/60" />
                        <p className="mb-2">Arraste e solte seu arquivo aqui</p>
                        <p className="text-sm text-white/60 mb-4">ou</p>
                        <input
                          type="file"
                          accept=".txt,.pdf"
                          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer transition-colors"
                        >
                          Selecionar Arquivo
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Classificar e-mail
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {classificationResult && (
        <section id="results-section" className="py-16 animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-effect rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Resultado da Classificação</h2>
                <p className="text-white/80">Análise concluída com sucesso</p>
              </div>

              {(() => {
                const { email, classification } = classificationResult;
                const isProductive = classification.category === 'Produtivo';
                const confidencePercentage = Math.round((classification.confidence_score || 0) * 100);
                const CategoryIcon = isProductive ? CheckCircle : XCircle;

                return (
                  <>
                    {/* Classification Result */}
                    <div className="flex items-center justify-center mb-8">
                      <div className={`
                        flex items-center space-x-3 px-6 py-4 rounded-lg
                        ${isProductive 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : 'bg-red-500/20 border border-red-500/30'
                        }
                      `}>
                        <CategoryIcon className={`h-8 w-8 ${isProductive ? 'text-green-400' : 'text-red-400'}`} />
                        <div className="text-center">
                          <h3 className={`text-2xl font-bold ${isProductive ? 'text-green-400' : 'text-red-400'}`}>
                            {classification.category}
                          </h3>
                          <p className="text-white/80 text-sm">
                            Confiança: {confidencePercentage}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Processing Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <Clock className="h-6 w-6 text-white/60 mx-auto mb-2" />
                        <p className="text-white/80 text-sm">Tempo de Processamento</p>
                        <p className="text-white font-medium">
                          {classification.processing_time ? `${classification.processing_time.toFixed(2)}s` : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <Brain className="h-6 w-6 text-white/60 mx-auto mb-2" />
                        <p className="text-white/80 text-sm">Método de Análise</p>
                        <p className="text-white font-medium">IA + NLP</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className={`h-6 w-6 mx-auto mb-2 rounded-full ${
                          confidencePercentage >= 80 ? 'bg-green-400' : 
                          confidencePercentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <p className="text-white/80 text-sm">Nível de Confiança</p>
                        <p className="text-white font-medium">{confidencePercentage}%</p>
                      </div>
                    </div>

                    {/* Email Content */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4">Conteúdo do e-mail</h3>
                      
                      {email.subject && (
                        <div className="mb-4">
                          <label className="block text-white/80 text-sm font-medium mb-1">Assunto:</label>
                          <p className="text-white bg-white/10 rounded-lg p-3">{email.subject}</p>
                        </div>
                      )}

                      {email.sender && (
                        <div className="mb-4">
                          <label className="block text-white/80 text-sm font-medium mb-1">Remetente:</label>
                          <p className="text-white bg-white/10 rounded-lg p-3">{email.sender}</p>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="block text-white/80 text-sm font-medium mb-1">Conteúdo:</label>
                        <div className="bg-white/10 rounded-lg p-4 max-h-64 overflow-y-auto">
                          <p className="text-white whitespace-pre-wrap">{email.content}</p>
                        </div>
                      </div>
                    </div>

                    {/* Suggested Response */}
                    {classification.suggested_response && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">Resposta Sugerida</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={generateNewResponse}
                              disabled={isGeneratingNewResponse}
                              className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isGeneratingNewResponse ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Gerando...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="h-4 w-4" />
                                  <span>Nova Sugestão</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(classification.suggested_response)}
                              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                                isCopied(classification.suggested_response)
                                  ? 'bg-green-600 text-white scale-105'
                                  : 'bg-white/20 hover:bg-white/30 text-white'
                              }`}
                            >
                              {isCopied(classification.suggested_response) ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-white/10 rounded-lg p-4">
                          <p className="text-white whitespace-pre-wrap">{classification.suggested_response}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={resetForm}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                      >
                        <RefreshCw className="h-5 w-5" />
                        <span>Classificar outro e-mail</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recursos Principais
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Tecnologia avançada para classificação inteligente e automação de processos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        </>
      )}

      {/* History Section */}
      {activeSection === 'history' && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Histórico de Classificações</h2>
              <p className="text-gray-300 text-lg">Todos os e-mails classificados pelo sistema</p>
            </div>

            {historyLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/80">Carregando histórico...</p>
              </div>
            ) : historyData.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/80 text-lg">Nenhum e-mail classificado ainda</p>
                <p className="text-white/60 text-sm">Faça upload de um e-mail para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyData.map((item) => {
                  const CategoryIcon = item.classification_category === 'Produtivo' ? CheckCircle : XCircle;
                  const categoryColor = item.classification_category === 'Produtivo' ? 'text-green-400' : 'text-red-400';
                  const isExpanded = expandedHistoryItems.has(item.id);
                  
                  return (
                    <div key={item.id} className="glass-effect rounded-xl border border-white/10 overflow-hidden">
                      {/* Header clicável */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => toggleHistoryItem(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <CategoryIcon className={`h-5 w-5 ${categoryColor}`} />
                            <div className="flex-1">
                              <h3 className="text-white font-medium text-base">
                                {item.email_subject || 'Sem assunto'}
                              </h3>
                              <p className="text-white/60 text-sm">
                                {item.email_sender || 'Remetente não informado'} • {new Date(item.created_at).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.classification_category === 'Produtivo' 
                                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-600/20 text-red-400 border border-red-500/30'
                            }`}>
                              {item.classification_category}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-white/60" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-white/60" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Conteúdo expandível */}
                      {isExpanded && (
                        <div className="border-t border-white/10 p-4 space-y-4">
                          {item.email_content && (
                            <div>
                              <h4 className="text-white/80 text-sm font-medium mb-2">Conteúdo do e-mail:</h4>
                              <div className="bg-white/10 rounded-lg p-4 max-h-40 overflow-y-auto">
                                <p className="text-white text-sm whitespace-pre-wrap">{item.email_content}</p>
                              </div>
                            </div>
                          )}
                          
                          {item.classification_suggested_response && (
                            <div>
                              <h4 className="text-white/80 text-sm font-medium mb-2">Resposta Sugerida:</h4>
                              <div className="bg-white/10 rounded-lg p-4">
                                <p className="text-white text-sm whitespace-pre-wrap">{item.classification_suggested_response}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Prompts Section */}
      {activeSection === 'prompts' && (
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
                      {(() => {
                        const count = promptsData.filter(p => p.category === 'produtivo').length;
                        console.log('🔢 Contador produtivos:', count, 'de', promptsData.length, 'total');
                        console.log('🔢 Categorias encontradas:', [...new Set(promptsData.map(p => p.category))]);
                        return count;
                      })()}
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
                      {(() => {
                        const count = promptsData.filter(p => p.category === 'improdutivo').length;
                        console.log('🔢 Contador improdutivos:', count, 'de', promptsData.length, 'total');
                        return count;
                      })()}
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
                      promptsData.filter(p => p.category === 'produtivo').map((prompt) => {
                        const isEditing = editingPrompt === prompt.id;
                        
                        return (
                          <div key={prompt.id} className="glass-effect rounded-xl p-6 border border-green-500/20">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                      {prompt.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </span>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                      {prompt.category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </span>
                                    {prompt.subcategory && (
                                      <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                        {prompt.subcategory.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {!isEditing && (
                                    <button
                                      onClick={() => startEditingPrompt(prompt.id, prompt.content)}
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
                      })
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
                      promptsData.filter(p => p.category === 'improdutivo').map((prompt) => {
                        const isEditing = editingPrompt === prompt.id;
                        
                        return (
                          <div key={prompt.id} className="glass-effect rounded-xl p-6 border border-red-500/20">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                      {prompt.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </span>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                      {prompt.category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </span>
                                    {prompt.subcategory && (
                                      <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                        {prompt.subcategory.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {!isEditing && (
                                    <button
                                      onClick={() => startEditingPrompt(prompt.id, prompt.content)}
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
                      })
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}


      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">AutoU</h3>
            <p className="text-gray-400 mb-4">
              Classificação Inteligente de E-mails
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 AutoU. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;