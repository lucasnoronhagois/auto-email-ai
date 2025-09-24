import React, { useState } from 'react';
import { UploadSection } from './components/UploadSection.jsx';
import { ResultsSection } from './components/ResultsSection.jsx';
import { HistorySection } from './components/HistorySection.jsx';
import { Header } from './components/Header.jsx';
import { TabNavigation } from './components/TabNavigation.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [classificationResult, setClassificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClassificationComplete = (result) => {
    setClassificationResult(result);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <TabNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            hasResults={!!classificationResult}
          />
          
          <div className="mt-8">
            {activeTab === 'upload' && (
              <UploadSection 
                onClassificationComplete={handleClassificationComplete}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            
            {activeTab === 'results' && classificationResult && (
              <ResultsSection result={classificationResult} />
            )}
            
            {activeTab === 'history' && (
              <HistorySection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
