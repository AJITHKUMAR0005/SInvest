
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { mockStocks, generateMockPriceHistory } from '@/utils/mockData';
import PriceChart from '@/components/PriceChart';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Info, BarChart3, BookOpen, Star, Plus, Minus, LineChart, Activity, DollarSign } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Link } from 'react-router-dom';

const StockDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState(mockStocks[0]);
  const [priceHistory, setPriceHistory] = useState(generateMockPriceHistory(stock.price, 90));
  const [activeTab, setActiveTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('buy');
  
  useEffect(() => {
    // Find the stock by ID
    const foundStock = mockStocks.find((s) => s.id === id);
    if (foundStock) {
      setStock(foundStock);
      setPriceHistory(generateMockPriceHistory(foundStock.price, 90));
    }
  }, [id]);
  
  const handleQuantityChange = (action: 'increment' | 'decrement') => {
    if (action === 'increment') {
      setQuantity(quantity + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const isPositive = stock.change >= 0;
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-lg font-semibold mr-3">
                      {stock.ticker.substring(0, 2)}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">{stock.name}</h1>
                      <div className="text-muted-foreground">{stock.ticker} • {stock.industry}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-baseline">
                  <div className="text-3xl font-bold">${stock.price.toLocaleString()}</div>
                  <div className={`ml-2 text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Price Chart */}
                <Card className="glass-panel">
                  <CardHeader className="pb-0">
                    <CardTitle>Price Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <PriceChart
                        data={priceHistory}
                        ticker={stock.ticker}
                        change={stock.change}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Stock Information Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="glass-panel">
                  <TabsList className="grid grid-cols-3 bg-secondary/50 p-1 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                    <TabsTrigger value="news">News</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6">
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Market Cap</div>
                          <div className="font-medium">
                            ${(stock.marketCap / 1000000000).toFixed(2)}B
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Volume</div>
                          <div className="font-medium">
                            {(stock.volume / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">P/E Ratio</div>
                          <div className="font-medium">
                            {stock.peRatio ? stock.peRatio.toFixed(2) : '--'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Dividend</div>
                          <div className="font-medium">
                            {stock.dividend ? `$${stock.dividend.toFixed(2)}` : '--'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">52W High</div>
                          <div className="font-medium">
                            ${stock.high52w.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">52W Low</div>
                          <div className="font-medium">
                            ${stock.low52w.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Avg Volume</div>
                          <div className="font-medium">
                            {(stock.averageVolume / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Industry</div>
                          <div className="font-medium">
                            {stock.industry}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About {stock.name}</h3>
                        <p className="text-muted-foreground">
                          {stock.name} is a leading company in the {stock.industry} industry. 
                          Founded with the mission to innovate and revolutionize the way people interact with technology, 
                          they've established themselves as market leaders through continuous innovation and customer-focused products.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="financials" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Quarterly Results</h3>
                        <Button variant="outline" size="sm">
                          View Full Report
                        </Button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border text-left">
                              <th className="p-2 text-sm font-medium text-muted-foreground">Period</th>
                              <th className="p-2 text-sm font-medium text-muted-foreground">Revenue</th>
                              <th className="p-2 text-sm font-medium text-muted-foreground">EPS</th>
                              <th className="p-2 text-sm font-medium text-muted-foreground">Net Income</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border">
                              <td className="p-2">Q1 2023</td>
                              <td className="p-2">$94.8B</td>
                              <td className="p-2">$1.52</td>
                              <td className="p-2">$24.2B</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="p-2">Q4 2022</td>
                              <td className="p-2">$117.2B</td>
                              <td className="p-2">$1.88</td>
                              <td className="p-2">$30.0B</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="p-2">Q3 2022</td>
                              <td className="p-2">$90.1B</td>
                              <td className="p-2">$1.29</td>
                              <td className="p-2">$20.7B</td>
                            </tr>
                            <tr>
                              <td className="p-2">Q2 2022</td>
                              <td className="p-2">$83.0B</td>
                              <td className="p-2">$1.20</td>
                              <td className="p-2">$19.4B</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="news" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Latest News</h3>
                        <Button variant="outline" size="sm">
                          More News
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                            <h4 className="font-medium">{stock.name} Reports Strong Quarterly Results, Exceeding Analyst Expectations</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              The company reported revenue growth of 15% year-over-year, with particularly strong performance in its services segment.
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">Financial Times</span>
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                {/* Trade Card */}
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Trade {stock.ticker}</CardTitle>
                    <CardDescription>
                      Place an order to buy or sell
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="buy" className="w-full" onValueChange={setOrderType}>
                      <TabsList className="grid grid-cols-2 w-full mb-4">
                        <TabsTrigger value="buy">Buy</TabsTrigger>
                        <TabsTrigger value="sell">Sell</TabsTrigger>
                      </TabsList>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <div className="flex items-center rounded-md border border-input">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="rounded-r-none"
                              onClick={() => handleQuantityChange('decrement')}
                              disabled={quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="quantity"
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                              className="border-0 text-center"
                              min={1}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="rounded-l-none"
                              onClick={() => handleQuantityChange('increment')}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="market-price">Market Price</Label>
                          <Input id="market-price" value={`$${stock.price.toFixed(2)}`} readOnly />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between items-center font-medium">
                          <span>Estimated Cost</span>
                          <span>${(stock.price * quantity).toFixed(2)}</span>
                        </div>
                        
                        <Button className="w-full mt-4" size="lg">
                          {orderType === 'buy' ? 'Buy' : 'Sell'} {stock.ticker}
                        </Button>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
                
                {/* Key Stats */}
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-primary mr-2" />
                      Key Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Open</span>
                      <span className="font-medium">${(stock.price - (Math.random() * 2)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">High</span>
                      <span className="font-medium">${(stock.price + (Math.random() * 3)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Low</span>
                      <span className="font-medium">${(stock.price - (Math.random() * 3)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Volume</span>
                      <span className="font-medium">{(stock.volume / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Avg. Volume</span>
                      <span className="font-medium">{(stock.averageVolume / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Market Cap</span>
                      <span className="font-medium">${(stock.marketCap / 1000000000).toFixed(2)}B</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Analyst Recommendations */}
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="h-5 w-5 text-primary mr-2" />
                      Analyst Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">Buy</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Buy</div>
                        <div className="text-lg font-semibold">24</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Hold</div>
                        <div className="text-lg font-semibold">8</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Sell</div>
                        <div className="text-lg font-semibold">2</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default StockDetails;
