import React from 'react';
import { GeographicHotspot, LaborStats } from '../types';
import { Map, AlertCircle, TrendingUp, Target } from 'lucide-react';

interface GeographicDrilldownProps {
  hotspots: GeographicHotspot[];
  metroStats: LaborStats;
  metroName: string;
}

const GeographicDrilldown: React.FC<GeographicDrilldownProps> = ({ hotspots, metroStats, metroName }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-indigo-900 text-white p-6 border-b border-indigo-800">
        <div className="flex items-center gap-3 mb-2">
          <Map className="text-amber-400" />
          <h2 className="text-xl font-bold">Geographic Drill-Down: Neighborhood Hotspots</h2>
        </div>
        <p className="text-indigo-200 text-sm">
          Averages hide the truth. While {metroName} has a Black unemployment rate of {metroStats.officialUnemploymentRate}%, specific neighborhoods face crisis-level conditions requiring targeted intervention.
        </p>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="py-3 pl-2">Neighborhood / Tract</th>
                <th className="py-3">Type</th>
                <th className="py-3">Unemployment Gap</th>
                <th className="py-3">Median Income</th>
                <th className="py-3">Policy Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotspots.map((hotspot) => {
                const unemploymentGap = (hotspot.unemploymentRate - metroStats.officialUnemploymentRate).toFixed(1);
                const isCrisis = hotspot.unemploymentRate > (metroStats.officialUnemploymentRate * 1.5);
                
                return (
                  <tr key={hotspot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="font-bold text-slate-800">{hotspot.name}</div>
                      <div className="text-xs text-slate-400">Pop: {hotspot.population.toLocaleString()}</div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                        {hotspot.type}
                      </span>
                    </td>
                    <td className="py-4 pr-6">
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold ${isCrisis ? 'text-red-600' : 'text-slate-600'}`}>
                                {hotspot.unemploymentRate}%
                            </span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full w-32 relative">
                                {/* Metro Average Marker */}
                                <div 
                                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" 
                                    style={{ left: `${Math.min(metroStats.officialUnemploymentRate * 2.5, 100)}%` }} 
                                    title={`Metro Avg: ${metroStats.officialUnemploymentRate}%`}
                                ></div>
                                {/* Bar */}
                                <div 
                                    className={`h-full rounded-full ${isCrisis ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                    style={{ width: `${Math.min(hotspot.unemploymentRate * 2.5, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                            {Number(unemploymentGap) > 0 ? `+${unemploymentGap}% vs Metro` : `${unemploymentGap}% vs Metro`}
                        </div>
                    </td>
                    <td className="py-4">
                       <div className="font-mono text-sm text-slate-700">{formatCurrency(hotspot.medianIncome)}</div>
                    </td>
                    <td className="py-4">
                        {hotspot.interventionTarget !== 'None' ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 w-fit">
                                <Target size={12} />
                                {hotspot.interventionTarget}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400 italic">Stable</span>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div>
                <h4 className="text-sm font-bold text-amber-800">Intervention Logic</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    SMA recommends allocating resources based on <strong>Census Tract deviation</strong>. 
                    Neighborhoods with &gt;1.5x the regional unemployment rate should be designated as "Priority Enterprise Zones" for direct equity investment.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicDrilldown;
