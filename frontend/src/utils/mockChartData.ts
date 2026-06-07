export const STOCK_CHART_TRENDS: Record<string, { basePrice: number, volatility: number, trend: 'up' | 'down' | 'volatile' | 'steady' }> = {
  'RELIANCE': { basePrice: 2900.50, volatility: 0.015, trend: 'steady' },
  'TCS': { basePrice: 3950.88, volatility: 0.012, trend: 'up' },
  'INFY': { basePrice: 1420.28, volatility: 0.025, trend: 'volatile' },
  'HDFCBANK': { basePrice: 1530.34, volatility: 0.008, trend: 'up' },
  'ICICIBANK': { basePrice: 1120.68, volatility: 0.02, trend: 'down' },
  'SBIN': { basePrice: 810.15, volatility: 0.03, trend: 'volatile' }
};

export function generateRealisticMockData(symbol: string, range: string) {
  const profile = STOCK_CHART_TRENDS[symbol] || { basePrice: 1000, volatility: 0.02, trend: 'steady' };
  
  const points = range === '1D' ? 24 : range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : 120;
  const data = [];
  
  let currentPrice = profile.basePrice;
  // Apply an initial offset so it doesn't always start exactly at base
  currentPrice = currentPrice * (1 - (profile.volatility * 2));

  for (let i = 0; i < points; i++) {
    // Generate a predictable but realistic looking curve using sine waves + noise
    let trendFactor = 0;
    
    if (profile.trend === 'up') trendFactor = 0.002;
    if (profile.trend === 'down') trendFactor = -0.002;
    if (profile.trend === 'steady') trendFactor = 0.0005;
    
    const noise = (Math.random() - 0.5) * profile.volatility;
    // Add some wave pattern for realism
    const wave = Math.sin(i / (points / Math.PI)) * (profile.volatility * 0.5);
    
    currentPrice = currentPrice * (1 + trendFactor + noise + wave);
    
    // Time formatting
    let timeStr: string;
    if (range === '1D') {
      timeStr = `${9 + Math.floor((i * 6.5) / points)}:${String(Math.floor((i * 6.5 % points) * 60)).padStart(2, '0')}`;
    } else {
      const d = new Date();
      d.setDate(d.getDate() - (points - i));
      timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    data.push({
      time: timeStr,
      price: Number(currentPrice.toFixed(2))
    });
  }
  
  return data;
}
