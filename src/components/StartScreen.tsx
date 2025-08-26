import React from 'react';
import { Rocket, Code, Layers } from 'lucide-react';

interface StartScreenProps {
  onNext: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
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
          onClick={onNext}
          className="inline-flex items-center px-24 py-5 bg-[#1D2C3B] absolute top-28 right-[24rem] text-white text-3xl  shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300  mt-16"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default StartScreen;