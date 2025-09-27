import React from 'react';
import { FileText, Upload, Send, Loader2 } from 'lucide-react';
import { UploadType } from '../../types';

interface ClassificationSectionProps {
  uploadType: UploadType;
  setUploadType: (type: UploadType) => void;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailSender: string;
  setEmailSender: (sender: string) => void;
  emailContent: string;
  setEmailContent: (content: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  dragActive: boolean;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleFileSelect: (file: File | null) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

const ClassificationSection: React.FC<ClassificationSectionProps> = ({
  uploadType,
  setUploadType,
  emailSubject,
  setEmailSubject,
  emailSender,
  setEmailSender,
  emailContent,
  setEmailContent,
  selectedFile,
  setSelectedFile,
  dragActive,
  isLoading,
  handleSubmit,
  handleFileSelect,
  handleDrag,
  handleDrop
}) => {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-2xl font-bold text-white mb-4">
            Cole o conteúdo do e-mail ou faça upload de um arquivo para classificação instantânea
          </h3>
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
  );
};

export default ClassificationSection;
