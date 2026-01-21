export interface EconomicIndicator {
  id: string;
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'flat';
  trendLabel: string;
  context: string;
}

export interface LaborStats {
  laborForceParticipationRate: number; // Black %
  officialUnemploymentRate: number; // Black U-3
  underemploymentRate: number; // Black U-6
  discouragedWorkersEstimate: number; 
  
  // Benchmarks for Structural Analysis
  whiteLaborForceParticipationRate: number;
  whiteOfficialUnemploymentRate: number;
  whiteUnderemploymentRate: number;
  
  // National Context
  nationalBlackUnemploymentRate: number;
}

export interface CapitalMetrics {
  denialRate: { black: number; white: number }; // % of applicants denied
  avgLoanSize: { black: number; white: number }; // Average approved amount in USD
  interestRate: { black: number; white: number }; // Average interest rate %
  fearOfRejectionRate: { black: number; white: number }; // % who didn't apply fearing denial
}

export interface RFP {
  id: string;
  title: string;
  issuer: string;
  value: string;
  deadline: string;
  status: 'Open' | 'Closing Soon';
}

export interface StrategicPartner {
  name: string;
  type: 'Capital (CDFI)' | 'Technical Assistance' | 'Policy';
}

export interface SectorData {
  id: string;
  name: string;
  multiplier: number; // General economic multiplier
  jobsMultiplier: number; // General indirect jobs created per 1 direct job
  
  // Racial Equity Adjustments
  blackOwnedMultiplier: number; // Adjusted output multiplier for Black-owned firms
  blackOwnedJobsMultiplier: number; // Adjusted jobs multiplier (reflecting local hiring)
  equityAdjustmentReason: string; // Narrative explanation for the difference
  
  leakageScore: 'High' | 'Medium' | 'Low'; // Qualitative flag
  description: string;
  opportunity: string;
  // Quantitative Supply Chain Metrics
  regionalDemand: number; // Total annual market demand in the region (USD)
  netLeakagePct: number; // % of final demand met by imports (0-100)
  importDependency: number; // % of intermediate inputs that are imported (0-100)
  
  // Actionable Procurement Data
  topAnchors: string[]; // Specific institutions buying this service
  activeRFPs: RFP[]; // Live contract opportunities
  mobilizationPartners: StrategicPartner[]; // Who can help win the deal
}

export interface PolicyScenario {
  id: string;
  name: string;
  description: string;
  impactDescription: string;
  // Multiplier modifiers (additive factors to the base/black-owned multipliers)
  outputModifier: number; // e.g., +0.15 
  jobsModifier: number; // e.g., +0.2
}

export interface GapMetric {
  category: string;
  blackValue: number;
  whiteValue: number;
  nationalBlackAvg: number; // New Benchmark
  unit: string;
  source: string;
}

export interface GeographicHotspot {
  id: string;
  name: string;
  type: 'Census Tract' | 'Neighborhood' | 'County';
  population: number;
  unemploymentRate: number;
  medianIncome: number;
  homeOwnershipRate: number;
  interventionTarget: string; // e.g., "Workforce Development", "Small Biz Capital"
}

export interface HistoricalPoint {
  year: number;
  blackValue: number;
  whiteValue: number;
}

export interface HistoricalTrend {
  id: string;
  label: string;
  unit: string; // "%" or "$"
  series: HistoricalPoint[];
}

export interface RegionContext {
  id: string;
  name: string;
  state: string;
  population: number;
  blackPopulationPct: number;
}

export interface SourceMetadata {
    blsDate: string;
    censusDate: string;
    fredDate: string;
}

export interface RegionDataBundle {
  context: RegionContext;
  indicators: EconomicIndicator[];
  laborStats: LaborStats;
  capitalMetrics: CapitalMetrics;
  sectors: SectorData[];
  gaps: GapMetric[];
  hotspots: GeographicHotspot[];
  historicalTrends: HistoricalTrend[];
  sourceMetadata: SourceMetadata; // Data Freshness
  lastUpdated: string;
}
