import React, { useState, useEffect } from 'react';
import { getStackComponentsForDocument, StackComponent, DragOption, Parameter } from '../utils/stackData';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { SelectedDocument } from '../App';

interface StackBuilderProps {
  selectedDocument: SelectedDocument | null;
  onNext: () => void;
}

const StackBuilder: React.FC<StackBuilderProps> = ({ selectedDocument, onNext }) => {
  const [components, setComponents] = useState<StackComponent[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [totalFilled, setTotalFilled] = useState(0);
  const [totalParameters, setTotalParameters] = useState(0);
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(null);

  useEffect(() => {
    if (selectedDocument) {
      const initialComponents = getStackComponentsForDocument(selectedDocument.id);
      setComponents(initialComponents);
      
      // Calculate total parameters based on available options
      const totalParams = initialComponents.reduce((count, component) => {
        return count + component.parameters.length;
      }, 0);
      setTotalParameters(totalParams);
    }
  }, [selectedDocument]);

  useEffect(() => {
    const filledCount = components.reduce((count, component) => {
      return count + component.parameters.filter(param => param.filled).length;
    }, 0);
    setTotalFilled(filledCount);

    if (filledCount === totalParameters && totalParameters > 0) {
      setTimeout(() => onNext(), 1000);
    }
  }, [components, onNext, totalParameters]);

  const handleDragStart = (e: React.DragEvent, optionId: string) => {
    setDraggedItem(optionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, parameterId: string) => {
    e.preventDefault();

    if (!draggedItem) return;

    let draggedOption: DragOption | undefined;
    for (const component of components) {
      for (const param of component.parameters) {
        const option = param.options.find(opt => opt.id === draggedItem);
        if (option) {
          draggedOption = option;
          break;
        }
      }
      if (draggedOption) break;
    }

    if (!draggedOption) return;

    // Check if the option is correct for this parameter
    if (draggedOption.targetParameter === parameterId && draggedOption.isCorrect) {
      // Update the component parameter
      setComponents(prev => prev.map(component => ({
        ...component,
        parameters: component.parameters.map(param =>
          param.id === parameterId
            ? { ...param, filled: true }
            : param
        )
      })));
      setSelectedParameter(null); // Hide the options block after a successful drop
    }

    setDraggedItem(null);
  };

  const progress = totalParameters > 0 ? (totalFilled / totalParameters) * 100 : 0;

  if (!selectedDocument) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundImage: 'url(/s03.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Title, Progress and Options */}
          <div className="space-y-4">
            {/* Title and Description */}
            <div className="bg-white/90 rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
     
                <h2 className="text-2xl font-bold text-gray-800">Build Your {selectedDocument.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">Click a parameter to see the options, then drag the correct option to its matching parameter</p>

              
            </div>

            {/* Options Panel */}
            {selectedParameter && !selectedParameter.filled && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-fade-in">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Available Options for {selectedParameter.name}
                </h3>
                <div className="space-y-3">
                  {selectedParameter.options.map((option) => (
                    <div
                      key={option.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, option.id)}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-move hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                    >
                      <span className="text-sm font-medium text-gray-700">{option.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!selectedParameter && (
              <div className="bg-white/80 rounded-xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-500 text-center">Click on a parameter to see available options</p>
              </div>
            )}
          </div>

          {/* Right Column - Parameters */}
          <div className="space-y-4">
            {components.map((component) => (
              <div key={component.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{component.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{component.name}</h3>
                    <p className="text-sm text-gray-600">{component.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {component.parameters.map((param) => (
                    <div
                      key={param.id}
                      className={`border-2 border-dashed rounded-lg p-4 min-h-[60px] flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        param.filled
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-blue-300'
                      } ${
                        selectedParameter?.id === param.id ? 'border-blue-500 ring-2 ring-blue-200' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, param.id)}
                      onClick={() => setSelectedParameter(param)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">{param.name}:</span>
                        {param.filled && (
                          <>
                            <span className="text-sm text-green-700 font-semibold">
                              {param.acceptedOption}
                            </span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalFilled === totalParameters && totalParameters > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h3>
              <p className="text-gray-600">All parameters matched correctly!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackBuilder;