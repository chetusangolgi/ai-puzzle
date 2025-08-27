import React from 'react';

interface StackReadyProps {
  onNext: () => void;
}

const StackReady: React.FC<StackReadyProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        onEnded={onNext}
      >
        <source src="/button1.mp4" type="video/mp4" />
        <source src="/button1.webm" type="video/webm" />
        {/* Fallback for browsers that don't support video */}
        <img src="/button1.png" alt="Stack Ready" className="w-full h-full object-cover" />
      </video>
    </div>
  );
};

export default StackReady;