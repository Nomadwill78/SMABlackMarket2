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
import CostOfCapitalCalculator from './components/CostOfCapitalCalculator';
import IndustryDeepDive from './components/IndustryDeepDive';

import { Menu, X, ChevronDown, MapPin, Loader2, Download, Users, Briefcase, Wallet, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'equity' | 'simulator' | 'strategy'>('overview');
  
  // Data State
  const [regionId, setRegionId] = useState<string>('memphis');
  const [data, setData] = useState<RegionDataBundle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const availableRegions = EconomicDataService.getAvailableRegions();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

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

  // Helper to get icon for hero cards
  const getIndicatorIcon = (id: string) => {
    switch(id) {
        case 'unemp': return <Users size={24} className="text-white" />;
        case 'biz-own': return <Briefcase size={24} className="text-white" />;
        case 'wage': return <Wallet size={24} className="text-white" />;
        default: return <Users size={24} className="text-white" />;
    }
  };

  // Helper for gradient backgrounds
  const getIndicatorGradient = (id: string) => {
      switch(id) {
          case 'unemp': return 'from-blue-500 to-blue-600';
          case 'biz-own': return 'from-amber-500 to-amber-600';
          case 'wage': return 'from-emerald-500 to-emerald-600';
          default: return 'from-indigo-500 to-indigo-600';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Live Data Status Bar */}
      <DataStatus 
        isLoading={isLoading} 
        lastUpdated={data?.lastUpdated || null} 
        metadata={data?.sourceMetadata}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A] text-white border-b border-white/10 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-serif font-bold text-lg shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-105">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl tracking-tight">SMA</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Economic Equity</span>
                </div>
              </div>
              
              {/* Region Selector */}
              <div className="hidden md:flex items-center ml-6 bg-white/5 rounded-full border border-white/10 px-4 py-1.5 hover:bg-white/10 transition-colors">
                <MapPin size={14} className="text-emerald-400 mr-2" />
                <select 
                  value={regionId} 
                  onChange={handleRegionChange}
                  className="bg-transparent text-sm text-white focus:outline-none cursor-pointer font-medium"
                  disabled={isLoading}
                >
                  {availableRegions.map(r => (
                    <option key={r.id} value={r.id} className="bg-slate-900 text-white">{r.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-gray-400 ml-2" />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {[
                { id: 'overview', label: 'Regional Pulse' },
                { id: 'equity', label: 'Equity Gaps' },
                { id: 'simulator', label: 'Impact Simulator' },
                { id: 'strategy', label: 'Industry Strategy', icon: ShieldCheck }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
                      activeTab === tab.id 
                        ? 'bg-white text-black shadow-lg transform scale-105' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon && <tab.icon size={14} />}
                  {tab.label}
                </button>
              ))}
              
              <div className="w-px h-6 bg-white/10 mx-4"></div>
              
              <button 
                onClick={handleExport}
                disabled={isLoading}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                title="Download Data as CSV"
              >
                  <Download size={14} />
                  Export Data
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
                <button onClick={() => { setActiveTab('strategy'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-white">Industry Strategy</button>
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
                            <div className="space-y-12">
                                {/* Hero Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {data.indicators.map((indicator) => (
                                        <div key={indicator.id} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group overflow-hidden">
                                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${getIndicatorGradient(indicator.id)} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{indicator.label}</h3>
                                                    <div className={`p-2 rounded-full bg-gray-50 text-gray-400 group-hover:text-gray-600 transition-colors`}>
                                                        {getIndicatorIcon(indicator.id)}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-baseline gap-3 mb-2">
                                                    <span className="text-4xl font-mono font-medium text-gray-900 tracking-tight">{indicator.value}</span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                                                        indicator.trend === 'up' ? 'bg-red-50 text-red-600' : 
                                                        indicator.trend === 'down' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'
                                                    }`}>
                                                        {indicator.trendLabel}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2 font-medium border-t border-gray-100 pt-3">{indicator.context}</p>
                                            </div>
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
                                <LaborMarketAnalysis stats={data.laborStats} />

                                <SectorOpportunities sectors={data.sectors} />

                                <div className="bg-[#111827] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
                                    {/* Decorative background element */}
                                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
                                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                    
                                    <div className="flex-1 relative z-10">
                                        <h2 className="text-3xl font-serif font-medium mb-4">Why This Matters</h2>
                                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                                            "The goal isn't just to increase black employment—it's to capture the multiplier effect. When we own the supply chain, the dollar circulates within our community instead of leaking out."
                                        </p>
                                    </div>
                                    <div className="shrink-0 relative z-10">
                                        <button 
                                            onClick={() => setActiveTab('strategy')}
                                            className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center gap-3"
                                        >
                                            View Sector Strategy
                                            <ShieldCheck size={18} />
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
                                
                                <TrendAnalysis trends={data.historicalTrends} />

                                {/* DEEP DIVE: Capital Barriers */}
                                <div className="grid grid-cols-1 gap-8">
                                <CapitalBarriers data={data.capitalMetrics} />
                                
                                <CostOfCapitalCalculator metrics={data.capitalMetrics} />
                                </div>
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

                        {activeTab === 'strategy' && (
                            <div className="space-y-8">
                                <IndustryDeepDive sectors={data.sectors} />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;