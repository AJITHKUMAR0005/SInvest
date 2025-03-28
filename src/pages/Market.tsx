
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStocks, mockMutualFunds, mockDigitalGold } from '@/utils/mockData';
import StockCard from '@/components/StockCard';
import MutualFundCard from '@/components/MutualFundCard';
import DigitalGoldCard from '@/components/DigitalGoldCard';
import MarketOverview from '@/components/MarketOverview';
import AIRecommendations from '@/components/AIRecommendations';
import MainLayout from '@/components/MainLayout';

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const filteredStocks = mockStocks.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMutualFunds = mockMutualFunds.filter(fund => 
    fund.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    fund.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDigitalGold = mockDigitalGold.filter(gold => 
    gold.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemSelect = (itemId: string) => {
    navigate(`/stocks/${itemId}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Markets</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MarketOverview />
          </div>
          <div>
            <AIRecommendations />
          </div>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search investments..."
            className="w-full p-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="stocks" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
            <TabsTrigger value="digital-gold">Digital Gold</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stocks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStocks.map(stock => (
                <div 
                  key={stock.id} 
                  onClick={() => handleItemSelect(stock.id)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <StockCard stock={stock} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mutual-funds" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMutualFunds.map(fund => (
                <div 
                  key={fund.id} 
                  onClick={() => handleItemSelect(fund.id)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <MutualFundCard key={fund.id} fund={fund} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="digital-gold" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDigitalGold.map(gold => (
                <div 
                  key={gold.id} 
                  onClick={() => handleItemSelect(gold.id)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <DigitalGoldCard key={gold.id} gold={gold} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Market;
