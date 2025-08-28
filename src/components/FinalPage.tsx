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
      "Dell Pro AI PC": "A sleek, AI-optimized workstation built for hybrid and remote work. Powered by on-chip AI, it enhances multitasking, offers smart video conferencing features, and optimizes workflows with AI-assisted task handling—all while maintaining enterprise-grade security and manageability.",
      "Microsoft 365 Copilot": "Integrated directly into the Microsoft 365 suite, Copilot brings AI-enhanced productivity to apps like Word, Excel, Teams, and PowerPoint. It helps automate content creation, generate insightful summaries, and foster smarter collaboration across your organization.",
      "Dell AI Readiness Assessment": "A structured diagnostic to assess your organization's preparedness for AI adoption. It identifies quick-win use cases, highlights capability gaps, and develops a roadmap that accelerates AI implementation with minimal disruption.",
      "Trend Micro AI Security": "A robust, AI-driven security suite that protects collaboration platforms and data exchanges from threats in real time. It ensures safe, uninterrupted productivity—especially critical in hybrid work environments.",
      "Dell Edge Gateway": "Enables real-time data processing and secure AI-enabled applications at the network edge. Ideal for supporting distributed teams and ensuring low-latency collaboration—even in remote or bandwidth-limited environments.",
      "PowerEdge XE-Series": "High-performance edge servers optimized for harsh environments and AI workloads at the network edge.",
      "Dell AI Factory with NVIDIA": "Complete AI infrastructure solution combining Dell hardware with NVIDIA accelerated computing for enterprise AI development.",
      "Hardware-Level Security": "Built-in security features at the hardware level providing root of trust and protection against firmware attacks.",
      "Dell Pro Max AI PC": "A high-performance AI PC designed for analytics-heavy workflows. It accelerates data insights with powerful processing and robust AI-assisted decision support.",
      "Dell Pro AI Studio": "An all-in-one development environment for AI workflows on Dell PCs. It brings pre-configured tools, frameworks, and models to your desktop—streamlining AI experimentation and deployment.",
      "Dell Professional Services for AI": "Strategic consulting to custom-build AI solutions tailored to your business objectives. Dell's experts guide implementation, from ideation to deployment and optimization.",
      "Data Governance Toolkit": "Tools and frameworks that ensure AI-driven decisions comply with governance standards and ethical guidelines. It embeds control and transparency into your AI workflows.",
      "Streaming Analytics at Edge": "Analytics platform optimized for processing real-time data at the edge. Enables faster, contextual decision-making by analyzing insights where data is generated.",
      "Dell Pro Max with Blackwell GPUs": "A powerhouse desktop designed for AI workloads, built around NVIDIA's Blackwell architecture. It delivers accelerated AI inference and threat analytics with unmatched performance.",
      "AI Threat Detection Suite": "AI-augmented software to detect anomalies and security threats proactively. It adds a smart, responsive layer to traditional IT defense systems.",
      "Dell Managed AI Ops": "Continuous monitoring, optimization, and orchestration of AI pipelines to ensure both performance and security. It abstracts the complexity of running AI at scale.",
      "Cyber Recovery Vault": "Secure, isolated backup architecture—ideal for protection against ransomware and data loss risks. Ensures rapid recovery without compromising AI system integrity.",
      "Edge Inferencing Kit": "A toolkit optimized for deploying AI inference at the network edge—enabling instant threat response in connected environments like retail, manufacturing, or remote sites.",
      "McAfee AI Endpoint Protection": "AI-powered endpoint protection securing remote and hybrid devices against evolving threats.",
      "APEX Flex on Demand": "A flexible infrastructure service offering pay-per-use access to AI workloads. It allows scaling compute resources up or down dynamically—perfect for variable training needs."
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
              <span className="font-large">Home</span>
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
                    <p className="text-slate-800 text-xl">
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