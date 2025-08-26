import React, { useState } from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { SelectedDocument } from '../App';

interface DocumentSelectionProps {
  selectedDocument: SelectedDocument | null;
  setSelectedDocument: React.Dispatch<React.SetStateAction<SelectedDocument | null>>;
  onNext: () => void;
}

const documents: SelectedDocument[] = [
  {
    id: 'button-1',
    title: 'Enhance Productivity & Collaboration',
    description: 'Enhance Productivity & Collaboration',
    icon: '/n/b1.png'
  },
  {
    id: 'button-2',
    title: 'Enable AI Model Development',
    description: 'Enable AI Model Development',
    icon: '/n/b2.png'
  },
  {
    id: 'button-3',
    title: 'Optimize Decision-Making',
    description: 'Optimize Decision-Making',
    icon: '/n/b3.png'
  },
  {
    id: 'button-4',
    title: 'Strengthen Security & Governance',
    description: 'Strengthen Security & Governance',
    icon: '/n/b4.png'
  },
  {
    id: 'button-5',
    title: 'Empower Remote & Hybrid Work',
    description: 'Empower Remote & Hybrid Work',
    icon: '/n/b5.png'
  }
];

const getHoverImage = (buttonId: string): string => {
  const buttonNumber = buttonId.split('-')[1];
  return `/a/b${buttonNumber}.png`;
};


const DocumentSelection: React.FC<DocumentSelectionProps> = ({ 
  selectedDocument, 
  setSelectedDocument, 
  onNext 
}) => {
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);
  const [clickedDocument, setClickedDocument] = useState<string | null>(null);

  const handleDocumentSelect = (document: SelectedDocument) => {
    setSelectedDocument(document);
    setClickedDocument(document.id);
    setTimeout(() => {
      onNext();
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: 'url(/s02.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 "></div>
      <div className="w-full relative z-10">
        

        <div className="mt-[24rem] ml-[19rem]">
          {/* First row - 3 buttons */}
          <div className="flex justify-start gap-4 mb-4">
            {documents.slice(0, 3).map((document) => (
              <button
                key={document.id}
                onClick={() => handleDocumentSelect(document)}
                onMouseEnter={() => setHoveredDocument(document.id)}
                onMouseLeave={() => setHoveredDocument(null)}
                className={`cursor-pointer transition-all duration-300 ${
                  clickedDocument === document.id
                    ? 'ring-4 ring-blue-400 ring-opacity-80 transform scale-105 shadow-xl'
                    : hoveredDocument === document.id || selectedDocument?.id === document.id
                    ? 'ring-4 ring-blue-400 ring-opacity-60'
                    : 'hover:ring-2 hover:ring-white hover:ring-opacity-50'
                }`}
                disabled={clickedDocument !== null}
              >
                <img 
                  src={
                    hoveredDocument === document.id || selectedDocument?.id === document.id || clickedDocument === document.id
                      ? getHoverImage(document.id)
                      : document.icon
                  }
                  alt={document.title}
                  className="max-h-60 w-auto object-contain transition-all duration-300"
                />
              </button>
            ))}
          </div>
          
          {/* Second row - 2 buttons */}
          <div className="flex justify-start gap-4 mb-8">
            {documents.slice(3, 5).map((document) => (
              <button
                key={document.id}
                onClick={() => handleDocumentSelect(document)}
                onMouseEnter={() => setHoveredDocument(document.id)}
                onMouseLeave={() => setHoveredDocument(null)}
                className={`cursor-pointer transition-all duration-300 ${
                  clickedDocument === document.id
                    ? 'ring-4 ring-blue-400 ring-opacity-80 transform scale-105 shadow-xl'
                    : hoveredDocument === document.id || selectedDocument?.id === document.id
                    ? 'ring-4 ring-blue-400 ring-opacity-60'
                    : 'hover:ring-2 hover:ring-white hover:ring-opacity-50'
                }`}
                disabled={clickedDocument !== null}
              >
                <img 
                  src={
                    hoveredDocument === document.id || selectedDocument?.id === document.id || clickedDocument === document.id
                      ? getHoverImage(document.id)
                      : document.icon
                  }
                  alt={document.title}
                  className="max-h-60 w-auto object-contain transition-all duration-300"
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentSelection;