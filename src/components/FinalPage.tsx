import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Home } from 'lucide-react';
import { UserInfo } from '../App';
import { getStackComponentsForDocument } from '../utils/stackData';

interface FinalPageProps {
  userInfo: UserInfo;
  selectedDocument?: { id: string } | null;
  onHome?: () => void;
}

const FinalPage: React.FC<FinalPageProps> = ({ userInfo, selectedDocument, onHome }) => {
  const [expandedOption, setExpandedOption] = useState<number | null>(null);

  const getCorrectOptions = () => {
    if (!selectedDocument) return [];
    
    const components = getStackComponentsForDocument(selectedDocument.id);
    if (components.length === 0) return [];
    
    return components[0].parameters.map(param => ({
      name: param.name,
      correctOption: param.acceptedOption
    }));
  };

  const correctOptions = getCorrectOptions();

  const toggleDropdown = (index: number) => {
    setExpandedOption(expandedOption === index ? null : index);
  };

  const getOptionDescription = (optionName: string) => {
    const descriptions: { [key: string]: string } = {
      "Dell Pro AI PC": "Advanced AI-ready personal computer designed for productivity workflows with built-in AI acceleration and enhanced processing power.",
      "Microsoft 365 Copilot": "AI-powered productivity assistant integrated across Microsoft Office applications, helping automate tasks and enhance collaboration.",
      "Dell AI Readiness Assessment": "Comprehensive evaluation service to determine your organization's readiness for AI implementation and provide strategic recommendations.",
      "Trend Micro AI Security": "Advanced AI-driven cybersecurity solution that provides real-time threat detection and automated response capabilities.",
      "Dell Edge Gateway": "Industrial IoT gateway solution enabling secure edge computing and data processing at the network edge.",
      "PowerEdge XE-Series": "High-performance edge servers optimized for harsh environments and AI workloads at the network edge.",
      "Dell AI Factory with NVIDIA": "Complete AI infrastructure solution combining Dell hardware with NVIDIA accelerated computing for enterprise AI development.",
      "Hardware-Level Security": "Built-in security features at the hardware level providing root of trust and protection against firmware attacks.",
      "Dell Pro Max AI PC": "Premium AI-enabled workstation with maximum performance capabilities for demanding AI and machine learning workloads.",
      "Dell Pro AI Studio": "Integrated development environment and toolkit for AI application development and deployment.",
      "Dell Professional Services for AI": "Expert consulting and implementation services to help organizations successfully deploy AI solutions.",
      "Data Governance Toolkit": "Comprehensive set of tools and policies for managing data quality, compliance, and governance in AI initiatives.",
      "Streaming Analytics at Edge": "Real-time data processing and analytics capabilities deployed at edge locations for immediate insights.",
      "Dell Pro Max with Blackwell GPUs": "Ultra-high performance computing solution featuring the latest NVIDIA Blackwell GPU architecture for advanced AI workloads.",
      "AI Threat Detection Suite": "Advanced security platform using AI and machine learning to identify and respond to cybersecurity threats in real-time.",
      "Dell Managed AI Ops": "Fully managed AI operations service providing end-to-end management of AI infrastructure and applications.",
      "Cyber Recovery Vault": "Isolated and secure data recovery solution designed to protect against ransomware and ensure business continuity.",
      "Edge Inferencing Kit": "Complete hardware and software solution for deploying AI inference capabilities at edge locations.",
      "McAfee AI Endpoint Protection": "AI-powered endpoint security solution providing advanced threat protection and behavioral analysis.",
      "APEX Flex on Demand": "Flexible consumption model for IT infrastructure allowing organizations to scale resources based on actual usage.",
      "Dell Precision AI-Ready Workstation": "Professional workstation optimized for AI development with certified drivers and enhanced compute capabilities.",
      "NVIDIA AI Enterprise": "Enterprise-grade AI software suite providing tools and frameworks for developing and deploying AI applications.",
      "Dell Accelerator Services for RAG": "Specialized services for implementing Retrieval-Augmented Generation AI systems and applications.",
      "Dell AI Data Platform & Data Lakehouse": "Unified data platform combining data lake and warehouse capabilities optimized for AI workloads.",
      "AI Orchestration, Management, and Automation": "Platform for managing and orchestrating AI workflows, models, and infrastructure at enterprise scale.",
      "Orchestration, Cluster Automation": "Automated management and orchestration of computing clusters for efficient resource utilization.",
      "Professional and Managed AI Services": "Comprehensive professional services including consulting, implementation, and ongoing management of AI solutions.",
      "Data Platform Protection": "Security solutions specifically designed to protect data platforms and ensure data integrity in AI environments.",
      "Network Security & Compliance Framework": "Comprehensive security framework ensuring network protection and regulatory compliance for AI deployments."
    };
    return descriptions[optionName] || "Detailed information about this solution is coming soon.";
  };

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center bg-no-repeat relative overflow-hidden" // Added overflow-hidden to the root
      style={{
        backgroundImage: 'url(/s05.png)'
      }}
    >
      <div className="h-full flex justify-end relative">
        <div className="fixed bottom-32 left-24"> {/* Changed to fixed */}
          <img 
            src="/frame.png" 
            alt="Frame" 
            className="w-auto h-auto"
          />
          <div className="flex mt-36 -ml-4">
            <button
              onClick={onHome}
              className="flex items-center justify-center bg-[#1D2C3B] text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ width: '287px', height: '58px' }}
            >
              <span className="font-medium">Home</span>
            </button>
          </div>
        </div>
        
        {/* Right side container */}
        <div className="w-2/5 p-8 flex flex-col justify-center">
          <div className="ml-20 mr-20">
            <h1 className="text-4xl mb-8 text-white mt-28">Your chosen AI stack is powered by these solutions.</h1>
            
            {/* Scrollable container for the blocks */}
            {/* Adjusted max-h-screen to ensure it takes full available height if needed */}
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] pr-4"> 
              {correctOptions.map((option, index) => (
                <div 
                  key={index}
                  className="p-4 relative" // Kept relative for dropdown content
                  style={{ backgroundColor: '#C5D4E3' }}
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    <p className="text-slate-800 text-lg">
                      {option.correctOption}
                    </p>
                    {expandedOption === index ? (
                      <ChevronUp className="w-5 h-5 text-slate-800" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-800" />
                    )}
                  </div>
                  {expandedOption === index && (
                    <div className="mt-3"> {/* Removed absolute positioning */}
                      <p className="text-slate-800 leading-relaxed">
                        {getOptionDescription(option.correctOption)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPage;