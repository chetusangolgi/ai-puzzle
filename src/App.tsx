import React, { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import InformationForm from './components/InformationForm';
import DocumentSelection from './components/DocumentSelection';
import StackBuilder from './components/StackBuilder';
import StackReady from './components/StackReady';
import FinalPage from './components/FinalPage';

export interface UserInfo {
  name: string;
  company: string;
  role: string;
  experience: string;
}

export interface SelectedDocument {
  id: string;
  title: string;
  description: string;
  icon: string;
}
function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    company: '',
    role: '',
    experience: ''
  });
  const [selectedDocument, setSelectedDocument] = useState<SelectedDocument | null>(null);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => {
      // Skip InformationForm (page 2) and set default user info
      if (prev === 1) {
        setUserInfo({
          name: 'Guest',
          company: 'N/A',
          role: 'Developer',
          experience: 'Intermediate (2-4 years)',
        });
        return 3; // Skip to DocumentSelection
      }
      return prev + 1;
    });
  }, []);

  const goHome = useCallback(() => {
    setCurrentPage(1);
    setSelectedDocument(null);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <StartScreen onNext={nextPage} />;
      case 2:
        return <InformationForm userInfo={userInfo} setUserInfo={setUserInfo} onNext={nextPage} />;
      case 3:
        return <DocumentSelection selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} onNext={nextPage} />;
      case 4:
        return <StackBuilder selectedDocument={selectedDocument} onNext={nextPage} />;
      case 5:
        return <StackReady onNext={nextPage} />;
      case 6:
        return <FinalPage userInfo={userInfo} selectedDocument={selectedDocument} onHome={goHome} />;
      default:
        return <StartScreen onNext={nextPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {renderPage()}
    </div>
  );
}

export default App;