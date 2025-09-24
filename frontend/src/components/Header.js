import React from 'react';
import { Mail, Brain } from 'lucide-react';

export const Header = () => {
  return (
    <header className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2">
            <Mail className="h-8 w-8 text-white" />
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Auto</h1>
            <p className="text-white/80 text-sm">Classificação Inteligente de Emails</p>
          </div>
        </div>
      </div>
    </header>
  );
};
