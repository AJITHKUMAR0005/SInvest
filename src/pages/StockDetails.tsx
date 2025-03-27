
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import AnimatedTransition from '@/components/AnimatedTransition';
import PriceChart from '@/components/PriceChart';
import { useWatchlist } from '@/hooks/use-watchlist';
import { getStock, getMockChartData, Stock } from '@/utils/mockData';
import { Star, BookmarkPlus, BookmarkMinus, ArrowLeft, ExternalLink } from 'lucide-react';
import MarketActions from '@/components/MarketActions';

const StockDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [timeframe, setTimeframe] = useState('1d');
  const { watchlist, addToWatchlist, removeFromWatchlist, isLoading: watchlistLoading } = useWatchlist();

  useEffect(() => {
    if (id) {
      const stockData = getStock(id);
      if (stockData) {
        setStock(stockData);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  const isInWatchlist = watchlist.some(item => item.ticker === id);

  const handleWatchlistToggle = async () => {
    if (!stock) return;
    
    if (isInWatchlist) {
      await removeFromWatchlist(stock.ticker);
    } else {
      await addToWatchlist(stock.ticker);
    }
  };

  if (!stock) {
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
        
        <main className="container max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold ml-2">{stock.name} ({stock.ticker})</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              className="ml-auto"
              title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isInWatchlist ? (
                <BookmarkMinus className="h-5 w-5 text-primary" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-3xl font-bold">${stock.price.toLocaleString()}</CardTitle>
                      <CardDescription>
                        {stock.price > stock.previousClose ? (
                          <span className="text-green-600">
                            +${(stock.price - stock.previousClose).toFixed(2)} (+{((stock.price - stock.previousClose) / stock.previousClose * 100).toFixed(2)}%)
                          </span>
                        ) : (
                          <span className="text-red-600">
                            -${(stock.previousClose - stock.price).toFixed(2)} (-{((stock.previousClose - stock.price) / stock.previousClose * 100).toFixed(2)}%)
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div>
                      <TabsList>
                        <TabsTrigger value="1d" onClick={() => setTimeframe('1d')}>1D</TabsTrigger>
                        <TabsTrigger value="1w" onClick={() => setTimeframe('1w')}>1W</TabsTrigger>
                        <TabsTrigger value="1m" onClick={() => setTimeframe('1m')}>1M</TabsTrigger>
                        <TabsTrigger value="1y" onClick={() => setTimeframe('1y')}>1Y</TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <PriceChart data={getMockChartData(timeframe)} timeframe={timeframe} />
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                  <TabsTrigger value="news">News</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {stock.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{stock.description}</p>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Market Cap</span>
                            <span className="text-sm">${(stock.marketCap / 1000000000).toFixed(2)}B</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">P/E Ratio</span>
                            <span className="text-sm">{stock.peRatio.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Dividend Yield</span>
                            <span className="text-sm">{(stock.dividendYield * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">52 Week High</span>
                            <span className="text-sm">${stock.yearHigh.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">52 Week Low</span>
                            <span className="text-sm">${stock.yearLow.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Average Volume</span>
                            <span className="text-sm">{(stock.averageVolume / 1000000).toFixed(2)}M</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="financials">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">Quarterly financial data for {stock.name}</p>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Revenue (Quarterly)</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((quarter) => (
                              <div key={quarter} className="bg-muted p-3 rounded-md">
                                <div className="text-xs text-muted-foreground mb-1">Q{quarter} 2023</div>
                                <div className="font-semibold">${(Math.random() * 10 + 20).toFixed(2)}B</div>
                                <div className={`text-xs ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                                  {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 10).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Earnings Per Share (Quarterly)</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((quarter) => (
                              <div key={quarter} className="bg-muted p-3 rounded-md">
                                <div className="text-xs text-muted-foreground mb-1">Q{quarter} 2023</div>
                                <div className="font-semibold">${(Math.random() * 2 + 1).toFixed(2)}</div>
                                <div className={`text-xs ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                                  {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 15).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="news">
                  <Card>
                    <CardHeader>
                      <CardTitle>Latest News</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                            <h4 className="font-semibold mb-1">{stock.name} {['Reports Strong Q2', 'Announces New Product Line', 'Partners with Tech Giant'][i-1]}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {['Financial Times', 'Wall Street Journal', 'Bloomberg'][i-1]} • {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                            <p className="text-sm mb-2">
                              {['The company reported earnings that exceeded analyst expectations, driven by strong product sales.', 
                                'A new line of products was announced today, expected to launch next quarter.', 
                                'A strategic partnership was announced today that could boost revenue significantly.'][i-1]}
                            </p>
                            <Button variant="link" className="p-0 h-auto text-sm" asChild>
                              <a href="#" className="flex items-center">
                                Read more <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="analysis">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analyst Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <span className="text-2xl font-bold">{(Math.random() * 2 + 3).toFixed(1)}</span>
                          </div>
                          <div>
                            <div className="font-semibold">Average Rating</div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-xl">${(stock.price * 1.15).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Average Target Price</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Buy</span>
                          <span className="font-semibold">65%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex justify-between">
                          <span>Hold</span>
                          <span className="font-semibold">25%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <div className="flex justify-between">
                          <span>Sell</span>
                          <span className="font-semibold">10%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <MarketActions stock={stock} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium">Open</span>
                      <span>${stock.open.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium">Previous Close</span>
                      <span>${stock.previousClose.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium">Day Range</span>
                      <span>${stock.dayLow.toLocaleString()} - ${stock.dayHigh.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium">52 Week Range</span>
                      <span>${stock.yearLow.toLocaleString()} - ${stock.yearHigh.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium">Volume</span>
                      <span>{(stock.volume / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium">Avg. Volume</span>
                      <span>{(stock.averageVolume / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default StockDetails;
