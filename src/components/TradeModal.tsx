
import React from 'react';
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
  tradeType?: 'buy' | 'sell';
}

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen = false,
  onClose,
  asset,
  assetType,
  tradeType: initialTradeType
}) => {
  const { toast } = useToast();
  const { balance } = useAccount();
  const { 
    closeTradeModal, 
    tradeType, 
    executeTrade, 
    shares, 
    setShares, 
    isSubmitting, 
    totalCost,
    ownedShares
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
    if (tradeType === 'sell' && parseFloat(shares) > ownedShares) {
      toast({
        variant: "destructive",
        title: "Sale failed",
        description: `You only own ${ownedShares} ${getUnitLabel()}`,
      });
      return;
    }

    const result = await executeTrade();
    
    if (result.success) {
      toast({
        title: tradeType === 'buy' ? 'Purchase successful' : 'Sale successful',
        description: `${tradeType === 'buy' ? 'Bought' : 'Sold'} ${shares} ${getUnitLabel()} of ${getAssetName()}`,
      });
      handleClose();
    } else if (result.error) {
      toast({
        title: `${tradeType === 'buy' ? 'Purchase' : 'Sale'} failed`,
        description: result.error,
        variant: "destructive"
      });
    }
  };

  // Use the explicitly passed trade type or fall back to the one from useTrade
  const displayTradeType = initialTradeType || tradeType;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {displayTradeType === 'buy' ? 'Buy' : 'Sell'} {getAssetName()}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium col-span-2">
              {displayTradeType === 'buy' ? 'Purchase' : 'Sell'} Amount:
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
            <p className="text-sm font-medium col-span-2">Total Value:</p>
            <p className="col-span-2 font-semibold">${totalCost.toLocaleString()}</p>
          </div>
          {balance && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm font-medium col-span-2">
                {displayTradeType === 'buy' ? 'Available Balance' : 'Current Holdings'}:
              </p>
              <p className="col-span-2">
                {displayTradeType === 'buy' 
                  ? `$${balance.cash_balance.toLocaleString()}`
                  : `${ownedShares} ${getUnitLabel()}`
                }
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (displayTradeType === 'sell' && parseFloat(shares) > ownedShares)}
          >
            {isSubmitting ? 'Processing...' : displayTradeType === 'buy' ? 'Buy' : 'Sell'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
