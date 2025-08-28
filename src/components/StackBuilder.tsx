import type React from "react"
import { useState, useEffect } from "react"
import { getStackComponentsForDocument, type StackComponent, type DragOption, type Parameter } from "../utils/stackData"
import { CheckCircle } from "lucide-react"
import type { SelectedDocument } from "../App"

interface StackBuilderProps {
  selectedDocument: SelectedDocument | null
  onNext: () => void
}

const StackBuilder: React.FC<StackBuilderProps> = ({ selectedDocument, onNext }) => {
  const [components, setComponents] = useState<StackComponent[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [totalFilled, setTotalFilled] = useState(0)
  const [totalParameters, setTotalParameters] = useState(0)
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(null)
  const [dragOverParameter, setDragOverParameter] = useState<string | null>(null)
  const [droppedOptions, setDroppedOptions] = useState<{[key: string]: DragOption}>({})
  const [wrongDrop, setWrongDrop] = useState<string | null>(null)
  const [touchedItem, setTouchedItem] = useState<string | null>(null)
  const [touchPosition, setTouchPosition] = useState<{x: number, y: number} | null>(null)
  const [wrongClick, setWrongClick] = useState<string | null>(null)
  const [fallingOptions, setFallingOptions] = useState<{[key: string]: number}>({})

  // Map parameter types to their respective before images
  const getBeforeImage = (parameterName: string) => {
    const normalizedName = parameterName.toLowerCase()
    if (normalizedName.includes('hardware')) return '/before/hardware.png'
    if (normalizedName.includes('software')) return 'before/software.png'
    if (normalizedName.includes('service')) return 'before/service.png'
    if (normalizedName.includes('security')) return 'before/security.png'
    if (normalizedName.includes('edge') || normalizedName.includes('deployment')) return 'before/deployment.png'
    return '/hardwarebefore.png' // fallback
  }

  // Map parameter types to their respective after images
  const getAfterImage = (parameterName: string) => {
    const normalizedName = parameterName.toLowerCase()
    if (normalizedName.includes('hardware')) return 'after/hardware.png'
    if (normalizedName.includes('software')) return 'after/software.png'
    if (normalizedName.includes('service')) return 'after/service.png'
    if (normalizedName.includes('security')) return 'after/security.png'
    if (normalizedName.includes('edge') || normalizedName.includes('deployment')) return 'after/deployment.png'
    return '/hardwareafter.png' // fallback
  }

  // Get the next unfilled parameter
  const getNextUnfilledParameter = (currentComponents: StackComponent[]) => {
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
      const initialComponents = getStackComponentsForDocument(selectedDocument.id)
      setComponents(initialComponents)

      // Calculate total parameters based on available options
      const totalParams = initialComponents.reduce((count, component) => {
        return count + component.parameters.length
      }, 0)
      setTotalParameters(totalParams)

      // Auto-select the first parameter (hardware) when components load
      if (initialComponents.length > 0 && initialComponents[0].parameters.length > 0) {
        setSelectedParameter(initialComponents[0].parameters[0])
      }
    }
  }, [selectedDocument])

  // Random falling animation effect
  useEffect(() => {
    const generateRandomOptions = () => {
      if (selectedParameter?.options) {
        const randomOptions: {[key: string]: {delay: number, duration: number, position: number}} = {}
        
        // Generate 12 random falling options
        for (let i = 0; i < 12; i++) {
          const randomOptionIndex = Math.floor(Math.random() * selectedParameter.options.length)
          const option = selectedParameter.options[randomOptionIndex]
          const uniqueKey = `${option.id}-${i}-${Date.now()}-${Math.random()}`
          
          randomOptions[uniqueKey] = {
            delay: Math.random() * 15000, // Random delay 0-15 seconds
            duration: 5000 + Math.random() * 10000, // Random duration 5-15 seconds
            position: Math.random() * 90 // Random horizontal position 0-90%
          }
        }
        
        setFallingOptions(randomOptions as any)
      }
    }

    generateRandomOptions()
    const interval = setInterval(generateRandomOptions, 2000) // Regenerate every 2 seconds

    return () => clearInterval(interval)
  }, [selectedParameter])

  useEffect(() => {
    const filledCount = components.reduce((count, component) => {
      return count + component.parameters.filter((param) => param.filled).length
    }, 0)
    setTotalFilled(filledCount)

    if (filledCount === totalParameters && totalParameters > 0) {
      onNext()
    }
  }, [components, onNext, totalParameters])

  const handleDragStart = (e: React.DragEvent, optionId: string) => {
    setDraggedItem(optionId)
    e.dataTransfer.effectAllowed = "move"
    
    // Create a custom drag image for better visual feedback
    const dragElement = e.currentTarget as HTMLElement
    const rect = dragElement.getBoundingClientRect()
    
    // Set drag data
    e.dataTransfer.setData("text/plain", optionId)
    
    // Add grabbing cursor to body during drag
    document.body.style.cursor = "grabbing"
  }

  const handleDragOver = (e: React.DragEvent, parameterId?: string) => {
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
    // Clean up cursor and drag state
    document.body.style.cursor = "auto"
    setDraggedItem(null)
    setDragOverParameter(null)
  }

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent, optionId: string) => {
    e.preventDefault()
    setTouchedItem(optionId)
    setDraggedItem(optionId)
    
    const touch = e.touches[0]
    setTouchPosition({ x: touch.clientX, y: touch.clientY })
    
    // Prevent body scrolling during drag
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchedItem) return
    
    const touch = e.touches[0]
    setTouchPosition({ x: touch.clientX, y: touch.clientY })
    
    // Find element under touch
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const dropZone = elementBelow?.closest('[data-drop-zone]')
    
    if (dropZone) {
      const parameterId = dropZone.getAttribute('data-parameter-id')
      if (parameterId) {
        setDragOverParameter(parameterId)
      }
    } else {
      setDragOverParameter(null)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchedItem || !touchPosition) return
    
    // Restore body scrolling
    document.body.style.overflow = 'auto'
    document.body.style.touchAction = 'auto'
    
    // Find element under final touch position
    const elementBelow = document.elementFromPoint(touchPosition.x, touchPosition.y)
    const dropZone = elementBelow?.closest('[data-drop-zone]')
    
    if (dropZone) {
      const parameterId = dropZone.getAttribute('data-parameter-id')
      if (parameterId) {
        // Add success haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
        
        // Simulate drop event
        const mockEvent = {
          preventDefault: () => {},
        } as React.DragEvent
        handleDrop(mockEvent, parameterId)
      }
    } else {
      // Add error haptic feedback for missed drop
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }
    }
    
    // Clean up touch state
    setTouchedItem(null)
    setTouchPosition(null)
    setDraggedItem(null)
    setDragOverParameter(null)
  }

  const handleOptionClick = (optionId: string, uniqueKey: string) => {
    if (!selectedParameter) return

    const clickedOption = selectedParameter.options.find(opt => opt.id === optionId)
    if (!clickedOption) return

    // Find the target parameter for this option
    const targetParam = components[0]?.parameters.find(param => param.id === clickedOption.targetParameter)
    if (!targetParam) return

    // Check if the option is correct
    if (clickedOption.isCorrect && !targetParam.filled) {
      // Correct answer - place option in parameter
      setDroppedOptions(prev => ({
        ...prev,
        [clickedOption.targetParameter]: clickedOption
      }))
      
      // Update the component parameter
      const updatedComponents = components.map((component) => ({
        ...component,
        parameters: component.parameters.map((param) =>
          param.id === clickedOption.targetParameter ? { ...param, filled: true } : param,
        ),
      }))
      
      setComponents(updatedComponents)
      
      // Auto-select the next unfilled parameter
      const nextParameter = getNextUnfilledParameter(updatedComponents)
      setSelectedParameter(nextParameter)
    } else {
      // Wrong answer - show red flash for only this specific card
      setWrongClick(uniqueKey)
      setTimeout(() => {
        setWrongClick(null)
      }, 1000)
    }
  }

  const handleDrop = (e: React.DragEvent, parameterId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    let draggedOption: DragOption | undefined
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

    // Check if the option is correct for this parameter
    if (draggedOption.targetParameter === parameterId && draggedOption.isCorrect) {
      // Store the dropped option
      setDroppedOptions(prev => ({
        ...prev,
        [parameterId]: draggedOption
      }))
      
      // Update the component parameter
      const updatedComponents = components.map((component) => ({
        ...component,
        parameters: component.parameters.map((param) =>
          param.id === parameterId ? { ...param, filled: true } : param,
        ),
      }))
      
      setComponents(updatedComponents)
      
      // Auto-select the next unfilled parameter
      const nextParameter = getNextUnfilledParameter(updatedComponents)
      setSelectedParameter(nextParameter)
    } else {
      // Wrong answer - show visual feedback
      setWrongDrop(parameterId)
      setTimeout(() => {
        setWrongDrop(null)
      }, 1000) // Clear the wrong drop indicator after 1 second
    }

    setDraggedItem(null)
    setDragOverParameter(null)
  }

  const progress = totalParameters > 0 ? (totalFilled / totalParameters) * 100 : 0

  if (!selectedDocument) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col touch-pan-y" style={{ backgroundImage: 'url(/s03.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <style>
        {`
          .options-screen {
            position: relative;
            overflow: hidden;
          }
          
          @keyframes smoothFall {
            0% { 
              transform: translateY(-300px) translateX(0px); 
              opacity: 0;
            }
            10% { 
              opacity: 1;
            }
            90% { 
              opacity: 1;
            }
            100% { 
              transform: translateY(400px) translateX(0px); 
              opacity: 0;
            }
          }
          
          .falling-option {
            animation: smoothFall linear infinite;
            position: absolute;
            z-index: 10;
          }
        `}
      </style>
      {/* Dell Technologies Header */}
      <div className="p-8">
        <div className="mb-8 mt-32">
          <div className="flex items-center mb-6">
            <div className="w-5 h-20 bg-slate-800 mr-10"></div>
            <div>
              {components[0] && (
                <>
                  <h1 className="text-7xl font-light text-slate-800">
                    {components[0].name}
                  </h1>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right side instruction */}
      

      <div className="flex flex-1">
        {/* Left side - Options above, Parameters below */}
        <div className="w-4/5 p-8 flex flex-col justify-between">
          {/* Hardware Section */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Options Panel */}
            <div className="bg-white py-16 px-6 shadow-sm mb-8 flex-1 flex flex-col justify-center options-screen">
              <div className="flex items-center mb-6">
               
                
              </div>

              {/* Hardware Options Cards - Falling Animation */}
              <div className="relative w-full h-full">
                {selectedParameter &&
                  Array.from({ length: 9 }, (_, index) => {
                    const optionIndex = index % selectedParameter.options.length
                    const option = selectedParameter.options[optionIndex]
                    const columnWidth = 100 / 9 // Divide full width into 9 columns
                    
                    return (
                      <div
                        key={`${option.id}-${index}`}
                        onClick={() => handleOptionClick(option.id, `${option.id}-${index}`)}
                        className={`falling-option border border-blue-200 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 touch-manipulation select-none ${
                          wrongClick === `${option.id}-${index}` ? "bg-red-500 animate-pulse" : ""
                        }`}
                        style={{
                          width: `${columnWidth - 2}%`,
                          height: '80px',
                          backgroundColor: wrongClick === `${option.id}-${index}` ? '#EF4444' : '#C5D4E3',
                          animationDelay: `${index * 1}s`,
                          animationDuration: '10s',
                          left: `${index * columnWidth}%`,
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
                } ${selectedParameter?.id === param.id ? "" : ""} ${
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
                    // Show the dropped option card
                    <div style={{ backgroundColor: '#C5D4E3' }} className="border border-blue-200 rounded-lg p-4 w-full h-full">
                      <div className="h-full flex flex-col justify-between">
                        <h4 className="text-3xl font-thin text-left">{droppedOptions[param.id].text}</h4>
                        <div className="w-8 h-1 bg-slate-800"></div>
                      </div>
                    </div>
                  ) : (
                    // Show the default image when empty
                    <>
                      <img
                        src={getBeforeImage(param.name)}
                        alt={param.name}
                        className="w-full h-full object-cover "
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

        {/* Right side - Empty space for instructions */}
        <div className="w-1/5 p-8 relative">
          {/* Decorative arc in top right */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-0">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path d="M 200 0 A 100 100 0 0 1 100 100 L 200 100 Z" fill="white" />
            </svg>
          </div>
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