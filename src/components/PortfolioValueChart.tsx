import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/use-transactions';
import { format, subDays, subMonths, subYears, isAfter } from 'date-fns';

interface PortfolioDataPoint {
  date: string;
  value: number;
  formattedDate?: string;
  hasTransaction?: boolean;
  transactionType?: 'deposit' | 'withdrawal';
}

interface PortfolioValueChartProps {
  initialValue: number;
  currentValue: number;
  change: number;
  changePercent: number;
  className?: string;
  height?: number | string;
}

const timeRanges = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "All", value: "all" }
];

const PortfolioValueChart: React.FC<PortfolioValueChartProps> = ({ 
  initialValue,
  currentValue,
  change,
  changePercent,
  className,
  height = "300px"
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [chartData, setChartData] = useState<PortfolioDataPoint[]>([]);
  const { transactions } = useTransactions();
  const isPositive = change >= 0;
  
  // Generate chart data based on selected timeframe
  useEffect(() => {
    const generateChartData = () => {
      const now = new Date();
      let startDate: Date;
      let dataPoints: number;
      let interval: 'day' | 'week' | 'month';
      
      // Determine start date and number of data points based on timeframe
      switch (selectedTimeframe) {
        case '1d':
          startDate = subDays(now, 1);
          dataPoints = 24; // Hourly for 1 day
          interval = 'day';
          break;
        case '1w':
          startDate = subDays(now, 7);
          dataPoints = 7; // Daily for 1 week
          interval = 'day';
          break;
        case '1m':
          startDate = subMonths(now, 1);
          dataPoints = 30; // Daily for 1 month
          interval = 'day';
          break;
        case '3m':
          startDate = subMonths(now, 3);
          dataPoints = 90; // Daily for 3 months
          interval = 'day';
          break;
        case '6m':
          startDate = subMonths(now, 6);
          dataPoints = 26; // Weekly for 6 months
          interval = 'week';
          break;
        case '1y':
          startDate = subYears(now, 1);
          dataPoints = 52; // Weekly for 1 year
          interval = 'week';
          break;
        case 'all':
          startDate = subYears(now, 3); // Assuming 3 years of data
          dataPoints = 36; // Monthly for all time
          interval = 'month';
          break;
        default:
          startDate = subMonths(now, 1);
          dataPoints = 30;
          interval = 'day';
      }
      
      // Generate data points with a realistic trend
      const data: PortfolioDataPoint[] = [];
      let currentPortfolioValue = initialValue;
      const valueRange = currentValue - initialValue;
      const volatility = Math.abs(valueRange) * 0.1; // 10% of the total change as volatility
      
      for (let i = 0; i < dataPoints; i++) {
        let pointDate: Date;
        
        if (interval === 'day') {
          const hoursToAdd = selectedTimeframe === '1d' ? i : i * 24;
          pointDate = new Date(startDate.getTime() + hoursToAdd * 60 * 60 * 1000);
        } else if (interval === 'week') {
          pointDate = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        } else {
          pointDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, startDate.getDate());
        }
        
        // Calculate progress as a percentage of completion (0 to 1)
        const progress = i / (dataPoints - 1);
        
        // Base value follows a trend from initialValue to currentValue
        const baseValue = initialValue + (valueRange * progress);
        
        // Add some randomness for realistic fluctuations
        const randomFactor = (Math.random() - 0.5) * volatility;
        
        // Ensure the final point matches the current value exactly
        const value = i === dataPoints - 1 ? currentValue : baseValue + randomFactor;
        
        // Format date based on timeframe
        let formattedDate: string;
        if (selectedTimeframe === '1d') {
          formattedDate = format(pointDate, 'h:mm a');
        } else if (['1w', '1m', '3m'].includes(selectedTimeframe)) {
          formattedDate = format(pointDate, 'MMM d');
        } else {
          formattedDate = format(pointDate, 'MMM yyyy');
        }
        
        data.push({
          date: pointDate.toISOString(),
          value: Math.max(0, value), // Ensure value is not negative
          formattedDate
        });
      }
      
      // Add transaction markers
      if (transactions.length > 0) {
        const relevantTransactions = transactions.filter(tx => 
          (tx.type === 'deposit' || tx.type === 'withdrawal') && 
          isAfter(new Date(tx.created_at), startDate)
        );
        
        // Mark data points that have transactions
        data.forEach(dataPoint => {
          const dataPointDate = new Date(dataPoint.date);
          
          relevantTransactions.forEach(tx => {
            const txDate = new Date(tx.created_at);
            
            // Check if transaction date is close to this data point
            if (Math.abs(dataPointDate.getTime() - txDate.getTime()) < 24 * 60 * 60 * 1000) {
              dataPoint.hasTransaction = true;
              dataPoint.transactionType = tx.type as 'deposit' | 'withdrawal';
            }
          });
        });
      }
      
      return data;
    };
    
    setChartData(generateChartData());
  }, [selectedTimeframe, initialValue, currentValue, transactions]);
  
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-background/95 border border-border shadow-md rounded-lg backdrop-blur-sm">
          <p className="text-xs text-foreground font-medium">{data.formattedDate}</p>
          <p className="text-sm font-semibold">
            {formatCurrency(data.value)}
          </p>
          {data.hasTransaction && (
            <p className={`text-xs mt-1 ${data.transactionType === 'deposit' ? 'text-success' : 'text-destructive'}`}>
              {data.transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-xl">Portfolio Value</CardTitle>
            <CardDescription>Your investment performance</CardDescription>
          </div>
          <div className="flex items-baseline space-x-2 mt-2 sm:mt-0">
            <span className="text-2xl font-bold">
              {formatCurrency(currentValue)}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{formatCurrency(change)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList className="w-full justify-start">
              {timeRanges.map((range) => (
                <TabsTrigger key={range.value} value={range.value}>
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsla(var(--border)/0.5)" />
              <XAxis 
                dataKey="formattedDate" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
              />
              
              {/* Add reference dots for transactions */}
              {chartData.filter(point => point.hasTransaction).map((point, index) => (
                <ReferenceDot
                  key={index}
                  x={point.formattedDate}
                  y={point.value}
                  r={5}
                  fill={point.transactionType === 'deposit' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioValueChart;
