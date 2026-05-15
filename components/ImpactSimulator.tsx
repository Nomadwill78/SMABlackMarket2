import React, { useState, useEffect } from 'react';
import { SectorData } from '../types';
import { POLICY_SCENARIOS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, Info, BookOpen, X, ToggleLeft, ToggleRight } from 'lucide-react';

interface ImpactSimulatorProps {
  sectors: SectorData[];
}

const ImpactSimulator: React.FC<ImpactSimulatorProps> = ({ sectors }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>("");
  const [directJobs, setDirectJobs] = useState(50);
  const [showMethods, setShowMethods] = useState(false);
  const [isBlackOwnedModel, setIsBlackOwnedModel] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('none');

  // Set default sector when sectors load
  useEffect(() => {
    if (sectors.length > 0 && !selectedSectorId) {
      setSelectedSectorId(sectors[0].id);
    }
  }, [sectors]);

  const sector = sectors.find(s => s.id === selectedSectorId) || sectors[0] || {
    id: 'unknown',
    name: 'Loading...',
    multiplier: 1,
    jobsMultiplier: 0,
    blackOwnedMultiplier: 1,
    blackOwnedJobsMultiplier: 0,
    equityAdjustmentReason: '',
    leakageScore: 'Low',
    description: '',
    opportunity: ''
  };

  const selectedPolicy = POLICY_SCENARIOS.find(p => p.id === selectedPolicyId) || POLICY_SCENARIOS[0];

  // --- BASELINE CALCULATIONS ---
  const baseOutputMultiplier = isBlackOwnedModel ? sector.blackOwnedMultiplier : sector.multiplier;
  const baseJobsMultiplier = isBlackOwnedModel ? sector.blackOwnedJobsMultiplier : sector.jobsMultiplier;

  const baselineIndirectJobs = Math.round(directJobs * baseJobsMultiplier);
  const baselineTotalJobs = directJobs + baselineIndirectJobs;
  const baselineActivity = directJobs * 65000 * baseOutputMultiplier;

  // --- POLICY ADJUSTED CALCULATIONS ---
  // Policy multipliers act as additives to the base
  const policyOutputMultiplier = baseOutputMultiplier + selectedPolicy.outputModifier;
  const policyJobsMultiplier = baseJobsMultiplier + selectedPolicy.jobsModifier;

  const policyIndirectJobs = Math.round(directJobs * policyJobsMultiplier);
  const policyTotalJobs = directJobs + policyIndirectJobs;
  const policyActivity = directJobs * 65000 * policyOutputMultiplier;

  // --- DELTAS ---
  const jobGain = policyTotalJobs - baselineTotalJobs;
  const activityGain = policyActivity - baselineActivity;


  const chartData = [
    {
      name: 'Baseline',
      Direct: directJobs,
      'Indirect/Induced': baselineIndirectJobs,
      'Policy Boost': 0
    },
    {
      name: 'With Policy',
      Direct: directJobs,
      'Indirect/Induced': baselineIndirectJobs,
      'Policy Boost': policyIndirectJobs - baselineIndirectJobs // Visualization of the "extra"
    }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  if (!sectors.length) return <div>Loading Simulator...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      
      {/* Methodology Overlay */}
      {showMethods && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md p-8 overflow-y-auto animate-fade-in">
             <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
                    <BookOpen className="text-indigo-600" />
                    Methodology & Assumptions
                </h3>
                <button 
                    onClick={() => setShowMethods(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} className="text-gray-500" />
                </button>
             </div>
             
             <div className="space-y-8 text-sm text-gray-700 max-w-3xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">1. Multiplier Type: IMPLAN Type II</h4>
                    <p className="mb-3 leading-relaxed">
                        The figures shown use <strong>Type II Multipliers</strong>, which capture the total economic impact across three layers:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li><strong>Direct Effect:</strong> The jobs and revenue generated immediately by the specific business.</li>
                        <li><strong>Indirect Effect (Supply Chain):</strong> Business-to-business purchases (e.g., a construction firm buying local lumber).</li>
                        <li><strong>Induced Effect (Household Spending):</strong> Economic activity generated when employees spend their wages locally (e.g., groceries, rent).</li>
                    </ul>
                </div>

                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-3 text-lg">2. Racial Equity Adjustment</h4>
                    <p className="leading-relaxed">
                        When "Black-Owned Business Model" is active, we apply specific adjustment factors based on research:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-amber-800 mt-3">
                        <li><strong>Higher Induced Multiplier:</strong> Reflects higher propensity to hire Black workers who live in the community, retaining wages locally.</li>
                        <li><strong>Lower Indirect Multiplier (Penalty):</strong> Reflects systemic barriers to supply chain access (e.g., denial of trade credit), forcing businesses to buy retail rather than wholesale.</li>
                    </ul>
                </div>

                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                    <h4 className="font-bold text-emerald-900 mb-3 text-lg">3. Policy Modeling</h4>
                    <p className="leading-relaxed">
                        The "Policy Dividend" is calculated by modifying the base multiplier to reflect increased retention or productivity:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-emerald-800 mt-3">
                        <li><strong>Procurement Set-Asides:</strong> Modeled as an increase in the Indirect Multiplier (replacing imports with local purchase).</li>
                        <li><strong>Local Hiring:</strong> Modeled as an increase in the Induced Multiplier (retaining wages).</li>
                    </ul>
                </div>
             </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
            <Calculator size={24} />
            </div>
            <div>
            <h2 className="text-2xl font-bold text-gray-900 font-serif">Community Wealth Simulator</h2>
            <p className="text-sm text-gray-500">Model the "Multiplier Effect" of Black-led ventures.</p>
            </div>
        </div>
        <button 
            onClick={() => setShowMethods(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
        >
            <Info size={16} />
            Methods & Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          
          {/* Step 1: Sector & Jobs */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
             <div className="flex justify-between items-center mb-4">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">1. Sector & Scale</label>
             </div>
             
             <div className="space-y-6">
                <select 
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-gray-900"
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                >
                {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
                </select>

                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Direct Jobs Created</span>
                        <span className="font-mono font-bold text-indigo-600">{directJobs}</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={directJobs}
                        onChange={(e) => setDirectJobs(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
             </div>
          </div>

          {/* Step 2: Ownership Model */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
             <div className="flex justify-between items-center mb-3">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">2. Ownership Model</label>
                 <button 
                    onClick={() => setIsBlackOwnedModel(!isBlackOwnedModel)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${isBlackOwnedModel ? 'bg-indigo-600 text-white pl-3 pr-4' : 'bg-gray-300 text-gray-700 pl-4 pr-3'}`}
                 >
                    {isBlackOwnedModel ? 'Black-Owned' : 'General Market'}
                    {isBlackOwnedModel ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                 </button>
             </div>
             <p className="text-xs text-gray-500 leading-relaxed">
                 {isBlackOwnedModel ? "Adjusts for higher local hiring but lower supply chain access." : "Uses standard regional multipliers."}
             </p>
          </div>

          {/* Step 3: Policy Intervention */}
          <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
             <label className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-4">3. Policy Intervention</label>
             <select 
                className="w-full p-3 border border-emerald-200 rounded-xl bg-white text-emerald-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(e.target.value)}
             >
                {POLICY_SCENARIOS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
             </select>
             <div className="mt-3 text-xs text-emerald-700 leading-relaxed">
                 {selectedPolicy.description}
             </div>
          </div>

        </div>

        {/* Output Visualization */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-colors duration-500 bg-white border-gray-200 shadow-sm`}>
          <div className="mb-6">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-bold text-gray-900">Policy Impact Analysis</h3>
                 {selectedPolicyId !== 'none' && (
                     <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wide">
                         {selectedPolicy.impactDescription}
                     </span>
                 )}
             </div>
             
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{left: 0, right: 30, top: 10, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{fontSize: 12, fontWeight: 600, fill: '#374151'}} width={80} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}} 
                        contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: number, name: string) => [value, name]}
                    />
                    <Legend iconSize={8} wrapperStyle={{fontSize: '11px', paddingTop: '20px'}} />
                    <Bar dataKey="Direct" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} barSize={32} />
                    <Bar 
                        dataKey="Indirect/Induced" 
                        stackId="a" 
                        fill={isBlackOwnedModel ? "#d97706" : "#94a3b8"} 
                        radius={[0, 0, 0, 0]} 
                        name="Multiplier Jobs"
                    />
                    <Bar 
                        dataKey="Policy Boost" 
                        stackId="a" 
                        fill="#10b981" 
                        radius={[0, 6, 6, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-100">
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Baseline Output</div>
                    <div className="font-mono font-bold text-gray-900 text-lg">{formatCurrency(baselineActivity)}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">{baselineTotalJobs} Jobs</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="text-xs text-emerald-700 mb-1 uppercase tracking-wider">With Policy</div>
                    <div className="font-mono font-bold text-emerald-900 text-lg">{formatCurrency(policyActivity)}</div>
                    <div className="text-xs text-emerald-700 font-mono mt-1">{policyTotalJobs} Jobs</div>
                </div>
            </div>

            {/* The Dividend */}
            {selectedPolicyId !== 'none' && (
                <div className="bg-indigo-900 text-white p-6 rounded-xl flex items-center justify-between shadow-lg ring-1 ring-white/10">
                    <div>
                        <div className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">The Policy Dividend</div>
                        <div className="text-sm text-indigo-100 max-w-[200px]">Additional economic value generated by intervention.</div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-emerald-400">+{formatCurrency(activityGain)}</div>
                        <div className="text-sm font-mono font-bold text-indigo-300">+{jobGain} Jobs</div>
                    </div>
                </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactSimulator;