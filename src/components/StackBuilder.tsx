"use client"

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

  useEffect(() => {
    if (selectedDocument) {
      const initialComponents = getStackComponentsForDocument(selectedDocument.id)
      setComponents(initialComponents)

      // Calculate total parameters based on available options
      const totalParams = initialComponents.reduce((count, component) => {
        return count + component.parameters.length
      }, 0)
      setTotalParameters(totalParams)
    }
  }, [selectedDocument])

  useEffect(() => {
    const filledCount = components.reduce((count, component) => {
      return count + component.parameters.filter((param) => param.filled).length
    }, 0)
    setTotalFilled(filledCount)

    if (filledCount === totalParameters && totalParameters > 0) {
      setTimeout(() => onNext(), 1000)
    }
  }, [components, onNext, totalParameters])

  const handleDragStart = (e: React.DragEvent, optionId: string) => {
    setDraggedItem(optionId)
    e.dataTransfer.effectAllowed = "move"
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
      // Update the component parameter
      setComponents((prev) =>
        prev.map((component) => ({
          ...component,
          parameters: component.parameters.map((param) =>
            param.id === parameterId ? { ...param, filled: true } : param,
          ),
        })),
      )
      setSelectedParameter(null) // Hide the options block after a successful drop
    }

    setDraggedItem(null)
    setDragOverParameter(null)
  }

  const progress = totalParameters > 0 ? (totalFilled / totalParameters) * 100 : 0

  if (!selectedDocument) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-gray-100 p-8">
        {/* Dell Technologies Header */}
        <div className="mb-20 mt-40">
          <div className="flex items-center mb-6">
            <div className="w-5 h-40 bg-slate-800 mr-10"></div>
            <div>
              <h1 className="text-7xl font-light text-slate-800 mb-2">Enhance Productivity</h1>
              <h1 className="text-7xl font-light text-slate-800">& Collaboration</h1>
            </div>
          </div>
        </div>

        {/* Hardware Section */}
        <div className="mb-8">
          <h2 className="text-6xl font-semibold text-slate-800 mb-20">Hardware</h2>

          {/* Options Panel */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-slate-800 mr-4"></div>
              <h3 className="text-lg font-medium text-slate-700">Select the right solution for your stack</h3>
            </div>

            {/* Hardware Options Cards */}
            <div className="grid grid-cols-3 gap-4">
              {selectedParameter &&
                selectedParameter.options.map((option) => (
                  <div
                    key={option.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, option.id)}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-move hover:bg-blue-100 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="text-center">
                      <div className="mb-3">
                        <img
                          src={draggedItem === option.id ? getAfterImage(selectedParameter.name) : getBeforeImage(selectedParameter.name)}
                          className="w-12 h-12 mx-auto"
                        />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">{option.text}</h4>
                      <div className="w-8 h-1 bg-slate-800 mx-auto"></div>
                    </div>
                  </div>
                ))}

              {/* Default hardware options when no parameter selected */}
              {!selectedParameter && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="mb-3">
                        <img src="/hardwarebefore.png" alt="Dell Pro AI PC" className="w-12 h-12 mx-auto" />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Dell Pro AI PC</h4>
                      <div className="w-8 h-1 bg-slate-800 mx-auto"></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="mb-3">
                        <img src="/hardwarebefore.png" alt="Dell Precision AI-Ready" className="w-12 h-12 mx-auto" />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Dell Precision AI-Ready Workstation</h4>
                      <div className="w-8 h-1 bg-slate-800 mx-auto"></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="mb-3">
                        <img src="/hardwarebefore.png" alt="Dell Pro Max" className="w-12 h-12 mx-auto" />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Dell Pro Max with Blackwell GPUs</h4>
                      <div className="w-8 h-1 bg-slate-800 mx-auto"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-slate-800 p-8 relative">
        {/* Decorative arc in top right */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M 200 0 A 100 100 0 0 1 100 100 L 200 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-white text-xl font-light mb-2">Drag and drop the correct components into each</h2>
            <h2 className="text-white text-xl font-light">category to assemble your optimal AI Stack</h2>
          </div>

          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            {components[0]?.parameters.map((param) => (
              <div
                key={param.id}
                className={`transition-all duration-200 cursor-pointer relative flex flex-row items-center justify-center border-2 border-dashed rounded-lg p-6 min-h-[120px] ${
                  param.filled ? "border-green-400 bg-green-900/20" : "border-slate-500 hover:border-blue-400"
                } ${selectedParameter?.id === param.id ? "border-blue-400 ring-2 ring-blue-400/30" : ""} ${
                  dragOverParameter === param.id ? "ring-4 ring-blue-400/50 border-blue-400" : ""
                }`}
                onDragOver={(e) => handleDragOver(e, param.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, param.id)}
                onClick={() => setSelectedParameter(param)}
              >
                <div className="text-center">
                  <div className="mb-3 relative">
                    <img
                      src={param.filled ? getAfterImage(param.name) : getBeforeImage(param.name)}
                      alt={param.name}
                      className="w-12 h-12 mx-auto opacity-60"
                    />
                    {dragOverParameter === param.id && draggedItem && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={getAfterImage(param.name)}
                          alt={param.name}
                          className="w-12 h-12 mx-auto opacity-80 animate-pulse"
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-white text-sm">
                    <span className="block font-medium">Drag {param.name}</span>
                    <span className="block text-slate-300">here</span>
                  </div>
                  {param.filled && (
                    <div className="mt-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Congratulations Modal */}
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
  )
}

export default StackBuilder
