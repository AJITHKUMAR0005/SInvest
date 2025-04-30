
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stock } from '@/utils/mockData';
import WatchlistButton from './WatchlistButton';

interface StockCardProps {
  stock: Stock;
  className?: string;
}

const StockCard: React.FC<StockCardProps> = ({ stock, className }) => {
  const isPositive = stock.change >= 0;

  return (
    <div className="relative">
      <Link
        to={`/stocks/${stock.id}`}
        className={cn(
          "block h-full w-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
          className
        )}
      >
        <div className="flex flex-col space-y-3">
          {/* Top row with ticker and price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-sm font-semibold">
                {stock.ticker.substring(0, 2)}
              </div>
              <div>
                <h3 className="font-medium text-base">{stock.ticker}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{stock.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <WatchlistButton
                ticker={stock.ticker}
                size="sm"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              />
            </div>
          </div>

          {/* Bottom row with price and change */}
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="font-semibold text-base">${stock.price.toLocaleString()}</p>
            </div>
            <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StockCard;
