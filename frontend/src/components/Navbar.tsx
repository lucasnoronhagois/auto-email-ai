import React from 'react';
import { Brain, History, Settings, X } from 'lucide-react';

interface NavbarProps {
  activeSection: 'main' | 'history' | 'prompts';
  onBackToMain: () => void;
  onOpenHistory: () => void;
  onOpenPrompts: () => void;
  onGoToHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onBackToMain,
  onOpenHistory,
  onOpenPrompts,
  onGoToHome
}) => {
  return (
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onGoToHome}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Mail</h1>
              <p className="text-white/60 text-xs">Classificação Inteligente</p>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {activeSection !== 'main' && (
              <button
                onClick={onBackToMain}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Voltar</span>
              </button>
            )}
            <button
              onClick={onOpenHistory}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                activeSection === 'history' 
                  ? 'bg-green-600/20 border border-green-500/30 text-green-400' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Histórico</span>
            </button>
            <button
              onClick={onOpenPrompts}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                activeSection === 'prompts' 
                  ? 'bg-orange-600/20 border border-orange-500/30 text-orange-400' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Prompts</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
