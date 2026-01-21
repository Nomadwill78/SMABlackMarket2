import React, { useState } from 'react';
import { Activity, Database, Clock, ChevronDown } from 'lucide-react';
import { SourceMetadata } from '../types';

interface DataStatusProps {
  isLoading: boolean;
  lastUpdated: string | null;
  regionName: string;
  metadata?: SourceMetadata;
}

const DataStatus: React.FC<DataStatusProps> = ({ isLoading, lastUpdated, regionName, metadata }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900 text-slate-400 text-xs border-b border-slate-800 relative z-40">
        <div className="py-2 px-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                <Activity size={12} className={isLoading ? "animate-pulse text-amber-400" : "text-emerald-500"} />
                <span>
                    {isLoading ? "Connecting to Government Data Feeds..." : "Live Connection Active"}
                </span>
                </div>
                
                {/* Metadata Toggle */}
                {!isLoading && metadata && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <Database size={12} />
                        <span>View Source Timestamps</span>
                        <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>
            
            {!isLoading && lastUpdated && (
                <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>Dash updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
                </div>
            )}
        </div>

        {/* Expanded Metadata Panel */}
        {isExpanded && metadata && (
            <div className="bg-slate-800 px-4 py-3 grid grid-cols-3 gap-4 border-t border-slate-700 animate-fade-in">
                <div>
                    <div className="font-bold text-slate-300">BLS Employment</div>
                    <div className="text-slate-500">{metadata.blsDate}</div>
                </div>
                <div>
                    <div className="font-bold text-slate-300">Census ACS</div>
                    <div className="text-slate-500">{metadata.censusDate}</div>
                </div>
                <div>
                    <div className="font-bold text-slate-300">Fed Reserve (FRED)</div>
                    <div className="text-slate-500">{metadata.fredDate}</div>
                </div>
            </div>
        )}
    </div>
  );
};

export default DataStatus;
