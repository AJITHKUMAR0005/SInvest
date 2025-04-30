
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
import { mockMutualFunds, generateMockPriceHistory, PricePoint } from '@/utils/mockData';
import { useTrade } from '@/hooks/use-trade';
import TradeModal from '@/components/TradeModal';
import { ArrowLeft, Percent, BarChart2, DollarSign } from 'lucide-react';
import WatchlistButton from '@/components/WatchlistButton';

const MutualFundDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fund = mockMutualFunds.find(fund => fund.id === id);
  const [timeframe, setTimeframe] = useState('1m');

  const { isOpen, openTradeModal, closeTradeModal } = useTrade(
    'mutual_fund',
    fund || mockMutualFunds[0]
  );

  if (!fund) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <Card className="p-8 text-center">
            <CardTitle className="mb-4">Mutual Fund Not Found</CardTitle>
            <CardDescription>The mutual fund you're looking for doesn't exist.</CardDescription>
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
      price: fund.price * (0.95 + 0.1 * Math.sin(i / 10)),
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
                    <CardTitle className="text-3xl font-bold">{fund.name}</CardTitle>
                    <CardDescription className="text-lg">{fund.ticker}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">${fund.price.toLocaleString()}</p>
                    <p className={fund.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {fund.change >= 0 ? "+" : ""}{fund.change.toFixed(2)} ({fund.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Performance</CardTitle>
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
                    ticker={fund.ticker}
                    change={fund.change}
                    timeframe={timeframe}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About {fund.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{fund.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fund Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Expense Ratio</span>
                  </div>
                  <span className="font-semibold">{(fund.expenseRatio * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Risk Level</span>
                  </div>
                  <span className="font-semibold">{fund.riskLevel}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Yield</span>
                  </div>
                  <span className="font-semibold">{(fund.yield * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>1-Year Return</span>
                  </div>
                  <span className="font-semibold">{fund.oneYearReturn.toFixed(2)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trade</CardTitle>
                <CardDescription>Buy or sell units of this mutual fund</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                <div className="flex items-center justify-center">
                  <WatchlistButton
                    ticker={fund.ticker}
                    variant="outline"
                    showText={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <TradeModal
          asset={fund}
          assetType="mutual_fund"
          isOpen={isOpen}
          onClose={closeTradeModal}
        />
      </div>
    </MainLayout>
  );
};

export default MutualFundDetails;
