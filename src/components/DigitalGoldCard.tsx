
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DigitalGold } from '@/utils/mockData';
import WatchlistButton from './WatchlistButton';

interface DigitalGoldCardProps {
  gold: DigitalGold;
  className?: string;
}

const DigitalGoldCard: React.FC<DigitalGoldCardProps> = ({ gold, className }) => {
  const isPositive = gold.change >= 0;

  return (
    <div className="relative">
      <Link
        to={`/digital-gold/${gold.id}`}
        className={cn(
          "block h-full w-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
          className
        )}
      >
        <div className="flex flex-col space-y-3">
          {/* Top row with name and watchlist button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-semibold">
                Au
              </div>
              <div>
                <h3 className="font-medium text-base">{gold.name}</h3>
                <p className="text-sm text-muted-foreground">Purity: {gold.purity}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <WatchlistButton
                ticker={gold.id}
                size="sm"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              />
            </div>
          </div>

          {/* Middle row with price and change */}
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="font-semibold text-base">${gold.pricePerGram.toLocaleString()}/g</p>
            </div>
            <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}{gold.change.toFixed(2)} ({Math.abs(gold.changePercent).toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Bottom row with minimum quantity */}
          <div className="text-xs text-muted-foreground">
            <span>Min. quantity: {gold.minimumQuantity}g</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DigitalGoldCard;
