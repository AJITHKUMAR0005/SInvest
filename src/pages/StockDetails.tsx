
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, TrendingUp, ChevronUp, ChevronDown, DollarSign, Calendar, BarChart, BookOpen } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navigation from '@/components/Navigation';
import PriceChart from '@/components/PriceChart';
import { mockStocks, generateMockPriceHistory } from '@/utils/mockData';
import { useInvestments } from '@/hooks/use-investments';
import WatchlistManager from '@/components/WatchlistManager';
import TradeModal from '@/components/TradeModal';
import { useTrade } from '@/hooks/use-trade';

const StockDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState(mockStocks[0]);
  const [priceHistory, setPriceHistory] = useState(generateMockPriceHistory(stock.price - 100, 365));
  const [timeRange, setTimeRange] = useState('1M');
  const { investments } = useInvestments();
  
  // Find current stock from mock data
  useEffect(() => {
    if (id) {
      const foundStock = mockStocks.find(s => s.id === id);
      if (foundStock) {
        setStock(foundStock);
        // Generate price history for this stock
        setPriceHistory(generateMockPriceHistory(foundStock.price - 100, 365));
      }
    }
  }, [id]);

  // Calculate shares owned
  const ownedInvestment = investments.find(inv => inv.ticker === stock.ticker);
  const ownedShares = ownedInvestment?.shares || 0;
  const positionValue = ownedShares * stock.price;
  
  // Trade modal handler
  const { openTradeModal } = useTrade(stock);
  
  // Time range mapping to days
  const timeRangeDays: Record<string, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
    'All': 365,
  };
  
  // Filter price history by selected time range
  const filteredPriceHistory = priceHistory.slice(-timeRangeDays[timeRange]);
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
              {/* Header Section */}
              <div className="flex items-center mb-4">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                  <Link to="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Link>
                </Button>
              </div>
              
              {/* Stock Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center text-md font-semibold mr-3">
                      {stock.ticker.substring(0, 2)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{stock.ticker}</h1>
                      <p className="text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold">${stock.price.toLocaleString()}</div>
                  <div className={`flex items-center ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stock.change >= 0 ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                    <span>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Trading Actions */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={() => openTradeModal('buy')}
                >
                  Buy
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => openTradeModal('sell')}
                  disabled={ownedShares <= 0}
                >
                  Sell
                </Button>
                <WatchlistManager ticker={stock.ticker} className="flex-1" />
              </div>
              
              {/* Position Summary (if owned) */}
              {ownedShares > 0 && (
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Your Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Shares</div>
                        <div className="text-lg font-semibold">{ownedShares.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Market Value</div>
                        <div className="text-lg font-semibold">${positionValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg. Cost</div>
                        <div className="text-lg font-semibold">${ownedInvestment?.average_price.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Today's Return</div>
                        <div className={`text-lg font-semibold ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ${(ownedShares * stock.change).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Chart */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Price Chart</CardTitle>
                    <div className="flex space-x-1">
                      {Object.keys(timeRangeDays).map((range) => (
                        <Button 
                          key={range} 
                          variant={timeRange === range ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setTimeRange(range)}
                        >
                          {range}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <PriceChart 
                      data={filteredPriceHistory} 
                      ticker={stock.ticker} 
                      change={stock.change}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Stock Details Tabs */}
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">
                    <FileText className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="financials">
                    <BarChart className="h-4 w-4 mr-2" />
                    Financials
                  </TabsTrigger>
                  <TabsTrigger value="news">
                    <BookOpen className="h-4 w-4 mr-2" />
                    News
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {stock.description || `${stock.name} (${stock.ticker}) is a publicly traded company focused on innovation and growth in its industry. The company has shown consistent performance and is considered a leading player in its sector.`}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <div className="flex items-center mb-2">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Market Cap</span>
                          </div>
                          <div className="font-semibold">$178.4B</div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">P/E Ratio</span>
                          </div>
                          <div className="font-semibold">32.5</div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">52-Week High</span>
                          </div>
                          <div className="font-semibold">${(stock.price * 1.2).toFixed(2)}</div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">52-Week Low</span>
                          </div>
                          <div className="font-semibold">${(stock.price * 0.8).toFixed(2)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="financials">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Information</CardTitle>
                      <CardDescription>Key financial metrics for {stock.ticker}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Revenue (TTM)</h3>
                            <p className="text-lg font-semibold">$48.2B</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Profit Margin</h3>
                            <p className="text-lg font-semibold">18.7%</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">EPS (TTM)</h3>
                            <p className="text-lg font-semibold">$3.45</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Dividend Yield</h3>
                            <p className="text-lg font-semibold">1.2%</p>
                          </div>
                        </div>
                        
                        <h3 className="font-medium mt-6">Quarterly Results</h3>
                        <div className="relative overflow-x-auto rounded-lg border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-secondary/50">
                              <tr>
                                <th className="px-4 py-3">Quarter</th>
                                <th className="px-4 py-3">Revenue</th>
                                <th className="px-4 py-3">Profit</th>
                                <th className="px-4 py-3">EPS</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="px-4 py-3">Q1 2023</td>
                                <td className="px-4 py-3">$12.1B</td>
                                <td className="px-4 py-3">$2.3B</td>
                                <td className="px-4 py-3">$0.87</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3">Q4 2022</td>
                                <td className="px-4 py-3">$11.8B</td>
                                <td className="px-4 py-3">$2.1B</td>
                                <td className="px-4 py-3">$0.82</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3">Q3 2022</td>
                                <td className="px-4 py-3">$12.5B</td>
                                <td className="px-4 py-3">$2.4B</td>
                                <td className="px-4 py-3">$0.91</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3">Q2 2022</td>
                                <td className="px-4 py-3">$11.9B</td>
                                <td className="px-4 py-3">$2.2B</td>
                                <td className="px-4 py-3">$0.85</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="news">
                  <Card>
                    <CardHeader>
                      <CardTitle>Latest News</CardTitle>
                      <CardDescription>Recent articles about {stock.ticker}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                            <h3 className="font-medium mb-2">{stock.name} Reports Strong Quarterly Results, Beating Expectations</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              The company announced better than expected earnings, with revenue growing by 15% year over year...
                            </p>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Financial Times</span>
                              <span>3 hours ago</span>
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
        
        <TradeModal stock={stock} />
      </div>
    </AnimatedTransition>
  );
};

export default StockDetails;
