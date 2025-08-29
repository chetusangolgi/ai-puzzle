import React from "react"
import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"

// Mock data for testing
const mockStackData = {
  id: "doc1",
  name: "Dell Technologies Stack",
  parameters: [
    {
      id: "hardware",
      name: "Hardware",
      filled: false,
      options: [
        { id: "opt1", text: "PowerEdge Servers", targetParameter: "hardware", isCorrect: true },
        { id: "opt2", text: "Generic Servers", targetParameter: "hardware", isCorrect: false },
        { id: "opt3", text: "Basic Hardware", targetParameter: "hardware", isCorrect: false }
      ]
    },
    {
      id: "software",
      name: "Software",
      filled: false,
      options: [
        { id: "opt4", text: "VMware vSphere", targetParameter: "software", isCorrect: true },
        { id: "opt5", text: "Basic OS", targetParameter: "software", isCorrect: false },
        { id: "opt6", text: "Generic Software", targetParameter: "software", isCorrect: false }
      ]
    },
    {
      id: "service",
      name: "Service",
      filled: false,
      options: [
        { id: "opt7", text: "ProSupport Plus", targetParameter: "service", isCorrect: true },
        { id: "opt8", text: "Basic Support", targetParameter: "service", isCorrect: false },
        { id: "opt9", text: "No Support", targetParameter: "service", isCorrect: false }
      ]
    },
    {
      id: "security",
      name: "Security",
      filled: false,
      options: [
        { id: "opt10", text: "CyberRecovery", targetParameter: "security", isCorrect: true },
        { id: "opt11", text: "Basic Security", targetParameter: "security", isCorrect: false },
        { id: "opt12", text: "No Security", targetParameter: "security", isCorrect: false }
      ]
    },
    {
      id: "deployment",
      name: "Deployment",
      filled: false,
      options: [
        { id: "opt13", text: "Edge Solutions", targetParameter: "deployment", isCorrect: true },
        { id: "opt14", text: "Cloud Only", targetParameter: "deployment", isCorrect: false },
        { id: "opt15", text: "On-Premise Only", targetParameter: "deployment", isCorrect: false }
      ]
    }
  ]
}

