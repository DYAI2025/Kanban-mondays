import { Workshop, Family } from './types';

export const DEFAULT_FAMILY: Family = {
  id: 'monday-ready',
  name: 'Monday-Ready Framework Kickoffs',
  description: 'Operational Framework Kickoffs that bring a team into a work-ready state in a short time. Focus on Day-3 applicability.',
  referenceWorkshopId: 'kanban-kickoff-ref',
  benchmarkDimensions: [
    'Outcome Clarity',
    'Audience Fit',
    'Scope Boundaries',
    'Delivery Architecture',
    'Signature Methods',
    'Portfolio Connectivity'
  ],
  rules: [
    'No Day-3 Outcome -> Red Flag',
    'No visible artifacts -> Red Flag',
    'No non-fit audience defined -> Yellow Flag',
    'No out-of-scope list -> Red Flag'
  ]
};

export const REFERENCE_WORKSHOP: Workshop = {
  id: 'kanban-kickoff-ref',
  name: 'Kanban Kickoff',
  familyId: 'monday-ready',
  role: 'Reference Model / Gold Standard',
  status: 'published',
  version: '2.1',
  summary: 'The ultimate kickoff to get any team started with Kanban. Focused on immediate flow and system design.',
  description: 'This is the Gold Standard workshop for introducing flow-based systems. It covers the core mechanics of Kanban while ensuring teams walk away with a functional board design and team agreements.',
  day3Outcome: {
    capabilities: [
      'Team can visualize their work',
      'Team can manage flow using WIP limits',
      'Team can hold meaningful standups'
    ],
    artifacts: [
      'Visualized Kanban Board',
      'WIP Limit Agreements',
      'Class of Service definitions'
    ],
    decisions: [
      'Ready and Done criteria',
      'Cadence of meetings',
      'Metric priorities'
    ],
    notIncluded: [
      'Full Agile Transformation',
      'Technical Tool Training'
    ],
    successCriteria: [
      'Team has a defined board design and WIP limits',
      'Positive feedback on the "penny game" simulation',
      'First backlog items are mapped to the new board'
    ]
  },
  audienceFit: {
    primary: ['New Teams', 'Teams with high WIP', 'Leadership wishing to visualize flow'],
    nonFit: ['Solo practitioners', 'Teams with no shared purpose'],
    minReadiness: 'Shared backlog of tasks',
    exclusionCriteria: ['No willingness to change process']
  },
  scope: {
    inScope: ['System Design', 'Flow Basics', 'Metrics Intro'],
    outOfScope: ['Advanced Statistics', 'Tool implementation'],
    falseAssumptions: ['Kanban is only for technical teams'],
    boundaryStrength: 95
  },
  format: {
    durationOnsite: '2 Days',
    durationRemote: '4 x 4h',
    groupSize: '4-12 people',
    deliveryModes: ['Onsite workshop', 'Remote interactive'],
    constraints: ['Must have full team presence']
  },
  agenda: [
    {
      id: 'd1',
      blocks: [
        { id: 'b1', title: 'Fundamentals of Flow', duration: '90min', goal: 'Understanding Queues', output: 'Simulation results', isOptional: false, type: 'fundamentals' },
        { id: 'b2', title: 'The Kanban Game', duration: '120min', goal: 'Experience WIP', output: 'Bottleneck awareness', isOptional: false, type: 'experience' }
      ]
    }
  ],
  methods: {
    signatureMethods: ['STATIK (Systems Thinking Approach to Introducing Kanban)', 'The Penny Game'],
    replaceableMethods: ['Standard icebreakers'],
    experientialAnchor: 'The Flow Board Simulation',
    nonNegotiables: ['STATIK analysis steps']
  },
  deliverables: {
    teamArtifacts: ['Board Design', 'Protocol of Agreements'],
    handoverDocs: ['The "First 30 Days" Guide'],
    internalAssets: ['Case Study entry'],
    followOnTransitions: ['Kanban Maturity Assessment']
  },
  preWork: {
    discovery: 'Team Survey',
    inputs: ['Sample backlog items'],
    noHomeworkPolicy: true,
    interviews: ['Product Owner', 'Scrum Master']
  },
  aiLayer: {
    backstageAi: ['Gap analysis on board design'],
    clientVisibleAi: ['Automatic protocol generation'],
    excludedAi: ['AI Faciliation (must be human)']
  },
  followOnLogic: {
    addOns: ['Flow Metrics Deep Dive'],
    followOnProducts: ['Continuous Improvement Retainer'],
    retainerOptions: ['Monthly Coaching'],
    upgradePaths: ['Kanban Management Professional']
  },
  maturityScores: {
    categoryScores: {
      outcome: { score: 100, status: 'green', reason: 'Perfectly defined', nextStep: 'None' },
      audience: { score: 95, status: 'green', reason: 'Very clear', nextStep: 'None' },
      scope: { score: 98, status: 'green', reason: 'Hard boundaries', nextStep: 'None' },
      format: { score: 90, status: 'green', reason: 'Flexible but firm', nextStep: 'None' },
      delivery: { score: 92, status: 'green', reason: 'Proven track record', nextStep: 'None' },
      methods: { score: 100, status: 'green', reason: 'Signature STATIK', nextStep: 'None' },
      deliverables: { score: 95, status: 'green', reason: 'Concrete outcomes', nextStep: 'None' },
      prework: { score: 85, status: 'green', reason: 'Lean', nextStep: 'None' },
      ai: { score: 80, status: 'green', reason: 'Modern additions', nextStep: 'None' },
      portfolio: { score: 90, status: 'green', reason: 'Central hub', nextStep: 'None' },
      sales: { score: 95, status: 'green', reason: 'Highly sellable', nextStep: 'None' },
      scalability: { score: 90, status: 'green', reason: 'Well documented', nextStep: 'None' }
    },
    overallScore: 95,
    familyFitScore: 100,
    publishingReadiness: 100,
    assetReadiness: 100,
    redFlags: []
  },
  assets: [],
  lastModified: new Date().toISOString()
};

export const MOCK_WORKSHOPS: Workshop[] = [
  REFERENCE_WORKSHOP,
  {
    ...REFERENCE_WORKSHOP,
    id: 'scrum-kickoff-draft',
    name: 'Scrum Setup Studio',
    role: 'Sister / Draft',
    status: 'draft',
    version: '0.5',
    summary: 'A structured setup for new Scrum teams.',
    description: 'A deep dive into the Scrum framework for teams transitioning to agile rituals. This workshop focuses on establishing the core loop of Sprint Planning, Review, and Retrospective.',
    maturityScores: {
      ...REFERENCE_WORKSHOP.maturityScores,
      overallScore: 65,
      familyFitScore: 82,
      redFlags: ['Missing Day-3 Artifact definitions', 'Scope blurred with Technical training']
    },
    lastModified: new Date(Date.now() - 86400000).toISOString()
  }
];
