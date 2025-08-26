export interface DragOption {
  id: string;
  text: string;
  isCorrect: boolean;
  targetParameter: string;
  documentType: string;
}

export interface Parameter {
  id: string;
  name: string;
  acceptedOption: string;
  filled: boolean;
  options: DragOption[];
}

export interface StackComponent {
  id: string;
  name: string;
  description: string;
  icon: string;
  parameters: Parameter[];
}

const allDragOptions: DragOption[] = [
  // Hardware options
  { id: 'opt-1', text: 'Dell Pro AI PC', isCorrect: true, targetParameter: 'hardware', documentType: 'button-1' },
  { id: 'opt-2', text: 'Dell Precision AI-Ready Workstation', isCorrect: false, targetParameter: 'hardware', documentType: 'button-1' },
  { id: 'opt-3', text: 'Dell Pro Max with Blackwell GPUs', isCorrect: false, targetParameter: 'hardware', documentType: 'button-1' },

  // Software & AI Platforms options
  { id: 'opt-4', text: 'Microsoft 365 Copilot', isCorrect: true, targetParameter: 'software-ai', documentType: 'button-1' },
  { id: 'opt-5', text: 'NVIDIA AI Enterprise', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-1' },
  { id: 'opt-6', text: 'AI Threat Detection Suite', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-1' },

  // AI Services options
  { id: 'opt-7', text: 'Dell AI Readiness Assessment', isCorrect: true, targetParameter: 'ai-services', documentType: 'button-1' },
  { id: 'opt-8', text: 'Dell Accelerator Services for RAG', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-1' },
  { id: 'opt-9', text: 'Dell Managed AI Ops', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-1' },

  // Security & Governance options
  { id: 'opt-10', text: 'Trend Micro AI Security', isCorrect: true, targetParameter: 'security', documentType: 'button-1' },
  { id: 'opt-11', text: 'Cyber Recovery Vault', isCorrect: false, targetParameter: 'security', documentType: 'button-1' },
  { id: 'opt-12', text: 'Data Governance Toolkit', isCorrect: false, targetParameter: 'security', documentType: 'button-1' },

  // Edge / Deployment Tools options
  { id: 'opt-13', text: 'Dell Edge Gateway', isCorrect: true, targetParameter: 'edge-deployment', documentType: 'button-1' },
  { id: 'opt-14', text: 'Streaming Analytics at Edge', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-1' },
  { id: 'opt-15', text: 'Edge Inferencing Kit', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-1' },

  // Button-2 options
  { id: 'opt-16', text: 'PowerEdge XE-Series', isCorrect: true, targetParameter: 'hardware', documentType: 'button-2' },
  { id: 'opt-17', text: 'PowerEdge R-Series', isCorrect: false, targetParameter: 'hardware', documentType: 'button-2' },
  { id: 'opt-18', text: 'PowerEdge XR-Series', isCorrect: false, targetParameter: 'hardware', documentType: 'button-2' },
  { id: 'opt-19', text: 'Dell AI Factory with NVIDIA', isCorrect: true, targetParameter: 'software-ai', documentType: 'button-2' },
  { id: 'opt-20', text: 'Dell AI Data Platform & Data Lakehouse', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-2' },
  { id: 'opt-21', text: 'AI Orchestration, Management, and Automation', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-2' },
  { id: 'opt-22', text: 'Dell AI Readiness Assessment', isCorrect: true, targetParameter: 'ai-services', documentType: 'button-2' },
  { id: 'opt-23', text: 'Orchestration, Cluster Automation', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-2' },
  { id: 'opt-24', text: 'Professional and Managed AI Services', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-2' },
  { id: 'opt-25', text: 'Hardware-Level Security', isCorrect: true, targetParameter: 'security', documentType: 'button-2' },
  { id: 'opt-26', text: 'Data Platform Protection', isCorrect: false, targetParameter: 'security', documentType: 'button-2' },
  { id: 'opt-27', text: 'Network Security & Compliance Framework', isCorrect: false, targetParameter: 'security', documentType: 'button-2' },

  // Button-3 options
  { id: 'opt-31', text: 'Dell Pro Max AI PC', isCorrect: true, targetParameter: 'hardware', documentType: 'button-3' },
  { id: 'opt-32', text: 'Dell Precision AI-Ready Workstation', isCorrect: false, targetParameter: 'hardware', documentType: 'button-3' },
  { id: 'opt-33', text: 'Dell Pro AI PC', isCorrect: false, targetParameter: 'hardware', documentType: 'button-3' },
  { id: 'opt-34', text: 'Dell Pro AI Studio', isCorrect: true, targetParameter: 'software-ai', documentType: 'button-3' },
  { id: 'opt-35', text: 'Microsoft 365 Copilot', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-3' },
  { id: 'opt-36', text: 'NVIDIA AI Enterprise', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-3' },
  { id: 'opt-37', text: 'Dell Professional Services for AI', isCorrect: true, targetParameter: 'ai-services', documentType: 'button-3' },
  { id: 'opt-38', text: 'Dell AI Readiness Assessment', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-3' },
  { id: 'opt-39', text: 'Dell Accelerator Services for RAG', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-3' },
  { id: 'opt-40', text: 'Data Governance Toolkit', isCorrect: true, targetParameter: 'security', documentType: 'button-3' },
  { id: 'opt-41', text: 'Trend Micro AI Security', isCorrect: false, targetParameter: 'security', documentType: 'button-3' },
  { id: 'opt-42', text: 'Cyber Recovery Vault', isCorrect: false, targetParameter: 'security', documentType: 'button-3' },
  { id: 'opt-43', text: 'Streaming Analytics at Edge', isCorrect: true, targetParameter: 'edge-deployment', documentType: 'button-3' },
  { id: 'opt-44', text: 'Edge Inferencing Kit', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-3' },
  { id: 'opt-45', text: 'Dell Edge Gateway', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-3' },

  // Button-4 options
  { id: 'opt-46', text: 'Dell Pro Max with Blackwell GPUs', isCorrect: true, targetParameter: 'hardware', documentType: 'button-4' },
  { id: 'opt-47', text: 'Dell Pro AI PC', isCorrect: false, targetParameter: 'hardware', documentType: 'button-4' },
  { id: 'opt-48', text: 'Dell Precision AI-Ready Workstation', isCorrect: false, targetParameter: 'hardware', documentType: 'button-4' },
  { id: 'opt-49', text: 'AI Threat Detection Suite', isCorrect: true, targetParameter: 'software-ai', documentType: 'button-4' },
  { id: 'opt-50', text: 'Microsoft 365 Copilot', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-4' },
  { id: 'opt-51', text: 'NVIDIA AI Enterprise', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-4' },
  { id: 'opt-52', text: 'Dell Managed AI Ops', isCorrect: true, targetParameter: 'ai-services', documentType: 'button-4' },
  { id: 'opt-53', text: 'Dell AI Readiness Assessment', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-4' },
  { id: 'opt-54', text: 'Dell Professional Services for AI', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-4' },
  { id: 'opt-55', text: 'Cyber Recovery Vault', isCorrect: true, targetParameter: 'security', documentType: 'button-4' },
  { id: 'opt-56', text: 'Data Governance Toolkit', isCorrect: false, targetParameter: 'security', documentType: 'button-4' },
  { id: 'opt-57', text: 'Trend Micro AI Security', isCorrect: false, targetParameter: 'security', documentType: 'button-4' },
  { id: 'opt-58', text: 'Edge Inferencing Kit', isCorrect: true, targetParameter: 'edge-deployment', documentType: 'button-4' },
  { id: 'opt-59', text: 'Streaming Analytics at Edge', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-4' },
  { id: 'opt-60', text: 'Dell Edge Gateway', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-4' },

  // Button-5 options
  { id: 'opt-61', text: 'Dell Pro AI PC', isCorrect: true, targetParameter: 'hardware', documentType: 'button-5' },
  { id: 'opt-62', text: 'Dell Pro Max AI PC', isCorrect: false, targetParameter: 'hardware', documentType: 'button-5' },
  { id: 'opt-63', text: 'Dell Precision AI-Ready Workstation', isCorrect: false, targetParameter: 'hardware', documentType: 'button-5' },
  { id: 'opt-64', text: 'Microsoft 365 Copilot', isCorrect: true, targetParameter: 'software-ai', documentType: 'button-5' },
  { id: 'opt-65', text: 'NVIDIA AI Enterprise', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-5' },
  { id: 'opt-66', text: 'AI Threat Detection Suite', isCorrect: false, targetParameter: 'software-ai', documentType: 'button-5' },
  { id: 'opt-67', text: 'Dell AI Readiness Assessment', isCorrect: true, targetParameter: 'ai-services', documentType: 'button-5' },
  { id: 'opt-68', text: 'Dell Managed AI Ops', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-5' },
  { id: 'opt-69', text: 'Dell Accelerator Services for RAG', isCorrect: false, targetParameter: 'ai-services', documentType: 'button-5' },
  { id: 'opt-70', text: 'McAfee AI Endpoint Protection', isCorrect: true, targetParameter: 'security', documentType: 'button-5' },
  { id: 'opt-71', text: 'Trend Micro AI Security', isCorrect: false, targetParameter: 'security', documentType: 'button-5' },
  { id: 'opt-72', text: 'Cyber Recovery Vault', isCorrect: false, targetParameter: 'security', documentType: 'button-5' },
  { id: 'opt-73', text: 'Dell Edge Gateway', isCorrect: true, targetParameter: 'edge-deployment', documentType: 'button-5' },
  { id: 'opt-74', text: 'APEX Flex on Demand', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-5' },
  { id: 'opt-75', text: 'Edge Inferencing Kit', isCorrect: false, targetParameter: 'edge-deployment', documentType: 'button-5' },
];

const stackComponentConfigs: { [key: string]: StackComponent } = {
  'button-1': {
    id: 'productivity-collab',
    name: 'Enhance Productivity & Collaboration',
    description: 'Configure your Dell AI Stack for Enhanced Productivity & Collaboration',
    icon: '',
    parameters: [
      { id: 'hardware', name: 'Hardware', acceptedOption: 'Dell Pro AI PC', filled: false, options: [] },
      { id: 'software-ai', name: 'Software & AI Platforms', acceptedOption: 'Microsoft 365 Copilot', filled: false, options: [] },
      { id: 'ai-services', name: 'AI Services', acceptedOption: 'Dell AI Readiness Assessment', filled: false, options: [] },
      { id: 'security', name: 'Security & Governance', acceptedOption: 'Trend Micro AI Security', filled: false, options: [] },
      { id: 'edge-deployment', name: 'Edge / Deployment Tools', acceptedOption: 'Dell Edge Gateway', filled: false, options: [] },
    ]
  },
  'button-2': {
    id: 'ai-model-dev',
    name: 'Enable AI Model Development',
    description: 'Configure your Dell AI Stack for AI Model Development',
    icon: '',
    parameters: [
      { id: 'hardware', name: 'Hardware', acceptedOption: 'PowerEdge XE-Series', filled: false, options: [] },
      { id: 'software-ai', name: 'Software & AI Platforms', acceptedOption: 'Dell AI Factory with NVIDIA', filled: false, options: [] },
      { id: 'ai-services', name: 'AI Services', acceptedOption: 'Dell AI Readiness Assessment', filled: false, options: [] },
      { id: 'security', name: 'Security & Governance', acceptedOption: 'Hardware-Level Security', filled: false, options: [] },
    ]
  },
  'button-3': {
    id: 'decision-making',
    name: 'Optimize Decision-Making',
    description: 'Configure your Dell AI Stack for Decision-Making Optimization',
    icon: '',
    parameters: [
      { id: 'hardware', name: 'Hardware', acceptedOption: 'Dell Pro Max AI PC', filled: false, options: [] },
      { id: 'software-ai', name: 'Software & AI Platforms', acceptedOption: 'Dell Pro AI Studio', filled: false, options: [] },
      { id: 'ai-services', name: 'AI Services', acceptedOption: 'Dell Professional Services for AI', filled: false, options: [] },
      { id: 'security', name: 'Security & Governance', acceptedOption: 'Data Governance Toolkit', filled: false, options: [] },
      { id: 'edge-deployment', name: 'Edge / Deployment Tools', acceptedOption: 'Streaming Analytics at Edge', filled: false, options: [] },
    ]
  },
  'button-4': {
    id: 'security-governance',
    name: 'Strengthen Security & Governance',
    description: 'Configure your Dell AI Stack for Security & Governance',
    icon: '',
    parameters: [
      { id: 'hardware', name: 'Hardware', acceptedOption: 'Dell Pro Max with Blackwell GPUs', filled: false, options: [] },
      { id: 'software-ai', name: 'Software & AI Platforms', acceptedOption: 'AI Threat Detection Suite', filled: false, options: [] },
      { id: 'ai-services', name: 'AI Services', acceptedOption: 'Dell Managed AI Ops', filled: false, options: [] },
      { id: 'security', name: 'Security & Governance', acceptedOption: 'Cyber Recovery Vault', filled: false, options: [] },
      { id: 'edge-deployment', name: 'Edge / Deployment Tools', acceptedOption: 'Edge Inferencing Kit', filled: false, options: [] },
    ]
  },
  'button-5': {
    id: 'remote-hybrid',
    name: 'Empower Remote & Hybrid Work',
    description: 'Configure your Dell AI Stack for Remote & Hybrid Work',
    icon: '',
    parameters: [
      { id: 'hardware', name: 'Hardware', acceptedOption: 'Dell Pro AI PC', filled: false, options: [] },
      { id: 'software-ai', name: 'Software & AI Platforms', acceptedOption: 'Microsoft 365 Copilot', filled: false, options: [] },
      { id: 'ai-services', name: 'AI Services', acceptedOption: 'Dell AI Readiness Assessment', filled: false, options: [] },
      { id: 'security', name: 'Security & Governance', acceptedOption: 'McAfee AI Endpoint Protection', filled: false, options: [] },
      { id: 'edge-deployment', name: 'Edge / Deployment Tools', acceptedOption: 'Dell Edge Gateway', filled: false, options: [] },
    ]
  }
};

export const stackComponents: StackComponent[] = [
  stackComponentConfigs['button-1'] // Default fallback
];

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getStackComponentsForDocument = (documentType: string): StackComponent[] => {
  const filteredOptions = allDragOptions.filter(option => option.documentType === documentType);
  const componentConfig = stackComponentConfigs[documentType];
  
  if (!componentConfig) {
    console.warn(`No configuration found for document type: ${documentType}`);
    return [];
  }

  return [{
    ...componentConfig,
    parameters: componentConfig.parameters
      .map(param => ({
        ...param,
        options: shuffleArray(filteredOptions.filter(option => option.targetParameter === param.id))
      }))
      .filter(param => param.options.length > 0) // Only include parameters that have options
  }];
};