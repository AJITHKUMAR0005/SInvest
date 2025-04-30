
/**
 * Enhanced GenAI utility for providing personalized financial advice and education
 * This implementation follows best practices for AI financial advisors:
 * - Personalized recommendations based on user profile
 * - Educational content to help users understand investment concepts
 * - Transparent explanations of investment options
 * - Ethical guidelines to avoid overpromising or pushing high-risk investments
 */

// User profile interface for personalization
export interface UserFinancialProfile {
  riskTolerance: 'low' | 'medium' | 'high';
  investmentHorizon: 'short' | 'medium' | 'long';
  investmentGoals?: string[];
  existingInvestments?: string[];
  financialKnowledge?: 'beginner' | 'intermediate' | 'advanced';
}

// Default user profile when specific data isn't available
const defaultUserProfile: UserFinancialProfile = {
  riskTolerance: 'medium',
  investmentHorizon: 'medium',
  financialKnowledge: 'beginner'
};

// Enhanced AI response generation with educational components
export const generateAIResponse = async (prompt: string, userProfile?: Partial<UserFinancialProfile>): Promise<string> => {
  // In a real implementation, this would call an AI service API
  console.log('AI prompt received:', prompt);

  // Combine provided profile with defaults
  const profile = { ...defaultUserProfile, ...userProfile };

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Enhanced pattern matching with more personalized, educational responses
  if (prompt.toLowerCase().includes('invest') || prompt.toLowerCase().includes('stock')) {
    return `Based on your ${profile.riskTolerance} risk tolerance and ${profile.investmentHorizon}-term investment horizon, here's my perspective on stock investing:\n\n` +
           `When investing in stocks, it's important to align your strategy with your personal goals and situation. A well-balanced portfolio typically includes a mix of different asset classes.\n\n` +
           `For someone with your profile, consider allocating about ${profile.riskTolerance === 'low' ? '30-40%' : profile.riskTolerance === 'medium' ? '50-60%' : '70-80%'} to stocks, focusing on ${profile.riskTolerance === 'low' ? 'established dividend-paying companies' : profile.riskTolerance === 'medium' ? 'a mix of growth and value stocks' : 'growth-oriented companies with strong potential'}.\n\n` +
           `Remember that diversification across sectors and geographies can help manage risk. Would you like me to explain more about specific stock selection strategies?`;
  } else if (prompt.toLowerCase().includes('mutual fund') || prompt.toLowerCase().includes('fund')) {
    return `Mutual funds can be an excellent choice for ${profile.financialKnowledge === 'beginner' ? 'beginners since they offer professional management' : 'building a diversified portfolio efficiently'}.\n\n` +
           `For your ${profile.investmentHorizon}-term horizon, consider ${profile.investmentHorizon === 'short' ? 'money market or short-term bond funds' : profile.investmentHorizon === 'medium' ? 'balanced or index funds' : 'growth-oriented or target date funds'}.\n\n` +
           `When evaluating funds, look at these key factors:\n` +
           `• Expense ratio: Lower is generally better (ideally under 0.5-1%)\n` +
           `• Historical performance: Consistent returns relative to benchmark\n` +
           `• Fund manager experience and strategy\n` +
           `• Risk metrics like Sharpe ratio and standard deviation\n\n` +
           `Would you like recommendations for specific fund categories that might suit your goals?`;
  } else if (prompt.toLowerCase().includes('gold') || prompt.toLowerCase().includes('precious')) {
    return `Digital gold can serve as a hedge against inflation and market volatility. For most investors, a modest allocation of 5-10% to gold or precious metals is considered prudent.\n\n` +
           `Benefits of digital gold include:\n` +
           `• No storage or security concerns\n` +
           `• Easier to buy/sell in small quantities\n` +
           `• Generally lower fees than physical gold\n\n` +
           `However, it's important to understand that gold typically doesn't generate income like dividends or interest. Its value comes primarily from price appreciation and diversification benefits.\n\n` +
           `Given your ${profile.riskTolerance} risk tolerance, gold could serve as a ${profile.riskTolerance === 'low' ? 'core holding' : profile.riskTolerance === 'medium' ? 'complementary asset' : 'small diversifier'} in your portfolio.`;
  } else if (prompt.toLowerCase().includes('beginner') || prompt.toLowerCase().includes('start')) {
    return `Starting your investment journey is an excellent decision! Here's a step-by-step approach I'd recommend for beginners:\n\n` +
           `1️⃣ First, establish an emergency fund covering 3-6 months of expenses in a high-yield savings account\n` +
           `2️⃣ If your employer offers retirement matching, contribute enough to get the full match\n` +
           `3️⃣ Consider low-cost index funds that track broad markets (like S&P 500)\n` +
           `4️⃣ Start with small, regular investments (dollar-cost averaging) rather than lump sums\n` +
           `5️⃣ As you learn more, gradually diversify into other assets that interest you\n\n` +
           `The most important aspects for beginners are starting early, staying consistent, keeping costs low, and continuing to learn. Would you like me to recommend some educational resources about investing basics?`;
  } else if (prompt.toLowerCase().includes('risk') || prompt.toLowerCase().includes('safe')) {
    return `Understanding risk is fundamental to successful investing. All investments carry some degree of risk, but they vary significantly in their risk profiles.\n\n` +
           `Lower risk options include:\n` +
           `• High-yield savings accounts and CDs (very safe but lower returns)\n` +
           `• Government bonds and Treasury securities\n` +
           `• Investment-grade corporate bonds\n\n` +
           `Moderate risk options include:\n` +
           `• Blue-chip stocks and dividend aristocrats\n` +
           `• Balanced mutual funds and ETFs\n` +
           `• Real Estate Investment Trusts (REITs)\n\n` +
           `Higher risk options include:\n` +
           `• Small-cap and growth stocks\n` +
           `• Emerging market investments\n` +
           `• Cryptocurrencies and alternative investments\n\n` +
           `For your ${profile.riskTolerance} risk tolerance, focusing on ${profile.riskTolerance === 'low' ? 'the lower risk category with some moderate risk investments' : profile.riskTolerance === 'medium' ? 'a balance across all three categories' : 'a mix of moderate and higher risk investments'} may be appropriate.\n\n` +
           `Remember that diversification across different risk categories can help manage overall portfolio risk.`;
  } else if (prompt.toLowerCase().includes('retire') || prompt.toLowerCase().includes('retirement')) {
    return `Retirement planning is a journey that benefits from starting early and being consistent. Based on your ${profile.investmentHorizon}-term horizon, here are some thoughts:\n\n` +
           `Key retirement investment vehicles include:\n` +
           `• 401(k)/403(b): Employer-sponsored plans with potential matching\n` +
           `• IRAs (Traditional or Roth): Individual retirement accounts with tax advantages\n` +
           `• HSAs: If eligible, these offer triple tax advantages for healthcare costs\n\n` +
           `For asset allocation, consider the "100 minus age" rule as a starting point - that percentage in stocks, the rest in bonds and safer investments. However, this is just a guideline.\n\n` +
           `As retirement approaches, gradually shift toward more conservative investments to protect your accumulated wealth. Would you like more specific guidance based on your age and timeline?`;
  } else if (prompt.toLowerCase().includes('tax') || prompt.toLowerCase().includes('taxes')) {
    return `Tax efficiency is an often overlooked aspect of investing that can significantly impact your returns. Here are some key considerations:\n\n` +
           `• Tax-advantaged accounts: Maximize contributions to 401(k)s, IRAs, and HSAs before investing in taxable accounts\n` +
           `• Asset location: Hold tax-inefficient investments (like bonds) in tax-advantaged accounts\n` +
           `• Tax-loss harvesting: Strategically realize losses to offset gains\n` +
           `• Qualified dividends and long-term capital gains are typically taxed at lower rates than ordinary income\n\n` +
           `For your specific situation, consulting with a tax professional can help optimize your investment strategy for tax efficiency.\n\n` +
           `Would you like me to explain more about specific tax-efficient investment strategies?`;
  } else {
    return `I'm your financial assistant, here to provide personalized guidance based on your investment profile and goals.\n\n` +
           `I can help with various topics including:\n` +
           `• Investment strategies tailored to your risk tolerance and timeline\n` +
           `• Explanations of different investment vehicles (stocks, bonds, funds, etc.)\n` +
           `• Portfolio diversification and asset allocation\n` +
           `• Retirement planning and tax-efficient investing\n` +
           `• Educational resources to improve your financial literacy\n\n` +
           `What specific aspect of investing would you like to learn more about today?`;
  }
};

