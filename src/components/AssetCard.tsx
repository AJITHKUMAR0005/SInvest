
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { useTrade } from '@/hooks/use-trade';
import TradeModal from './TradeModal';

type AssetType = 'stock' | 'mutual_fund' | 'digital_gold';

interface AssetCardProps {
  asset: Stock | MutualFund | DigitalGold;
  assetType: AssetType;
  className?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, assetType, className }) => {
  // Use the trade hooks to handle buy/sell operations
  const { isOpen, openTradeModal, closeTradeModal } = useTrade(assetType, asset);
  
  // Determine properties based on asset type
  const getAssetDetails = () => {
    let name, ticker, price, change, changePercent, icon;
    
    if (assetType === 'stock') {
      const stock = asset as Stock;
      name = stock.name;
      ticker = stock.ticker;
      price = stock.price;
      change = stock.change;
      changePercent = stock.changePercent;
      icon = stock.ticker.slice(0, 2).toUpperCase();
    } else if (assetType === 'mutual_fund') {
      const fund = asset as MutualFund;
      name = fund.name;
      ticker = fund.ticker;
      price = fund.price;
      change = fund.change;
      changePercent = fund.changePercent;
      icon = 'MF';
    } else {
      const gold = asset as DigitalGold;
      name = gold.name;
      ticker = gold.id;
      price = gold.pricePerGram;
      change = gold.change;
      changePercent = gold.changePercent;
      icon = 'Au';
    }
    
    return { name, ticker, price, change, changePercent, icon };
  };
  
  const details = getAssetDetails();
  const isPositive = details.change >= 0;
  const linkPath = assetType === 'stock' ? `/stocks/${(asset as Stock).id}` : 
                   assetType === 'mutual_fund' ? `/mutual-funds/${(asset as MutualFund).id}` : 
                   `/digital-gold/${(asset as DigitalGold).id}`;
  
  return (
    <>
      <Card className={cn("h-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Link to={linkPath} className="flex items-center space-x-3 flex-grow">
              <div className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold ${
                assetType === 'stock' ? 'bg-blue-100 text-blue-600' : 
                assetType === 'mutual_fund' ? 'bg-purple-100 text-purple-600' : 
                'bg-yellow-100 text-yellow-600'
              }`}>
                {details.icon}
              </div>
              <div>
                <h3 className="font-medium text-base">{details.name}</h3>
                {details.ticker && <p className="text-sm text-muted-foreground">{details.ticker}</p>}
              </div>
            </Link>
            <div className="text-right">
              <p className="font-semibold text-base">
                ${details.price.toLocaleString()}
                {assetType === 'digital_gold' && '/g'}
              </p>
              <div className={`flex items-center justify-end text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>
                  {isPositive ? '+' : ''}{details.change.toFixed(2)} ({Math.abs(details.changePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
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
      
      <TradeModal 
        asset={asset} 
        assetType={assetType} 
        isOpen={isOpen} 
        onClose={closeTradeModal} 
      />
    </>
  );
};

export default AssetCard;
