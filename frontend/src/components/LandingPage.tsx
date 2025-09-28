import React, { useState, useEffect } from 'react';
import { emailService, promptService } from '../services';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import MainLayout from './MainLayout';
import { 
  ClassificationResult, 
  HistoryItem, 
  PromptItem, 
  ActiveSection, 
  UploadType, 
  PromptTab 
} from '../types';

const LandingPage: React.FC = () => {
  // UI State
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('main');
  
  // Upload State
  const [uploadType, setUploadType] = useState<UploadType>('text');
  const [emailContent, setEmailContent] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailSender, setEmailSender] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingNewResponse, setIsGeneratingNewResponse] = useState<boolean>(false);
  
  // Data States
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [promptsData, setPromptsData] = useState<PromptItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [promptsLoading, setPromptsLoading] = useState<boolean>(false);
  
  // History State
  const [expandedHistoryItems, setExpandedHistoryItems] = useState<Set<number>>(new Set());
  const [historyItemHeights] = useState<Record<number, number>>({});
  
  // Prompts State
  const [editingPrompt, setEditingPrompt] = useState<number | null>(null);
  const [promptEditContent, setPromptEditContent] = useState<string>('');
  const [activePromptTab, setActivePromptTab] = useState<PromptTab>('productive');
  
  // Hook para gerenciar cópia com feedback visual
  const { copy: copyToClipboard, isCopied } = useCopyToClipboard();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // File handling
  const handleFileSelect = (file: File | null): void => {
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let content = '';
      
      if (uploadType === 'text') {
        content = emailContent;
      } else if (selectedFile) {
        const fileContent = await selectedFile.text();
        content = fileContent;
      }

      if (!content.trim()) {
        alert('Por favor, forneça o conteúdo do e-mail');
        return;
      }

      const result = await emailService.uploadTextEmail({
        content,
        subject: emailSubject,
        sender: emailSender,
        recipient: emailRecipient
      });

      setClassificationResult(result);
      
      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);

    } catch (error) {
      console.error('Erro ao processar e-mail:', error);
      alert('Erro ao processar o e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new response
  const generateNewResponse = async (): Promise<void> => {
    if (!classificationResult) return;
    
    setIsGeneratingNewResponse(true);
    try {
        const result = await emailService.uploadTextEmail({
        content: emailContent,
        subject: emailSubject,
        sender: emailSender,
        recipient: emailRecipient
      });
      
      if (result) {
        setClassificationResult(result);
      }
    } catch (error) {
      console.error('Erro ao gerar nova resposta:', error);
      alert('Erro ao gerar nova resposta. Tente novamente.');
    } finally {
      setIsGeneratingNewResponse(false);
    }
  };

  // Reset form
  const resetForm = (): void => {
    setClassificationResult(null);
    setEmailContent('');
    setEmailSubject('');
    setEmailSender('');
    setEmailRecipient('');
    setSelectedFile(null);
  };

  // Navigation handlers
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

  const onGoToHome = (): void => {
    setActiveSection('main');
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load history
  const loadHistory = async (): Promise<void> => {
    setHistoryLoading(true);
    try {
      const history = await emailService.getHistorico();
      setHistoryData(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load prompts
  const loadPrompts = async (): Promise<void> => {
    setPromptsLoading(true);
    try {
      const prompts = await promptService.getPrompts();
      setPromptsData(prompts);
    } catch (error) {
      console.error('Erro ao carregar prompts:', error);
    } finally {
      setPromptsLoading(false);
    }
  };

  // History item handlers
  const toggleHistoryItem = (id: number): void => {
    setExpandedHistoryItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleResizeStart = (_e: React.MouseEvent, id: number): void => {
    // Implementation for resize functionality
    console.log('Resize started for item:', id);
  };

  // Prompt handlers
  const startEditingPrompt = (id: number, content: string): void => {
    setEditingPrompt(id);
    setPromptEditContent(content);
  };

  const savePrompt = async (id: number): Promise<void> => {
    try {
      await promptService.updatePrompt(id, { content: promptEditContent });
      setEditingPrompt(null);
      setPromptEditContent('');
      loadPrompts(); // Reload prompts
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      alert('Erro ao salvar prompt. Tente novamente.');
    }
  };

  const cancelEditingPrompt = (): void => {
    setEditingPrompt(null);
    setPromptEditContent('');
  };

  return (
    <MainLayout
      // State
      isVisible={isVisible}
      activeSection={activeSection}
      uploadType={uploadType}
      emailSubject={emailSubject}
      emailSender={emailSender}
      emailContent={emailContent}
      selectedFile={selectedFile}
      dragActive={dragActive}
      isLoading={isLoading}
      isGeneratingNewResponse={isGeneratingNewResponse}
      classificationResult={classificationResult}
      historyData={historyData}
      promptsData={promptsData}
      historyLoading={historyLoading}
      promptsLoading={promptsLoading}
      expandedHistoryItems={expandedHistoryItems}
      editingPrompt={editingPrompt}
      promptEditContent={promptEditContent}
      activePromptTab={activePromptTab}
      historyItemHeights={historyItemHeights}
      
      // Handlers
      setUploadType={setUploadType}
      setEmailSubject={setEmailSubject}
      setEmailSender={setEmailSender}
      setEmailContent={setEmailContent}
      setSelectedFile={setSelectedFile}
      handleSubmit={handleSubmit}
      handleFileSelect={handleFileSelect}
      handleDrag={handleDrag}
      handleDrop={handleDrop}
      generateNewResponse={generateNewResponse}
      resetForm={resetForm}
      backToMain={backToMain}
      openHistorySection={openHistorySection}
      openPromptsSection={openPromptsSection}
      onGoToHome={onGoToHome}
      toggleHistoryItem={toggleHistoryItem}
      handleResizeStart={handleResizeStart}
      setActivePromptTab={setActivePromptTab}
      startEditingPrompt={startEditingPrompt}
      setPromptEditContent={setPromptEditContent}
      savePrompt={savePrompt}
      cancelEditingPrompt={cancelEditingPrompt}
      copyToClipboard={copyToClipboard}
      isCopied={isCopied}
    />
  );
};

export default LandingPage;
