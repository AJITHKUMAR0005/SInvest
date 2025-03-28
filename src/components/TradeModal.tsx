
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';
import { useAccount } from '@/hooks/use-account';
import { useTrade } from '@/hooks/use-trade';

export type AssetType = 'stock' | 'mutualFund' | 'digitalGold';

export interface TradeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  asset: Stock | MutualFund | DigitalGold;
  assetType: AssetType;
}

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen = false,
  onClose,
  asset,
  assetType
}) => {
  const { toast } = useToast();
  const { balance, updateBalance } = useAccount();
  const { closeTradeModal, tradeType } = useTrade();
  const [quantity, setQuantity] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAssetName = (): string => {
    if (assetType === 'stock') {
      return `${(asset as Stock).name} (${(asset as Stock).ticker})`;
    } else if (assetType === 'mutualFund') {
      return `${(asset as MutualFund).name} (${(asset as MutualFund).ticker})`;
    } else {
      return (asset as DigitalGold).name;
    }
  };

  const getAssetPrice = (): number => {
    if (assetType === 'stock' || assetType === 'mutualFund') {
      return (asset as Stock | MutualFund).price;
    } else {
      return (asset as DigitalGold).pricePerGram;
    }
  };

  const getUnitLabel = (): string => {
    if (assetType === 'stock') return 'shares';
    if (assetType === 'mutualFund') return 'units';
    return 'grams';
  };

  const getTotalPrice = (): number => {
    const numericQuantity = parseFloat(quantity) || 0;
    return numericQuantity * getAssetPrice();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const totalCost = getTotalPrice();

    // Simulate API call
    setTimeout(() => {
      if (tradeType === 'buy') {
        // Check if enough balance
        if (balance && totalCost > balance.cash_balance) {
          toast({
            title: "Insufficient funds",
            description: "You don't have enough balance to complete this transaction.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        
        // Update balance
        if (updateBalance) {
          updateBalance(balance ? balance.cash_balance - totalCost : 0);
        }
        
        toast({
          title: "Purchase successful",
          description: `You have successfully purchased ${quantity} ${getUnitLabel()} of ${getAssetName()}.`,
        });
      } else {
        // Update balance
        if (updateBalance) {
          updateBalance(balance ? balance.cash_balance + totalCost : 0);
        }
        
        toast({
          title: "Sale successful",
          description: `You have successfully sold ${quantity} ${getUnitLabel()} of ${getAssetName()}.`,
        });
      }
      
      setIsSubmitting(false);
      closeTradeModal();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose || closeTradeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {getAssetName()}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium col-span-2">
              {tradeType === 'buy' ? 'Purchase' : 'Sell'} Amount:
            </p>
            <div className="col-span-2 flex gap-2">
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0.01"
                step="0.01"
                className="flex-1"
              />
              <span className="flex items-center text-sm text-muted-foreground">
                {getUnitLabel()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium col-span-2">Price per {getUnitLabel()}:</p>
            <p className="col-span-2">${getAssetPrice().toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium col-span-2">Total Cost:</p>
            <p className="col-span-2 font-semibold">${getTotalPrice().toLocaleString()}</p>
          </div>
          {balance && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm font-medium col-span-2">Available Balance:</p>
              <p className="col-span-2">${balance.cash_balance.toLocaleString()}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeTradeModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : tradeType === 'buy' ? 'Buy' : 'Sell'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
