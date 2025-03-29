
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Wallet } from 'lucide-react';
import { useAccount } from '@/hooks/use-account';
import WithdrawModal from './WithdrawModal';

interface BalanceCardProps {
  className?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ className }) => {
  const { balance, isLoading } = useAccount();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Cash Balance
          </CardTitle>
          <CardDescription>Available funds for trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-0.5 mb-4">
            <p className="text-3xl font-bold">
              ${balance?.cash_balance.toLocaleString() || '0.00'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 text-xs h-9" size="sm">
              Deposit
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-xs h-9" 
              size="sm"
              onClick={() => setIsWithdrawModalOpen(true)}
            >
              Withdraw
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="link" className="text-xs h-8 p-0" size="sm">
            <span>View Transactions</span>
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>

      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
      />
    </>
  );
};

export default BalanceCard;
