import React from 'react';
import { GapMetric } from '../types';
import { TrendingUp, Home, Briefcase, DollarSign, Flag } from 'lucide-react';

interface EquityDashboardProps {
  data: GapMetric[];
}

const EquityDashboard: React.FC<EquityDashboardProps> = ({ data }) => {
  const netWorth = data.find(d => d.category === 'Median Net Worth');
  const homeOwner = data.find(d => d.category === 'Home Ownership');
  const bizEquity = data.find(d => d.category === 'Business Equity');
  const income = data.find(d => d.category === 'Median HH Income');

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (!netWorth || !homeOwner || !bizEquity || !income) return <div className="p-8 text-center text-slate-500">Loading Equity Data...</div>;

  const netWorthGap = (netWorth.whiteValue / netWorth.blackValue).toFixed(1);
  const bizEquityGap = (bizEquity.whiteValue / bizEquity.blackValue).toFixed(1);

  // Benchmarking Logic
  const compareToNational = (local: number, national: number, unit: string) => {
      const diff = local - national;
      const isBetter = diff > 0;
      const pctDiff = ((diff / national) * 100).toFixed(1);
      
      return (
          <div className="flex items-center gap-1 text-[10px] mt-1">
              <span className="text-slate-400">vs National Black Avg:</span>
              <span className={`font-bold ${isBetter ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isBetter ? '+' : ''}{unit === '$' ? formatCurrency(diff) : `${diff.toFixed(1)}%`} ({isBetter ? '+' : ''}{pctDiff}%)
              </span>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Narrative Header */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border-l-4 border-emerald-500">
            <h2 className="text-2xl font-bold mb-2">The Wealth & Asset Gap</h2>
            <p className="text-slate-300 max-w-3xl leading-relaxed">
                Income measures <span className="text-slate-400 italic">flow</span>, but wealth measures <span className="text-emerald-400 font-bold">power</span>. 
                SMA tracks Net Worth and Business Equity to reveal the deep structural disparities that income data often hides.
            </p>
        </div>

        {/* Section 1: Household Wealth (The Foundation) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Worth Hero */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Median Net Worth</h3>
                            <div className="text-xs text-slate-500">The primary indicator of intergenerational resilience</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                                <span>White Household (Local)</span>
                                <span>{formatCurrency(netWorth.whiteValue)}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-slate-300 w-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                                <span>Black Household (Local)</span>
                                <span className="text-emerald-700">{formatCurrency(netWorth.blackValue)}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-emerald-500" style={{width: `${(netWorth.blackValue / netWorth.whiteValue) * 100}%`}}></div>
                                {/* National Marker */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10 dashed" style={{left: `${(netWorth.nationalBlackAvg / netWorth.whiteValue) * 100}%`}}></div>
                            </div>
                            {compareToNational(netWorth.blackValue, netWorth.nationalBlackAvg, '$')}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="text-xs text-slate-400">Source: {netWorth.source}</div>
                    <div className="bg-red-50 px-3 py-1 rounded text-red-700 text-sm font-bold border border-red-100">
                        {netWorthGap}x Disparity
                    </div>
                </div>
            </div>

            {/* Homeownership */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                     <div className="p-2 bg-blue-100 rounded-lg text-blue-800">
                        <Home size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Homeownership Rate</h3>
                         <div className="text-xs text-slate-500">Access to the #1 wealth building asset</div>
                    </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center p-4">
                     <div className="w-full h-40 flex items-end justify-center gap-8">
                        <div className="w-24 flex flex-col items-center gap-2">
                             <span className="font-bold text-2xl text-slate-800">{homeOwner.whiteValue}%</span>
                             <div className="w-full bg-slate-300 rounded-t-lg" style={{height: `${homeOwner.whiteValue}%`}}></div>
                             <span className="text-xs font-bold text-slate-500">White</span>
                        </div>
                        <div className="w-24 flex flex-col items-center gap-2">
                             <span className="font-bold text-2xl text-blue-600">{homeOwner.blackValue}%</span>
                             <div className="w-full bg-blue-500 rounded-t-lg" style={{height: `${homeOwner.blackValue}%`}}></div>
                             <span className="text-xs font-bold text-slate-500">Black</span>
                        </div>
                     </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                     <div className="mb-2">
                        {compareToNational(homeOwner.blackValue, homeOwner.nationalBlackAvg, '%')}
                     </div>
                    <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-400">Gap: {homeOwner.whiteValue - homeOwner.blackValue} points</span>
                         <span className="text-slate-400">Source: {homeOwner.source}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 2: Business Power (Full Width) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                    <Briefcase size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Business Equity (Valuation)</h3>
                    <div className="text-xs text-slate-500">The end result of capital access barriers</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div>
                     <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 text-right">
                            <div className="text-xs text-slate-500">White-Owned</div>
                            <div className="text-xl font-bold text-slate-800">{formatCurrency(bizEquity.whiteValue)}</div>
                        </div>
                        <div className="text-slate-300 text-2xl font-light">/</div>
                        <div className="flex-1">
                             <div className="text-xs text-slate-500">Black-Owned</div>
                            <div className="text-xl font-bold text-amber-600">{formatCurrency(bizEquity.blackValue)}</div>
                        </div>
                    </div>
                     <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className="absolute inset-y-0 left-0 bg-slate-300" style={{width: '100%'}}></div>
                        <div className="absolute inset-y-0 left-0 bg-amber-500 border-r-2 border-white" style={{width: `${(bizEquity.blackValue / bizEquity.whiteValue) * 100}%`}}></div>
                     </div>
                     {compareToNational(bizEquity.blackValue, bizEquity.nationalBlackAvg, '$')}
                 </div>
                 <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-center">
                      <span className="block text-3xl font-bold text-red-600 mb-1">{bizEquityGap}x</span>
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">Valuation Disparity</span>
                      <p className="text-xs text-amber-800 mt-2">
                          Black firms are undervalued due to lack of growth capital, preventing them from scaling to maturity.
                      </p>
                 </div>
            </div>
         </div>
    </div>
  );
};

export default EquityDashboard;
