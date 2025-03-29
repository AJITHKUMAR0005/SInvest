
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/MainLayout';
import PriceChart from '@/components/PriceChart';
import { mockDigitalGold, generateMockPriceHistory, PricePoint } from '@/utils/mockData';
import { useTrade } from '@/hooks/use-trade';
import TradeModal from '@/components/TradeModal';
import { ArrowLeft, Award, DollarSign, Scale, Package } from 'lucide-react';

const DigitalGoldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const gold = mockDigitalGold.find(gold => gold.id === id);
  const [timeframe, setTimeframe] = useState('1m');
  
  const { isOpen, openTradeModal, closeTradeModal } = useTrade(
    'digital_gold', 
    gold || mockDigitalGold[0]
  );
  
  if (!gold) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <Card className="p-8 text-center">
            <CardTitle className="mb-4">Digital Gold Not Found</CardTitle>
            <CardDescription>The digital gold product you're looking for doesn't exist.</CardDescription>
            <Button className="mt-4" onClick={() => navigate('/market')}>
              Back to Market
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  const getMockChartData = (timeframe: string): PricePoint[] => {
    // Generate fake chart data based on timeframe
    const dataPoints = timeframe === '1d' ? 24 : 
                      timeframe === '1w' ? 7 : 
                      timeframe === '1m' ? 30 : 365;
    
    return Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(Date.now() - (dataPoints - i) * 3600000).toISOString(),
      price: gold.pricePerGram * (0.95 + 0.1 * Math.sin(i / 10)),
      volume: Math.floor(Math.random() * 1000000)
    }));
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/market')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-3xl font-bold">{gold.name}</CardTitle>
                    <CardDescription className="text-lg">Gold - {gold.purity}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">${gold.pricePerGram.toLocaleString()}/gram</p>
                    <p className={gold.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {gold.change >= 0 ? "+" : ""}{gold.change.toFixed(2)} ({gold.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Price History</CardTitle>
                  </div>
                  <div>
                    <Tabs value={timeframe} onValueChange={setTimeframe}>
                      <TabsList>
                        <TabsTrigger value="1d">1D</TabsTrigger>
                        <TabsTrigger value="1w">1W</TabsTrigger>
                        <TabsTrigger value="1m">1M</TabsTrigger>
                        <TabsTrigger value="1y">1Y</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <PriceChart 
                    data={getMockChartData(timeframe)} 
                    ticker="Gold"
                    change={gold.change}
                    timeframe={timeframe}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>About {gold.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{gold.description}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Purity</span>
                  </div>
                  <span className="font-semibold">{gold.purity}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Storage Fees</span>
                  </div>
                  <span className="font-semibold">{gold.storageFees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Minimum Purchase</span>
                  </div>
                  <span className="font-semibold">{gold.minimumQuantity} gram</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trade</CardTitle>
                <CardDescription>Buy or sell digital gold</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => openTradeModal('buy')} 
                    className="w-full"
                  >
                    Buy
                  </Button>
                  <Button 
                    onClick={() => openTradeModal('sell')} 
                    variant="outline" 
                    className="w-full"
                  >
                    Sell
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <TradeModal 
          asset={gold}
          assetType="digital_gold"
          isOpen={isOpen}
          onClose={closeTradeModal}
        />
      </div>
    </MainLayout>
  );
};

export default DigitalGoldDetails;
