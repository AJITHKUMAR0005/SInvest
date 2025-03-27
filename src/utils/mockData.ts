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
  yearHigh: number; // Added for StockDetails
  yearLow: number; // Added for StockDetails
  open: number; // Added for StockDetails
  previousClose: number; // Added for MarketActions
  dayHigh: number; // Added for StockDetails
  dayLow: number; // Added for StockDetails
  averageVolume: number;
  peRatio: number | null;
  dividend: number | null;
  dividendYield: number; // Added for StockDetails
  industry: string;
  logo: string;
  description: string;
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
    yearHigh: 198.23, // Same as high52w
    yearLow: 142.19, // Same as low52w
    open: 187.52, // Added
    previousClose: 187.52, // Added
    dayHigh: 190.45, // Added
    dayLow: 186.60, // Added
    averageVolume: 57423500,
    peRatio: 31.2,
    dividend: 0.96,
    dividendYield: 0.51, // Added
    industry: "Technology",
    logo: "/apple-logo.svg",
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones."
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
    yearHigh: 430.82, // Same as high52w
    yearLow: 309.45, // Same as low52w
    open: 422.18, // Added
    previousClose: 422.18, // Added
    dayHigh: 423.50, // Added
    dayLow: 417.00, // Added
    averageVolume: 25632400,
    peRatio: 35.8,
    dividend: 3.00,
    dividendYield: 0.72, // Added
    industry: "Technology",
    logo: "/microsoft-logo.svg",
    description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing."
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
    yearHigh: 189.77, // Same as high52w
    yearLow: 114.31, // Same as low52w
    open: 180.47, // Added
    previousClose: 180.47, // Added
    dayHigh: 183.50, // Added
    dayLow: 180.00, // Added
    averageVolume: 42567800,
    peRatio: 45.2,
    dividend: null,
    dividendYield: 0, // Added
    industry: "Consumer Cyclical",
    logo: "/amazon-logo.svg",
    description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally. It operates through three segments: North America, International, and Amazon Web Services (AWS)."
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
    yearHigh: 169.87, // Same as high52w
    yearLow: 120.21, // Same as low52w
    open: 163.72, // Added
    previousClose: 163.72, // Added
    dayHigh: 164.50, // Added
    dayLow: 162.00, // Added
    averageVolume: 29876500,
    peRatio: 28.4,
    dividend: null,
    dividendYield: 0, // Added
    industry: "Technology",
    logo: "/alphabet-logo.svg",
    description: "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments."
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
    yearHigh: 278.98, // Same as high52w
    yearLow: 138.80, // Same as low52w
    open: 170.00, // Added
    previousClose: 170.00, // Added
    dayHigh: 176.50, // Added
    dayLow: 169.50, // Added
    averageVolume: 102345600,
    peRatio: 50.1,
    dividend: null,
    dividendYield: 0, // Added
    industry: "Automotive",
    logo: "/tesla-logo.svg",
    description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally."
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
    yearHigh: 925.68, // Same as high52w
    yearLow: 222.97, // Same as low52w
    open: 858.29, // Added
    previousClose: 858.29, // Added
    dayHigh: 875.00, // Added
    dayLow: 855.00, // Added
    averageVolume: 47865300,
    peRatio: 72.8,
    dividend: 0.16,
    dividendYield: 0.02, // Added
    industry: "Technology",
    logo: "/nvidia-logo.svg",
    description: "NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally. The company's Graphics segment offers GeForce GPUs."
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
    yearHigh: 531.49, // Same as high52w
    yearLow: 279.40, // Same as low52w
    open: 475.86, // Added
    previousClose: 475.86, // Added
    dayHigh: 477.00, // Added
    dayLow: 472.00, // Added
    averageVolume: 22654300,
    peRatio: 27.2,
    dividend: null,
    dividendYield: 0, // Added
    industry: "Technology",
    logo: "/meta-logo.svg",
    description: "Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide."
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
    yearHigh: 200.94, // Same as high52w
    yearLow: 135.19, // Same as low52w
    open: 195.32, // Added
    previousClose: 195.32, // Added
    dayHigh: 198.00, // Added
    dayLow: 195.00, // Added
    averageVolume: 13654200,
    peRatio: 11.8,
    dividend: 4.80,
    dividendYield: 2.43, // Added
    industry: "Financial Services",
    logo: "/jpmorgan-logo.svg",
    description: "JPMorgan Chase & Co. operates as a financial services company worldwide. It operates through four segments: Consumer & Community Banking, Corporate & Investment Bank, Commercial Banking, and Asset & Wealth Management."
  }
];

// Function to get a stock by ID
export const getStock = (id: string): Stock | undefined => {
  return mockStocks.find(stock => stock.id === id);
};

// Generate mock price history data based on a timeframe
export const getMockChartData = (timeframe: string): PricePoint[] => {
  const today = new Date();
  const result: PricePoint[] = [];
  
  // Determine number of data points based on timeframe
  let days;
  switch (timeframe) {
    case '1d':
      days = 1;
      break;
    case '1w':
      days = 7;
      break;
    case '1m':
      days = 30;
      break;
    case '1y':
      days = 365;
      break;
    default:
      days = 30; // Default to 1 month
  }
  
  // Generate mock data points
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a random price between 150 and 200
    const price = 175 + (Math.random() - 0.5) * 50;
    
    result.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2))
    });
  }
  
  return result;
};

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
