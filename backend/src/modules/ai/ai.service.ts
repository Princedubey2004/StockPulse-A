import { GoogleGenAI } from '@google/genai';
import { redisClient } from '../../config/redis';

// Mock news data for demonstration
const mockNewsDatabase: Record<string, string[]> = {
  RELIANCE: [
    "Reliance Industries announces major investment in green energy.",
    "Jio continues to dominate the telecom market share.",
    "Retail expansion boosts Q3 revenue for Reliance."
  ],
  TCS: [
    "TCS wins massive cloud transformation deal with European bank.",
    "Margin expansion expected due to improved operational efficiency.",
    "Management flags cautious optimism for next quarter IT spending."
  ],
  INFY: [
    "Infosys launches new enterprise AI platform.",
    "Client budget constraints remain a slight headwind for Infosys.",
    "Infosys expands its footprint in the North American market."
  ],
  HDFCBANK: [
    "HDFC Bank deposit growth surges post-merger integration.",
    "NIM (Net Interest Margin) stabilizes as cost of funds peaks.",
    "Retail credit card portfolio sees strong double-digit growth."
  ],
  ICICIBANK: [
    "ICICI Bank reports record profit driven by strong loan growth.",
    "Asset quality continues to improve across all retail segments.",
    "Digital initiatives drive lower cost-to-income ratio."
  ],
  SBIN: [
    "SBI crosses historic market capitalization milestone.",
    "Strong credit growth across corporate and retail portfolios.",
    "Non-performing assets (NPAs) drop to multi-year lows."
  ]
};

export interface AIInsight {
  symbol: string;
  summary: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  marketImpact: string;
  investmentInsights: string[];
  riskIndicators: string[];
  timestamp: string;
}

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock-key' });
  }

  public async getStockInsights(symbol: string): Promise<AIInsight> {
    const cacheKey = `ai_insights:${symbol}`;
    
    // 1. Check Redis Cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`[AIService] Returning cached insights for ${symbol}`);
      return JSON.parse(cachedData);
    }

    console.log(`[AIService] Generating fresh insights for ${symbol}`);
    
    // 2. Fetch News (Mocked)
    const news = mockNewsDatabase[symbol] || [
      `${symbol} experiences normal market volatility.`,
      `Investors closely watching ${symbol} for upcoming earnings report.`
    ];

    // 3. Generate Analysis using Gemini
    let result: AIInsight;
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
      }

      const prompt = `
        Analyze the following recent news headlines for the stock symbol ${symbol}.
        News:
        ${news.map((n, i) => `${i + 1}. ${n}`).join('\n')}
        
        Provide a JSON response with the following exact structure:
        {
          "summary": "A 2-3 sentence concise summary of the news",
          "sentiment": "POSITIVE" or "NEGATIVE" or "NEUTRAL",
          "marketImpact": "A brief explanation of potential market impact",
          "investmentInsights": ["Key insight 1", "Key insight 2"],
          "riskIndicators": ["Risk factor 1", "Risk factor 2"]
        }
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (!response.text) {
        throw new Error('Empty response from Gemini API');
      }

      const parsedData = JSON.parse(response.text);
      
      result = {
        symbol,
        summary: parsedData.summary,
        sentiment: parsedData.sentiment,
        marketImpact: parsedData.marketImpact,
        investmentInsights: parsedData.investmentInsights,
        riskIndicators: parsedData.riskIndicators || ["General market volatility"],
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error(`[AIService] Gemini API error or parsing failed:`, error.message);
      // Fallback for demonstration if API fails or key is missing
      result = {
        symbol,
        summary: `Analysis currently unavailable due to system constraints. News: ${news.join(' ')}`,
        sentiment: 'NEUTRAL',
        marketImpact: 'Unknown due to lack of AI analysis.',
        investmentInsights: ['Monitor market conditions closely.', 'Diversify portfolio to manage risk.'],
        riskIndicators: ['Data unavailable', 'API connectivity issues'],
        timestamp: new Date().toISOString()
      };
    }

    // 4. Cache the result for 1 hour (3600 seconds)
    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);

    return result;
  }
}

export const aiService = new AIService();
