import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, CreditCard, Building, Wallet, Smartphone, Globe } from 'lucide-react';
import { useAccount } from '@/hooks/use-account';
import PaymentMethodSelector, { PaymentMethod } from './PaymentMethodSelector';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const { withdrawFunds, balance } = useAccount();
  const [error, setError] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
      setError('');
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (balance && withdrawAmount > balance.cash_balance) {
      setError('Insufficient funds');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, we would pass the payment method to the backend
      console.log(`Processing withdrawal with ${paymentMethod} payment method`);
      const { success } = await withdrawFunds(withdrawAmount);
      if (success) {
        setAmount('');
        setPaymentMethod('bank');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
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
            {balance && (
              <p className="text-sm text-muted-foreground">
                Available balance: ${balance.cash_balance.toLocaleString()}
              </p>
            )}
          </div>

          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
            title="Withdrawal Method"
            description="Select how you would like to receive your funds"
            amount={amount ? parseFloat(amount) : undefined}
            options={[
              {
                id: 'bank',
                label: 'Bank Transfer',
                icon: <Building className="w-5 h-5 text-blue-600" />,
                description: 'Direct to your bank account',
                recommended: true,
                securityInfo: 'Bank-level security',
                processingTime: '1-3 business days',
                fees: 'No fees'
              },
              {
                id: 'card',
                label: 'Credit/Debit Card',
                icon: <CreditCard className="w-5 h-5 text-primary" />,
                description: 'Instant to your card',
                securityInfo: 'Encrypted and secure',
                processingTime: 'Instant',
                fees: '1% fee may apply',
                brandLogos: ['visa', 'mastercard']
              },
              {
                id: 'wallet',
                label: 'Digital Wallet',
                icon: <Wallet className="w-5 h-5 text-green-600" />,
                description: 'Quick and convenient withdrawal',
                securityInfo: 'Tokenized transactions',
                processingTime: 'Instant',
                fees: 'No fees'
              },
              {
                id: 'upi',
                label: 'UPI',
                icon: <Smartphone className="w-5 h-5 text-purple-600" />,
                description: 'Withdraw directly to UPI',
                securityInfo: 'PIN protected',
                processingTime: 'Instant',
                fees: 'No fees'
              }
            ]}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleWithdraw}
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || (balance && parseFloat(amount) > balance.cash_balance)}
            variant="destructive"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin"></div>
                Processing...
              </div>
            ) : 'Withdraw'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
