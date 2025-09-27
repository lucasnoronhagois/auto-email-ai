import React from 'react';
import Navbar from './Navbar';
import ScrollToTopButton from './ScrollToTopButton';
import {
  HeroSection,
  ClassificationSection,
  ClassificationResults,
  FeaturesSection,
  HistorySection,
  PromptsSection
} from './sections';
import { 
  ClassificationResult, 
  HistoryItem, 
  PromptItem, 
  ActiveSection, 
  UploadType, 
  PromptTab 
} from '../types';

interface MainLayoutProps {
  // State
  isVisible: boolean;
  activeSection: ActiveSection;
  uploadType: UploadType;
  emailSubject: string;
  emailSender: string;
  emailContent: string;
  selectedFile: File | null;
  dragActive: boolean;
  isLoading: boolean;
  isGeneratingNewResponse: boolean;
  classificationResult: ClassificationResult | null;
  historyData: HistoryItem[];
  promptsData: PromptItem[];
  historyLoading: boolean;
  promptsLoading: boolean;
  expandedHistoryItems: Set<number>;
  editingPrompt: number | null;
  promptEditContent: string;
  activePromptTab: PromptTab;
  historyItemHeights: Record<number, number>;
  
  // Handlers
  setUploadType: (type: UploadType) => void;
  setEmailSubject: (subject: string) => void;
  setEmailSender: (sender: string) => void;
  setEmailContent: (content: string) => void;
  setSelectedFile: (file: File | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleFileSelect: (file: File | null) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  generateNewResponse: () => void;
  resetForm: () => void;
  backToMain: () => void;
  openHistorySection: () => void;
  openPromptsSection: () => void;
  onGoToHome: () => void;
  toggleHistoryItem: (id: number) => void;
  handleResizeStart: (e: React.MouseEvent, id: number) => void;
  setActivePromptTab: (tab: PromptTab) => void;
  startEditingPrompt: (id: number, content: string) => void;
  setPromptEditContent: (content: string) => void;
  savePrompt: (id: number) => void;
  cancelEditingPrompt: () => void;
  copyToClipboard: (text: string) => void;
  isCopied: (text: string) => boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  isVisible,
  activeSection,
  uploadType,
  emailSubject,
  emailSender,
  emailContent,
  selectedFile,
  dragActive,
  isLoading,
  isGeneratingNewResponse,
  classificationResult,
  historyData,
  promptsData,
  historyLoading,
  promptsLoading,
  expandedHistoryItems,
  editingPrompt,
  promptEditContent,
  activePromptTab,
  historyItemHeights,
  setUploadType,
  setEmailSubject,
  setEmailSender,
  setEmailContent,
  setSelectedFile,
  handleSubmit,
  handleFileSelect,
  handleDrag,
  handleDrop,
  generateNewResponse,
  resetForm,
  backToMain,
  openHistorySection,
  openPromptsSection,
  onGoToHome,
  toggleHistoryItem,
  handleResizeStart,
  setActivePromptTab,
  startEditingPrompt,
  setPromptEditContent,
  savePrompt,
  cancelEditingPrompt,
  copyToClipboard,
  isCopied
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navbar */}
      <Navbar
        activeSection={activeSection}
        onBackToMain={backToMain}
        onOpenHistory={openHistorySection}
        onOpenPrompts={openPromptsSection}
        onGoToHome={onGoToHome}
      />

      {/* Main Content */}
      {activeSection === 'main' && (
        <>
          {/* Hero Section */}
          <HeroSection isVisible={isVisible} />

          {/* Classification Section */}
          <ClassificationSection
            uploadType={uploadType}
            setUploadType={setUploadType}
            emailSubject={emailSubject}
            setEmailSubject={setEmailSubject}
            emailSender={emailSender}
            setEmailSender={setEmailSender}
            emailContent={emailContent}
            setEmailContent={setEmailContent}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            dragActive={dragActive}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handleFileSelect={handleFileSelect}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
          />

          {/* Results Section */}
          {classificationResult && (
            <ClassificationResults
              classificationResult={classificationResult}
              isGeneratingNewResponse={isGeneratingNewResponse}
              isCopied={isCopied}
              onGenerateNewResponse={generateNewResponse}
              onCopyToClipboard={copyToClipboard}
              onResetForm={resetForm}
            />
          )}

          {/* Features Section */}
          <FeaturesSection />
        </>
      )}

      {/* History Section */}
      {activeSection === 'history' && (
        <HistorySection
          historyLoading={historyLoading}
          historyData={historyData}
          expandedHistoryItems={expandedHistoryItems}
          historyItemHeights={historyItemHeights}
          toggleHistoryItem={toggleHistoryItem}
          handleResizeStart={handleResizeStart}
        />
      )}

      {/* Prompts Section */}
      {activeSection === 'prompts' && (
        <PromptsSection
          promptsLoading={promptsLoading}
          promptsData={promptsData}
          activePromptTab={activePromptTab}
          setActivePromptTab={setActivePromptTab}
          editingPrompt={editingPrompt}
          promptEditContent={promptEditContent}
          setPromptEditContent={setPromptEditContent}
          startEditingPrompt={startEditingPrompt}
          savePrompt={savePrompt}
          cancelEditingPrompt={cancelEditingPrompt}
        />
      )}

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;
