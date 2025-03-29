
import React from 'react';
import MainLayout from '@/components/MainLayout';
import PriceChart from '@/components/PriceChart';
import AIRecommendations from '@/components/AIRecommendations';
import BalanceCard from '@/components/BalanceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowUpRight, TrendingUp, CircleDollarSign, Wallet } from 'lucide-react';
import { useInvestments } from '@/hooks/use-investments';
import { useTransactions } from '@/hooks/use-transactions';

const Dashboard = () => {
  const { investments, isLoading: isLoadingInvestments } = useInvestments();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions();
  
  // Sample data for the portfolio value chart
  const portfolioChartData = [
    { date: '2023-05-01', value: 10500 },
    { date: '2023-05-08', value: 11200 },
    { date: '2023-05-15', value: 10900 },
    { date: '2023-05-22', value: 11500 },
    { date: '2023-05-29', value: 12000 },
    { date: '2023-06-05', value: 12400 },
    { date: '2023-06-12', value: 12200 },
    { date: '2023-06-19', value: 12800 },
    { date: '2023-06-26', value: 13100 }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Investment Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PriceChart data={portfolioChartData} height={300} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <BalanceCard />
            <AIRecommendations />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Investments</CardTitle>
              <CardDescription>Your latest investment activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInvestments ? (
                <p>Loading investments...</p>
              ) : investments.length > 0 ? (
                <div className="space-y-3">
                  {investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{investment.ticker}</p>
                        <p className="text-sm text-muted-foreground">
                          {investment.shares} {investment.asset_type === 'digital_gold' ? 'grams' : 'shares'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(investment.average_price * investment.shares).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">${investment.average_price.toLocaleString()} avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No investments yet</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto">
                <span>View All</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <CardDescription>Your recent financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <p>Loading transactions...</p>
              ) : transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded mr-3 ${
                          transaction.type === 'deposit' || transaction.type === 'sell' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'sell' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <Wallet className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{transaction.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'sell' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'sell' ? '+' : '-'}
                          ${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent transactions</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto">
                <span>View All</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Market Overview</CardTitle>
              <CardDescription>Latest market trends and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <CircleDollarSign className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">S&P 500</h3>
                  </div>
                  <p className="text-2xl font-bold mb-1">4,327.81</p>
                  <p className="text-green-600 text-sm">+1.02% (+43.72)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <CircleDollarSign className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Nasdaq</h3>
                  </div>
                  <p className="text-2xl font-bold mb-1">13,437.59</p>
                  <p className="text-green-600 text-sm">+1.28% (+169.66)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <CircleDollarSign className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Dow Jones</h3>
                  </div>
                  <p className="text-2xl font-bold mb-1">34,112.43</p>
                  <p className="text-green-600 text-sm">+0.83% (+281.67)</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                <span>Go to Markets</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
