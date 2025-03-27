
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccount } from '@/hooks/use-account';
import { useTrade } from '@/hooks/use-trade';
import { Stock } from '@/utils/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { calculatePercentChange } from '@/lib/utils';
import TradeModal from './TradeModal';

interface MarketActionsProps {
  stock: Stock;
}

const MarketActions: React.FC<MarketActionsProps> = ({ stock }) => {
  const { balance } = useAccount();
  const { openTradeModal } = useTrade(stock);
  
  const percentChange = calculatePercentChange(stock.price, stock.previousClose);
  const isPositive = percentChange >= 0;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Market Actions</CardTitle>
          <CardDescription>Buy or sell {stock.name} ({stock.ticker}) shares</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium">Current Price</span>
              <span className="font-semibold">${stock.price.toLocaleString()}</span>
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
      
      <TradeModal stock={stock} />
    </>
  );
};

export default MarketActions;
