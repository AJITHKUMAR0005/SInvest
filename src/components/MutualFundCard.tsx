
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MutualFund } from '@/utils/mockData';
import WatchlistButton from './WatchlistButton';

interface MutualFundCardProps {
  fund: MutualFund;
  className?: string;
}

const MutualFundCard: React.FC<MutualFundCardProps> = ({ fund, className }) => {
  const isPositive = fund.change >= 0;

  return (
    <div className="relative">
      <Link
        to={`/mutual-funds/${fund.id}`}
        className={cn(
          "block h-full w-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
          className
        )}
      >
        <div className="flex flex-col space-y-3">
          {/* Top row with ticker and watchlist button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-sm font-semibold">
                {fund.ticker.substring(0, 2)}
              </div>
              <div>
                <h3 className="font-medium text-base">{fund.ticker}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{fund.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <WatchlistButton
                ticker={fund.ticker}
                size="sm"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              />
            </div>
          </div>

          {/* Middle row with price and change */}
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="font-semibold text-base">${fund.price.toLocaleString()}</p>
            </div>
            <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}{fund.change.toFixed(2)} ({Math.abs(fund.changePercent).toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Bottom row with risk and return */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Risk: {fund.riskLevel}</span>
            <span>1Y: {fund.oneYearReturn}%</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MutualFundCard;
