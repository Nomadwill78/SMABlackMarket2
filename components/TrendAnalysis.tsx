import React, { useState } from 'react';
import { HistoricalTrend } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';

interface TrendAnalysisProps {
  trends: HistoricalTrend[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trends }) => {
  const [selectedTrendId, setSelectedTrendId] = useState<string>(trends[0]?.id || '');

  const activeTrend = trends.find(t => t.id === selectedTrendId);
  if (!activeTrend) return null;

  const data = activeTrend.series;
  const startYear = data[0];
  const endYear = data[data.length - 1];
  
  const startGap = Math.abs(startYear.whiteValue - startYear.blackValue);
  const endGap = Math.abs(endYear.whiteValue - endYear.blackValue);
  
  const gapChange = endGap - startGap;
  const isWidening = gapChange > 0;
  
  const formatValue = (val: number) => {
    if (activeTrend.unit === '$') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    }
    return `${val}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const blackVal = payload.find((p: any) => p.dataKey === 'blackValue')?.value;
      const whiteVal = payload.find((p: any) => p.dataKey === 'whiteValue')?.value;
      const gap = whiteVal && blackVal ? Math.abs(whiteVal - blackVal) : 0;

      return (
        <div className="bg-slate-900 text-white p-3 rounded shadow-lg border border-slate-700 text-xs">
          <p className="font-bold mb-1">{label}</p>
          <div className="space-y-1">
             <div className="flex justify-between gap-4">
                 <span className="text-slate-300">White:</span>
                 <span className="font-mono font-bold">{formatValue(whiteVal)}</span>
             </div>
             <div className="flex justify-between gap-4">
                 <span className="text-slate-300">Black:</span>
                 <span className="font-mono font-bold text-amber-400">{formatValue(blackVal)}</span>
             </div>
             <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between gap-4">
                 <span className="text-slate-400 uppercase tracking-wider">Gap:</span>
                 <span className="font-mono font-bold text-red-400">{formatValue(gap)}</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <div className="flex items-center gap-2 mb-1">
                <Calendar className="text-indigo-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Historical Gap Analysis (2015-2024)</h2>
            </div>
            <p className="text-sm text-slate-500">Tracking the structural trajectory over the last decade.</p>
         </div>

         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Metric:</span>
            <select 
                value={selectedTrendId}
                onChange={(e) => setSelectedTrendId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
            >
                {trends.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                ))}
            </select>
         </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 w-full min-h-[256px]">
             <ResponsiveContainer width="99%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => activeTrend.unit === '$' ? `$${val/1000}k` : `${val}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="whiteValue" name="White" stroke="#94a3b8" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="blackValue" name="Black" stroke="#d97706" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
             </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center gap-4">
              <div className={`p-4 rounded-lg border ${isWidening ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                   <div className="flex items-center gap-2 mb-2">
                       {isWidening ? <TrendingUp className="text-red-600" /> : <TrendingUp className="text-emerald-600 transform rotate-180" />}
                       <h3 className={`font-bold ${isWidening ? 'text-red-800' : 'text-emerald-800'}`}>
                           Gap is {isWidening ? 'Widening' : 'Narrowing'}
                       </h3>
                   </div>
                   <p className={`text-sm ${isWidening ? 'text-red-700' : 'text-emerald-700'}`}>
                       Since {startYear.year}, the disparity between Black and White outcomes has {isWidening ? 'increased' : 'decreased'} by <strong>{formatValue(Math.abs(gapChange))}</strong>.
                   </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Snapshot Comparison</h4>
                  <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600">{startYear.year} Gap</span>
                      <span className="font-mono font-bold text-slate-800">{formatValue(startGap)}</span>
                  </div>
                  <div className="flex justify-center my-1 text-slate-300"><ArrowRight size={14} className="rotate-90" /></div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{endYear.year} Gap</span>
                      <span className="font-mono font-bold text-slate-800">{formatValue(endGap)}</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;