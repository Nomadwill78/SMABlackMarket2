import React from 'react';
import { SectorData } from '../types';
import { Building2, TrendingUp, Target, ShieldCheck, Zap, Users, MapPin } from 'lucide-react';

interface IndustryDeepDiveProps {
  sectors: SectorData[];
}

const IndustryDeepDive: React.FC<IndustryDeepDiveProps> = ({ sectors }) => {
  // Sort by regional demand to get the "Top 8"
  const topSectors = [...sectors]
    .sort((a, b) => b.regionalDemand - a.regionalDemand)
    .slice(0, 8);

  const formatCompactCurrency = (number: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number);
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      {/* Header Banner */}
      <div className="relative bg-[#050505] rounded-3xl p-10 md:p-16 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] -mr-32 -mt-32 mix-blend-screen"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-mono uppercase tracking-widest text-emerald-300 border border-white/5">
              Strategic Mobilization
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-mono uppercase tracking-widest text-indigo-300 border border-white/5">
              Top Industrial Targets
            </span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[0.9] mb-8 tracking-tight">
            The South's <br/>
            <span className="italic text-emerald-400">Equity Pipeline</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed border-l-2 border-emerald-500 pl-6">
            We don't just measure industries; we identify where the money is "leaking" out of our communities and how to plug those gaps with Black-led ventures.
          </p>
        </div>
      </div>

      {/* Grid of Top Industries */}
      <section>
        <div className="flex items-end gap-4 mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-4xl font-serif font-medium text-gray-900">01. Priority Power Clusters</h2>
          <span className="text-gray-400 font-mono text-sm mb-2">/ HIGH-DEMAND OPPORTUNITIES</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topSectors.map((sector, idx) => (
            <div key={sector.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors">
                  <Building2 size={20} />
                </div>
                <span className="font-mono text-xs text-gray-300 font-bold">0{idx + 1}</span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 mb-2">{sector.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {sector.description}
              </p>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 uppercase tracking-wider font-bold">Regional Demand</span>
                  <span className="font-mono font-bold text-gray-900">{formatCompactCurrency(sector.regionalDemand)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 uppercase tracking-wider font-bold">Leakage Gap</span>
                  <span className="font-mono font-bold text-red-500">{sector.netLeakagePct}%</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${sector.leakageScore === 'High' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{sector.leakageScore} Leakage Risk</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Framework */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="flex items-end gap-4 mb-10 border-b border-gray-200 pb-4">
            <h2 className="text-4xl font-serif font-medium text-gray-900">02. The SMA Strategy</h2>
            <span className="text-gray-400 font-mono text-sm mb-2">/ MOBILIZATION FRAMEWORK</span>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                title: "Asset Identification", 
                desc: "We look beyond payroll to equity. Our priority is supporting businesses in high-multiplier sectors where ownership creates generational mobility.",
                icon: Target,
                color: "indigo"
              },
              { 
                title: "Procurement Mobilization", 
                desc: "We bridge the gap between large Anchor Institutions (Hospitals, Universities) and minority vendors through 'Contract-Ready' certification.",
                icon: Users,
                color: "emerald"
              },
              { 
                title: "Capital Infusion", 
                desc: "By derisking ventures through strategic partnerships, we lower the 'Cost of Capital' and increase the absolute loan size for Black founders.",
                icon: Zap,
                color: "amber"
              }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 p-6 rounded-2xl border border-gray-100 hover:border-emerald-100 bg-white transition-colors">
                <div className={`p-4 bg-${step.color}-50 text-${step.color}-600 rounded-xl h-fit`}>
                  <step.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
           <div className="flex items-end gap-4 mb-10 border-b border-gray-200 pb-4">
            <h2 className="text-4xl font-serif font-medium text-gray-900">03. The Mission</h2>
          </div>
          
          <div className="bg-[#111827] text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-emerald-400 font-serif text-2xl italic mb-4">Our Core Vision</h3>
                  <p className="text-lg text-gray-300 font-light leading-relaxed">
                    "The SMA serves as the economic architect for the Black South. We believe that economic equity is not achieved through jobs alone, but through the ownership of the means of production within our regional power clusters."
                  </p>
                </div>

                <div className="pt-8 border-t border-gray-800 space-y-6">
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold uppercase tracking-widest text-emerald-400 mb-1">Advocacy Lead</span>
                        <p className="text-xs text-gray-400">Pushing for 'Living Wage' transparency and procurement transparency in all 8 core sectors.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20 shrink-0">
                        <TrendingUp size={16} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold uppercase tracking-widest text-sky-400 mb-1">Growth Catalyst</span>
                        <p className="text-xs text-gray-400">Accelerating Black business growth to trigger the 1.85x multiplier effect across the region.</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
                 <p className="text-sm font-mono text-gray-400 mb-4 text-center">Core Mobilization Values</p>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Economic Sovereignty", icon: ShieldCheck },
                      { label: "Southern Centricity", icon: MapPin },
                      { label: "Data as Power", icon: TrendingUp },
                      { label: "Radical Collaboration", icon: Users }
                    ].map((v, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                        <v.icon size={12} className="text-emerald-400" />
                        {v.label}
                      </div>
                    ))}
                 </div>
                 <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-6 text-center border-t border-white/10 pt-4">Southern Minority Alliance</div>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryDeepDive;
