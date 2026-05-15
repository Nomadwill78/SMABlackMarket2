import React from 'react';
import { GapMetric } from '../types';
import { Home, Briefcase, DollarSign } from 'lucide-react';

interface EquityDashboardProps {
  data: GapMetric[];
}

const EquityDashboard: React.FC<EquityDashboardProps> = ({ data }) => {
  const netWorth = data.find(d => d.category === 'Median Net Worth');
  const homeOwner = data.find(d => d.category === 'Home Ownership');
  const bizEquity = data.find(d => d.category === 'Business Equity');
  const income = data.find(d => d.category === 'Median HH Income');

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (!netWorth || !homeOwner || !bizEquity || !income) return <div className="p-8 text-center text-gray-500 font-mono">Loading Equity Data...</div>;

  const netWorthGap = (netWorth.whiteValue / netWorth.blackValue).toFixed(1);
  const bizEquityGap = (bizEquity.whiteValue / bizEquity.blackValue).toFixed(1);

  // Benchmarking Logic
  const compareToNational = (local: number, national: number, unit: string) => {
      const diff = local - national;
      const isBetter = diff > 0;
      const pctDiff = ((diff / national) * 100).toFixed(1);
      
      return (
          <div className="flex items-center gap-2 text-xs mt-2 font-mono">
              <span className="text-gray-400">vs National Black Avg:</span>
              <span className={`font-bold ${isBetter ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isBetter ? '+' : ''}{unit === '$' ? formatCurrency(diff) : `${diff.toFixed(1)}%`} ({isBetter ? '+' : ''}{pctDiff}%)
              </span>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Narrative Header */}
        <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg border-l-4 border-emerald-500">
            <h2 className="text-3xl font-serif font-medium mb-3">The Wealth & Asset Gap</h2>
            <p className="text-gray-300 max-w-3xl leading-relaxed text-lg font-light">
                Income measures <span className="text-gray-400 italic">flow</span>, but wealth measures <span className="text-emerald-400 font-medium">power</span>. 
                SMA tracks Net Worth and Business Equity to reveal the deep structural disparities that income data often hides.
            </p>
        </div>

        {/* Section 1: Household Wealth (The Foundation) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Net Worth Hero */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">Median Net Worth</h3>
                            <div className="text-sm text-gray-500">The primary indicator of intergenerational resilience</div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">
                                <span>White Household (Local)</span>
                                <span className="font-mono text-gray-900">{formatCurrency(netWorth.whiteValue)}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-gray-300 w-full rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">
                                <span>Black Household (Local)</span>
                                <span className="font-mono text-emerald-700">{formatCurrency(netWorth.blackValue)}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" style={{width: `${(netWorth.blackValue / netWorth.whiteValue) * 100}%`}}></div>
                                {/* National Marker */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-black z-10" style={{left: `${(netWorth.nationalBlackAvg / netWorth.whiteValue) * 100}%`}}></div>
                            </div>
                            {compareToNational(netWorth.blackValue, netWorth.nationalBlackAvg, '$')}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-400 font-mono">Source: {netWorth.source}</div>
                    <div className="bg-red-50 px-4 py-2 rounded-lg text-red-700 text-sm font-bold border border-red-100 font-mono">
                        {netWorthGap}x Disparity
                    </div>
                </div>
            </div>

            {/* Homeownership */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
                        <Home size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-gray-900">Homeownership Rate</h3>
                         <div className="text-sm text-gray-500">Access to the #1 wealth building asset</div>
                    </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center p-4">
                     <div className="w-full h-48 flex items-end justify-center gap-12">
                        <div className="w-24 flex flex-col items-center gap-3 group">
                             <span className="font-mono font-bold text-3xl text-gray-900">{homeOwner.whiteValue}%</span>
                             <div className="w-full bg-gray-200 rounded-t-xl transition-all group-hover:bg-gray-300" style={{height: `${homeOwner.whiteValue}%`}}></div>
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">White</span>
                        </div>
                        <div className="w-24 flex flex-col items-center gap-3 group">
                             <span className="font-mono font-bold text-3xl text-blue-600">{homeOwner.blackValue}%</span>
                             <div className="w-full bg-blue-500 rounded-t-xl transition-all group-hover:bg-blue-600" style={{height: `${homeOwner.blackValue}%`}}></div>
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Black</span>
                        </div>
                     </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                     <div className="mb-2">
                        {compareToNational(homeOwner.blackValue, homeOwner.nationalBlackAvg, '%')}
                     </div>
                    <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                         <span>Gap: {homeOwner.whiteValue - homeOwner.blackValue} points</span>
                         <span>Source: {homeOwner.source}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 2: Business Power (Full Width) */}
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-gray-900">Business Equity (Valuation)</h3>
                    <div className="text-sm text-gray-500">The end result of capital access barriers</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div>
                     <div className="flex items-center gap-8 mb-6">
                        <div className="flex-1 text-right">
                            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">White-Owned</div>
                            <div className="text-2xl font-mono font-bold text-gray-900">{formatCurrency(bizEquity.whiteValue)}</div>
                        </div>
                        <div className="text-gray-200 text-4xl font-light">/</div>
                        <div className="flex-1">
                             <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Black-Owned</div>
                            <div className="text-2xl font-mono font-bold text-amber-600">{formatCurrency(bizEquity.blackValue)}</div>
                        </div>
                    </div>
                     <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <div className="absolute inset-y-0 left-0 bg-gray-300" style={{width: '100%'}}></div>
                        <div className="absolute inset-y-0 left-0 bg-amber-500 border-r-2 border-white" style={{width: `${(bizEquity.blackValue / bizEquity.whiteValue) * 100}%`}}></div>
                     </div>
                     {compareToNational(bizEquity.blackValue, bizEquity.nationalBlackAvg, '$')}
                 </div>
                 <div className="bg-amber-50/50 p-8 rounded-2xl border border-amber-100 text-center">
                      <span className="block text-5xl font-mono font-bold text-red-600 mb-2 tracking-tighter">{bizEquityGap}x</span>
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">Valuation Disparity</span>
                      <p className="text-sm text-amber-800 mt-4 leading-relaxed max-w-xs mx-auto">
                          Black firms are undervalued due to lack of growth capital, preventing them from scaling to maturity.
                      </p>
                 </div>
            </div>
         </div>
    </div>
  );
};

export default EquityDashboard;
