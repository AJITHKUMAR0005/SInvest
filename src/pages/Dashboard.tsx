import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStocks } from '@/utils/mockData';
import StockCard from '@/components/StockCard';
import PriceChart from '@/components/PriceChart';
import MarketOverview from '@/components/MarketOverview';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BarChart3, DollarSign, TrendingUp, Wallet, Plus, RefreshCcw, ExternalLink, BookOpen } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from '@/hooks/use-account';
import { useInvestments } from '@/hooks/use-investments';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useTransactions } from '@/hooks/use-transactions';
import DepositModal from '@/components/DepositModal';
import TradeModal from '@/components/TradeModal';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const generateMockPriceHistory = (startValue: number, days: number) => {
  const data = [];
  let currentValue = startValue;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * startValue * 0.02; // Random change up to 2%
    currentValue += change;
    data.push({
      time: i,
      value: currentValue
    });
  }
  
  return data;
};

const featuredLearningContent = [
  {
    title: 'Understanding Market Volatility',
    type: 'article',
    source: 'Investopedia',
    link: '/learning'
  },
  {
    title: 'Technical Analysis Basics',
    type: 'video',
    source: 'YouTube',
    link: '/learning'
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { balance, isLoading: isBalanceLoading } = useAccount();
  const { investments, isLoading: isInvestmentsLoading } = useInvestments();
  const { watchlistStocks, isLoading: isWatchlistLoading } = useWatchlist();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  
  const popularStocks = mockStocks.slice(0, 4);
  
  const calculatePortfolioValue = () => {
    if (isInvestmentsLoading || isBalanceLoading) return 0;
    
    const investmentsValue = investments.reduce((total, inv) => {
      const stock = mockStocks.find(s => s.ticker === inv.ticker);
      return total + (stock ? stock.price * inv.shares : 0);
    }, 0);
    
    return (balance?.cash_balance || 0) + investmentsValue;
  };
  
  const portfolioValue = calculatePortfolioValue();
  
  const [portfolioHistory, setPortfolioHistory] = useState(generateMockPriceHistory(10000, 30));
  
  const dailyChange = popularStocks.reduce((sum, stock) => sum + stock.change, 0);
  const dailyChangePercent = ((dailyChange / (portfolioValue - dailyChange)) * 100).toFixed(2);

  useEffect(() => {
    setPortfolioHistory(generateMockPriceHistory(portfolioValue - 10000, 30));
  }, [portfolioValue]);
  
  const formatTransactions = transactions.map(tx => {
    let type = tx.type;
    let ticker = '';
    let shares = '';
    let price = '';
    
    if (tx.description && (tx.type === 'buy' || tx.type === 'sell')) {
      const match = tx.description.match(/(\d+) shares of ([A-Z]+)/);
      if (match) {
        shares = match[1];
        ticker = match[2];
      }
      price = `$${(tx.amount / parseFloat(shares || '1')).toFixed(2)}`;
    }
    
    return {
      id: tx.id,
      type,
      ticker,
      date: format(new Date(tx.created_at), 'MMM d, yyyy'),
      price,
      shares,
      amount: tx.amount,
    };
  });
  
  const totalInvestmentValue = investments.reduce((total, inv) => {
    const stock = mockStocks.find(s => s.ticker === inv.ticker);
    return total + (stock ? stock.price * inv.shares : 0);
  }, 0);
  
  const holdings = investments.map(inv => {
    const stock = mockStocks.find(s => s.ticker === inv.ticker);
    const value = stock ? stock.price * inv.shares : 0;
    const allocationPercentage = ((value / (totalInvestmentValue || 1)) * 100).toFixed(1);
    
    return {
      ...inv,
      value,
      allocationPercentage,
    };
  }).sort((a, b) => b.value - a.value);
  
  const getTopPerformer = () => {
    if (holdings.length === 0) return null;
    
    return holdings.reduce((top, current) => {
      const currentStock = mockStocks.find(s => s.ticker === current.ticker);
      const topStock = mockStocks.find(s => s.ticker === top.ticker);
      
      if (!currentStock || !topStock) return top;
      
      return currentStock.changePercent > topStock.changePercent ? current : top;
    }, holdings[0]);
  };
  
  const topPerformer = getTopPerformer();
  const topPerformerStock = topPerformer ? mockStocks.find(s => s.ticker === topPerformer.ticker) : null;
  
  const isLoading = isBalanceLoading || isInvestmentsLoading || isWatchlistLoading || isTransactionsLoading;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
              <section className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.email}</h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your investments today.
                </p>
              </section>
              
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel col-span-1 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Wallet className="mr-2 h-5 w-5 text-primary" />
                      Portfolio Value
                    </CardTitle>
                    <CardDescription>
                      Your investment performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline mb-2">
                      <h2 className="text-3xl font-bold">${portfolioValue.toLocaleString()}</h2>
                      <span className={`ml-2 text-sm font-medium ${dailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {dailyChange >= 0 ? '+' : ''}{dailyChange.toLocaleString()} ({dailyChangePercent}%)
                      </span>
                    </div>
                    
                    <div className="h-[180px]">
                      <PriceChart 
                        data={portfolioHistory} 
                        ticker="Portfolio" 
                        change={dailyChange}
                        compact={true}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card className="glass-panel">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-primary" />
                        Cash Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold">${balance?.cash_balance.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">Available to invest</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsDepositModalOpen(true)}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Deposit
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const randomStock = mockStocks[Math.floor(Math.random() * mockStocks.length)];
                            setSelectedStock(randomStock);
                          }}
                          asChild
                        >
                          <Link to={`/stocks/${mockStocks[0].id}`}>Trade</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-panel">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                        Top Performer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {topPerformer && topPerformerStock ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold">{topPerformer.ticker}</span>
                            <div className={`text-sm ${topPerformerStock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {topPerformerStock.change >= 0 ? '+' : ''}${topPerformerStock.change.toFixed(2)} ({topPerformerStock.changePercent.toFixed(1)}%)
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedStock(topPerformerStock);
                            }}
                            asChild
                          >
                            <Link to={`/stocks/${topPerformerStock.id}`}>View</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-muted-foreground">
                          No investments yet
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </section>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-secondary/50 p-1">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Popular Stocks</h2>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/stocks/AAPL">
                          View All
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {popularStocks.map(stock => (
                        <StockCard key={stock.id} stock={stock} />
                      ))}
                    </div>
                  </section>
                  
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Learning Resources</h2>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/learning">
                          Explore All
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {featuredLearningContent.map((content, index) => (
                        <Card key={index} className="hover:bg-secondary/10 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="mt-1 p-2 rounded-md bg-primary/10">
                                  {content.type === 'video' ? (
                                    <ExternalLink className="h-4 w-4 text-primary" />
                                  ) : (
                                    <BookOpen className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-medium">{content.title}</h3>
                                  <p className="text-sm text-muted-foreground">{content.type} • {content.source}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={content.link}>
                                  View
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                  
                  <MarketOverview />
                </TabsContent>
                
                <TabsContent value="portfolio" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Holdings</CardTitle>
                        <CardDescription>Current allocation of your portfolio</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Refresh data
                        }}
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {holdings.length > 0 ? (
                        <div className="space-y-4">
                          {holdings.map(holding => {
                            const stock = mockStocks.find(s => s.ticker === holding.ticker);
                            return (
                              <div key={holding.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <div>
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-sm font-semibold mr-2">
                                      {holding.ticker.substring(0, 2)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{holding.ticker}</div>
                                      <div className="text-sm text-muted-foreground">{holding.shares.toLocaleString()} shares</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">${holding.value.toLocaleString()}</div>
                                  <div className="text-sm text-muted-foreground">{holding.allocationPercentage}% of portfolio</div>
                                  {stock && (
                                    <div className={`text-xs ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                                      {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} today
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                          <p>You don't have any investments yet.</p>
                          <Button className="mt-4" asChild>
                            <Link to="/stocks/AAPL">Browse Stocks</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="watchlist" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Watchlist</CardTitle>
                      <CardDescription>Stocks you're monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {watchlistStocks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {watchlistStocks.map(stock => (
                            <StockCard key={stock.id} stock={stock} />
                          ))}
                        </div>
                      ) : (
                        <>
                          <p className="text-muted-foreground text-center py-8">You haven't added any stocks to your watchlist yet.</p>
                          <Button className="w-full" asChild>
                            <Link to="/stocks/AAPL">Add Stocks to Watchlist</Link>
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>Your trading activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {formatTransactions.length > 0 ? (
                        <div className="space-y-4">
                          {formatTransactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                              <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                  tx.type === 'buy' ? 'bg-success/10 text-success' : 
                                  tx.type === 'sell' ? 'bg-destructive/10 text-destructive' : 
                                  tx.type === 'deposit' ? 'bg-primary/10 text-primary' : 
                                  'bg-secondary/80 text-muted-foreground'
                                }`}>
                                  {tx.type === 'buy' ? '↑' : tx.type === 'sell' ? '↓' : tx.type === 'deposit' ? '+' : '-'}
                                </div>
                                <div>
                                  <div className="font-medium capitalize">
                                    {tx.type} {tx.ticker && `${tx.ticker}`}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{tx.date}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                {['buy', 'sell'].includes(tx.type) ? (
                                  <>
                                    <div className="font-medium">{tx.shares} shares</div>
                                    <div className="text-sm text-muted-foreground">{tx.price}/share</div>
                                  </>
                                ) : (
                                  <div className={`font-medium ${tx.type === 'deposit' ? 'text-success' : 'text-destructive'}`}>
                                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No transactions yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <DepositModal 
          isOpen={isDepositModalOpen} 
          onClose={() => setIsDepositModalOpen(false)} 
        />
        
        {selectedStock && (
          <TradeModal 
            isOpen={isTradeModalOpen}
            onClose={() => setIsTradeModalOpen(false)}
            asset={selectedStock}
            assetType="stock"
          />
        )}
      </div>
    </AnimatedTransition>
  );
};

export default Dashboard;
