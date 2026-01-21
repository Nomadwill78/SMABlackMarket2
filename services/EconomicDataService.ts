import { RegionDataBundle } from '../types';
import { REGION_DB } from '../constants';

export class EconomicDataService {
  /**
   * Simulates fetching data from external government APIs.
   * In production, this would call endpoints like:
   * - BLS: https://api.bls.gov/publicAPI/v2/timeseries/data/
   * - Census: https://api.census.gov/data/
   */
  static async fetchRegionData(regionId: string): Promise<RegionDataBundle> {
    // 1. Simulate network latency (600ms - 1200ms) to show "loading" state
    const latency = 600 + Math.random() * 600;
    await new Promise(resolve => setTimeout(resolve, latency));

    // 2. Mock API Response
    const data = REGION_DB[regionId];

    if (!data) {
      throw new Error(`Data unavailable for region ID: ${regionId}`);
    }

    // 3. Return a copy to ensure immutability
    return {
      ...data,
      lastUpdated: new Date().toISOString() // Simulate fresh fetch timestamp
    };
  }

  static getAvailableRegions() {
    return [
      { id: 'memphis', name: 'Memphis, TN' },
      { id: 'birmingham', name: 'Birmingham, AL' },
      { id: 'atlanta', name: 'Atlanta, GA' }
    ];
  }

  // --- NEW: EXPORT UTILITY ---
  static exportRegionDataAsCSV(data: RegionDataBundle) {
    const rows = [];
    
    // Header
    rows.push(['SMA ECONOMIC EQUITY EXPORT', `Region: ${data.context.name}`, `Date: ${new Date().toISOString()}`]);
    rows.push([]);

    // 1. GAPS & BENCHMARKS
    rows.push(['EQUITY GAPS & BENCHMARKS']);
    rows.push(['Metric', 'Black Value', 'White Value', 'Gap Multiplier', 'National Black Avg', 'Source']);
    data.gaps.forEach(g => {
        const gap = (g.whiteValue / g.blackValue).toFixed(2);
        rows.push([g.category, g.blackValue, g.whiteValue, `${gap}x`, g.nationalBlackAvg, g.source]);
    });
    rows.push([]);

    // 2. LABOR
    rows.push(['LABOR MARKET']);
    rows.push(['Metric', 'Black', 'White', 'National Black Avg']);
    rows.push(['Unemployment (U-3)', `${data.laborStats.officialUnemploymentRate}%`, `${data.laborStats.whiteOfficialUnemploymentRate}%`, `${data.laborStats.nationalBlackUnemploymentRate}%`]);
    rows.push(['Underemployment (U-6)', `${data.laborStats.underemploymentRate}%`, `${data.laborStats.whiteUnderemploymentRate}%`, 'N/A']);
    rows.push([]);

    // 3. SECTOR OPPORTUNITIES
    rows.push(['SECTOR OPPORTUNITIES & PROCUREMENT']);
    rows.push(['Sector', 'Demand', 'Leakage %', 'Active RFPs']);
    data.sectors.forEach(s => {
        rows.push([s.name, s.regionalDemand, `${s.netLeakagePct}%`, s.activeRFPs.length]);
    });

    // Convert to CSV String
    const csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SMA_Data_Export_${data.context.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
