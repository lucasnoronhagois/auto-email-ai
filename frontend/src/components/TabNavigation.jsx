import React from 'react';
import { Upload, BarChart3, History, Settings } from 'lucide-react';

export const TabNavigation = ({ activeTab, setActiveTab, hasResults }) => {
  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'results', label: 'Resultados', icon: BarChart3, disabled: !hasResults },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'prompts', label: 'Prompts', icon: Settings }
  ];

  return (
    <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled;
        
        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && setActiveTab(tab.id)}
            disabled={isDisabled}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
              ${isActive 
                ? 'bg-white text-gray-900 shadow-lg' 
                : isDisabled 
                  ? 'text-white/40 cursor-not-allowed' 
                  : 'text-white hover:bg-white/20 hover:text-white'
              }
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
