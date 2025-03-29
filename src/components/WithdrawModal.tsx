
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

const WithdrawModal: React.FC<WithdrawModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { balance, withdrawFunds } = useAccount();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric values with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw",
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    
    if (!balance || withdrawAmount > balance.cash_balance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "You don't have enough funds to withdraw this amount",
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
      }
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
            <p className="text-sm font-medium col-span-4">
              Current Balance: <span className="font-semibold">${balance?.cash_balance.toLocaleString() || '0.00'}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium col-span-1">Amount:</p>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="pl-8"
                type="text"
                inputMode="decimal"
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mt-2">
            <p>Funds will be transferred to your linked bank account.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
