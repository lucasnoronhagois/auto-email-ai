import React from 'react';
import { CheckCircle, XCircle, Clock, Brain, Copy, RefreshCw } from 'lucide-react';

export const ResultsSection = ({ result }) => {
  const { email, classification } = result;
  
  const isProductive = classification.category === 'Produtivo';
  const confidencePercentage = Math.round((classification.confidence_score || 0) * 100);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getCategoryColor = () => {
    return isProductive ? 'success' : 'danger';
  };

  const getCategoryIcon = () => {
    return isProductive ? CheckCircle : XCircle;
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Classification Result */}
      <div className="glass-effect rounded-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Resultado da Classificação</h2>
          <p className="text-white/80">Análise concluída com sucesso</p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className={`
            flex items-center space-x-3 px-6 py-4 rounded-lg
            ${isProductive 
              ? 'bg-success-500/20 border border-success-500/30' 
              : 'bg-danger-500/20 border border-danger-500/30'
            }
          `}>
            <CategoryIcon className={`h-8 w-8 ${isProductive ? 'text-success-400' : 'text-danger-400'}`} />
            <div className="text-center">
              <h3 className={`text-2xl font-bold ${isProductive ? 'text-success-400' : 'text-danger-400'}`}>
                {classification.category}
              </h3>
              <p className="text-white/80 text-sm">
                Confiança: {confidencePercentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Processing Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              confidencePercentage >= 80 ? 'bg-success-400' : 
              confidencePercentage >= 60 ? 'bg-yellow-400' : 'bg-danger-400'
            }`} />
            <p className="text-white/80 text-sm">Nível de Confiança</p>
            <p className="text-white font-medium">{confidencePercentage}%</p>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="glass-effect rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-4">Conteúdo do Email</h3>
        
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
        <div className="glass-effect rounded-xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Resposta Sugerida</h3>
            <button
              onClick={() => copyToClipboard(classification.suggested_response)}
              className="flex items-center space-x-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copiar</span>
            </button>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white whitespace-pre-wrap">{classification.suggested_response}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Classificar Outro Email</span>
        </button>
      </div>
    </div>
  );
};
