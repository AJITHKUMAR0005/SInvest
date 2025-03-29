import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import BalanceCard from '@/components/BalanceCard';
import { useInvestments } from '@/hooks/use-investments';
import { useWatchlist } from '@/hooks/use-watchlist';
import { mockStocks } from '@/utils/mockData';
import AssetCard from '@/components/AssetCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { investments, isLoading } = useInvestments();
  const { watchlist } = useWatchlist();
  
  // Filter stocks that are in the watchlist
  const watchlistStocks = mockStocks.filter(stock => 
    watchlist.some(item => item.ticker === stock.ticker)
  );

  // Get user's stock investments
  const stockInvestments = investments.filter(inv => inv.asset_type === 'stock');
  const mutualFundInvestments = investments.filter(inv => inv.asset_type === 'mutual_fund');
  const digitalGoldInvestments = investments.filter(inv => inv.asset_type === 'digital_gold');

  // Find the corresponding stock objects for the investments
  const userStocks = stockInvestments.map(inv => {
    const stockData = mockStocks.find(stock => stock.ticker === inv.ticker);
    return stockData ? { ...stockData, shares: inv.shares } : null;
  }).filter(Boolean);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BalanceCard className="h-full" />
          <Card>
            <CardHeader>
              <CardTitle>Total Investments</CardTitle>
              <CardDescription>Your total investment value</CardDescription>
            </CardHeader>
            <CardContent>
              $0.00
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Distribution of your assets</CardDescription>
            </CardHeader>
            <CardContent>
              Stocks: 0%
              <br />
              Mutual Funds: 0%
              <br />
              Digital Gold: 0%
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Watchlist Count</CardTitle>
              <CardDescription>Number of items in your watchlist</CardDescription>
            </CardHeader>
            <CardContent>
              {watchlist.length} Items
            </CardContent>
          </Card>
        </div>

        {userStocks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userStocks.map(stock => stock && (
                <AssetCard 
                  key={stock.id} 
                  asset={stock}
                  assetType="stock"
                />
              ))}
            </div>
          </div>
        )}

        {watchlistStocks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Watchlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistStocks.map(stock => (
                <AssetCard 
                  key={stock.id} 
                  asset={stock}
                  assetType="stock"
                />
              ))}
            </div>
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Investment Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockStocks.slice(0, 3).map(stock => (
              <AssetCard 
                key={stock.id} 
                asset={stock}
                assetType="stock"
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
