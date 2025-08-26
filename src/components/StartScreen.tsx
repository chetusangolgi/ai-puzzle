import React, { useState } from 'react';
import { Rocket, Code, Layers } from 'lucide-react';

interface StartScreenProps {
  onNext: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
      onNext();
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 "></div>
      <div className="max-w-2xl text-center space-y-8 animate-fade-in relative z-10">
        
        
        <button
          onClick={handleClick}
          className={`inline-flex items-center px-24 py-5 bg-[#1D2C3B] absolute top-28 right-[24rem] text-white text-3xl shadow-lg transform transition-all duration-300 mt-16 ${
            isClicked 
              ? 'scale-105 shadow-xl ring-4 ring-white ring-opacity-50' 
              : 'hover:scale-105 hover:shadow-xl'
          }`}
          disabled={isClicked}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default StartScreen;