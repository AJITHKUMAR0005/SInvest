
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { PricePoint } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PriceChartProps {
  data: PricePoint[];
  color?: string;
  className?: string;
  ticker: string;
  change: number;
}

const timeRanges = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y"];

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  color = "hsl(var(--primary))", 
  className,
  ticker,
  change 
}) => {
  const [selectedRange, setSelectedRange] = useState("1M");
  const isPositive = change >= 0;
  
  // Format numbers for display
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  
  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-background/95 border border-border shadow-md rounded-lg backdrop-blur-sm">
          <p className="text-sm text-foreground font-medium">{formatDate(label)}</p>
          <p className="text-base font-semibold">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div className="flex justify-between items-center mb-1">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{ticker} Price</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold">
              {formatPrice(data[data.length - 1]?.price || 0)}
            </span>
            <span className={`text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? "default" : "ghost"}
              size="sm"
              className={`text-xs px-2 py-1 h-7 ${selectedRange === range ? '' : 'text-muted-foreground'}`}
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsla(var(--border)/0.5)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={formatPrice}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: color, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
