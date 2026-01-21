import React, { useState, useEffect } from 'react';
import { RegionDataBundle } from './types';
import { EconomicDataService } from './services/EconomicDataService';
import ImpactSimulator from './components/ImpactSimulator';
import EquityDashboard from './components/EquityDashboard';
import SectorOpportunities from './components/SectorOpportunities';
import LaborMarketAnalysis from './components/LaborMarketAnalysis';
import CapitalBarriers from './components/CapitalBarriers';
import GeographicDrilldown from './components/GeographicDrilldown';
import TrendAnalysis from './components/TrendAnalysis';
import DataStatus from './components/DataStatus';
import { Menu, X, ChevronDown, MapPin, Loader2, Download } from 'lucide-react';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'equity' | 'simulator'>('overview');
  
  // Data State
  const [regionId, setRegionId] = useState<string>('memphis');
  const [data, setData] = useState<RegionDataBundle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const availableRegions = EconomicDataService.getAvailableRegions();

  // Async Fetch Effect
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await EconomicDataService.fetchRegionData(regionId);
        if (mounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to connect to regional data streams.");
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, [regionId]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegionId(e.target.value);
  };

  const handleExport = () => {
      if (data) {
          EconomicDataService.exportRegionDataAsCSV(data);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Live Data Status Bar */}
      <DataStatus 
        isLoading={isLoading} 
        lastUpdated={data?.lastUpdated || null} 
        regionName={data?.context.name || "Unknown"} 
        metadata={data?.sourceMetadata}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded flex items-center justify-center font-bold text-slate-900 text-xs shadow-inner">
                  SMA
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base leading-none">Economic Equity Dashboard</span>
                </div>
              </div>
              
              {/* Region Selector */}
              <div className="hidden md:flex items-center ml-4 bg-slate-800 rounded-md border border-slate-700 px-3 py-1">
                <MapPin size={14} className="text-slate-400 mr-2" />
                <select 
                  value={regionId} 
                  onChange={handleRegionChange}
                  className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
                  disabled={isLoading}
                >
                  {availableRegions.map(r => (
                    <option key={r.id} value={r.id} className="bg-slate-800">{r.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 ml-2" />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'overview' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Regional Pulse
              </button>
              <button 
                onClick={() => setActiveTab('equity')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'equity' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Equity Gaps
              </button>
              <button 
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'simulator' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Impact Simulator
              </button>
              
              <div className="w-px h-6 bg-slate-700 mx-2"></div>
              
              <button 
                onClick={handleExport}
                disabled={isLoading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download Data as CSV"
              >
                  <Download size={14} />
                  Export
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
             <div className="px-4 py-3 border-b border-slate-700">
                <label className="text-xs text-slate-400 block mb-1">Select Region</label>
                <select 
                  value={regionId} 
                  onChange={handleRegionChange}
                  className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600"
                >
                  {availableRegions.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
             </div>
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-white">Regional Pulse</button>
                <button onClick={() => { setActiveTab('equity'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-white">Equity Gaps</button>
                <button onClick={() => { setActiveTab('simulator'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-white">Impact Simulator</button>
                <button onClick={() => { handleExport(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-emerald-400 font-bold border-t border-slate-700 mt-2">Download Data CSV</button>
             </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-slate-600">Syncing with Federal Databases...</h3>
                <p className="text-sm text-slate-400">Fetching latest census and BLS employment figures for {availableRegions.find(r => r.id === regionId)?.name}.</p>
            </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="underline mt-2">Retry Connection</button>
            </div>
        )}

        {/* Data View */}
        {!isLoading && !error && data && (
            <div className="space-y-8 animate-fade-in">
                
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Hero Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.indicators.map((indicator) => (
                                <div key={indicator.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-sm font-medium text-slate-500 mb-2">{indicator.label}</h3>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-3xl font-bold text-slate-900">{indicator.value}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded mb-1 ${
                                            indicator.trend === 'up' ? 'bg-red-100 text-red-700' : 
                                            indicator.trend === 'down' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {indicator.trendLabel}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 border-t border-slate-100 pt-2 mt-2">{indicator.context}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Geographic Deep Dive */}
                        <GeographicDrilldown 
                            hotspots={data.hotspots} 
                            metroStats={data.laborStats}
                            metroName={data.context.name}
                        />

                        {/* Labor Market Deep Dive */}
                        <LaborMarketAnalysis stats={data.laborStats} regionName={data.context.name} />

                        <SectorOpportunities sectors={data.sectors} />

                        <div className="bg-indigo-900 rounded-xl p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">Why This Matters</h2>
                                <p className="text-indigo-200 text-lg leading-relaxed">
                                    "The goal isn't just to increase black employment—it's to capture the multiplier effect. When we own the supply chain, the dollar circulates within our community instead of leaking out."
                                </p>
                            </div>
                            <div className="shrink-0">
                                 <button 
                                    onClick={() => setActiveTab('simulator')}
                                    className="bg-amber-400 text-slate-900 hover:bg-amber-300 px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
                                 >
                                    Run Impact Simulation
                                 </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'equity' && (
                    <div className="space-y-8">
                         <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-2">Structural Analysis: {data.context.name}</h2>
                            <p className="text-slate-600 max-w-3xl">
                                These charts visualize the "starting line" disparity in {data.context.state}. Policy interventions that ignore these wealth and capital gaps will fail to produce equitable outcomes. SMA focuses on <strong>Asset-Building</strong> rather than just income.
                            </p>
                         </div>
                        <EquityDashboard data={data.gaps} />
                        
                        {/* NEW: Trend Analysis */}
                        <TrendAnalysis trends={data.historicalTrends} />

                        {/* DEEP DIVE: Capital Barriers */}
                        <CapitalBarriers data={data.capitalMetrics} />
                    </div>
                )}

                {activeTab === 'simulator' && (
                    <div className="space-y-8">
                        <ImpactSimulator sectors={data.sectors} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-2">For Policymakers</h3>
                                <p className="text-sm text-slate-600">
                                    Use this data to justify procurement set-asides. If a project uses "Green Construction," require local hiring to trigger the 1.85x multiplier shown above.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                 <h3 className="font-bold text-slate-800 mb-2">For Philanthropy</h3>
                                 <p className="text-sm text-slate-600">
                                    Stop funding "training" without demand. Fund the <strong>Business Owners</strong> in the high-multiplier sectors so they can afford to hire the trainees.
                                 </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
