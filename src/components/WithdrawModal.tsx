
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from '@/hooks/use-account';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { balance, withdrawFunds } = useAccount();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && !isNaN(Number(value)))) {
      setAmount(value);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    
    if (!balance || withdrawAmount > balance.cash_balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await withdrawFunds(withdrawAmount);
      
      if (result.success) {
        toast({
          title: "Withdrawal successful",
          description: `$${withdrawAmount.toLocaleString()} has been withdrawn from your account`,
        });
        setAmount('');
        onClose();
      } else if (result.error) {
        toast({
          title: "Withdrawal failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium col-span-2">
              Withdrawal Amount:
            </p>
            <div className="col-span-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
          </div>
          
          {balance && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm font-medium col-span-2">Available Balance:</p>
              <p className="col-span-2">${balance.cash_balance.toLocaleString()}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
          >
            {isSubmitting ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
