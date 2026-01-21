import React, { useState } from 'react';
import { SectorData } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Droplets, Info, Building2, FileText, Handshake, ChevronDown, ChevronUp } from 'lucide-react';

interface SectorOpportunitiesProps {
  sectors: SectorData[];
}

const SectorOpportunities: React.FC<SectorOpportunitiesProps> = ({ sectors }) => {
  const [expandedSectorId, setExpandedSectorId] = useState<string | null>(null);

  const formatCompactCurrency = (number: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number);
  };

  const toggleSector = (id: string) => {
      setExpandedSectorId(expandedSectorId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-emerald-400" />
          <h2 className="text-xl font-bold">Strategic Procurement & Mobilization Pipeline</h2>
        </div>
        <p className="text-slate-300 text-sm">Identifying "leaky" supply chains and connecting entrepreneurs to the specific Anchors, RFPs, and Capital needed to plug them.</p>
      </div>

      <div className="divide-y divide-slate-200">
        {sectors.map((sector) => {
          const leakageAmount = sector.regionalDemand * (sector.netLeakagePct / 100);
          const retentionPct = 100 - sector.netLeakagePct;
          const isExpanded = expandedSectorId === sector.id;

          return (
            <div key={sector.id} className="bg-white transition-all">
                {/* Summary Row */}
                <div 
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleSector(sector.id)}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{sector.name}</h3>
                                {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span>Demand: <strong>{formatCompactCurrency(sector.regionalDemand)}</strong></span>
                                <span className="hidden md:inline text-slate-300">|</span>
                                <span>Leakage: <strong className="text-red-600">{sector.netLeakagePct}%</strong></span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                             {/* Leakage Visualizer Mini */}
                            <div className="w-32 hidden md:block">
                                <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400">
                                    <span>Retained</span>
                                    <span>Leaked</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-emerald-500" style={{ width: `${retentionPct}%` }}></div>
                                    <div className="h-full bg-red-400" style={{ width: `${sector.netLeakagePct}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="text-right min-w-[100px]">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Active RFPs</span>
                                <span className="text-lg font-mono font-bold text-indigo-600">{sector.activeRFPs.length} Open</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="px-6 pb-6 pt-0 animate-fade-in">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Column 1: The Demand (Anchors) */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-200 pb-2">
                                    <Building2 size={16} className="text-slate-500" />
                                    <span>Top Anchor Buyers</span>
                                </div>
                                <ul className="space-y-2">
                                    {sector.topAnchors.map((anchor, idx) => (
                                        <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                            {anchor}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 2: The Opportunity (RFPs) */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-200 pb-2">
                                    <FileText size={16} className="text-indigo-500" />
                                    <span>Live Contract Tracker</span>
                                </div>
                                <div className="space-y-3">
                                    {sector.activeRFPs.map((rfp) => (
                                        <div key={rfp.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group cursor-pointer">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors line-clamp-1">{rfp.title}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rfp.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {rfp.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-500">
                                                <span>{rfp.issuer}</span>
                                                <span className="font-mono font-bold text-slate-700">{rfp.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Column 3: The Support (Partners) */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-200 pb-2">
                                    <Handshake size={16} className="text-emerald-500" />
                                    <span>Mobilization Partners</span>
                                </div>
                                <div className="space-y-3">
                                    {sector.mobilizationPartners.map((partner, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-2 rounded bg-emerald-50/50 border border-emerald-100">
                                            <div>
                                                <div className="text-sm font-bold text-slate-700">{partner.name}</div>
                                                <div className="text-[10px] text-emerald-700 font-medium uppercase tracking-wide">{partner.type}</div>
                                            </div>
                                            <button className="text-xs bg-white hover:bg-emerald-50 border border-slate-200 text-slate-600 px-2 py-1 rounded transition-colors">
                                                Connect
                                            </button>
                                        </div>
                                    ))}
                                    <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-100 text-xs text-amber-800 italic">
                                        <strong>SMA Strategy:</strong> Leveraging these partners reduces the "cost of trust" for anchors, derisking the contract.
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorOpportunities;
