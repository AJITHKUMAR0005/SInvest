
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from '@/hooks/use-account';
import { Wallet, ArrowDownToLine } from 'lucide-react';
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
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Cash Balance</h3>
              <p className="text-2xl font-semibold">
                {isLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  `$${balance?.cash_balance.toLocaleString() || '0.00'}`
                )}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw
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
