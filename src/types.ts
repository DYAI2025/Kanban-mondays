export type WorkshopStatus = 'draft' | 'internal_review' | 'internal_approved' | 'sales_ready' | 'published';

export type MaturityScoreCategory = 
  | 'outcome' 
  | 'audience' 
  | 'scope' 
  | 'format' 
  | 'delivery' 
  | 'methods' 
  | 'deliverables' 
  | 'prework' 
  | 'ai' 
  | 'portfolio' 
  | 'sales' 
  | 'scalability';

export interface CategoryScore {
  score: number; // 0-100
  status: 'red' | 'yellow' | 'green';
  reason: string;
  nextStep: string;
}

export interface MaturityEvaluation {
  categoryScores: Record<MaturityScoreCategory, CategoryScore>;
  overallScore: number;
  familyFitScore: number;
  publishingReadiness: number;
  assetReadiness: number;
  redFlags: string[];
}

export interface AgendaBlock {
  id: string;
  title: string;
  duration: string;
  goal: string;
  output: string;
  isOptional: boolean;
  type: 'fundamentals' | 'experience' | 'application' | 'close';
}

export interface AgendaDay {
  id: string;
  blocks: AgendaBlock[];
}

export interface Workshop {
  id: string;
  name: string;
  familyId: string;
  role: string;
  status: WorkshopStatus;
  version: string;
  summary: string;
  description: string;
  
  // High-level product logic
  day3Outcome: {
    capabilities: string[];
    artifacts: string[];
    decisions: string[];
    notIncluded: string[];
    successCriteria: string[]; // Added
  };
  
  audienceFit: {
    primary: string[];
    nonFit: string[];
    minReadiness: string;
    exclusionCriteria: string[];
  };
  
  scope: {
    inScope: string[];
    outOfScope: string[];
    falseAssumptions: string[];
    boundaryStrength: number;
  };
  
  format: {
    durationOnsite: string;
    durationRemote: string;
    groupSize: string;
    deliveryModes: string[];
    constraints: string[];
  };
  
  agenda: AgendaDay[];
  
  methods: {
    signatureMethods: string[];
    replaceableMethods: string[];
    experientialAnchor: string;
    nonNegotiables: string[];
  };
  
  deliverables: {
    teamArtifacts: string[];
    handoverDocs: string[];
    internalAssets: string[];
    followOnTransitions: string[];
  };
  
  preWork: {
    discovery: string;
    inputs: string[];
    noHomeworkPolicy: boolean;
    interviews: string[];
  };
  
  aiLayer: {
    backstageAi: string[];
    clientVisibleAi: string[];
    excludedAi: string[];
  };
  
  followOnLogic: {
    addOns: string[];
    followOnProducts: string[];
    retainerOptions: string[];
    upgradePaths: string[];
  };
  
  maturityScores: MaturityEvaluation;
  assets: string[]; // IDs of related assets
  lastModified: string;
}

export interface Family {
  id: string;
  name: string;
  description: string;
  referenceWorkshopId: string;
  benchmarkDimensions: string[];
  rules: string[];
}

export interface Asset {
  id: string;
  workshopId: string;
  type: 'infosheet' | 'onepager' | 'proposal' | 'brief' | 'handover';
  status: 'draft' | 'reviewed' | 'approved' | 'published';
  content: string;
  template: string;
  createdAt: string;
}
