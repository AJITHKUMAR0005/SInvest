
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import MarketActions from '@/components/MarketActions';
import { Stock } from '@/utils/mockData';

interface StockSidebarProps {
  stock: Stock & {
    previousClose: number;
    open: number;
    yearHigh: number;
    yearLow: number;
    dayHigh: number;
    dayLow: number;
  };
}

const StockSidebar: React.FC<StockSidebarProps> = ({ stock }) => {
  return (
    <div className="space-y-6">
      <MarketActions stock={stock} />
      
      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium">Open</span>
              <span>${stock.open.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium">Previous Close</span>
              <span>${stock.previousClose.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium">Day Range</span>
              <span>${stock.dayLow.toLocaleString()} - ${stock.dayHigh.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium">52 Week Range</span>
              <span>${stock.yearLow.toLocaleString()} - ${stock.yearHigh.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium">Volume</span>
              <span>{(stock.volume / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium">Avg. Volume</span>
              <span>{(stock.averageVolume / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockSidebar;
