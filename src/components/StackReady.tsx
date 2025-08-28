import React from 'react';
import { SelectedDocument } from '../App';

interface StackReadyProps {
  selectedDocument: SelectedDocument | null;
  onNext: () => void;
}

const StackReady: React.FC<StackReadyProps> = ({ selectedDocument, onNext }) => {
  const getVideoSrc = () => {
    if (!selectedDocument) {
      return "/button1.mp4"; // Default fallback
    }
    
    const buttonNumber = selectedDocument.id.split('-')[1];
    return `/button${buttonNumber}.mp4`;
  };

  const videoSrc = getVideoSrc();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        onEnded={onNext}
        key={videoSrc} // Force re-render when video changes
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <img src="/frame.png" alt="Stack Ready" className="w-full h-full object-cover" />
      </video>
    </div>
  );
};

export default StackReady;