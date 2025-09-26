import React from 'react';
import { Mail, Brain, Home } from 'lucide-react';

interface HeaderProps {
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-white" />
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">AutoU</h1>
              <p className="text-white/80 text-sm">Classificação Inteligente de e-mails</p>
            </div>
          </div>

          {/* Home Button */}
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors duration-300"
            >
              <Home className="h-5 w-5" />
              <span>Início</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
