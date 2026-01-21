import { RegionDataBundle, PolicyScenario } from './types';

export const POLICY_SCENARIOS: PolicyScenario[] = [
  {
    id: 'none',
    name: 'No Intervention (Baseline)',
    description: 'Standard market conditions with existing structural barriers.',
    impactDescription: 'Growth limited by current leakage rates.',
    outputModifier: 0,
    jobsModifier: 0
  },
  {
    id: 'procurement',
    name: 'Anchor Procurement Set-Aside (30%)',
    description: 'Mandates anchors to direct 30% of spend to local minority firms.',
    impactDescription: 'Reduces supply chain leakage, boosting the Indirect Multiplier.',
    outputModifier: 0.35,
    jobsModifier: 0.15
  },
  {
    id: 'hiring',
    name: 'Local Hiring Ordinance',
    description: 'Requires 50% of new hires to reside in priority zip codes.',
    impactDescription: 'Retains wages locally, boosting the Induced Multiplier.',
    outputModifier: 0.10,
    jobsModifier: 0.45
  },
  {
    id: 'capital',
    name: 'Supply Chain Capital Fund',
    description: 'Provides 0% interest loans for equipment to meet anchor demand.',
    impactDescription: 'Increases capacity and productivity per job.',
    outputModifier: 0.55,
    jobsModifier: 0.25
  }
];

