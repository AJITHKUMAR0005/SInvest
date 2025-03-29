
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
import TradeModal from '@/components/TradeModal';
import { useTrade } from '@/hooks/use-trade';

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

  // Create separate state for each asset type's selected item
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);
  const [selectedGold, setSelectedGold] = useState(null);
  
  // Initialize trade hooks for each asset type
  const { openTradeModal: openStockTradeModal, isOpen: isStockModalOpen, closeTradeModal: closeStockTradeModal } = 
    useTrade('stock', selectedStock);
  const { openTradeModal: openFundTradeModal, isOpen: isFundModalOpen, closeTradeModal: closeFundTradeModal } = 
    useTrade('mutual_fund', selectedFund);
  const { openTradeModal: openGoldTradeModal, isOpen: isGoldModalOpen, closeTradeModal: closeGoldTradeModal } = 
    useTrade('digital_gold', selectedGold);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    openStockTradeModal('buy');
  };

  const handleFundClick = (fund) => {
    setSelectedFund(fund);
    openFundTradeModal('buy');
  };

  const handleGoldClick = (gold) => {
    setSelectedGold(gold);
    openGoldTradeModal('buy');
  };

  const handleDetailsClick = (id) => {
    navigate(`/stocks/${id}`);
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
                  className="cursor-pointer transition-transform hover:scale-[1.02] relative group"
                >
                  <div onClick={() => handleDetailsClick(stock.id)}>
                    <StockCard stock={stock} />
                  </div>
                  <div 
                    className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStockClick(stock);
                    }}
                  >
                    <button className="bg-primary text-white px-4 py-2 rounded-md shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mutual-funds" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMutualFunds.map(fund => (
                <div 
                  key={fund.id} 
                  className="cursor-pointer transition-transform hover:scale-[1.02] relative group"
                >
                  <div onClick={() => handleDetailsClick(fund.id)}>
                    <MutualFundCard fund={fund} />
                  </div>
                  <div 
                    className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFundClick(fund);
                    }}
                  >
                    <button className="bg-primary text-white px-4 py-2 rounded-md shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="digital-gold" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDigitalGold.map(gold => (
                <div 
                  key={gold.id} 
                  className="cursor-pointer transition-transform hover:scale-[1.02] relative group"
                >
                  <div onClick={() => handleDetailsClick(gold.id)}>
                    <DigitalGoldCard gold={gold} />
                  </div>
                  <div 
                    className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoldClick(gold);
                    }}
                  >
                    <button className="bg-primary text-white px-4 py-2 rounded-md shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Trade Modals */}
        {selectedStock && (
          <TradeModal 
            asset={selectedStock} 
            assetType="stock" 
            isOpen={isStockModalOpen} 
            onClose={closeStockTradeModal} 
          />
        )}
        
        {selectedFund && (
          <TradeModal 
            asset={selectedFund} 
            assetType="mutual_fund" 
            isOpen={isFundModalOpen} 
            onClose={closeFundTradeModal} 
          />
        )}
        
        {selectedGold && (
          <TradeModal 
            asset={selectedGold} 
            assetType="digital_gold" 
            isOpen={isGoldModalOpen} 
            onClose={closeGoldTradeModal} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Market;
