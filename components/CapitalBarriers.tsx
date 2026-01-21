import React from 'react';
import { CapitalMetrics } from '../types';
import { Ban, DollarSign, TrendingUp, AlertCircle, Lock } from 'lucide-react';

interface CapitalBarriersProps {
  data: CapitalMetrics;
}

const CapitalBarriers: React.FC<CapitalBarriersProps> = ({ data }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  // Disparity Multipliers
  const denialDisparity = (data.denialRate.black / data.denialRate.white).toFixed(1);
  const loanSizeDisparity = (data.avgLoanSize.white / data.avgLoanSize.black).toFixed(1);
  const interestPremium = (data.interestRate.black - data.interestRate.white).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-slate-900 p-6 border-b border-slate-800">
             <div className="flex items-center gap-3 mb-2">
                <Lock className="text-red-400" size={24} />
                <h2 className="text-xl font-bold text-white">Barriers to Capital</h2>
             </div>
             <p className="text-slate-400 text-sm">
                Visualizing the "Black Tax": Higher denial rates, smaller loans, and higher costs of capital.
             </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. The Gatekeepers (Denial Rate) */}
            <div className="flex flex-col">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-red-50 rounded text-red-600"><Ban size={18} /></div>
                    <h3 className="font-bold text-slate-800">The "No" Gap</h3>
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div className="relative pt-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                            <span>White Applicants</span>
                            <span>{data.denialRate.white}% Denied</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-slate-400" style={{ width: `${data.denialRate.white}%` }}></div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                            <span>Black Applicants</span>
                            <span className="text-red-600">{data.denialRate.black}% Denied</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-red-500" style={{ width: `${data.denialRate.black}%` }}></div>
                        </div>
                    </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                        {denialDisparity}x Higher Denial Rate
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2">
                        {data.fearOfRejectionRate.black}% of qualified Black firms did not apply due to fear of rejection (vs {data.fearOfRejectionRate.white}% White).
                    </p>
                 </div>
            </div>

            {/* 2. The Capital Cliff (Loan Size) */}
            <div className="flex flex-col border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-50 rounded text-amber-600"><DollarSign size={18} /></div>
                    <h3 className="font-bold text-slate-800">The Capital Cliff</h3>
                 </div>

                 <div className="flex-1 flex items-end justify-center gap-4 py-4">
                    <div className="w-16 flex flex-col items-center gap-1 group relative">
                        <span className="text-xs font-bold text-slate-600 text-center">{formatCurrency(data.avgLoanSize.white)}</span>
                        <div className="w-full bg-slate-300 rounded-t-sm hover:bg-slate-400 transition-colors" style={{ height: '120px' }}></div>
                        <span className="text-[10px] font-bold text-slate-400">White Avg</span>
                    </div>
                    
                    <div className="w-16 flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-amber-600 text-center">{formatCurrency(data.avgLoanSize.black)}</span>
                        <div className="w-full bg-amber-500 rounded-t-sm" style={{ height: `${(data.avgLoanSize.black / data.avgLoanSize.white) * 120}px` }}></div>
                        <span className="text-[10px] font-bold text-slate-400">Black Avg</span>
                    </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <span className="text-xs font-bold text-slate-600">
                        {loanSizeDisparity}x Capital Disparity
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                        For every $1 a White firm receives, a Black firm receives ${(data.avgLoanSize.black / data.avgLoanSize.white).toFixed(2)}.
                    </p>
                 </div>
            </div>

             {/* 3. The Cost (Interest Rate) */}
            <div className="flex flex-col border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600"><TrendingUp size={18} /></div>
                    <h3 className="font-bold text-slate-800">Cost of Capital</h3>
                 </div>

                 <div className="flex-1 flex flex-col justify-center gap-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="text-xs font-bold text-slate-500">White Avg Rate</span>
                        <span className="font-mono text-lg font-bold text-slate-700">{data.interestRate.white}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-800">Black Avg Rate</span>
                        <span className="font-mono text-lg font-bold text-indigo-600">{data.interestRate.black}%</span>
                    </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <AlertCircle size={12} className="text-red-500" />
                        <span className="text-xs font-bold text-red-600">+{interestPremium}% Risk Premium</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                        Systemic risk scoring bias results in higher debt service costs for Black firms.
                    </p>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default CapitalBarriers;
