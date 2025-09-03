import React from "react"
import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
import { getStackComponentsForDocument } from '../utils/stackData'

const StackBuilder = ({ selectedDocument = { id: "button-1" }, onNext = () => {} }) => {
  const [components, setComponents] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [totalFilled, setTotalFilled] = useState(0)
  const [totalParameters, setTotalParameters] = useState(0)
  const [selectedParameter, setSelectedParameter] = useState(null)
  const [dragOverParameter, setDragOverParameter] = useState(null)
  const [droppedOptions, setDroppedOptions] = useState({})
  const [wrongDrop, setWrongDrop] = useState(null)
  const [touchedItem, setTouchedItem] = useState(null)
  const [touchPosition, setTouchPosition] = useState(null)
  const [wrongClick, setWrongClick] = useState(null)
  const [successBlocks, setSuccessBlocks] = useState([])
  const [visibleBlocks, setVisibleBlocks] = useState([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [gameStartTime, setGameStartTime] = useState(Date.now())
  const [randomizedOptions, setRandomizedOptions] = useState([])

  // Get document-specific block images
  const getBlockImages = (documentType) => {
    const baseCount = documentType === 'button-2' ? 4 : 5; // button-2 has 4 blocks, others have 5
    const images = [];
    for (let i = 1; i <= baseCount; i++) {
      images.push(`/stack/${documentType}/Block ${i}.png`);
    }
    return images;
  }

  const [blockImages, setBlockImages] = useState(getBlockImages('button-1'))

  // Map parameter types to their respective images
  // Active parameters (filled or currently available) use 'before' images, others use 'after' images
  const getParameterImage = (parameterName, isActive) => {
    const normalizedName = parameterName.toLowerCase()
    const folder = isActive ? 'before' : 'after'
    
    if (normalizedName.includes('hardware')) return `/${folder}/hardware.png`
    if (normalizedName.includes('software') || normalizedName.includes('ai platforms')) return `/${folder}/software.png`
    if (normalizedName.includes('service') || normalizedName.includes('ai services')) return `/${folder}/service.png`
    if (normalizedName.includes('security') || normalizedName.includes('governance')) return `/${folder}/security.png`
    if (normalizedName.includes('edge') || normalizedName.includes('deployment')) return `/${folder}/deployment.png`
    return `/${folder}/hardware.png`
  }

  // Check if a parameter should be active (filled or next in sequence)
  const isParameterActive = (param, allParameters) => {
    if (param.filled) return true // Always active if filled
    
    // Get the index of current parameter
    const currentIndex = allParameters.findIndex(p => p.id === param.id)
    
    // Check if all previous parameters are filled
    for (let i = 0; i < currentIndex; i++) {
      if (!allParameters[i].filled) {
        return false
      }
    }
    
    return true // This parameter is next in sequence
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
      const stackComponents = getStackComponentsForDocument(selectedDocument.id)
      setComponents(stackComponents)
      setGameStartTime(Date.now())
      setBlockImages(getBlockImages(selectedDocument.id))
      
      if (stackComponents.length > 0) {
        setTotalParameters(stackComponents[0].parameters.length)
        
        // Auto-select the first parameter
        if (stackComponents[0].parameters.length > 0) {
          setSelectedParameter(stackComponents[0].parameters[0])
        }
      }
    }
  }, [selectedDocument])

  // Generate randomized options when selectedParameter changes
  useEffect(() => {
    if (selectedParameter && selectedParameter.options.length > 0) {
      const backgroundImages = ['/optionsbg/bg1.png', '/optionsbg/bg2.png', '/optionsbg/bg3.png']
      const textColors = ['#80AEEE', '#80E7EE', '#8BEEB0']
      
      // Assign consistent background images and text colors to each unique option
      const optionBgMap = {}
      const optionTextColorMap = {}
      selectedParameter.options.forEach((option, index) => {
        const colorIndex = index % backgroundImages.length
        optionBgMap[option.id] = backgroundImages[colorIndex]
        optionTextColorMap[option.id] = textColors[colorIndex]
      })
      
      // Create truly random falling options with proper spacing
      const newRandomizedOptions = []
      const animationDuration = 6 // seconds
      const optionWidth = 160 // pixels - larger square dimensions
      const optionHeight = 160 // pixels - larger square dimensions
      const horizontalMargin = 20 // pixels horizontal margin between options
      const verticalMargin = 60 // pixels vertical margin
      const fallDistance = 600 // pixels (from -200 to +400)
      const fallSpeed = fallDistance / animationDuration // pixels per second
      const minTimeGap = (optionHeight + verticalMargin) / fallSpeed // Time for safe spacing
      
      // Calculate random horizontal positions with equal left/right margins
      const leftMargin = 10 // Left margin percentage
      const rightMargin = 10 // Right margin percentage
      const optionWidthPercent = 16 // 160px option is roughly 16% of a 1000px container
      const maxPositionStart = 100 - rightMargin - optionWidthPercent // Maximum left position (74%)
      
      // Generate completely random positions within safe bounds
      const generateRandomPosition = () => {
        return leftMargin + Math.random() * (maxPositionStart - leftMargin)
      }
      
      // Track occupied space-time
      const occupiedSpaces = []
      
      // Ensure the correct option is always included
      const correctOption = selectedParameter.options.find(opt => opt.isCorrect)
      const availableOptions = [...selectedParameter.options]
      
      // Create 3 options, ensuring the correct one is always included and all are different
      const selectedOptions = []
      const usedOptionIds = new Set()
      
      // Always include the correct option first
      if (correctOption) {
        selectedOptions.push(correctOption)
        usedOptionIds.add(correctOption.id)
      }
      
      // Fill the remaining slots with different options (no duplicates)
      while (selectedOptions.length < 3 && selectedOptions.length < availableOptions.length) {
        const randomOptionIndex = Math.floor(Math.random() * availableOptions.length)
        const randomOption = availableOptions[randomOptionIndex]
        
        // Only add if we haven't used this option ID yet
        if (!usedOptionIds.has(randomOption.id)) {
          selectedOptions.push(randomOption)
          usedOptionIds.add(randomOption.id)
        }
      }
      
      // If we still need more options and have exhausted unique ones, fill with remaining available options
      while (selectedOptions.length < 3) {
        const randomOptionIndex = Math.floor(Math.random() * availableOptions.length)
        selectedOptions.push(availableOptions[randomOptionIndex])
      }
      
      // Shuffle the selected options so the correct one isn't always first
      for (let i = selectedOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedOptions[i], selectedOptions[j]] = [selectedOptions[j], selectedOptions[i]]
      }
      
      // Create the falling options
      for (let i = 0; i < 3; i++) {
        const selectedOption = selectedOptions[i]
        
        let finalPosition = generateRandomPosition()
        let finalDelay = i * 0.8 + Math.random() * 1.0 // Base delay with more variance
        let attempts = 0
        const maxAttempts = 15
        
        // Find a non-colliding position and time
        while (attempts < maxAttempts) {
          let collision = false
          
          for (const occupied of occupiedSpaces) {
            const horizontalDistance = Math.abs(occupied.position - finalPosition)
            const timeDistance = Math.abs(occupied.delay - finalDelay)
            
            // Check if too close horizontally and temporally
            if (horizontalDistance < 15 && timeDistance < minTimeGap * 0.7) {
              collision = true
              break
            }
          }
          
          if (!collision) {
            break
          }
          
          // Generate new random position and adjust timing
          finalPosition = generateRandomPosition()
          finalDelay += 1.0 + Math.random() * 0.3
          attempts++
        }
        
        // Record this occupied space
        occupiedSpaces.push({ position: finalPosition, delay: finalDelay })
        
        newRandomizedOptions.push({
          ...selectedOption,
          uniqueId: `${selectedOption.id}-${i}-${Date.now()}`,
          randomPosition: finalPosition,
          randomDelay: finalDelay,
          assignedBgImage: optionBgMap[selectedOption.id],
          assignedTextColor: optionTextColorMap[selectedOption.id]
        })
      }
      
      setRandomizedOptions(newRandomizedOptions)
    }
  }, [selectedParameter])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStartTime])

  useEffect(() => {
    const filledCount = components.reduce((count, component) => {
      return count + component.parameters.filter((param) => param.filled).length
    }, 0)
    setTotalFilled(filledCount)

    if (filledCount === totalParameters && totalParameters > 0) {
      // Add a 2-second delay before transitioning to leaderboard
      setTimeout(() => {
        onNext()
      }, 1000)
    }
  }, [components, onNext, totalParameters])


  const handleDragStart = (e, optionId, uniqueKey) => {
    setDraggedItem({ optionId, uniqueKey })
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", JSON.stringify({ optionId, uniqueKey }))
    document.body.style.cursor = "grabbing"
  }

  const handleDragOver = (e, parameterId) => {
    e.preventDefault()
    
    // Only allow drag over if parameter is not filled
    const targetParam = components[0]?.parameters.find(param => param.id === parameterId)
    if (targetParam && !targetParam.filled) {
      e.dataTransfer.dropEffect = "move"
      setDragOverParameter(parameterId)
    } else {
      e.dataTransfer.dropEffect = "none"
      setDragOverParameter(null)
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

  // Touch event handlers
  const handleTouchStart = (e, optionId, uniqueKey) => {
    e.preventDefault()
    const touch = e.touches[0]
    setTouchedItem(optionId)
    setTouchPosition({ x: touch.clientX, y: touch.clientY })
    setDraggedItem({ optionId, uniqueKey })
  }

  const handleTouchMove = (e) => {
    if (!touchedItem || !draggedItem) return
    e.preventDefault()
    
    const touch = e.touches[0]
    setTouchPosition({ x: touch.clientX, y: touch.clientY })
    
    // Find element under touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const dropZone = elementBelow?.closest('[data-drop-zone="true"]')
    
    if (dropZone) {
      const parameterId = dropZone.getAttribute('data-parameter-id')
      setDragOverParameter(parameterId)
    } else {
      setDragOverParameter(null)
    }
  }

  const handleTouchEnd = (e) => {
    if (!touchedItem || !draggedItem) return
    e.preventDefault()
    
    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const dropZone = elementBelow?.closest('[data-drop-zone="true"]')
    
    if (dropZone) {
      const parameterId = dropZone.getAttribute('data-parameter-id')
      if (parameterId) {
        // Simulate drop event
        const syntheticEvent = {
          preventDefault: () => {},
        }
        handleDrop(syntheticEvent, parameterId)
      }
    }
    
    // Cleanup
    setTouchedItem(null)
    setTouchPosition(null)
    setDraggedItem(null)
    setDragOverParameter(null)
  }

  const handleDrop = (e, parameterId) => {
    e.preventDefault()

    if (!draggedItem) return

    const { optionId, uniqueKey } = draggedItem

    let draggedOption
    for (const component of components) {
      for (const param of component.parameters) {
        const option = param.options.find((opt) => opt.id === optionId)
        if (option) {
          draggedOption = option
          break
        }
      }
      if (draggedOption) break
    }

    if (!draggedOption) return

    // Check if this is the correct parameter for the dragged option and parameter is not already filled
    const targetParam = components[0]?.parameters.find(param => param.id === parameterId)
    const isValidTarget = draggedOption.targetParameter === parameterId && 
                          draggedOption.isCorrect && 
                          !targetParam?.filled
    
    if (isValidTarget) {
      // Hide the dragged falling option by removing it from randomizedOptions
      setRandomizedOptions(prev => prev.filter(opt => opt.uniqueId !== uniqueKey))
      
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
      
      // Auto-select next unfilled parameter
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
    <div 
      className="min-h-screen flex flex-col touch-pan-y" 
      style={{ backgroundImage: 'url(/s03.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      onTouchMove={handleTouchMove}
    >
      <style jsx>{`
        .options-screen {
          position: relative;
          overflow: hidden;
        }
        
        @keyframes smoothFall {
          0% { 
            transform: translateY(-200px);
            opacity: 0;
          }
          3% { 
            opacity: 1;
          }
          97% { 
            opacity: 1;
          }
          100% { 
            transform: translateY(400px);
            opacity: 0;
          }
        }
        
        .falling-option {
          animation: smoothFall linear infinite;
          position: absolute;
          z-index: 10;
          opacity: 0;
          transform: translateY(-200px);
        }
        
        .falling-option:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
        
        .falling-option.dragging {
          opacity: 0.7;
          transform: scale(0.95);
        }
        
        .falling-option:active {
          transform: scale(0.98);
          opacity: 0.8;
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
        <div className=" mt-32">
          <div className="flex items-center mb-6">
            <div className="w-4 h-10 bg-[#C5D4E3] mr-10"></div>
            <div>
              {components[0] && (
                <h1 className="text-5xl font-light text-[#C5D4E3] font-sans">
                  {components[0].name}
                </h1>
              )}
              
            </div>
            
          </div>
          <h3 className="text-[#C5D4E3] ml-16 text-2xl font-sans font-light">Drag the right choice to the parameter slot.</h3>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left side - Options and Parameters */}
        <div className="flex-1 p-8 flex flex-col justify-between" style={{ width: '70%' }}>
          {/* Options Panel */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-white py-16 px-6 shadow-sm mb-8 flex-1 flex flex-col justify-center options-screen">
              <div className="relative w-full h-full">
                {randomizedOptions.length > 0 &&
                  randomizedOptions.map((option, index) => {
                    const horizontalPosition = option.randomPosition // Use random horizontal position
                    const verticalPosition = 15 // All start from same vertical position but different delays
                    
                    // Use the consistent background image and text color assigned to this option
                    const bgImage = option.assignedBgImage
                    const textColor = option.assignedTextColor
                    
                    return (
                      <div
                        key={`${option.id}-${index}`}
                        onDragStart={(e) => handleDragStart(e, option.id, option.uniqueId)}
                        onTouchStart={(e) => handleTouchStart(e, option.id, option.uniqueId)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        draggable
                        className={`falling-option cursor-grab transition-all duration-300 touch-manipulation select-none ${
                          wrongClick === option.uniqueId ? "bg-red-500 animate-pulse" : ""
                        } ${draggedItem?.uniqueKey === option.uniqueId ? "dragging" : ""}`}
                        style={{
                          width: '160px',
                          height: '160px',
                          backgroundImage: wrongClick === option.uniqueId ? 'none' : `url(${bgImage})`,
                          backgroundColor: wrongClick === option.uniqueId ? '#EF4444' : 'transparent',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          animationDelay: `${option.randomDelay}s`,
                          animationDuration: '6s',
                          left: `${horizontalPosition}%`,
                          top: `${verticalPosition}%`,
                          animationIterationCount: 'infinite'
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div 
                            className="flex items-center justify-center rounded-full"
                            style={{ 
                              width: '80px', // 50% of 160px radius (80px * 0.5 = 40px radius, 80px diameter)
                              height: '80px'
                            }}
                          >
                            <h4 className="text-sm font-light text-center font-sans px-2 leading-tight overflow-hidden" style={{ 
                              color: textColor,
                              fontSize: option.text.length > 15 ? '12px' : option.text.length > 10 ? '13px' : '14px',
                              lineHeight: '1.3',
                              wordBreak: 'keep-all'
                            }}>{option.text}</h4>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Parameters at bottom */}
          <div className="flex gap-3 justify-start overflow-hidden">
            {/* Timer Component */}
            <div 
              className="relative flex items-center justify-center flex-shrink-0"
              style={{ width: '200px', height: '180px' }}
            >
              <div 
                className="w-full h-full bg-center bg-cover flex items-center justify-center"
                style={{ backgroundImage: 'url(/timer.png)' }}
              >
                <div className="flex items-end justify-center">
                  <div className="text-7xl font-light text-[#1D2C3B] font-sans leading-none">
                    {elapsedTime}
                  </div>
                  <div className="text-4xl font-light text-[#1D2C3B] font-sans ml-1 pb-1">
                    s
                  </div>
                </div>
              </div>
            </div>
            
            {components[0]?.parameters.map((param) => (
              <div
                key={param.id}
                data-drop-zone="true"
                data-parameter-id={param.id}
                className={`transition-all duration-300 ease-in-out relative flex flex-row items-center justify-center transform touch-manipulation flex-shrink-0 ${
                  param.filled ? "scale-100 cursor-default" : "hover:scale-105 cursor-pointer"
                } ${
                  dragOverParameter === param.id ? "ring-4 ring-blue-400/50 scale-105 shadow-xl bg-blue-50/20 cursor-copy" : ""
                } ${
                  wrongDrop === param.id ? "ring-4 ring-red-500 bg-red-100/20 animate-bounce cursor-not-allowed" : ""
                }`}
                style={{ width: '204px', height: '179px' }}
                onDragOver={(e) => handleDragOver(e, param.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, param.id)}
                onClick={() => setSelectedParameter(param)}
              >
                <div className="relative w-full h-full">
                  {param.filled && droppedOptions[param.id] ? (
                    <div style={{ backgroundColor: '#C5D4E3' }} className="border border-blue-200 rounded-lg p-4 w-full h-full">
                      <div className="h-full flex flex-col justify-between">
                        <h4 className="text-3xl font-light text-left font-sans">{droppedOptions[param.id].text}</h4>
                        <div className="w-8 h-1 bg-slate-800"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={getParameterImage(param.name, isParameterActive(param, components[0]?.parameters || []))}
                        alt={param.name}
                        className="w-full h-full object-cover"
                      />
                      {dragOverParameter === param.id && draggedItem && (
                        <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                          <img
                            src={getParameterImage(param.name, true)}
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
        <div className="p-8 relative overflow-hidden" style={{ width: '30%' }}>
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
                    width: '260px',
                    height: '232px',
                    bottom: stackPosition >= 0 ? `${stackPosition * 84}px` : '0px',
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
                    className="w-full h-full"
                  />
                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* Touch Drag Indicator */}
      {touchedItem && touchPosition && (
        <div
          className="fixed pointer-events-none z-50 shadow-2xl transform -translate-x-1/2 -translate-y-1/2 opacity-90"
          style={{
            left: touchPosition.x,
            top: touchPosition.y,
            width: '160px',
            height: '160px',
            backgroundImage: `url(${randomizedOptions.find(opt => opt.id === touchedItem)?.assignedBgImage || '/optionsbg/bg1.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="h-full flex items-center justify-center">
            <div 
              className="flex items-center justify-center rounded-full"
              style={{ 
                width: '80px', // 50% of 160px radius (80px * 0.5 = 40px radius, 80px diameter)
                height: '80px'
              }}
            >
              <div className="text-center text-sm font-bold px-2 leading-tight overflow-hidden" style={{ 
                color: randomizedOptions.find(opt => opt.id === touchedItem)?.assignedTextColor || '#80AEEE',
                fontSize: (randomizedOptions.find(opt => opt.id === touchedItem)?.text?.length || 0) > 15 ? '12px' : (randomizedOptions.find(opt => opt.id === touchedItem)?.text?.length || 0) > 10 ? '13px' : '14px',
                lineHeight: '1.3',
                wordBreak: 'keep-all'
              }}>
                {randomizedOptions.find(opt => opt.id === touchedItem)?.text || 'Dragging...'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StackBuilder