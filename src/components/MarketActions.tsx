
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccount } from '@/hooks/use-account';
import { useTrade } from '@/hooks/use-trade';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { calculatePercentChange } from '@/lib/utils';
import TradeModal from './TradeModal';

interface MarketActionsProps {
  asset: Stock | MutualFund | DigitalGold;
  assetType: 'stock' | 'mutual_fund' | 'digital_gold';
}

const MarketActions: React.FC<MarketActionsProps> = ({ asset, assetType }) => {
  const { balance } = useAccount();
  const { openTradeModal } = useTrade(assetType, asset);
  
  // Get asset details based on type
  const getAssetDetails = () => {
    if (assetType === 'stock') {
      const stock = asset as Stock;
      return {
        name: stock.name,
        ticker: stock.ticker,
        price: stock.price,
        previousPrice: stock.previousClose,
        change: stock.change,
        changePercent: stock.changePercent
      };
    } else if (assetType === 'mutual_fund') {
      const fund = asset as MutualFund;
      return {
        name: fund.name,
        ticker: fund.ticker,
        price: fund.price,
        previousPrice: fund.price - fund.change, // Calculate previous price
        change: fund.change,
        changePercent: fund.changePercent
      };
    } else {
      const gold = asset as DigitalGold;
      return {
        name: gold.name,
        ticker: gold.id,
        price: gold.pricePerGram,
        previousPrice: gold.pricePerGram - gold.change, // Calculate previous price
        change: gold.change,
        changePercent: gold.changePercent
      };
    }
  };
  
  const details = getAssetDetails();
  const percentChange = calculatePercentChange(details.price, details.previousPrice);
  const isPositive = percentChange >= 0;

  // Get appropriate unit label based on asset type
  const getUnitLabel = () => {
    if (assetType === 'digital_gold') return 'grams';
    return 'shares';
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Market Actions</CardTitle>
          <CardDescription>
            Buy or sell {details.name} {details.ticker ? `(${details.ticker})` : ''} {getUnitLabel()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium">Current Price</span>
              <span className="font-semibold">
                ${details.price.toLocaleString()}
                {assetType === 'digital_gold' ? '/gram' : ''}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium">24h Change</span>
              <span className={`flex items-center font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                {percentChange.toFixed(2)}%
              </span>
            </div>
            {balance && (
              <div className="flex justify-between items-center py-1">
                <span className="text-sm font-medium">Your Balance</span>
                <span className="font-semibold">${balance.cash_balance.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button 
            className="flex-1"
            onClick={() => openTradeModal('buy')}
          >
            Buy
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => openTradeModal('sell')}
          >
            Sell
          </Button>
        </CardFooter>
      </Card>
      
      <TradeModal asset={asset} assetType={assetType} />
    </>
  );
};

export default MarketActions;
