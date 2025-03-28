
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navigation from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';
import { Stock, mockStocks } from '@/utils/mockData';
import StockHeader from '@/components/stock/StockHeader';
import StockChartSection from '@/components/stock/StockChartSection';
import StockInfoTabs from '@/components/stock/StockInfoTabs';
import StockSidebar from '@/components/stock/StockSidebar';

// Helper function to find stock by ID
const getStock = (id: string): Stock | undefined => {
  return mockStocks.find(stock => stock.id === id);
};

const StockDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [timeframe, setTimeframe] = useState('1d');

  useEffect(() => {
    if (id) {
      const stockData = getStock(id);
      if (stockData) {
        setStock(stockData);
      } else {
        navigate('/market');
      }
    }
  }, [id, navigate]);

  if (!stock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Add mock data to stock for rendering
  const enhancedStock = {
    ...stock,
    previousClose: stock.price * 0.99, // Mock previous close as 99% of current price
    open: stock.price * 0.995,          // Mock open price
    yearHigh: stock.price * 1.2,        // Mock 52-week high
    yearLow: stock.price * 0.8,         // Mock 52-week low
    dayHigh: stock.price * 1.03,        // Mock day high
    dayLow: stock.price * 0.97,         // Mock day low
    dividendYield: 0.02,                // Mock dividend yield (2%)
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold ml-2">{enhancedStock.name} ({enhancedStock.ticker})</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StockChartSection 
                stock={enhancedStock} 
                timeframe={timeframe} 
                setTimeframe={setTimeframe} 
              />
              
              <StockInfoTabs stock={enhancedStock} />
            </div>
            
            <StockSidebar stock={enhancedStock} />
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default StockDetails;
