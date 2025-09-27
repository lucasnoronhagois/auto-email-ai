import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain, 
  RefreshCw, 
  Copy, 
  Loader2 
} from 'lucide-react';

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

interface ClassificationResultsProps {
  classificationResult: ClassificationResult;
  isGeneratingNewResponse: boolean;
  isCopied: (text: string) => boolean;
  onGenerateNewResponse: () => void;
  onCopyToClipboard: (text: string) => void;
  onResetForm: () => void;
}

const ClassificationResults: React.FC<ClassificationResultsProps> = ({
  classificationResult,
  isGeneratingNewResponse,
  isCopied,
  onGenerateNewResponse,
  onCopyToClipboard,
  onResetForm
}) => {
  const { email, classification } = classificationResult;
  const isProductive = classification.category === 'Produtivo';
  const confidencePercentage = Math.round((classification.confidence_score || 0) * 100);
  const CategoryIcon = isProductive ? CheckCircle : XCircle;

  return (
    <section id="results-section" className="py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Resultado da Classificação</h2>
            <p className="text-white/80">Análise concluída com sucesso</p>
          </div>

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
                    onClick={onGenerateNewResponse}
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
                    onClick={() => onCopyToClipboard(classification.suggested_response)}
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
              onClick={onResetForm}
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Classificar outro e-mail</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassificationResults;
