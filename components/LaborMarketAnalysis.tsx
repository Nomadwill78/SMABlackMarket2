import React from 'react';
import { LaborStats } from '../types';
import { Users, AlertTriangle, TrendingDown, HelpCircle, Activity } from 'lucide-react';

interface LaborMarketAnalysisProps {
  stats: LaborStats;
  regionName: string;
}

const LaborMarketAnalysis: React.FC<LaborMarketAnalysisProps> = ({ stats, regionName }) => {
  const hiddenUnemployedRate = (stats.underemploymentRate - stats.officialUnemploymentRate).toFixed(1);
  const participationGap = (stats.whiteLaborForceParticipationRate - stats.laborForceParticipationRate).toFixed(1);
  const u6GapMultiplier = (stats.underemploymentRate / stats.whiteUnderemploymentRate).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Labor Market Exclusion</h2>
          </div>
          <p className="text-sm text-slate-500">Measuring the structural gap in workforce participation.</p>
        </div>
        
        {/* Participation Metric */}
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-right">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Black Participation (LFPR)</div>
             <div className="flex items-baseline justify-end gap-2">
                 <div className="text-2xl font-bold text-slate-900">{stats.laborForceParticipationRate}%</div>
                 <div className="text-xs text-slate-400 font-medium">vs White: {stats.whiteLaborForceParticipationRate}%</div>
             </div>
             <div className="text-xs text-red-500 font-bold mt-1">
                {participationGap}% Participation Gap
             </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. Official U-3 Disparity */}
            <div className="relative">
                <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
                    Official Rate (U-3)
                    <HelpCircle size={14} className="text-slate-400" />
                </h3>
                
                {/* Chart */}
                <div className="space-y-3 mt-4">
                    <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Black</span>
                            <span className="font-bold">{stats.officialUnemploymentRate}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-800" style={{ width: `${stats.officialUnemploymentRate * 3}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>White Benchmark</span>
                            <span>{stats.whiteOfficialUnemploymentRate}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-300" style={{ width: `${stats.whiteOfficialUnemploymentRate * 3}%` }}></div>
                        </div>
                    </div>
                </div>
                
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    Standard measure. 2x disparity indicates systemic hiring bias.
                </p>
            </div>

            {/* 2. Underemployment (U-6) Disparity - THE HERO METRIC */}
            <div className="relative bg-red-50 p-4 rounded-lg border border-red-100 -mt-4 lg:mt-0 col-span-1 lg:col-span-2">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        True Economic Exclusion (U-6)
                    </h3>
                    <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">
                        {u6GapMultiplier}x Disparity
                    </span>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                     <div>
                        <div className="text-4xl font-bold text-red-700 mb-1">{stats.underemploymentRate}%</div>
                        <div className="text-xs font-bold text-red-900 uppercase tracking-wide">Black U-6 Rate</div>
                        <p className="text-xs text-red-800/70 mt-2">
                            Includes involuntary part-time & discouraged workers.
                        </p>
                     </div>
                     <div className="flex flex-col justify-end">
                         <div className="mb-2">
                             <div className="flex justify-between text-xs font-bold text-red-800/60 mb-1">
                                <span>White U-6 Benchmark</span>
                                <span>{stats.whiteUnderemploymentRate}%</span>
                             </div>
                             <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-red-100">
                                 <div className="h-full bg-slate-400" style={{width: '100%'}}></div>
                             </div>
                         </div>
                         <div>
                             <div className="flex justify-between text-xs font-bold text-red-700 mb-1">
                                <span>Black U-6 Actual</span>
                                <span>{stats.underemploymentRate}%</span>
                             </div>
                             <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-red-100">
                                 <div className="h-full bg-red-600" style={{width: `${(stats.underemploymentRate / stats.whiteUnderemploymentRate) * 100}%`}}></div>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded text-xs text-slate-600">
                 <div className="bg-slate-200 p-1 rounded text-slate-600 shrink-0 font-bold">Analysis</div>
                 <p>
                    <strong>The "Missing" Workforce:</strong> The {participationGap}% gap in participation combined with a {u6GapMultiplier}x higher underemployment rate suggests that roughly {hiddenUnemployedRate}% of the Black workforce is utilized below their capacity due to structural barriers.
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LaborMarketAnalysis;
