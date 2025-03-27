
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStocks, generateMockPriceHistory, userPortfolio } from '@/utils/mockData';
import StockCard from '@/components/StockCard';
import PriceChart from '@/components/PriceChart';
import MarketOverview from '@/components/MarketOverview';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BarChart3, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get popular stocks
  const popularStocks = mockStocks.slice(0, 4);
  
  // Generate chart data for portfolio
  const portfolioHistory = generateMockPriceHistory(userPortfolio.totalValue - 10000, 30);
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
              {/* Welcome Section */}
              <section className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your investments today.
                </p>
              </section>
              
              {/* Portfolio Summary */}
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
                    <div className="flex items-baseline mb-6">
                      <h2 className="text-3xl font-bold">${userPortfolio.totalValue.toLocaleString()}</h2>
                      <span className={`ml-2 text-sm font-medium ${userPortfolio.dailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {userPortfolio.dailyChange >= 0 ? '+' : ''}${userPortfolio.dailyChange.toLocaleString()} ({userPortfolio.dailyChangePercent}%)
                      </span>
                    </div>
                    
                    <div className="h-[200px]">
                      <PriceChart 
                        data={portfolioHistory} 
                        ticker="Portfolio" 
                        change={userPortfolio.dailyChange}
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
                        <span className="text-2xl font-bold">${userPortfolio.cashBalance.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">Available to invest</span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4">
                        Deposit Funds
                      </Button>
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
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold">NVDA</span>
                          <div className="text-sm text-success">+$15.44 (1.8%)</div>
                        </div>
                        <Button size="sm">View</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
              
              {/* Main Dashboard Tabs */}
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
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {popularStocks.map(stock => (
                        <StockCard key={stock.id} stock={stock} />
                      ))}
                    </div>
                  </section>
                  
                  <MarketOverview />
                </TabsContent>
                
                <TabsContent value="portfolio" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Holdings</CardTitle>
                      <CardDescription>Current allocation of your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userPortfolio.holdings.map(holding => (
                          <div key={holding.ticker} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div>
                              <div className="font-medium">{holding.ticker}</div>
                              <div className="text-sm text-muted-foreground">{holding.shares} shares</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${holding.value.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">{holding.allocationPercentage}% of portfolio</div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                      <p className="text-muted-foreground text-center py-8">You haven't added any stocks to your watchlist yet.</p>
                      <Button className="w-full">Add Stocks to Watchlist</Button>
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
                      <div className="space-y-4">
                        {userPortfolio.recentTransactions.map(tx => (
                          <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                tx.type === 'buy' ? 'bg-success/10 text-success' : 
                                tx.type === 'sell' ? 'bg-destructive/10 text-destructive' : 
                                'bg-primary/10 text-primary'
                              }`}>
                                {tx.type === 'buy' ? '↑' : tx.type === 'sell' ? '↓' : '$'}
                              </div>
                              <div>
                                <div className="font-medium capitalize">{tx.type} {tx.ticker}</div>
                                <div className="text-sm text-muted-foreground">{tx.date}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              {tx.type === 'dividend' ? (
                                <div className="font-medium text-success">+${tx.amount}</div>
                              ) : (
                                <>
                                  <div className="font-medium">{tx.shares} shares</div>
                                  <div className="text-sm text-muted-foreground">${tx.price}</div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default Dashboard;