/**
 * Get personalized investment recommendations based on user profile and market conditions
 * This enhanced implementation provides more detailed recommendations with educational content
 * and transparent reasoning behind each suggestion
 */
export interface InvestmentRecommendation {
  name: string;
  description: string;
  confidence: number;
  reasoning?: string;
  riskLevel?: string;
  expectedReturn?: string;
  timeHorizon?: string;
  learnMoreUrl?: string;
}

export const getPersonalizedRecommendations = async (
  riskTolerance: 'low' | 'medium' | 'high',
  investmentHorizon: 'short' | 'medium' | 'long',
  category?: string,
  userProfile?: Partial<UserFinancialProfile>
): Promise<InvestmentRecommendation[]> => {
  console.log('Generating recommendations for:', { riskTolerance, investmentHorizon, category });

  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Enhanced recommendations with more educational content and transparency
  const recommendations = {
    low: {
      short: [
        {
          name: "Treasury Bills",
          description: "Government-backed short-term securities with minimal risk",
          confidence: 0.92,
          reasoning: "Treasury bills are backed by the full faith and credit of the U.S. government, making them one of the safest investments available. They're ideal for conservative investors with short time horizons.",
          riskLevel: "Very Low",
          expectedReturn: "1-3%",
          timeHorizon: "3-12 months",
          learnMoreUrl: "https://www.treasurydirect.gov/marketable-securities/treasury-bills/"
        },
        {
          name: "High-Yield Savings",
          description: "FDIC-insured savings accounts with competitive interest rates",
          confidence: 0.89,
          reasoning: "High-yield savings accounts offer liquidity with FDIC insurance up to $250,000, making them appropriate for emergency funds or short-term goals with minimal risk.",
          riskLevel: "Very Low",
          expectedReturn: "2-4%",
          timeHorizon: "0-2 years",
          learnMoreUrl: "https://www.fdic.gov/resources/deposit-insurance/"
        },
        {
          name: "Short-Term Bond Funds",
          description: "Diversified exposure to bonds with 1-3 year maturities",
          confidence: 0.85,
          reasoning: "Short-term bond funds provide slightly higher yields than savings accounts while maintaining relatively low interest rate risk, suitable for near-term financial goals.",
          riskLevel: "Low",
          expectedReturn: "2-4%",
          timeHorizon: "1-3 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds"
        }
      ],
      medium: [
        {
          name: "Corporate Bond ETFs",
          description: "Exposure to investment-grade corporate debt with moderate yields",
          confidence: 0.88,
          reasoning: "Investment-grade corporate bonds offer higher yields than government securities while maintaining relatively low default risk, suitable for income-focused investors.",
          riskLevel: "Low to Moderate",
          expectedReturn: "3-5%",
          timeHorizon: "3-5 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        },
        {
          name: "Dividend ETFs",
          description: "Baskets of stocks from established companies with consistent dividend payments",
          confidence: 0.82,
          reasoning: "Dividend-paying companies tend to be more stable and mature, offering both income and potential for modest growth, appropriate for conservative equity exposure.",
          riskLevel: "Moderate",
          expectedReturn: "4-6%",
          timeHorizon: "3-7 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/glossary/dividend"
        },
        {
          name: "Balanced Funds",
          description: "Professionally managed mix of stocks and bonds with conservative allocation",
          confidence: 0.87,
          reasoning: "Balanced funds provide diversification across asset classes in a single investment, with professional managers handling asset allocation decisions.",
          riskLevel: "Low to Moderate",
          expectedReturn: "4-6%",
          timeHorizon: "3-7 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds"
        }
      ],
      long: [
        {
          name: "Target-Date Funds",
          description: "Automatically adjusted asset allocation that becomes more conservative over time",
          confidence: 0.91,
          reasoning: "Target-date funds automatically shift from growth-oriented to more conservative investments as your goal date approaches, providing a hands-off approach to long-term investing.",
          riskLevel: "Moderate (decreasing over time)",
          expectedReturn: "5-7%",
          timeHorizon: "7+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/glossary/target-date-fund"
        },
        {
          name: "Blue-Chip Dividend Stocks",
          description: "Shares in established companies with long histories of stable dividends",
          confidence: 0.86,
          reasoning: "Blue-chip companies with long dividend histories tend to be financially stable and can provide both income and long-term growth potential with moderate risk.",
          riskLevel: "Moderate",
          expectedReturn: "6-8%",
          timeHorizon: "7+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"
        },
        {
          name: "Municipal Bond Funds",
          description: "Tax-advantaged bonds issued by local governments and agencies",
          confidence: 0.84,
          reasoning: "Municipal bonds often provide tax-free income, which can be especially valuable for investors in higher tax brackets looking for conservative long-term investments.",
          riskLevel: "Low to Moderate",
          expectedReturn: "2-4% (tax-equivalent yield may be higher)",
          timeHorizon: "5-10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/glossary/municipal-bonds"
        }
      ]
    },
    medium: {
      short: [
        {
          name: "Short-Term Corporate Bonds",
          description: "Corporate bonds with 1-3 year maturities offering better yields than government securities",
          confidence: 0.87,
          reasoning: "Short-term corporate bonds balance modest returns with relatively low interest rate sensitivity, suitable for investors who need stability but want better returns than cash.",
          riskLevel: "Low to Moderate",
          expectedReturn: "3-5%",
          timeHorizon: "1-3 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds"
        },
        {
          name: "Balanced ETFs",
          description: "Single-fund solution with a pre-set mix of stocks and bonds",
          confidence: 0.85,
          reasoning: "Balanced ETFs provide instant diversification across stocks and bonds, offering a middle ground between growth potential and stability.",
          riskLevel: "Moderate",
          expectedReturn: "4-6%",
          timeHorizon: "2-5 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        },
        {
          name: "Sector ETFs - Consumer Staples",
          description: "Focused exposure to companies producing essential everyday products",
          confidence: 0.83,
          reasoning: "Consumer staples companies tend to be more resilient during economic downturns while still offering growth potential, providing a defensive equity position.",
          riskLevel: "Moderate",
          expectedReturn: "5-7%",
          timeHorizon: "2-5 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        }
      ],
      medium: [
        {
          name: "S&P 500 Index Funds",
          description: "Low-cost exposure to 500 of the largest U.S. companies",
          confidence: 0.92,
          reasoning: "S&P 500 index funds provide broad diversification across major U.S. companies at low cost, serving as a core holding for many investors seeking market returns.",
          riskLevel: "Moderate",
          expectedReturn: "7-10%",
          timeHorizon: "5-10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds"
        },
        {
          name: "Quality Factor ETFs",
          description: "Companies selected for strong balance sheets and consistent earnings",
          confidence: 0.88,
          reasoning: "Quality factor ETFs focus on financially strong companies that may be more resilient during market downturns while still participating in market growth.",
          riskLevel: "Moderate",
          expectedReturn: "7-9%",
          timeHorizon: "5-10 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        },
        {
          name: "REITs",
          description: "Real Estate Investment Trusts providing exposure to income-producing properties",
          confidence: 0.84,
          reasoning: "REITs offer exposure to real estate without directly owning property, typically providing higher income yields and potential inflation protection.",
          riskLevel: "Moderate to High",
          expectedReturn: "6-10%",
          timeHorizon: "5-10 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits"
        }
      ],
      long: [
        {
          name: "Total Market Index Funds",
          description: "Broad exposure to the entire U.S. equity market including small and mid-cap stocks",
          confidence: 0.93,
          reasoning: "Total market funds provide the broadest possible diversification across the U.S. equity market, including smaller companies with higher growth potential.",
          riskLevel: "Moderate to High",
          expectedReturn: "8-10%",
          timeHorizon: "10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds"
        },
        {
          name: "Growth at Reasonable Price Stocks",
          description: "Companies with strong growth prospects trading at reasonable valuations",
          confidence: 0.87,
          reasoning: "GARP investing balances growth potential with valuation considerations, potentially offering better risk-adjusted returns than pure growth or value approaches.",
          riskLevel: "Moderate to High",
          expectedReturn: "8-12%",
          timeHorizon: "7-10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"
        },
        {
          name: "International Developed Markets ETFs",
          description: "Exposure to established economies outside the U.S. for geographical diversification",
          confidence: 0.85,
          reasoning: "International diversification can reduce portfolio volatility and provide exposure to growth opportunities outside the U.S. market cycle.",
          riskLevel: "Moderate to High",
          expectedReturn: "7-10%",
          timeHorizon: "7-10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/international-investing"
        }
      ]
    },
    high: {
      short: [
        {
          name: "Momentum ETFs",
          description: "Stocks showing strong recent price performance relative to the market",
          confidence: 0.84,
          reasoning: "Momentum strategies aim to capitalize on existing market trends, which can be effective in certain market environments but require more active monitoring.",
          riskLevel: "High",
          expectedReturn: "8-12% (with higher volatility)",
          timeHorizon: "1-3 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        },
        {
          name: "Sector ETFs - Technology",
          description: "Focused exposure to technology companies with growth potential",
          confidence: 0.86,
          reasoning: "Technology sector ETFs provide concentrated exposure to an innovative, high-growth sector, though with increased volatility and sector-specific risks.",
          riskLevel: "High",
          expectedReturn: "10-15% (with higher volatility)",
          timeHorizon: "3-5 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        },
        {
          name: "Leveraged ETFs",
          description: "Funds designed to deliver multiples of index returns (both up and down)",
          confidence: 0.78,
          reasoning: "Leveraged ETFs can amplify returns but also magnify losses and suffer from volatility decay over time. These are sophisticated products best used for short-term tactical positions by experienced investors.",
          riskLevel: "Very High",
          expectedReturn: "Variable (can be significantly positive or negative)",
          timeHorizon: "Very short (days to weeks)",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/leveraged"
        }
      ],
      medium: [
        {
          name: "Small-Cap Growth Stocks",
          description: "Smaller companies with high growth potential but higher volatility",
          confidence: 0.85,
          reasoning: "Small-cap growth stocks offer higher growth potential than large caps but with increased volatility and risk. They may outperform during economic expansions.",
          riskLevel: "High",
          expectedReturn: "10-15%",
          timeHorizon: "5-10 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"
        },
        {
          name: "Emerging Markets ETFs",
          description: "Exposure to developing economies with higher growth potential",
          confidence: 0.83,
          reasoning: "Emerging markets offer exposure to faster-growing economies but come with additional risks including currency fluctuations, political instability, and less regulatory oversight.",
          riskLevel: "High",
          expectedReturn: "8-14%",
          timeHorizon: "7-10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/international-investing"
        },
        {
          name: "Thematic ETFs",
          description: "Funds focused on specific trends like AI, clean energy, or cybersecurity",
          confidence: 0.87,
          reasoning: "Thematic ETFs allow targeted investment in specific trends or technologies with high growth potential, though with increased concentration risk compared to broader market exposure.",
          riskLevel: "High",
          expectedReturn: "10-15% (with higher volatility)",
          timeHorizon: "5-10 years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        }
      ],
      long: [
        {
          name: "Individual Growth Stocks",
          description: "Companies with strong long-term growth prospects and competitive advantages",
          confidence: 0.88,
          reasoning: "Individual growth stocks with strong competitive advantages can deliver substantial returns over long periods, though with higher volatility and company-specific risks.",
          riskLevel: "High",
          expectedReturn: "12-15+%",
          timeHorizon: "10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"
        },
        {
          name: "Emerging Markets Small Caps",
          description: "Smaller companies in developing economies with high growth potential",
          confidence: 0.82,
          reasoning: "Emerging market small caps combine the growth potential of both small companies and developing economies, offering high potential returns with correspondingly high risk.",
          riskLevel: "Very High",
          expectedReturn: "12-18%",
          timeHorizon: "10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/international-investing"
        },
        {
          name: "Sector ETFs - Disruptive Tech",
          description: "Companies at the forefront of technological innovation and disruption",
          confidence: 0.89,
          reasoning: "Disruptive technology ETFs focus on companies creating or benefiting from transformative technologies, offering high growth potential but with significant volatility.",
          riskLevel: "Very High",
          expectedReturn: "12-20%",
          timeHorizon: "10+ years",
          learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds/exchange"
        }
      ]
    }
  };

  // Filter by category if provided
  let results = recommendations[riskTolerance][investmentHorizon];

  if (category) {
    // Simple category filtering logic - in a real implementation this would be more sophisticated
    const categoryKeywords: {[key: string]: string[]} = {
      'income': ['dividend', 'yield', 'income', 'bond'],
      'growth': ['growth', 'emerging', 'small-cap', 'technology'],
      'balanced': ['balanced', 'mix', 'allocation', 'target-date'],
      'esg': ['sustainable', 'esg', 'clean', 'responsible'],
      'tech': ['technology', 'tech', 'digital', 'innovation']
    };

    const keywords = categoryKeywords[category.toLowerCase()] || [];
    if (keywords.length > 0) {
      results = results.filter(rec =>
        keywords.some(keyword =>
          rec.name.toLowerCase().includes(keyword) ||
          rec.description.toLowerCase().includes(keyword)
        )
      );
    }
  }

  return results;
};

/**
 * Provides educational content and market analysis to help users understand investment concepts
 * and current market conditions
 */
export interface EducationalContent {
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  relatedTopics?: string[];
  learnMoreUrl?: string;
}

export interface MarketAnalysis {
  summary: string;
  trends: {
    name: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral' | 'mixed';
  }[];
  opportunities: string[];
  risks: string[];
  timestamp: string;
}

/**
 * Get educational content on investment topics
 */
export const getEducationalContent = async (
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): Promise<EducationalContent> => {
  console.log('Fetching educational content for:', { topic, difficulty });

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Educational content library
  const educationalContent: {[key: string]: {[key: string]: EducationalContent}} = {
    'diversification': {
      'beginner': {
        title: "Why Diversification Matters",
        content:
          "Diversification is one of the most important principles in investing. It means spreading your investments across different types of assets to reduce risk.\n\n" +
          "Think of it like not putting all your eggs in one basket. If you invest all your money in a single stock and that company struggles, your entire investment is at risk. But if you spread your money across many different investments, problems with one won't sink your entire portfolio.\n\n" +
          "Basic ways to diversify include:\n" +
          "• Investing across different asset classes (stocks, bonds, real estate)\n" +
          "• Spreading investments across different industries\n" +
          "• Including both domestic and international investments\n" +
          "• Mixing investments with different risk levels\n\n" +
          "For beginners, mutual funds and ETFs offer instant diversification by holding many different securities in a single investment.",
        difficulty: 'beginner',
        tags: ['basics', 'risk management', 'portfolio construction'],
        relatedTopics: ['asset allocation', 'index funds', 'risk and return'],
        learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds"
      },
      'intermediate': {
        title: "Advanced Diversification Strategies",
        content:
          "Beyond basic diversification across asset classes, more sophisticated diversification strategies can help optimize your portfolio's risk-return profile.\n\n" +
          "Correlation is a key concept in advanced diversification. Assets with low or negative correlation to each other tend to move in different directions, providing better protection during market volatility.\n\n" +
          "Consider these diversification dimensions:\n" +
          "• Factor diversification (value, growth, quality, momentum)\n" +
          "• Geographic diversification beyond developed markets\n" +
          "• Market cap diversification (large, mid, small)\n" +
          "• Alternative investments (commodities, real estate, private equity)\n" +
          "• Duration and credit quality in fixed income\n\n" +
          "Rebalancing is essential to maintain your diversification strategy as different assets perform differently over time.",
        difficulty: 'intermediate',
        tags: ['portfolio management', 'correlation', 'factors', 'alternatives'],
        relatedTopics: ['modern portfolio theory', 'factor investing', 'rebalancing'],
        learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products"
      }
    },
    'compound interest': {
      'beginner': {
        title: "The Magic of Compound Interest",
        content:
          "Compound interest is often called the eighth wonder of the world, and for good reason. It's the process where the interest you earn on an investment generates its own interest over time.\n\n" +
          "Here's how it works: When you invest money, you earn interest or returns on your principal. If you reinvest those earnings, they start generating their own returns. Over time, this creates a snowball effect where your money grows faster and faster.\n\n" +
          "The Rule of 72 is a simple way to estimate how long it will take to double your money: divide 72 by your expected annual return. For example, at 8% returns, your money would double in about 9 years (72 ÷ 8 = 9).\n\n" +
          "The three key factors that affect compound growth are:\n" +
          "• The interest rate or rate of return\n" +
          "• The time period (longer is much better)\n" +
          "• How often interest is compounded\n\n" +
          "Starting early is incredibly powerful with compound interest. Even small amounts invested in your 20s can grow to substantial sums by retirement age.",
        difficulty: 'beginner',
        tags: ['basics', 'long-term investing', 'retirement'],
        relatedTopics: ['time value of money', 'retirement planning', 'investment returns'],
        learnMoreUrl: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
      }
    },
    'index funds': {
      'beginner': {
        title: "Index Funds: A Simple Way to Invest",
        content:
          "Index funds are a type of investment that aims to track the performance of a specific market index, like the S&P 500 or the Total Stock Market Index.\n\n" +
          "Unlike actively managed funds where managers try to pick winning investments, index funds simply hold all (or a representative sample) of the securities in their target index. This passive approach offers several advantages:\n\n" +
          "• Lower fees: Index funds typically charge much lower expense ratios than actively managed funds\n" +
          "• Broad diversification: One fund can give you exposure to hundreds or thousands of companies\n" +
          "• Simplicity: You don't need to research individual stocks or time the market\n" +
          "• Tax efficiency: Less trading means fewer taxable events\n\n" +
          "For beginners, index funds can be an excellent foundation for a long-term investment strategy. They provide instant diversification and professional management at a low cost.",
        difficulty: 'beginner',
        tags: ['passive investing', 'ETFs', 'mutual funds', 'low-cost investing'],
        relatedTopics: ['ETFs vs mutual funds', 'expense ratios', 'market indices'],
        learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds"
      }
    },
    'risk and return': {
      'beginner': {
        title: "Understanding the Relationship Between Risk and Return",
        content:
          "One of the fundamental principles of investing is that risk and return are related. Generally, investments with higher potential returns come with higher risks.\n\n" +
          "Risk in investing refers to the possibility that an investment's actual return will be different than expected – including the potential to lose some or all of your original investment.\n\n" +
          "The risk-return spectrum looks something like this (from lower to higher risk/return):\n" +
          "• Cash and cash equivalents (savings accounts, money market funds)\n" +
          "• Government bonds and high-quality corporate bonds\n" +
          "• Corporate bonds and dividend stocks\n" +
          "• Growth stocks and real estate\n" +
          "• Small-cap stocks and emerging markets\n" +
          "• High-yield bonds and speculative investments\n\n" +
          "Your personal risk tolerance depends on factors like your investment timeline, financial goals, and comfort with market fluctuations. A well-designed portfolio balances risk and potential return based on your individual situation.",
        difficulty: 'beginner',
        tags: ['basics', 'risk management', 'investment principles'],
        relatedTopics: ['volatility', 'diversification', 'asset allocation'],
        learnMoreUrl: "https://www.investor.gov/introduction-investing/investing-basics/what-risk"
      }
    },
    'retirement planning': {
      'beginner': {
        title: "Getting Started with Retirement Planning",
        content:
          "Retirement planning is the process of determining retirement income goals and the actions needed to achieve those goals.\n\n" +
          "Key retirement accounts in the U.S. include:\n" +
          "• 401(k)/403(b): Employer-sponsored plans often with matching contributions\n" +
          "• Traditional IRA: Tax-deductible contributions with taxes paid on withdrawals\n" +
          "• Roth IRA: After-tax contributions with tax-free growth and withdrawals\n" +
          "• SEP IRA and Solo 401(k): Options for self-employed individuals\n\n" +
          "The power of starting early cannot be overstated. Thanks to compound growth, even small contributions in your 20s and 30s can grow substantially by retirement age.\n\n" +
          "A common guideline is to save 15% of your income for retirement, including any employer match. The actual amount depends on your retirement age goal, expected lifestyle, and other factors.\n\n" +
          "Asset allocation is crucial for retirement planning and typically becomes more conservative as you approach retirement age.",
        difficulty: 'beginner',
        tags: ['retirement', 'long-term planning', '401k', 'IRA'],
        relatedTopics: ['social security', 'tax-advantaged accounts', 'required minimum distributions'],
        learnMoreUrl: "https://www.investor.gov/additional-resources/retirement-toolkit"
      }
    }
  };

  // Find the requested topic (case insensitive)
  const normalizedTopic = topic.toLowerCase();
  let content: EducationalContent | null = null;

  // Look for exact matches first
  if (educationalContent[normalizedTopic] && educationalContent[normalizedTopic][difficulty]) {
    content = educationalContent[normalizedTopic][difficulty];
  } else {
    // Look for partial matches if no exact match
    for (const [key, value] of Object.entries(educationalContent)) {
      if (key.includes(normalizedTopic) || normalizedTopic.includes(key)) {
        if (value[difficulty]) {
          content = value[difficulty];
          break;
        } else {
          // If requested difficulty not available, return any available difficulty
          const availableDifficulty = Object.keys(value)[0] as 'beginner' | 'intermediate' | 'advanced';
          content = value[availableDifficulty];
          break;
        }
      }
    }
  }

  // If still no match, return a default response
  if (!content) {
    return {
      title: "Investment Education",
      content: "We don't have specific content on that topic yet, but we're constantly expanding our educational library. In the meantime, you might be interested in learning about fundamental investment concepts like diversification, compound interest, or asset allocation.",
      difficulty: difficulty,
      tags: ['general', 'investing'],
      relatedTopics: ['diversification', 'compound interest', 'index funds', 'risk and return'],
      learnMoreUrl: "https://www.investor.gov/introduction-investing"
    };
  }

  return content;
};

/**
 * Get current market analysis and insights
 */
export const getMarketAnalysis = async (): Promise<MarketAnalysis> => {
  console.log('Generating market analysis');

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real implementation, this would pull from market data APIs and financial news sources
  return {
    summary: "Markets are showing mixed signals with inflation concerns being balanced by strong corporate earnings. The Federal Reserve's monetary policy remains a key focus for investors, with expectations of gradual rate adjustments in the coming months.",
    trends: [
      {
        name: "Inflation Outlook",
        description: "Recent data suggests inflation may be moderating, though still above the Federal Reserve's target rate. Core inflation metrics show signs of cooling in certain sectors.",
        impact: 'mixed'
      },
      {
        name: "Corporate Earnings",
        description: "Q2 earnings have largely exceeded analyst expectations, particularly in technology and financial sectors, suggesting business resilience despite economic headwinds.",
        impact: 'positive'
      },
      {
        name: "Interest Rates",
        description: "The Federal Reserve has signaled a potential pause in rate hikes, with future decisions remaining data-dependent. Bond markets are adjusting to this new outlook.",
        impact: 'neutral'
      },
      {
        name: "Global Economic Growth",
        description: "Developed markets show steady growth while some emerging economies face challenges. China's economic slowdown remains a concern for global growth prospects.",
        impact: 'mixed'
      }
    ],
    opportunities: [
      "Quality companies with strong balance sheets and cash flows may outperform in the current environment",
      "Fixed income investments are becoming more attractive as yields have risen substantially",
      "Selective opportunities in international markets where valuations are more favorable than U.S. equities",
      "Defensive sectors like healthcare and consumer staples offer stability amid economic uncertainty"
    ],
    risks: [
      "Persistent inflation could force central banks to maintain higher rates for longer than markets expect",
      "Geopolitical tensions continue to present unpredictable risks to global markets",
      "Banking sector stress could resurface if economic conditions deteriorate",
      "Corporate earnings may face pressure if consumer spending weakens"
    ],
    timestamp: new Date().toISOString()
  };
};
