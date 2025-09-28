import React from 'react';
import { Brain, Zap, Target, BarChart3, Users, Settings, CheckCircle } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Brain className="h-6 w-6 text-white" />,
      title: "IA Avançada",
      description: "Classificação inteligente usando análise de contexto e padrões semânticos para identificar e-mails produtivos e improdutivos",
      benefits: [
        "Análise de contexto profunda",
        "Detecção de subcategorias específicas",
        "Classificação automática"
      ]
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Tempo Real",
      description: "Processamento instantâneo com respostas sugeridas personalizadas para cada tipo de e-mail",
      benefits: [
        "Classificação em segundos",
        "Respostas automáticas",
        "Interface intuitiva"
      ]
    },
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Precisão",
      description: "Algoritmo avançado com alta taxa de acerto na classificação",
      benefits: [
        "Classificação precisa por contexto",
        "Validação em tempo real",
        "Análise de padrões avançada"
      ]
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      title: "Analytics",
      description: "Histórico completo de classificações e métricas de performance",
      benefits: [
        "Histórico detalhado",
        "Métricas de uso",
        "Relatórios simples"
      ]
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Colaboração",
      description: "Interface simples e intuitiva para toda a equipe usar",
      benefits: [
        "Interface amigável",
        "Fácil de usar",
        "Sem treinamento necessário"
      ]
    },
    {
      icon: <Settings className="h-6 w-6 text-white" />,
      title: "Prompts Inteligentes",
      description: "Sistema de prompts adaptativos para respostas personalizadas",
      benefits: [
        "Templates por categoria de e-mail",
        "Prompts personalizáveis",
        "Respostas contextualizadas"
      ]
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Como a solução funciona
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Principais conceitos que tornam a classificação inteligente possível
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              </div>
              
              <p className="text-white/80 mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-2 text-white/70">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
