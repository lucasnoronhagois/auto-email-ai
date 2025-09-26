import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { emailService } from '../services';

interface HistoricoItem {
  id: number;
  email_id: number;
  classification_id: number;
  email_subject: string;
  email_sender: string;
  email_content: string;
  classification_category: string;
  classification_confidence: number;
  classification_suggested_response: string;
  created_at: string;
}

export const HistorySection: React.FC = () => {
  const [emails, setEmails] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmail, setSelectedEmail] = useState<HistoricoItem | null>(null);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async (): Promise<void> => {
    try {
      const data = await emailService.getHistorico();
      setEmails(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getCategoryIcon = (category: string): React.ComponentType<{ className?: string }> => {
    return category === 'Produtivo' ? CheckCircle : XCircle;
  };

  const getCategoryColor = (category: string): string => {
    return category === 'Produtivo' ? 'text-green-400' : 'text-red-400';
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
            <p className="text-white/80 text-lg">Nenhum e-mail classificado ainda</p>
            <p className="text-white/60 text-sm">Faça upload de um e-mail para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((item) => {
              const CategoryIcon = getCategoryIcon(item.classification_category);
              const categoryColor = getCategoryColor(item.classification_category);
              
              return (
                <div
                  key={item.id}
                  className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmail(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CategoryIcon className={`h-6 w-6 ${categoryColor}`} />
                      <div>
                        <h3 className="text-white font-medium">
                          {item.email_subject || 'Sem assunto'}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {item.email_sender || 'Remetente não informado'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">
                        {item.classification_category}
                      </p>
                      <p className="text-white/60 text-xs">
                        {formatDate(item.created_at)}
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
              {selectedEmail.email_subject && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Assunto:</label>
                  <p className="text-white bg-white/10 rounded-lg p-3">{selectedEmail.email_subject}</p>
                </div>
              )}

              {selectedEmail.email_sender && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Remetente:</label>
                  <p className="text-white bg-white/10 rounded-lg p-3">{selectedEmail.email_sender}</p>
                </div>
              )}

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Conteúdo:</label>
                <div className="bg-white/10 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <p className="text-white whitespace-pre-wrap">{selectedEmail.email_content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Classificação:</label>
                  <div className="flex items-center space-x-2">
                    {React.createElement(getCategoryIcon(selectedEmail.classification_category), {
                      className: `h-5 w-5 ${getCategoryColor(selectedEmail.classification_category)}`
                    })}
                    <span className={`font-medium ${getCategoryColor(selectedEmail.classification_category)}`}>
                      {selectedEmail.classification_category}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Confiança:</label>
                  <p className="text-white">
                    {Math.round((selectedEmail.classification_confidence || 0) * 100)}%
                  </p>
                </div>
              </div>

              {selectedEmail.classification_suggested_response && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Resposta Sugerida:</label>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">
                      {selectedEmail.classification_suggested_response}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 text-white/60 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Processado em {formatDate(selectedEmail.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
