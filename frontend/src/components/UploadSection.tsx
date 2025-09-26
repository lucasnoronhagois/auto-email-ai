import React, { useState } from 'react';
import { Upload, FileText, Send, Loader2 } from 'lucide-react';
import { emailService } from '../services';

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

interface UploadSectionProps {
  onClassificationComplete: (result: ClassificationResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  onClassificationComplete, 
  isLoading, 
  setIsLoading 
}) => {
  const [uploadType, setUploadType] = useState<'text' | 'file'>('text');
  const [emailContent, setEmailContent] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailSender, setEmailSender] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

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

      onClassificationComplete(result);
      
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

  return (
    <div className="glass-effect rounded-xl p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Classificar e-mail</h2>
        <p className="text-white/80">Faça upload de um arquivo ou cole o texto do email</p>
      </div>

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
            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};