const StackBuilder = ({ selectedDocument = { id: "doc1" }, onNext = () => {} }) => {
  const [components, setComponents] = useState([mockStackData])
  const [draggedItem, setDraggedItem] = useState(null)
  const [totalFilled, setTotalFilled] = useState(0)
  const [totalParameters, setTotalParameters] = useState(5)
  const [selectedParameter, setSelectedParameter] = useState(null)
  const [dragOverParameter, setDragOverParameter] = useState(null)
  const [droppedOptions, setDroppedOptions] = useState({})
  const [wrongDrop, setWrongDrop] = useState(null)
  const [touchedItem, setTouchedItem] = useState(null)
  const [touchPosition, setTouchPosition] = useState(null)
  const [wrongClick, setWrongClick] = useState(null)
  const [successBlocks, setSuccessBlocks] = useState([])
  const [visibleBlocks, setVisibleBlocks] = useState([])

  // Stack block images
  const blockImages = [
    "/block1.png",
    "/block2.png", 
    "/block3.png",
    "/block4.png",
    "/block5.png"
  ]

  // Map parameter types to their respective before images
  const getBeforeImage = (parameterName) => {
    const normalizedName = parameterName.toLowerCase()
    if (normalizedName.includes('hardware')) return '/before/hardware.png'
    if (normalizedName.includes('software')) return '/before/software.png'
    if (normalizedName.includes('service')) return '/before/service.png'
    if (normalizedName.includes('security')) return '/before/security.png'
    if (normalizedName.includes('edge') || normalizedName.includes('deployment')) return '/before/deployment.png'
    return '/before/hardware.png'
  }

  // Map parameter types to their respective after images
  const getAfterImage = (parameterName) => {
    const normalizedName = parameterName.toLowerCase()
    if (normalizedName.includes('hardware')) return '/after/hardware.png'
    if (normalizedName.includes('software')) return '/after/software.png'
    if (normalizedName.includes('service')) return '/after/service.png'
    if (normalizedName.includes('security')) return '/after/security.png'
    if (normalizedName.includes('edge') || normalizedName.includes('deployment')) return '/after/deployment.png'
    return '/after/hardware.png'
  }

  // Get the next unfilled parameter
  const getNextUnfilledParameter = (currentComponents) => {
    for (const component of currentComponents) {
      for (const param of component.parameters) {
        if (!param.filled) {
          return param
        }
      }
    }
    return null
  }

  useEffect(() => {
    if (selectedDocument) {
      setComponents([mockStackData])
      setTotalParameters(5)
      
      // Auto-select the first parameter
      if (mockStackData.parameters.length > 0) {
        setSelectedParameter(mockStackData.parameters[0])
      }
    }
  }, [selectedDocument])

  useEffect(() => {
    const filledCount = components.reduce((count, component) => {
      return count + component.parameters.filter((param) => param.filled).length
    }, 0)
    setTotalFilled(filledCount)

    if (filledCount === totalParameters && totalParameters > 0) {
      onNext()
    }
  }, [components, onNext, totalParameters])

  const handleOptionClick = (optionId, uniqueKey) => {
    if (!selectedParameter) return

    const clickedOption = selectedParameter.options.find(opt => opt.id === optionId)
    if (!clickedOption) return

    const targetParam = components[0]?.parameters.find(param => param.id === clickedOption.targetParameter)
    if (!targetParam) return

    if (clickedOption.isCorrect && !targetParam.filled) {
      // Add success block with staggered animation
      const blockIndex = successBlocks.length
      const newBlock = {
        id: `success-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        stackIndex: blockIndex,
        imageUrl: blockImages[blockIndex % blockImages.length]
      }
      
      setSuccessBlocks(prev => [...prev, newBlock])
      
      // Stagger the visibility animation
      setTimeout(() => {
        setVisibleBlocks(prev => [...prev, blockIndex])
      }, 100)
      
      // Update dropped options
      setDroppedOptions(prev => ({
        ...prev,
        [clickedOption.targetParameter]: clickedOption
      }))
      
      // Update component parameters
      const updatedComponents = components.map((component) => ({
        ...component,
        parameters: component.parameters.map((param) =>
          param.id === clickedOption.targetParameter ? { ...param, filled: true } : param,
        ),
      }))
      
      setComponents(updatedComponents)
      
      // Auto-select next parameter
      const nextParameter = getNextUnfilledParameter(updatedComponents)
      setSelectedParameter(nextParameter)
    } else {
      // Wrong answer
      setWrongClick(uniqueKey)
      setTimeout(() => {
        setWrongClick(null)
      }, 1000)
    }
  }

  const handleDragStart = (e, optionId) => {
    setDraggedItem(optionId)
    e.dataTransfer.effectAllowed = "move"
    document.body.style.cursor = "grabbing"
  }

  const handleDragOver = (e, parameterId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (parameterId) {
      setDragOverParameter(parameterId)
    }
  }

  const handleDragLeave = () => {
    setDragOverParameter(null)
  }

  const handleDragEnd = () => {
    document.body.style.cursor = "auto"
    setDraggedItem(null)
    setDragOverParameter(null)
  }

  const handleDrop = (e, parameterId) => {
    e.preventDefault()

    if (!draggedItem) return

    let draggedOption
    for (const component of components) {
      for (const param of component.parameters) {
        const option = param.options.find((opt) => opt.id === draggedItem)
        if (option) {
          draggedOption = option
          break
        }
      }
      if (draggedOption) break
    }

    if (!draggedOption) return

    if (draggedOption.targetParameter === parameterId && draggedOption.isCorrect) {
      // Add success block with image
      const blockIndex = successBlocks.length
      const newBlock = {
        id: `success-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        stackIndex: blockIndex,
        imageUrl: blockImages[blockIndex % blockImages.length]
      }
      
      setSuccessBlocks(prev => [...prev, newBlock])
      
      setTimeout(() => {
        setVisibleBlocks(prev => [...prev, blockIndex])
      }, 100)
      
      setDroppedOptions(prev => ({
        ...prev,
        [parameterId]: draggedOption
      }))
      
      const updatedComponents = components.map((component) => ({
        ...component,
        parameters: component.parameters.map((param) =>
          param.id === parameterId ? { ...param, filled: true } : param,
        ),
      }))
      
      setComponents(updatedComponents)
      
      const nextParameter = getNextUnfilledParameter(updatedComponents)
      setSelectedParameter(nextParameter)
    } else {
      setWrongDrop(parameterId)
      setTimeout(() => {
        setWrongDrop(null)
      }, 1000)
    }

    setDraggedItem(null)
    setDragOverParameter(null)
  }

  return (
    <div className="min-h-screen flex flex-col touch-pan-y" style={{ backgroundImage: 'url(/s03.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <style jsx>{`
        .options-screen {
          position: relative;
          overflow: hidden;
        }
        
        @keyframes smoothFall {
          0% { 
            transform: translateY(-400px);
            opacity: 0;
          }
          5% { 
            opacity: 1;
          }
          95% { 
            opacity: 1;
          }
          100% { 
            transform: translateY(700px);
            opacity: 0;
          }
        }
        
        .falling-option {
          animation: smoothFall linear infinite;
          position: absolute;
          z-index: 10;
          opacity: 0;
          transform: translateY(-400px);
        }
        
        @keyframes blockDrop {
          0% { 
            transform: translateX(-50%) translateY(-400px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% { 
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        
        .block-falling {
          animation: blockDrop 0.7s ease-out forwards;
        }
      `}</style>

      {/* Dell Technologies Header */}
      <div className="p-8">
        <div className="mb-8 mt-32">
          <div className="flex items-center mb-6">
            <div className="w-5 h-20 bg-slate-800 mr-10"></div>
            <div>
              {components[0] && (
                <h1 className="text-7xl font-light text-slate-800">
                  {components[0].name}
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left side - Options and Parameters */}
        <div className="w-3.5/5 p-8 flex flex-col justify-between">
          {/* Options Panel */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-white py-16 px-6 shadow-sm mb-8 flex-1 flex flex-col justify-center options-screen">
              <div className="relative w-full h-full">
                {selectedParameter &&
                  Array.from({ length: 6 }, (_, index) => {
                    const optionIndex = index % selectedParameter.options.length
                    const option = selectedParameter.options[optionIndex]
                    const columnIndex = index % 3
                    const rowIndex = Math.floor(index / 3)
                    const horizontalPosition = 10 + columnIndex * 35
                    const verticalPosition = rowIndex === 0 ? 15 : 65
                    
                    return (
                      <div
                        key={`${option.id}-${index}`}
                        onClick={() => handleOptionClick(option.id, `${option.id}-${index}`)}
                        onDragStart={(e) => handleDragStart(e, option.id)}
                        draggable
                        className={`falling-option border border-blue-200 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 touch-manipulation select-none ${
                          wrongClick === `${option.id}-${index}` ? "bg-red-500 animate-pulse" : ""
                        }`}
                        style={{
                          width: '180px',
                          height: '90px',
                          backgroundColor: wrongClick === `${option.id}-${index}` ? '#EF4444' : '#C5D4E3',
                          animationDelay: `${columnIndex * 2 + rowIndex * 6}s`,
                          animationDuration: '12s',
                          left: `${horizontalPosition}%`,
                          top: `${verticalPosition}%`,
                          animationIterationCount: 'infinite'
                        }}
                      >
                        <div className="h-full flex flex-col justify-between">
                          <h4 className="text-sm font-thin text-left">{option.text}</h4>
                          <div className="w-6 h-0.5 bg-slate-800"></div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Parameters at bottom */}
          <div className="flex gap-4">
            {components[0]?.parameters.map((param) => (
              <div
                key={param.id}
                data-drop-zone="true"
                data-parameter-id={param.id}
                className={`transition-all duration-300 ease-in-out relative flex flex-row items-center justify-center transform touch-manipulation ${
                  param.filled ? "scale-100 cursor-default" : "hover:scale-105 cursor-pointer"
                } ${
                  dragOverParameter === param.id ? "ring-4 ring-blue-400/50 scale-105 shadow-xl bg-blue-50/20 cursor-copy" : ""
                } ${
                  wrongDrop === param.id ? "ring-4 ring-red-500 bg-red-100/20 animate-bounce cursor-not-allowed" : ""
                }`}
                style={{ width: '230px', height: '201px' }}
                onDragOver={(e) => handleDragOver(e, param.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, param.id)}
                onClick={() => setSelectedParameter(param)}
              >
                <div className="relative w-full h-full">
                  {param.filled && droppedOptions[param.id] ? (
                    <div style={{ backgroundColor: '#C5D4E3' }} className="border border-blue-200 rounded-lg p-4 w-full h-full">
                      <div className="h-full flex flex-col justify-between">
                        <h4 className="text-3xl font-thin text-left">{droppedOptions[param.id].text}</h4>
                        <div className="w-8 h-1 bg-slate-800"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={getBeforeImage(param.name)}
                        alt={param.name}
                        className="w-full h-full object-cover"
                      />
                      {dragOverParameter === param.id && draggedItem && (
                        <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                          <img
                            src={getAfterImage(param.name)}
                            alt={param.name}
                            className="w-full h-full object-cover opacity-90 animate-pulse transition-opacity duration-300"
                          />
                          <div className="absolute inset-0 bg-blue-400/20 animate-pulse"></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Image blocks stacking area */}
        <div className="w-1/5 p-8 relative overflow-hidden">
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            {successBlocks.map((block, index) => {
              const isVisible = visibleBlocks.includes(index)
              const stackPosition = visibleBlocks.indexOf(index)
              
              return (
                <div
                  key={block.id}
                  className={`absolute transition-all duration-700 ease-out ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    width: '176px',
                    height: '148px',
                    bottom: stackPosition >= 0 ? `${stackPosition * 64}px` : '0px',
                    left: '50%',
                    transform: isVisible
                      ? 'translateX(-50%)'
                      : 'translateX(-50%) translateY(-400px)',
                    zIndex: stackPosition >= 0 ? stackPosition + 10 : -1,
                  }}
                >
                  <img
                    src={block.imageUrl || "/placeholder.svg"}
                    alt={`Block ${index + 1}`}
                    className="w-full h-full rounded-sm shadow-lg"
                  />
                </div>
              )
            })}
          </div>

          {/* Optional: Success particles */}
          {successBlocks.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 20}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Touch Drag Indicator */}
      {touchedItem && touchPosition && (
        <div
          className="fixed pointer-events-none z-50 bg-blue-100 border-2 border-blue-300 rounded-lg p-2 shadow-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{
            left: touchPosition.x,
            top: touchPosition.y,
            width: '150px',
            height: '100px'
          }}
        >
          <div className="text-center text-blue-800 text-sm font-medium">
            {selectedParameter?.options.find(opt => opt.id === touchedItem)?.text || 'Dragging...'}
          </div>
        </div>
      )}
    </div>
  )
}

export default StackBuilder