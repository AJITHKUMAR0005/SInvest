export interface Stock {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  description: string;
  marketCap: number;
  peRatio: number;
  volume: number;
  averageVolume: number;
  open: number;
  previousClose: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  dividendYield: number;
}

export interface MutualFund {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  description: string;
  expenseRatio: number;
  yield: number;
  riskLevel: string;
  oneYearReturn: number;
}

export interface DigitalGold {
  id: string;
  name: string;
  pricePerGram: number;
  change: number;
  changePercent: number;
  description: string;
  purity: string;
  storageFees: string;
  minimumQuantity: number;
}

export interface PricePoint {
  date: string;
  price: number;
  volume?: number;
}

export interface MarketIndex {
  id: number;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export const mockStocks: Stock[] = [
  {
    id: 'AAPL',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    price: 175.96,
    change: 2.45,
    changePercent: 1.41,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    marketCap: 2800000000000,
    peRatio: 29.5,
    volume: 56789000,
    averageVolume: 55000000,
    open: 174.00,
    previousClose: 173.51,
    dayLow: 173.20,
    dayHigh: 176.00,
    yearLow: 125.00,
    yearHigh: 177.50,
    dividendYield: 0.005,
  },
  {
    id: 'MSFT',
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    price: 330.11,
    change: -0.88,
    changePercent: -0.27,
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    marketCap: 2500000000000,
    peRatio: 38.2,
    volume: 30456000,
    averageVolume: 29000000,
    open: 331.00,
    previousClose: 330.99,
    dayLow: 329.50,
    dayHigh: 332.00,
    yearLow: 210.00,
    yearHigh: 335.00,
    dividendYield: 0.008,
  },
  {
    id: 'GOOGL',
    name: 'Alphabet Inc.',
    ticker: 'GOOGL',
    price: 130.56,
    change: 1.23,
    changePercent: 0.95,
    description: 'Alphabet Inc. provides various products and platforms in the United States and internationally.',
    marketCap: 1600000000000,
    peRatio: 25.8,
    volume: 25678000,
    averageVolume: 24000000,
    open: 129.00,
    previousClose: 129.33,
    dayLow: 128.80,
    dayHigh: 131.00,
    yearLow: 85.00,
    yearHigh: 132.50,
    dividendYield: 0,
  },
  {
    id: 'AMZN',
    name: 'Amazon.com Inc.',
    ticker: 'AMZN',
    price: 135.23,
    change: 0.78,
    changePercent: 0.58,
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.',
    marketCap: 1400000000000,
    peRatio: 95.6,
    volume: 40123000,
    averageVolume: 39000000,
    open: 134.00,
    previousClose: 134.45,
    dayLow: 133.50,
    dayHigh: 135.50,
    yearLow: 81.00,
    yearHigh: 140.00,
    dividendYield: 0,
  },
  {
    id: 'TSLA',
    name: 'Tesla Inc.',
    ticker: 'TSLA',
    price: 250.45,
    change: -3.21,
    changePercent: -1.27,
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
    marketCap: 800000000000,
    peRatio: 60.3,
    volume: 45678000,
    averageVolume: 44000000,
    open: 253.00,
    previousClose: 253.66,
    dayLow: 249.00,
    dayHigh: 255.00,
    yearLow: 101.00,
    yearHigh: 299.00,
    dividendYield: 0,
  },
  {
    id: 'JPM',
    name: 'JPMorgan Chase & Co.',
    ticker: 'JPM',
    price: 155.89,
    change: 1.56,
    changePercent: 1.01,
    description: 'JPMorgan Chase & Co. is a financial holding company, which provides financial and investment banking services.',
    marketCap: 460000000000,
    peRatio: 12.1,
    volume: 12345000,
    averageVolume: 11000000,
    open: 154.00,
    previousClose: 154.33,
    dayLow: 153.80,
    dayHigh: 156.00,
    yearLow: 105.00,
    yearHigh: 160.00,
    dividendYield: 0.025,
  },
  {
    id: 'V',
    name: 'Visa Inc.',
    ticker: 'V',
    price: 240.50,
    change: 0.95,
    changePercent: 0.40,
    description: 'Visa Inc. operates as a payments technology company worldwide.',
    marketCap: 500000000000,
    peRatio: 35.7,
    volume: 8765000,
    averageVolume: 8000000,
    open: 239.00,
    previousClose: 239.55,
    dayLow: 238.80,
    dayHigh: 241.00,
    yearLow: 175.00,
    yearHigh: 242.00,
    dividendYield: 0.007,
  },
  {
    id: 'JNJ',
    name: 'Johnson & Johnson',
    ticker: 'JNJ',
    price: 165.75,
    change: -0.25,
    changePercent: -0.15,
    description: 'Johnson & Johnson researches and develops, manufactures, and sells a range of products in the healthcare field worldwide.',
    marketCap: 430000000000,
    peRatio: 27.9,
    volume: 7890000,
    averageVolume: 7500000,
    open: 166.00,
    previousClose: 166.00,
    dayLow: 165.50,
    dayHigh: 167.00,
    yearLow: 150.00,
    yearHigh: 180.00,
    dividendYield: 0.028,
  },
];

export const mockMutualFunds: MutualFund[] = [
  {
    id: 'VFINX',
    name: 'Vanguard 500 Index Fund',
    ticker: 'VFINX',
    price: 410.25,
    change: 2.10,
    changePercent: 0.51,
    description: 'The fund seeks to track the investment results of the S&P 500 Index.',
    expenseRatio: 0.0014,
    yield: 0.015,
    riskLevel: 'Moderate',
    oneYearReturn: 15.2,
  },
  {
    id: 'FXAIX',
    name: 'Fidelity 500 Index Fund',
    ticker: 'FXAIX',
    price: 150.50,
    change: 0.75,
    changePercent: 0.50,
    description: 'The fund seeks to track the performance of the S&P 500 Index.',
    expenseRatio: 0.0015,
    yield: 0.016,
    riskLevel: 'Moderate',
    oneYearReturn: 14.8,
  },
  {
    id: 'PRIDX',
    name: 'T. Rowe Price Blue Chip Growth Fund',
    ticker: 'PRIDX',
    price: 95.75,
    change: 0.45,
    changePercent: 0.47,
    description: 'The fund invests in blue chip companies with above-average growth potential.',
    expenseRatio: 0.0062,
    yield: 0.005,
    riskLevel: 'Moderate-High',
    oneYearReturn: 18.2,
  },
];

export const mockDigitalGold: DigitalGold[] = [
  {
    id: 'DG1',
    name: 'Augmont Digital Gold',
    pricePerGram: 61.50,
    change: 0.15,
    changePercent: 0.24,
    description: '24K 999 Purity Gold. Buy, Sell & Take Delivery of Gold Online.',
    purity: '99.99% Purity',
    storageFees: '₹0',
    minimumQuantity: 0.01,
  },
  {
    id: 'DG2',
    name: 'MMTC-PAMP Digital Gold',
    pricePerGram: 61.55,
    change: 0.10,
    changePercent: 0.16,
    description: 'Buy 24K gold online, assured purity. Insured & secured storage.',
    purity: '99.99% Purity',
    storageFees: '₹0',
    minimumQuantity: 0.01,
  },
  {
    id: 'DG3',
    name: 'SafeGold',
    pricePerGram: 61.60,
    change: 0.20,
    changePercent: 0.32,
    description: 'Buy, sell and store 24K gold securely with SafeGold.',
    purity: '99.5% Purity',
    storageFees: 'Included',
    minimumQuantity: 0.005,
  },
];

export const marketNews = [
  {
    id: 1,
    title: "Fed Signals Potential Rate Cut in Coming Months",
    summary: "Federal Reserve officials indicated they could begin cutting interest rates in the coming months if inflation continues to cool, according to minutes from their latest meeting.",
    source: "The Wall Street Journal",
    time: "2 hours ago",
    url: "#"
  },
  {
    id: 2,
    title: "Tech Stocks Rally as Earnings Beat Expectations",
    summary: "Major technology companies reported better-than-expected quarterly earnings, driving the Nasdaq to new heights as investors remain bullish on AI prospects.",
    source: "CNBC",
    time: "5 hours ago",
    url: "#"
  },
  {
    id: 3,
    title: "Oil Prices Rise Amid Middle East Tensions",
    summary: "Crude oil prices increased by 3% today as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.",
    source: "Reuters",
    time: "Yesterday",
    url: "#"
  },
  {
    id: 4,
    title: "Retail Sales Show Unexpected Strength in April",
    summary: "U.S. retail sales rose 0.7% in April, exceeding economists' forecasts and suggesting consumer spending remains resilient despite inflation pressures.",
    source: "Bloomberg",
    time: "Yesterday",
    url: "#"
  }
];

export const aiRecommendationCategories = [
  {
    id: '1',
    name: 'Beginner Investments',
    description: 'Recommended for new investors with little to no experience. Focus on simplicity, education, and long-term growth.'
  },
  {
    id: '2',
    name: 'High Growth Potential',
    description: 'Investments with higher growth potential but also higher volatility. Suitable for those with higher risk tolerance.'
  },
  {
    id: '3',
    name: 'Retirement Planning',
    description: 'Tax-advantaged investments suitable for long-term retirement savings with age-appropriate risk levels.'
  },
  {
    id: '4',
    name: 'Diversified Portfolio',
    description: 'A balanced mix of assets designed to optimize risk-adjusted returns through diversification across asset classes.'
  },
  {
    id: '5',
    name: 'Income Generation',
    description: 'Investments focused on providing regular income through dividends, interest, or other distributions.'
  },
  {
    id: '6',
    name: 'Sustainable Investing',
    description: 'Investments that consider environmental, social, and governance (ESG) factors alongside financial returns.'
  },
];

export const predefinedQueries = [
  "How should I start investing as a beginner?",
  "Can you explain diversification and why it matters?",
  "What are index funds and why are they recommended?",
  "How do I build a retirement portfolio?",
  "What's the relationship between risk and return?",
  "How can I invest in a tax-efficient way?",
  "What's a good asset allocation for my age?",
  "How much should I be saving for retirement?",
  "What are ETFs and how do they differ from mutual funds?",
  "Can you explain dollar-cost averaging?",
  "How do I analyze the current market conditions?",
  "What are some strategies for investing during inflation?"
];

export const mockIndices = [
  {
    id: 1,
    name: 'S&P 500',
    value: 4890.12,
    change: 32.65,
    changePercent: 0.67,
  },
  {
    id: 2,
    name: 'Dow Jones',
    value: 38763.45,
    change: -58.32,
    changePercent: -0.15,
  },
  {
    id: 3,
    name: 'Nasdaq',
    value: 16234.76,
    change: 128.93,
    changePercent: 0.80,
  },
  {
    id: 4,
    name: 'Russell 2000',
    value: 2056.87,
    change: 12.45,
    changePercent: 0.61,
  }
];

export const generateMockPriceHistory = (startValue: number, days: number) => {
  const data: PricePoint[] = [];
  let currentValue = startValue;

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * startValue * 0.02;
    currentValue += change;
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 3600000).toISOString(),
      price: currentValue,
      volume: Math.floor(Math.random() * 1000000)
    });
  }

  return data;
};

export const getStock = (id: string) => {
  return mockStocks.find(stock => stock.id === id);
};

export const getMockChartData = (timeframe: string): PricePoint[] => {
  const dataPoints = timeframe === '1d' ? 24 :
                     timeframe === '1w' ? 7 :
                     timeframe === '1m' ? 30 : 365;

  return Array.from({ length: dataPoints }, (_, i) => ({
    date: new Date(Date.now() - (dataPoints - i) * 3600000).toISOString(),
    price: 100 + Math.random() * 50 * Math.sin(i / 10),
    volume: Math.floor(Math.random() * 1000000)
  }));
};
