import React from 'react';
import { CheckCircle, XCircle, History, ChevronDown, ChevronUp } from 'lucide-react';
import { HistoryItem } from '../../types';

interface HistorySectionProps {
  historyLoading: boolean;
  historyData: HistoryItem[];
  expandedHistoryItems: Set<number>;
  historyItemHeights: Record<number, number>;
  toggleHistoryItem: (id: number) => void;
  handleResizeStart: (e: React.MouseEvent, id: number) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  historyLoading,
  historyData,
  expandedHistoryItems,
  historyItemHeights,
  toggleHistoryItem,
  handleResizeStart
}) => {
  return (
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
                          <div 
                            className="bg-white/10 rounded-lg p-4 overflow-y-auto relative"
                            style={{ height: `${historyItemHeights[item.id] || 160}px` }}
                          >
                            <p className="text-white text-sm whitespace-pre-wrap">{item.email_content}</p>
                            
                            {/* Handle de redimensionamento */}
                            <div 
                              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-500/30 transition-colors flex items-center justify-center"
                              onMouseDown={(e) => handleResizeStart(e, item.id)}
                            >
                              <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                            </div>
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
  );
};

export default HistorySection;