
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
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';
import { useAccount } from '@/hooks/use-account';
import { useTrade } from '@/hooks/use-trade';

export type AssetType = 'stock' | 'mutual_fund' | 'digital_gold';

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
  const { balance, depositFunds } = useAccount();
  const { 
    closeTradeModal, 
    tradeType, 
    executeTrade, 
    shares, 
    setShares, 
    isSubmitting, 
    totalCost 
  } = useTrade(assetType as any, asset);
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeTradeModal();
    }
  };

  const getAssetName = (): string => {
    if (assetType === 'stock') {
      return `${(asset as Stock).name} (${(asset as Stock).ticker})`;
    } else if (assetType === 'mutual_fund') {
      return `${(asset as MutualFund).name} (${(asset as MutualFund).ticker})`;
    } else {
      return (asset as DigitalGold).name;
    }
  };

  const getAssetPrice = (): number => {
    if (assetType === 'stock' || assetType === 'mutual_fund') {
      return (asset as Stock | MutualFund).price;
    } else {
      return (asset as DigitalGold).pricePerGram;
    }
  };

  const getUnitLabel = (): string => {
    if (assetType === 'stock') return 'shares';
    if (assetType === 'mutual_fund') return 'units';
    return 'grams';
  };

  const handleSubmit = async () => {
    const result = await executeTrade();
    
    if (!result.success && result.error) {
      toast({
        title: `${tradeType === 'buy' ? 'Purchase' : 'Sale'} failed`,
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                value={shares}
                onChange={(e) => setShares(e.target.value)}
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
            <p className="col-span-2 font-semibold">${totalCost.toLocaleString()}</p>
          </div>
          {balance && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm font-medium col-span-2">Available Balance:</p>
              <p className="col-span-2">${balance.cash_balance.toLocaleString()}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
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
