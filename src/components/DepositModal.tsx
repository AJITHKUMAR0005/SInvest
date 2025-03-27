
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DollarSign, CreditCard, Building, Wallet } from 'lucide-react';
import { useAccount } from '@/hooks/use-account';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const { depositFunds } = useAccount();
  const [error, setError] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
      setError('');
    }
  };

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would pass the payment method to the backend
      console.log(`Processing deposit with ${paymentMethod} payment method`);
      const { success } = await depositFunds(depositAmount);
      if (success) {
        setAmount('');
        setPaymentMethod('card');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="amount"
                type="text"
                className="pl-10"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center cursor-pointer">
                  <Building className="w-4 h-4 mr-2" />
                  <span>Bank Transfer</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span>Digital Wallet</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleDeposit} 
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin"></div>
                Processing...
              </div>
            ) : 'Deposit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
