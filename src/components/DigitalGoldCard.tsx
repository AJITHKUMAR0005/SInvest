
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DigitalGold } from '@/utils/mockData';

interface DigitalGoldCardProps {
  gold: DigitalGold;
  className?: string;
}

const DigitalGoldCard: React.FC<DigitalGoldCardProps> = ({ gold, className }) => {
  const isPositive = gold.change >= 0;
  
  return (
    <Link 
      to={`/digital-gold/${gold.id}`}
      className={cn(
        "block h-full w-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
        className
      )}
    >
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
        <div className="text-right">
          <p className="font-semibold text-base">${gold.pricePerGram.toLocaleString()}/g</p>
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
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        <span>Min. quantity: {gold.minimumQuantity}g</span>
      </div>
    </Link>
  );
};

export default DigitalGoldCard;
