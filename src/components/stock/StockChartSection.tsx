
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PriceChart from '@/components/PriceChart';
import { Stock, PricePoint } from '@/utils/mockData';

interface StockChartSectionProps {
  stock: Stock & {
    previousClose: number;
  };
  timeframe: string;
  setTimeframe: React.Dispatch<React.SetStateAction<string>>;
}

const StockChartSection: React.FC<StockChartSectionProps> = ({ 
  stock, 
  timeframe, 
  setTimeframe 
}) => {
  const getMockChartData = (timeframe: string): PricePoint[] => {
    // Generate fake chart data based on timeframe
    const dataPoints = timeframe === '1d' ? 24 : 
                      timeframe === '1w' ? 7 : 
                      timeframe === '1m' ? 30 : 365;
    
    return Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(Date.now() - (dataPoints - i) * 3600000).toISOString(),
      price: stock.price + Math.random() * 50 * Math.sin(i / 10),
      volume: Math.floor(Math.random() * 1000000)
    }));
  };

  return (
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
            symbol={stock.ticker}
            change={stock.change}
            timeframe={timeframe}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChartSection;
