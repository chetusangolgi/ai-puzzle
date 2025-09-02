import React, { useState, useCallback, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import UserInfo from './components/UserInfo';
import DocumentSelection from './components/DocumentSelection';
import StackBuilder from './components/StackBuilder';
import Leaderboard from './components/Leaderboard';
import FinalPage from './components/FinalPage';
import { saveUserData, testConnection } from './lib/supabase';

export interface UserInfo {
  name: string;
  email: string;
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
    email: ''
  });
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [selectedDocument, setSelectedDocument] = useState<SelectedDocument | null>(null);

  // Test Supabase connection on app start
  useEffect(() => {
    testConnection();
  }, []);
  // Disable right-click context menu
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', disableRightClick);
    
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const handleUserInfoSubmit = useCallback((userData: UserInfo) => {
    setUserInfo(userData);
    setGameStartTime(Date.now());
    nextPage();
  }, [nextPage]);

  const handleStackBuilderComplete = useCallback(async () => {
    const completionTime = Date.now();
    const timeTaken = Math.round((completionTime - gameStartTime) / 1000); // seconds in timer format
    
    console.log('Stack builder completed!', { 
      timeTaken, 
      userInfo, 
      gameStartTime, 
      completionTime 
    });
    
    setGameScore(timeTaken);
    
    // Save to Supabase
    if (userInfo.name && userInfo.email) {
      console.log('Saving user data to Supabase...');
      const result = await saveUserData({
        name: userInfo.name,
        email: userInfo.email,
        score: timeTaken
      });
      console.log('Save result:', result);
    } else {
      console.warn('Missing user info:', userInfo);
    }
    
    nextPage();
  }, [userInfo, gameStartTime, nextPage]);

  const goHome = useCallback(() => {
    setCurrentPage(1);
    setSelectedDocument(null);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <StartScreen onNext={nextPage} />;
      case 2:
        return <UserInfo onNext={handleUserInfoSubmit} />;
      case 3:
        return <DocumentSelection selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} onNext={nextPage} />;
      case 4:
        return <StackBuilder selectedDocument={selectedDocument} onNext={handleStackBuilderComplete} />;
      case 5:
        return <Leaderboard onNext={nextPage} currentUser={{ name: userInfo.name, score: gameScore }} />;
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