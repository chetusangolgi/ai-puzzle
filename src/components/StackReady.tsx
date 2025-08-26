import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface StackReadyProps {
  onNext: () => void;
}

const StackReady: React.FC<StackReadyProps> = ({ onNext }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // When countdown reaches 0, navigate to the next page.
    if (countdown === 0) {
      onNext();
      return; // Stop the timer.
    }

    // Set a timeout that will decrease the countdown by 1 after one second.
    const timerId = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    // This cleanup function will clear the timeout if the component unmounts.
    return () => clearTimeout(timerId);

  }, [countdown, onNext]); // The effect re-runs whenever 'countdown' or 'onNext' changes.

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl space-y-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <CheckCircle className="w-32 h-32 text-green-400 mx-auto opacity-75" />
          </div>
          <CheckCircle className="w-32 h-32 text-green-600 mx-auto relative z-10" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Stack is Ready!
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Congratulations! You've successfully built a complete technology stack. 
            Your personalized tech stack guide is being prepared.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            <span className="text-lg font-semibold text-gray-700">Generating your guide...</span>
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {countdown}
          </div>
          
          <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your personalized guide...
          </p>
        </div>
      </div>
    </div>
  );
};

export default StackReady;