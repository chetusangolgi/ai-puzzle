import React from 'react';
import { UserInfo } from '../App';

interface InformationFormProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  onNext: () => void;
}

const InformationForm: React.FC<InformationFormProps> = ({ setUserInfo, onNext }) => {
  const handleContinue = () => {
    // Set default user info since the form is removed
    setUserInfo({
      name: 'Guest',
      company: 'N/A',
      role: 'Developer',
      experience: 'Intermediate (2-4 years)',
    });
    onNext();
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/s02.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
    </div>
  );
};

export default InformationForm;