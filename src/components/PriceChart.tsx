
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface PriceChartProps {
  title?: string;
  subtitle?: string;
  data: any[];
  height?: number;
  className?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  title = "Portfolio Value", 
  subtitle = "Last 30 days", 
  data,
  height = 300,
  className
}) => {
  // Ensure data is valid before rendering
  const validData = Array.isArray(data) && data.length > 0 ? data : [];
  
  // Calculate min and max values for domain
  const values = validData.map(item => item.value).filter(val => typeof val === 'number' && !isNaN(val));
  const minValue = values.length > 0 ? Math.min(...values) * 0.95 : 0;
  const maxValue = values.length > 0 ? Math.max(...values) * 1.05 : 100;
  
  // Is the trend positive?
  const isPositive = values.length >= 2 && values[values.length - 1] >= values[0];
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ width: '100%', height: `${height}px` }}>
          {validData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={validData}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#16a34a" : "#dc2626"} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={isPositive ? "#16a34a" : "#dc2626"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (typeof value === 'string') {
                      const date = new Date(value);
                      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }
                    return value;
                  }}
                />
                <YAxis 
                  domain={[minValue, maxValue]} 
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  labelFormatter={(label) => {
                    if (typeof label === 'string') {
                      const date = new Date(label);
                      return date.toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    }
                    return label;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? "#16a34a" : "#dc2626"} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
