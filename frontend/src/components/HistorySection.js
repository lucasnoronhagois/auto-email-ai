import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, Clock, Eye } from 'lucide-react';
import { emailService } from '../services/emailService';

export const HistorySection = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      const data = await emailService.getEmails();
      setEmails(data);
    } catch (error) {
      console.error('Erro ao carregar emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getCategoryIcon = (category) => {
    return category === 'Produtivo' ? CheckCircle : XCircle;
  };

  const getCategoryColor = (category) => {
    return category === 'Produtivo' ? 'text-success-400' : 'text-danger-400';
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Histórico de Classificações</h2>
        
        {emails.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 text-lg">Nenhum email classificado ainda</p>
            <p className="text-white/60 text-sm">Faça upload de um email para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => {
              const CategoryIcon = getCategoryIcon(email.classification?.category);
              const categoryColor = getCategoryColor(email.classification?.category);
              
              return (
                <div
                  key={email.id}
                  className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CategoryIcon className={`h-6 w-6 ${categoryColor}`} />
                      <div>
                        <h3 className="text-white font-medium">
                          {email.subject || 'Sem assunto'}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {email.sender || 'Remetente não informado'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">
                        {email.classification?.category}
                      </p>
                      <p className="text-white/60 text-xs">
                        {formatDate(email.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Detalhes do Email</h3>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {selectedEmail.subject && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Assunto:</label>
                  <p className="text-white bg-white/10 rounded-lg p-3">{selectedEmail.subject}</p>
                </div>
              )}

              {selectedEmail.sender && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Remetente:</label>
                  <p className="text-white bg-white/10 rounded-lg p-3">{selectedEmail.sender}</p>
                </div>
              )}

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Conteúdo:</label>
                <div className="bg-white/10 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <p className="text-white whitespace-pre-wrap">{selectedEmail.content}</p>
                </div>
              </div>

              {selectedEmail.classification && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-1">Classificação:</label>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getCategoryIcon(selectedEmail.classification.category), {
                        className: `h-5 w-5 ${getCategoryColor(selectedEmail.classification.category)}`
                      })}
                      <span className={`font-medium ${getCategoryColor(selectedEmail.classification.category)}`}>
                        {selectedEmail.classification.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-1">Confiança:</label>
                    <p className="text-white">
                      {Math.round((selectedEmail.classification.confidence_score || 0) * 100)}%
                    </p>
                  </div>
                </div>
              )}

              {selectedEmail.classification?.suggested_response && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Resposta Sugerida:</label>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">
                      {selectedEmail.classification.suggested_response}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 text-white/60 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Processado em {formatDate(selectedEmail.created_at)}</span>
                </div>
                {selectedEmail.classification?.processing_time && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedEmail.classification.processing_time.toFixed(2)}s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
