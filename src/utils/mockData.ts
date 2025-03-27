
export interface Stock {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  averageVolume: number;
  peRatio: number | null;
  dividend: number | null;
  industry: string;
  logo: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Mock stock data
export const mockStocks: Stock[] = [
  {
    id: "aapl",
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 189.84,
    change: 2.32,
    changePercent: 1.24,
    volume: 62345678,
    marketCap: 2950000000000,
    high52w: 198.23,
    low52w: 142.19,
    averageVolume: 57423500,
    peRatio: 31.2,
    dividend: 0.96,
    industry: "Technology",
    logo: "/apple-logo.svg"
  },
  {
    id: "msft",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: 418.62,
    change: -3.56,
    changePercent: -0.84,
    volume: 28745123,
    marketCap: 3120000000000,
    high52w: 430.82,
    low52w: 309.45,
    averageVolume: 25632400,
    peRatio: 35.8,
    dividend: 3.00,
    industry: "Technology",
    logo: "/microsoft-logo.svg"
  },
  {
    id: "amzn",
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    price: 182.32,
    change: 1.85,
    changePercent: 1.02,
    volume: 46782345,
    marketCap: 1870000000000,
    high52w: 189.77,
    low52w: 114.31,
    averageVolume: 42567800,
    peRatio: 45.2,
    dividend: null,
    industry: "Consumer Cyclical",
    logo: "/amazon-logo.svg"
  },
  {
    id: "googl",
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 162.78,
    change: -0.94,
    changePercent: -0.57,
    volume: 32456789,
    marketCap: 2050000000000,
    high52w: 169.87,
    low52w: 120.21,
    averageVolume: 29876500,
    peRatio: 28.4,
    dividend: null,
    industry: "Technology",
    logo: "/alphabet-logo.svg"
  },
  {
    id: "tsla",
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 175.43,
    change: 5.62,
    changePercent: 3.31,
    volume: 98765432,
    marketCap: 560000000000,
    high52w: 278.98,
    low52w: 138.80,
    averageVolume: 102345600,
    peRatio: 50.1,
    dividend: null,
    industry: "Automotive",
    logo: "/tesla-logo.svg"
  },
  {
    id: "nvda",
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    price: 873.73,
    change: 15.44,
    changePercent: 1.8,
    volume: 45678912,
    marketCap: 2150000000000,
    high52w: 925.68,
    low52w: 222.97,
    averageVolume: 47865300,
    peRatio: 72.8,
    dividend: 0.16,
    industry: "Technology",
    logo: "/nvidia-logo.svg"
  },
  {
    id: "meta",
    ticker: "META",
    name: "Meta Platforms Inc.",
    price: 473.32,
    change: -2.54,
    changePercent: -0.53,
    volume: 25436789,
    marketCap: 1230000000000,
    high52w: 531.49,
    low52w: 279.40,
    averageVolume: 22654300,
    peRatio: 27.2,
    dividend: null,
    industry: "Technology",
    logo: "/meta-logo.svg"
  },
  {
    id: "jpm",
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 197.45,
    change: 2.13,
    changePercent: 1.09,
    volume: 15243678,
    marketCap: 570000000000,
    high52w: 200.94,
    low52w: 135.19,
    averageVolume: 13654200,
    peRatio: 11.8,
    dividend: 4.80,
    industry: "Financial Services",
    logo: "/jpmorgan-logo.svg"
  }
];

// Mock price history data for charts
export const generateMockPriceHistory = (basePrice: number, days: number): PricePoint[] => {
  const today = new Date();
  const result: PricePoint[] = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to create realistic price movements
    const randomChange = (Math.random() - 0.5) * (basePrice * 0.05);
    const price = basePrice + randomChange;
    
    // Update base price for next iteration to create trend
    basePrice = price;
    
    result.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2))
    });
  }
  
  return result;
};

// Mock market indices
export const mockIndices: MarketIndex[] = [
  {
    id: "sp500",
    name: "S&P 500",
    value: 5184.82,
    change: 34.25,
    changePercent: 0.67
  },
  {
    id: "nasdaq",
    name: "NASDAQ",
    value: 16274.94,
    change: 130.28,
    changePercent: 0.81
  },
  {
    id: "dow",
    name: "Dow Jones",
    value: 38753.11,
    change: -45.63,
    changePercent: -0.12
  }
];

// Popular investment categories
export const investmentCategories = [
  { id: "tech", name: "Technology", icon: "💻" },
  { id: "healthcare", name: "Healthcare", icon: "🏥" },
  { id: "finance", name: "Finance", icon: "💰" },
  { id: "energy", name: "Energy", icon: "⚡" },
  { id: "consumer", name: "Consumer", icon: "🛒" },
  { id: "real-estate", name: "Real Estate", icon: "🏢" }
];

// Mock news items
export const marketNews = [
  {
    id: "news1",
    title: "Federal Reserve Holds Interest Rates Steady",
    summary: "The Federal Reserve announced today that it will maintain current interest rates, citing steady economic growth and controlled inflation.",
    source: "Financial Times",
    time: "2 hours ago",
    url: "#"
  },
  {
    id: "news2",
    title: "Tech Stocks Rally on Strong Earnings Reports",
    summary: "Major technology companies reported better-than-expected quarterly earnings, driving a sector-wide rally in the stock market.",
    source: "Wall Street Journal",
    time: "4 hours ago",
    url: "#"
  },
  {
    id: "news3",
    title: "New Regulations for Cryptocurrency Exchanges Announced",
    summary: "Regulators unveiled a new framework for cryptocurrency exchanges, aiming to enhance consumer protection and market stability.",
    source: "Bloomberg",
    time: "6 hours ago",
    url: "#"
  }
];

// Mock user portfolio
export const userPortfolio = {
  totalValue: 152743.86,
  cashBalance: 12567.34,
  dailyChange: 3241.52,
  dailyChangePercent: 2.17,
  holdings: [
    { ticker: "AAPL", shares: 120, value: 22780.80, allocationPercentage: 15 },
    { ticker: "MSFT", shares: 45, value: 18837.90, allocationPercentage: 12 },
    { ticker: "NVDA", shares: 65, value: 56792.45, allocationPercentage: 37 },
    { ticker: "AMZN", shares: 30, value: 5469.60, allocationPercentage: 4 },
    { ticker: "GOOGL", shares: 25, value: 4069.50, allocationPercentage: 3 },
    { ticker: "JPM", shares: 55, value: 10859.75, allocationPercentage: 7 },
    { ticker: "TSLA", shares: 40, value: 7017.20, allocationPercentage: 5 }
  ],
  recentTransactions: [
    { id: "tx1", type: "buy", ticker: "NVDA", shares: 5, price: 873.73, date: "2023-05-15" },
    { id: "tx2", type: "sell", ticker: "GOOGL", shares: 10, price: 162.78, date: "2023-05-12" },
    { id: "tx3", type: "buy", ticker: "AAPL", shares: 20, price: 189.84, date: "2023-05-10" },
    { id: "tx4", type: "dividend", ticker: "MSFT", amount: 67.50, date: "2023-05-01" }
  ]
};
