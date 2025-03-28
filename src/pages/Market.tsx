
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStocks, mockMutualFunds, mockDigitalGold } from '@/utils/mockData';
import StockCard from '@/components/StockCard';
import MutualFundCard from '@/components/MutualFundCard';
import DigitalGoldCard from '@/components/DigitalGoldCard';
import MarketOverview from '@/components/MarketOverview';
import AIRecommendations from '@/components/AIRecommendations';
import ProductDetailCard from '@/components/ProductDetailCard';
import MainLayout from '@/components/MainLayout';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';

type ProductType = 'stock' | 'mutual_fund' | 'digital_gold';

interface SelectedProduct {
  product: Stock | MutualFund | DigitalGold;
  type: ProductType;
}

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  
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

  const handleProductSelect = (product: Stock | MutualFund | DigitalGold, type: ProductType) => {
    setSelectedProduct({
      product,
      type
    });
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
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
        
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <ProductDetailCard 
              product={selectedProduct.product}
              productType={selectedProduct.type}
              onClose={handleCloseDetail}
            />
          </div>
        )}
        
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
                  onClick={() => handleProductSelect(stock, 'stock')}
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
                  onClick={() => handleProductSelect(fund, 'mutual_fund')}
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
                  onClick={() => handleProductSelect(gold, 'digital_gold')}
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