// MOCK DATABASE simulating API responses from BLS, Census ACS, and FRED
export const REGION_DB: Record<string, RegionDataBundle> = {
  'memphis': {
    lastUpdated: new Date().toISOString(),
    sourceMetadata: {
        blsDate: 'Nov 2024 (Prelim)',
        censusDate: '2023 ACS 1-Year',
        fredDate: 'Q3 2024'
    },
    context: {
      id: 'memphis',
      name: "Memphis Metro",
      state: "TN/MS/AR",
      population: 1340000,
      blackPopulationPct: 48.2
    },
    laborStats: {
      laborForceParticipationRate: 59.8,
      officialUnemploymentRate: 9.8,
      underemploymentRate: 16.4,
      discouragedWorkersEstimate: 14500,
      whiteLaborForceParticipationRate: 64.2,
      whiteOfficialUnemploymentRate: 3.9,
      whiteUnderemploymentRate: 7.2,
      nationalBlackUnemploymentRate: 6.1 // Benchmark
    },
    capitalMetrics: {
      denialRate: { black: 38, white: 14 },
      avgLoanSize: { black: 38500, white: 112000 },
      interestRate: { black: 8.2, white: 5.9 },
      fearOfRejectionRate: { black: 42, white: 18 }
    },
    hotspots: [
      {
        id: 'orange-mound',
        name: 'Orange Mound',
        type: 'Neighborhood',
        population: 8500,
        unemploymentRate: 24.5,
        medianIncome: 22400,
        homeOwnershipRate: 38,
        interventionTarget: 'Stabilization Grants'
      },
      {
        id: 'whitehaven',
        name: 'Whitehaven',
        type: 'Neighborhood',
        population: 45000,
        unemploymentRate: 11.2,
        medianIncome: 42000,
        homeOwnershipRate: 58,
        interventionTarget: 'Growth Capital'
      },
      {
        id: 'germantown',
        name: 'Germantown',
        type: 'County',
        population: 39000,
        unemploymentRate: 3.2,
        medianIncome: 118000,
        homeOwnershipRate: 82,
        interventionTarget: 'Asset Retention'
      }
    ],
    historicalTrends: [
        {
            id: 'unemployment',
            label: 'Unemployment Rate (U-3)',
            unit: '%',
            series: [
                { year: 2015, blackValue: 12.5, whiteValue: 4.8 },
                { year: 2016, blackValue: 11.2, whiteValue: 4.5 },
                { year: 2017, blackValue: 10.5, whiteValue: 4.2 },
                { year: 2018, blackValue: 9.8, whiteValue: 4.0 },
                { year: 2019, blackValue: 8.9, whiteValue: 3.8 },
                { year: 2020, blackValue: 14.2, whiteValue: 5.5 }, // COVID Spike
                { year: 2021, blackValue: 11.5, whiteValue: 4.5 },
                { year: 2022, blackValue: 10.1, whiteValue: 4.1 },
                { year: 2023, blackValue: 9.9, whiteValue: 4.0 },
                { year: 2024, blackValue: 9.8, whiteValue: 3.9 },
            ]
        },
        {
            id: 'income',
            label: 'Median Household Income',
            unit: '$',
            series: [
                { year: 2015, blackValue: 32000, whiteValue: 62000 },
                { year: 2016, blackValue: 33500, whiteValue: 64500 },
                { year: 2017, blackValue: 34200, whiteValue: 66800 },
                { year: 2018, blackValue: 35800, whiteValue: 69000 },
                { year: 2019, blackValue: 37500, whiteValue: 71500 },
                { year: 2020, blackValue: 36800, whiteValue: 72000 },
                { year: 2021, blackValue: 38200, whiteValue: 74500 },
                { year: 2022, blackValue: 39500, whiteValue: 76000 },
                { year: 2023, blackValue: 40800, whiteValue: 77800 },
                { year: 2024, blackValue: 41200, whiteValue: 78500 },
            ]
        },
        {
            id: 'wealth',
            label: 'Median Net Worth',
            unit: '$',
            series: [
                { year: 2015, blackValue: 18000, whiteValue: 140000 },
                { year: 2017, blackValue: 19500, whiteValue: 152000 },
                { year: 2019, blackValue: 21000, whiteValue: 165000 },
                { year: 2021, blackValue: 22500, whiteValue: 178000 }, // Asset inflation helps white wealth more
                { year: 2023, blackValue: 24000, whiteValue: 188000 },
            ]
        }
    ],
    indicators: [
      {
        id: 'unemp',
        label: 'Black Unemployment (U-3)',
        value: '9.8%',
        trend: 'up',
        trendLabel: '+0.4% vs Q3',
        context: 'Source: BLS Local Area Unemployment'
      },
      {
        id: 'biz-own',
        label: 'Black Biz Ownership',
        value: '2.1%',
        trend: 'flat',
        trendLabel: 'No change',
        context: 'Source: Annual Business Survey'
      },
      {
        id: 'wage',
        label: 'Median HH Income (Black)',
        value: '$41,200',
        trend: 'down',
        trendLabel: '-1.2% (Adj)',
        context: 'Source: Census ACS 5-Year'
      }
    ],
    sectors: [
      {
        id: 'care',
        name: 'Care Economy',
        multiplier: 1.65,
        jobsMultiplier: 0.4, 
        blackOwnedMultiplier: 1.95,
        blackOwnedJobsMultiplier: 0.8,
        equityAdjustmentReason: "Higher local hiring retention (+Local Wages)",
        leakageScore: 'Low',
        description: 'High labor intensity, wages stay local.',
        opportunity: 'Community-owned birthing centers.',
        regionalDemand: 4200000000,
        netLeakagePct: 15,
        importDependency: 12,
        topAnchors: ['Methodist Le Bonheur', 'St. Jude Research', 'Regional One Health'],
        activeRFPs: [
            { id: 'rfp-01', title: 'Non-Emergency Medical Transport', issuer: 'Methodist Healthcare', value: '$1.2M', deadline: '2025-06-15', status: 'Open' },
            { id: 'rfp-02', title: 'Commercial Laundry Services', issuer: 'Regional One', value: '$450k', deadline: '2025-05-30', status: 'Closing Soon' }
        ],
        mobilizationPartners: [
            { name: 'River City Capital', type: 'Capital (CDFI)' },
            { name: 'Black Business Association', type: 'Technical Assistance' }
        ]
      },
      {
        id: 'green_const',
        name: 'Green Construction',
        multiplier: 1.85,
        jobsMultiplier: 0.7,
        blackOwnedMultiplier: 1.70,
        blackOwnedJobsMultiplier: 0.95,
        equityAdjustmentReason: "Supply chain exclusion (-Output) but high local hiring (+Jobs)",
        leakageScore: 'Medium',
        description: 'High input demands, high-wage trades.',
        opportunity: 'Weatherization contracts for aging housing.',
        regionalDemand: 1800000000,
        netLeakagePct: 35,
        importDependency: 42,
        topAnchors: ['City of Memphis (Housing)', 'MLGW', 'University of Memphis'],
        activeRFPs: [
            { id: 'rfp-03', title: 'Residential Weatherization Pilot', issuer: 'MLGW', value: '$3.5M', deadline: '2025-07-01', status: 'Open' },
            { id: 'rfp-04', title: 'Campus Solar Retrofit', issuer: 'Univ. of Memphis', value: '$850k', deadline: '2025-06-20', status: 'Open' }
        ],
        mobilizationPartners: [
            { name: 'Communities Unlimited', type: 'Capital (CDFI)' },
            { name: 'Memphis Urban League', type: 'Technical Assistance' }
        ]
      },
      {
        id: 'tech_serv',
        name: 'Digital Services',
        multiplier: 1.45,
        jobsMultiplier: 0.9,
        blackOwnedMultiplier: 1.60,
        blackOwnedJobsMultiplier: 1.2,
        equityAdjustmentReason: "Remote workforce retention in-community (+Jobs)",
        leakageScore: 'High',
        description: 'High wages, but spending leaks to software vendors.',
        opportunity: 'Data analytics for local gov anchors.',
        regionalDemand: 950000000,
        netLeakagePct: 55,
        importDependency: 28,
        topAnchors: ['FedEx Logistics', 'AutoZone HQ', 'Shelby County Gov'],
        activeRFPs: [
            { id: 'rfp-05', title: 'Cybersecurity Audit Services', issuer: 'Shelby County', value: '$250k', deadline: '2025-05-15', status: 'Closing Soon' },
            { id: 'rfp-06', title: 'Supply Chain Data Analytics', issuer: 'FedEx', value: '$2.0M', deadline: '2025-08-01', status: 'Open' }
        ],
        mobilizationPartners: [
            { name: 'Epicenter Memphis', type: 'Technical Assistance' },
            { name: 'Start Co.', type: 'Technical Assistance' }
        ]
      },
      {
        id: 'retail',
        name: 'General Retail',
        multiplier: 1.25,
        jobsMultiplier: 0.2,
        blackOwnedMultiplier: 1.45,
        blackOwnedJobsMultiplier: 0.35,
        equityAdjustmentReason: "Higher neighborhood spending circulation (+Output)",
        leakageScore: 'High',
        description: 'Inventory is imported. Low wages.',
        opportunity: 'Supply chain localization.',
        regionalDemand: 6200000000,
        netLeakagePct: 78,
        importDependency: 85,
        topAnchors: ['Memphis Intl Airport', 'Beale Street Mgmt', 'Kroger Delta Div'],
        activeRFPs: [
            { id: 'rfp-07', title: 'Concession Vendor - Terminal B', issuer: 'Memphis Airport', value: '$500k', deadline: '2025-09-01', status: 'Open' }
        ],
        mobilizationPartners: [
            { name: 'Hope Credit Union', type: 'Capital (CDFI)' }
        ]
      }
    ],
    gaps: [
      { category: 'Median HH Income', blackValue: 41200, whiteValue: 78500, nationalBlackAvg: 52860, unit: '$', source: 'Census ACS' },
      { category: 'Median Net Worth', blackValue: 24000, whiteValue: 188000, nationalBlackAvg: 44900, unit: '$', source: 'Fed Reserve SCF' },
      { category: 'Home Ownership', blackValue: 44, whiteValue: 72, nationalBlackAvg: 45.7, unit: '%', source: 'Census Bureau' },
      { category: 'Business Equity', blackValue: 58000, whiteValue: 450000, nationalBlackAvg: 68000, unit: '$', source: 'Annual Biz Survey' },
      { category: 'Loan Denial Rate', blackValue: 38, whiteValue: 14, nationalBlackAvg: 35, unit: '%', source: 'Small Biz Credit Survey' }
    ]
  },
  'birmingham': {
    lastUpdated: new Date().toISOString(),
    sourceMetadata: {
        blsDate: 'Nov 2024 (Prelim)',
        censusDate: '2023 ACS 1-Year',
        fredDate: 'Q3 2024'
    },
    context: {
      id: 'birmingham',
      name: "Birmingham Metro",
      state: "AL",
      population: 1100000,
      blackPopulationPct: 28.5
    },
    laborStats: {
      laborForceParticipationRate: 57.2,
      officialUnemploymentRate: 7.2,
      underemploymentRate: 13.8,
      discouragedWorkersEstimate: 9200,
      whiteLaborForceParticipationRate: 62.1,
      whiteOfficialUnemploymentRate: 3.1,
      whiteUnderemploymentRate: 6.8,
      nationalBlackUnemploymentRate: 6.1
    },
    capitalMetrics: {
      denialRate: { black: 41, white: 12 },
      avgLoanSize: { black: 32000, white: 98000 },
      interestRate: { black: 8.5, white: 6.1 },
      fearOfRejectionRate: { black: 45, white: 15 }
    },
    hotspots: [
      {
        id: 'ensley',
        name: 'Ensley',
        type: 'Neighborhood',
        population: 3200,
        unemploymentRate: 18.2,
        medianIncome: 24500,
        homeOwnershipRate: 41,
        interventionTarget: 'Industrial Revitalization'
      },
      {
        id: 'mountain-brook',
        name: 'Mountain Brook',
        type: 'Neighborhood',
        population: 20000,
        unemploymentRate: 2.1,
        medianIncome: 130000,
        homeOwnershipRate: 88,
        interventionTarget: 'None'
      }
    ],
    historicalTrends: [
        {
            id: 'unemployment',
            label: 'Unemployment Rate (U-3)',
            unit: '%',
            series: [
                { year: 2015, blackValue: 9.5, whiteValue: 3.8 },
                { year: 2016, blackValue: 8.8, whiteValue: 3.6 },
                { year: 2017, blackValue: 8.2, whiteValue: 3.4 },
                { year: 2018, blackValue: 7.5, whiteValue: 3.2 },
                { year: 2019, blackValue: 6.8, whiteValue: 3.0 },
                { year: 2020, blackValue: 11.2, whiteValue: 4.8 },
                { year: 2021, blackValue: 8.5, whiteValue: 3.5 },
                { year: 2022, blackValue: 7.8, whiteValue: 3.3 },
                { year: 2023, blackValue: 7.4, whiteValue: 3.2 },
                { year: 2024, blackValue: 7.2, whiteValue: 3.1 },
            ]
        },
        {
            id: 'income',
            label: 'Median Household Income',
            unit: '$',
            series: [
                { year: 2015, blackValue: 30000, whiteValue: 58000 },
                { year: 2016, blackValue: 31000, whiteValue: 60000 },
                { year: 2017, blackValue: 32500, whiteValue: 62500 },
                { year: 2018, blackValue: 34000, whiteValue: 64000 },
                { year: 2019, blackValue: 35500, whiteValue: 66000 },
                { year: 2020, blackValue: 34500, whiteValue: 66500 },
                { year: 2021, blackValue: 36000, whiteValue: 68000 },
                { year: 2022, blackValue: 37500, whiteValue: 69500 },
                { year: 2023, blackValue: 38800, whiteValue: 71000 },
                { year: 2024, blackValue: 39500, whiteValue: 72000 },
            ]
        },
        {
            id: 'wealth',
            label: 'Median Net Worth',
            unit: '$',
            series: [
                { year: 2015, blackValue: 15000, whiteValue: 125000 },
                { year: 2017, blackValue: 16000, whiteValue: 135000 },
                { year: 2019, blackValue: 17500, whiteValue: 145000 },
                { year: 2021, blackValue: 18200, whiteValue: 155000 },
                { year: 2023, blackValue: 19000, whiteValue: 165000 },
            ]
        }
    ],
    indicators: [
      {
        id: 'unemp',
        label: 'Black Unemployment (U-3)',
        value: '7.2%',
        trend: 'down',
        trendLabel: '-0.2% vs Q3',
        context: 'Source: BLS Local Area Unemployment'
      },
      {
        id: 'biz-own',
        label: 'Black Biz Ownership',
        value: '1.8%',
        trend: 'up',
        trendLabel: '+0.1% growth',
        context: 'Source: Annual Business Survey'
      },
      {
        id: 'wage',
        label: 'Median HH Income (Black)',
        value: '$39,500',
        trend: 'flat',
        trendLabel: '0.0%',
        context: 'Source: Census ACS 5-Year'
      }
    ],
    sectors: [
      {
        id: 'metal',
        name: 'Advanced Manufacturing',
        multiplier: 2.1,
        jobsMultiplier: 1.2, 
        blackOwnedMultiplier: 2.05,
        blackOwnedJobsMultiplier: 1.5,
        equityAdjustmentReason: "Hiring in high-unemployment zones (+Jobs)",
        leakageScore: 'Low',
        description: 'Legacy infrastructure allows for high value capture.',
        opportunity: 'Component fabrication for EV supply chains.',
        regionalDemand: 5100000000,
        netLeakagePct: 22,
        importDependency: 35,
        topAnchors: ['Mercedes-Benz US', 'Honda Manufacturing AL', 'U.S. Steel'],
        activeRFPs: [
            { id: 'rfp-b1', title: 'HVAC Component Fabrication', issuer: 'Mercedes-Benz', value: '$3.5M', deadline: '2025-08-01', status: 'Open' },
            { id: 'rfp-b2', title: 'Industrial Facility Cleaning', issuer: 'Honda', value: '$800k', deadline: '2025-06-15', status: 'Open' }
        ],
        mobilizationPartners: [
            { name: 'Birmingham Business Alliance', type: 'Technical Assistance' },
            { name: 'Hope Credit Union (AL)', type: 'Capital (CDFI)' }
        ]
      },
      {
        id: 'tech_serv',
        name: 'Health Tech Services',
        multiplier: 1.6,
        jobsMultiplier: 0.8,
        blackOwnedMultiplier: 1.75,
        blackOwnedJobsMultiplier: 1.1,
        equityAdjustmentReason: "Targeted training pipelines (+Jobs)",
        leakageScore: 'Medium',
        description: 'Strong anchor institutions (UAB) drive demand.',
        opportunity: 'HIPAA-compliant data processing firms.',
        regionalDemand: 2800000000,
        netLeakagePct: 45,
        importDependency: 30,
        topAnchors: ['UAB Health System', 'Regions Bank', 'Blue Cross AL'],
        activeRFPs: [
            { id: 'rfp-b3', title: 'Medical Billing Data Audit', issuer: 'UAB Health', value: '$750k', deadline: '2025-07-20', status: 'Open' }
        ],
        mobilizationPartners: [
            { name: 'Innovation Depot', type: 'Technical Assistance' }
        ]
      },
      {
        id: 'food',
        name: 'Food Systems',
        multiplier: 1.3,
        jobsMultiplier: 0.3,
        blackOwnedMultiplier: 1.55,
        blackOwnedJobsMultiplier: 0.6,
        equityAdjustmentReason: "Local sourcing co-ops (+Output)",
        leakageScore: 'High',
        description: 'Most food is imported from outside the state.',
        opportunity: 'Urban ag-tech and distribution co-ops.',
        regionalDemand: 3400000000,
        netLeakagePct: 85,
        importDependency: 90,
        topAnchors: ['Birmingham City Schools', 'Piggly Wiggly Dist.'],
        activeRFPs: [
            { id: 'rfp-b4', title: 'Fresh Produce Supply', issuer: 'City Schools', value: '$1.5M', deadline: '2025-05-30', status: 'Closing Soon' }
        ],
        mobilizationPartners: [
            { name: 'REV Birmingham', type: 'Technical Assistance' }
        ]
      }
    ],
    gaps: [
      { category: 'Median HH Income', blackValue: 39500, whiteValue: 72000, nationalBlackAvg: 52860, unit: '$', source: 'Census ACS' },
      { category: 'Median Net Worth', blackValue: 19000, whiteValue: 165000, nationalBlackAvg: 44900, unit: '$', source: 'Fed Reserve SCF' },
      { category: 'Home Ownership', blackValue: 51, whiteValue: 76, nationalBlackAvg: 45.7, unit: '%', source: 'Census Bureau' },
      { category: 'Business Equity', blackValue: 42000, whiteValue: 410000, nationalBlackAvg: 68000, unit: '$', source: 'Annual Biz Survey' },
      { category: 'Loan Denial Rate', blackValue: 41, whiteValue: 12, nationalBlackAvg: 35, unit: '%', source: 'Small Biz Credit Survey' }
    ]
  },
  'atlanta': {
    lastUpdated: new Date().toISOString(),
    sourceMetadata: {
        blsDate: 'Nov 2024 (Prelim)',
        censusDate: '2023 ACS 1-Year',
        fredDate: 'Q3 2024'
    },
    context: {
      id: 'atlanta',
      name: "Atlanta Metro",
      state: "GA",
      population: 6100000,
      blackPopulationPct: 33.6
    },
    laborStats: {
      laborForceParticipationRate: 66.5,
      officialUnemploymentRate: 5.8,
      underemploymentRate: 10.1,
      discouragedWorkersEstimate: 18500,
      whiteLaborForceParticipationRate: 70.2,
      whiteOfficialUnemploymentRate: 2.8,
      whiteUnderemploymentRate: 5.5,
      nationalBlackUnemploymentRate: 6.1
    },
    capitalMetrics: {
      denialRate: { black: 32, white: 11 },
      avgLoanSize: { black: 52000, white: 145000 },
      interestRate: { black: 7.8, white: 5.5 },
      fearOfRejectionRate: { black: 35, white: 12 }
    },
    hotspots: [
      {
        id: 'bankhead',
        name: 'Bankhead',
        type: 'Neighborhood',
        population: 12000,
        unemploymentRate: 14.5,
        medianIncome: 31000,
        homeOwnershipRate: 35,
        interventionTarget: 'Affordable Housing'
      },
      {
        id: 'buckhead',
        name: 'Buckhead',
        type: 'Neighborhood',
        population: 80000,
        unemploymentRate: 2.8,
        medianIncome: 105000,
        homeOwnershipRate: 65,
        interventionTarget: 'None'
      }
    ],
    historicalTrends: [
        {
            id: 'unemployment',
            label: 'Unemployment Rate (U-3)',
            unit: '%',
            series: [
                { year: 2015, blackValue: 8.2, whiteValue: 3.5 },
                { year: 2016, blackValue: 7.5, whiteValue: 3.4 },
                { year: 2017, blackValue: 7.0, whiteValue: 3.2 },
                { year: 2018, blackValue: 6.5, whiteValue: 3.0 },
                { year: 2019, blackValue: 5.9, whiteValue: 2.8 },
                { year: 2020, blackValue: 9.8, whiteValue: 4.2 },
                { year: 2021, blackValue: 7.2, whiteValue: 3.1 },
                { year: 2022, blackValue: 6.4, whiteValue: 2.9 },
                { year: 2023, blackValue: 6.0, whiteValue: 2.8 },
                { year: 2024, blackValue: 5.8, whiteValue: 2.8 },
            ]
        },
        {
            id: 'income',
            label: 'Median Household Income',
            unit: '$',
            series: [
                { year: 2015, blackValue: 42000, whiteValue: 72000 },
                { year: 2016, blackValue: 44000, whiteValue: 75000 },
                { year: 2017, blackValue: 46000, whiteValue: 78000 },
                { year: 2018, blackValue: 48500, whiteValue: 81000 },
                { year: 2019, blackValue: 51000, whiteValue: 84000 },
                { year: 2020, blackValue: 50000, whiteValue: 85000 },
                { year: 2021, blackValue: 52000, whiteValue: 87500 },
                { year: 2022, blackValue: 54000, whiteValue: 89000 },
                { year: 2023, blackValue: 55000, whiteValue: 91000 },
                { year: 2024, blackValue: 56000, whiteValue: 92000 },
            ]
        },
        {
            id: 'wealth',
            label: 'Median Net Worth',
            unit: '$',
            series: [
                { year: 2015, blackValue: 22000, whiteValue: 160000 },
                { year: 2017, blackValue: 24500, whiteValue: 172000 },
                { year: 2019, blackValue: 27000, whiteValue: 185000 },
                { year: 2021, blackValue: 29500, whiteValue: 198000 },
                { year: 2023, blackValue: 32000, whiteValue: 210000 },
            ]
        }
    ],
    indicators: [
      {
        id: 'unemp',
        label: 'Black Unemployment (U-3)',
        value: '5.8%',
        trend: 'down',
        trendLabel: '-0.5% vs Q3',
        context: 'Source: BLS Local Area Unemployment'
      },
      {
        id: 'biz-own',
        label: 'Black Biz Ownership',
        value: '7.4%',
        trend: 'up',
        trendLabel: 'Rapid growth',
        context: 'Source: Annual Business Survey'
      },
      {
        id: 'wage',
        label: 'Median HH Income (Black)',
        value: '$56,000',
        trend: 'up',
        trendLabel: '+2.1%',
        context: 'Source: Census ACS 5-Year'
      }
    ],
    sectors: [
      {
        id: 'fintech',
        name: 'FinTech & Payments',
        multiplier: 2.4,
        jobsMultiplier: 1.5, 
        blackOwnedMultiplier: 2.6,
        blackOwnedJobsMultiplier: 1.9,
        equityAdjustmentReason: "High wage retention within community (+Induced)",
        leakageScore: 'Low',
        description: 'Region is a global hub for transaction processing.',
        opportunity: 'Black-owned payment gateways and compliance firms.',
        regionalDemand: 12500000000,
        netLeakagePct: 18,
        importDependency: 15,
        topAnchors: ['NCR Corporation', 'Global Payments', 'Equifax'],
        activeRFPs: [
            { id: 'rfp-a1', title: 'Vendor Payment System Audit', issuer: 'Global Payments', value: '$600k', deadline: '2025-07-01', status: 'Open' }
        ],
        mobilizationPartners: [
            { name: 'Russell Innovation Center', type: 'Technical Assistance' },
            { name: 'Access to Capital for Entrepreneurs', type: 'Capital (CDFI)' }
        ]
      },
      {
        id: 'film',
        name: 'Media & Entertainment',
        multiplier: 1.9,
        jobsMultiplier: 1.1,
        blackOwnedMultiplier: 2.1,
        blackOwnedJobsMultiplier: 1.4,
        equityAdjustmentReason: "Local diverse casting and crew (+Jobs)",
        leakageScore: 'Medium',
        description: 'High spend, but production often uses imported talent.',
        opportunity: 'Post-production and VFX studios.',
        regionalDemand: 8200000000,
        netLeakagePct: 42,
        importDependency: 55,
        topAnchors: ['Tyler Perry Studios', 'Netflix (Atlanta Hub)', 'Turner Broadcasting'],
        activeRFPs: [
            { id: 'rfp-a2', title: 'Set Catering - Q3 Production', issuer: 'Netflix', value: '$250k', deadline: '2025-05-20', status: 'Closing Soon' }
        ],
        mobilizationPartners: [
            { name: 'Invest Atlanta', type: 'Policy' }
        ]
      },
      {
        id: 'logistics',
        name: 'Logistics & Warehousing',
        multiplier: 1.4,
        jobsMultiplier: 0.5,
        blackOwnedMultiplier: 1.55,
        blackOwnedJobsMultiplier: 0.7,
        equityAdjustmentReason: "Owner-operator wealth accumulation (+Output)",
        leakageScore: 'Low',
        description: 'Hub for Southeast distribution.',
        opportunity: 'Last-mile delivery fleets (owner-operator models.',
        regionalDemand: 7100000000,
        netLeakagePct: 30,
        importDependency: 25,
        topAnchors: ['Delta Air Lines', 'Home Depot', 'UPS'],
        activeRFPs: [
            { id: 'rfp-a3', title: 'Last Mile Courier Svc', issuer: 'UPS Supply Chain', value: '$1.8M', deadline: '2025-08-15', status: 'Open' }
        ],
        mobilizationPartners: [
            { name: 'Atlanta Wealth Building Initiative', type: 'Technical Assistance' }
        ]
      }
    ],
    gaps: [
      { category: 'Median HH Income', blackValue: 56000, whiteValue: 92000, nationalBlackAvg: 52860, unit: '$', source: 'Census ACS' },
      { category: 'Median Net Worth', blackValue: 32000, whiteValue: 210000, nationalBlackAvg: 44900, unit: '$', source: 'Fed Reserve SCF' },
      { category: 'Home Ownership', blackValue: 48, whiteValue: 74, nationalBlackAvg: 45.7, unit: '%', source: 'Census Bureau' },
      { category: 'Business Equity', blackValue: 95000, whiteValue: 580000, nationalBlackAvg: 68000, unit: '$', source: 'Annual Biz Survey' },
      { category: 'Loan Denial Rate', blackValue: 32, whiteValue: 11, nationalBlackAvg: 35, unit: '%', source: 'Small Biz Credit Survey' }
    ]
  }
};
