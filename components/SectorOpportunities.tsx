import React, { useState } from 'react';
import { SectorData } from '../types';
import { TrendingUp, Building2, FileText, Users, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="bg-gray-900 text-white p-8 border-b border-gray-800">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <TrendingUp className="text-emerald-400" size={24} />
          </div>
          <h2 className="text-2xl font-serif font-bold">Strategic Procurement & Mobilization Pipeline</h2>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">Identifying "leaky" supply chains and connecting entrepreneurs to the specific Anchors, RFPs, and Capital needed to plug them.</p>
      </div>

      <div className="divide-y divide-gray-100">
        {sectors.map((sector) => {
          const retentionPct = 100 - sector.netLeakagePct;
          const isExpanded = expandedSectorId === sector.id;

          return (
            <div key={sector.id} className="bg-white transition-all">
                {/* Summary Row */}
                <div 
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}
                    onClick={() => toggleSector(sector.id)}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{sector.name}</h3>
                                {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    Demand: <strong className="font-mono text-gray-900">{formatCompactCurrency(sector.regionalDemand)}</strong>
                                </span>
                                <span className="hidden md:inline text-gray-300">|</span>
                                <span className="flex items-center gap-2">
                                    Leakage: <strong className="font-mono text-red-600">{sector.netLeakagePct}%</strong>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                             {/* Leakage Visualizer Mini */}
                            <div className="w-48 hidden md:block">
                                <div className="flex justify-between text-[10px] mb-2 font-bold text-gray-400 uppercase tracking-wider">
                                    <span>Retained</span>
                                    <span>Leaked</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-emerald-500" style={{ width: `${retentionPct}%` }}></div>
                                    <div className="h-full bg-red-400" style={{ width: `${sector.netLeakagePct}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="text-right min-w-[120px]">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Active RFPs</span>
                                <span className="text-xl font-mono font-bold text-indigo-600">{sector.activeRFPs.length} Open</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="px-6 pb-8 pt-2 animate-fade-in">
                        <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-10">
                            
                            {/* Column 1: The Demand (Anchors) */}
                            <div>
                                <div className="flex items-center gap-3 mb-4 text-gray-900 font-bold border-b border-gray-100 pb-3">
                                    <div className="p-1.5 bg-gray-100 rounded-md">
                                        <Building2 size={16} className="text-gray-600" />
                                    </div>
                                    <span className="text-sm uppercase tracking-wide">Top Anchor Buyers</span>
                                </div>
                                <ul className="space-y-3">
                                    {sector.topAnchors.map((anchor, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                            {anchor}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 2: The Opportunity (RFPs) */}
                            <div>
                                <div className="flex items-center gap-3 mb-4 text-gray-900 font-bold border-b border-gray-100 pb-3">
                                    <div className="p-1.5 bg-indigo-50 rounded-md">
                                        <FileText size={16} className="text-indigo-600" />
                                    </div>
                                    <span className="text-sm uppercase tracking-wide">Live Contract Tracker</span>
                                </div>
                                <div className="space-y-3">
                                    {sector.activeRFPs.map((rfp) => (
                                        <div key={rfp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-gray-700 group-hover:text-indigo-700 transition-colors line-clamp-1">{rfp.title}</span>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${rfp.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                    {rfp.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{rfp.issuer}</span>
                                                <span className="font-mono font-bold text-gray-900">{rfp.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Column 3: The Support (Partners) */}
                            <div>
                                <div className="flex items-center gap-3 mb-4 text-gray-900 font-bold border-b border-gray-100 pb-3">
                                    <div className="p-1.5 bg-emerald-50 rounded-md">
                                        <Users size={16} className="text-emerald-600" />
                                    </div>
                                    <span className="text-sm uppercase tracking-wide">Mobilization Partners</span>
                                </div>
                                <div className="space-y-3">
                                    {sector.mobilizationPartners.map((partner, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/30 border border-emerald-100/50">
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">{partner.name}</div>
                                                <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wide mt-0.5">{partner.type}</div>
                                            </div>
                                            <button className="text-xs bg-white hover:bg-emerald-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                                Connect
                                            </button>
                                        </div>
                                    ))}
                                    <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-amber-900 leading-relaxed">
                                        <strong className="block mb-1 text-amber-700 uppercase tracking-wide text-[10px]">SMA Strategy</strong>
                                        Leveraging these partners reduces the "cost of trust" for anchors, derisking the contract.
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
