import React, { useState } from 'react';
import { CapitalMetrics } from '../types';
import { DollarSign, RefreshCw, AlertOctagon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CostOfCapitalCalculatorProps {
  metrics: CapitalMetrics;
}

const CostOfCapitalCalculator: React.FC<CostOfCapitalCalculatorProps> = ({ metrics }) => {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTermYears, setLoanTermYears] = useState(5);

  // Amortization Calculation
  const calculateLoan = (principal: number, ratePercent: number, years: number) => {
    const r = ratePercent / 100 / 12; // Monthly rate
    const n = years * 12; // Total payments
    
    // Monthly Payment Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalCost = monthlyPayment * n;
    const totalInterest = totalCost - principal;

    return {
      monthlyPayment,
      totalInterest,
      totalCost
    };
  };

  const whiteLoan = calculateLoan(loanAmount, metrics.interestRate.white, loanTermYears);
  const blackLoan = calculateLoan(loanAmount, metrics.interestRate.black, loanTermYears);

  const blackTax = blackLoan.totalInterest - whiteLoan.totalInterest;
  const percentIncrease = ((blackLoan.totalInterest / whiteLoan.totalInterest) - 1) * 100;

  const chartData = [
    {
      name: 'White-Owned Firm',
      Principal: loanAmount,
      Interest: whiteLoan.totalInterest,
      Excess: 0,
      rate: metrics.interestRate.white
    },
    {
      name: 'Black-Owned Firm',
      Principal: loanAmount,
      Interest: whiteLoan.totalInterest, // Base interest
      Excess: blackTax, // The disparity
      rate: metrics.interestRate.black
    }
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="text-emerald-400" />
            <h2 className="text-xl font-bold">The "Cost of Capital" Simulator</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            See how the interest rate gap impacts the bottom line of a business over time.
          </p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Loan Amount</label>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-slate-400" />
              <input 
                type="number" 
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="text-2xl font-bold bg-transparent border-b border-slate-300 focus:border-indigo-500 focus:outline-none w-full pb-1"
              />
            </div>
            <input 
              type="range" 
              min="10000" 
              max="500000" 
              step="5000" 
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>$10k</span>
              <span>$500k</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Loan Term</label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 20].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setLoanTermYears(yr)}
                  className={`py-2 text-sm font-bold rounded border transition-colors ${
                    loanTermYears === yr 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertOctagon size={20} className="text-red-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-800 uppercase mb-1">The Black Tax</div>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  +{formatCurrency(blackTax)}
                </div>
                <p className="text-xs text-red-700 leading-tight">
                  Extra interest paid solely due to the rate disparity ({metrics.interestRate.black}% vs {metrics.interestRate.white}%) over {loanTermYears} years.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visuals */}
        <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(val) => `$${val/1000}k`} hide />
                  <YAxis type="category" dataKey="name" width={110} tick={{fontSize: 12, fontWeight: 'bold', fill: '#475569'}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="Principal" stackId="a" fill="#e2e8f0" barSize={32} />
                  <Bar dataKey="Interest" stackId="a" fill="#64748b" />
                  <Bar dataKey="Excess" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]}>
                    
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">White-Owned Cost</div>
                <div className="text-xl font-bold text-slate-700">{formatCurrency(whiteLoan.totalCost)}</div>
                <div className="text-xs text-slate-400 mt-1">{formatCurrency(whiteLoan.monthlyPayment)} / mo</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-200 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-bl">
                   +{percentIncrease.toFixed(0)}% Interest
                </div>
                <div className="text-xs text-red-700 font-bold uppercase mb-1">Black-Owned Cost</div>
                <div className="text-xl font-bold text-red-700">{formatCurrency(blackLoan.totalCost)}</div>
                <div className="text-xs text-red-500 mt-1">{formatCurrency(blackLoan.monthlyPayment)} / mo</div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CostOfCapitalCalculator;