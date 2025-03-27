
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccount } from '@/hooks/use-account';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';
import { useTrade } from '@/hooks/use-trade';

interface TradeModalProps {
  asset: Stock | MutualFund | DigitalGold;
  assetType: 'stock' | 'mutual_fund' | 'digital_gold';
}

const TradeModal: React.FC<TradeModalProps> = ({ asset, assetType }) => {
  const { balance } = useAccount();
  
  // Cast asset to appropriate type
  const stock = assetType === 'stock' ? asset as Stock : null;
  const mutualFund = assetType === 'mutual_fund' ? asset as MutualFund : null;
  const digitalGold = assetType === 'digital_gold' ? asset as DigitalGold : null;
  
  // Use appropriate asset for the trade hook
  const { 
    isOpen, 
    tradeType, 
    shares, 
    setShares, 
    isSubmitting, 
    ownedShares, 
    totalCost,
    closeTradeModal, 
    executeTrade 
  } = useTrade(assetType, asset);

  const [error, setError] = React.useState('');

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point (up to 6 decimal places)
    if (/^\d*\.?\d{0,6}$/.test(value) || value === '') {
      setShares(value);
      setError('');
    }
  };

  // Get the current price based on asset type
  const getCurrentPrice = () => {
    if (stock) return stock.price;
    if (mutualFund) return mutualFund.price;
    if (digitalGold) return digitalGold.pricePerGram;
    return 0;
  };

  // Get the asset name/ticker based on asset type
  const getAssetName = () => {
    if (stock) return stock.ticker;
    if (mutualFund) return mutualFund.ticker;
    if (digitalGold) return digitalGold.name;
    return '';
  };

  // Validate the trade
  useEffect(() => {
    if (!shares) {
      setError('');
      return;
    }

    const shareCount = parseFloat(shares);
    
    if (isNaN(shareCount) || shareCount <= 0) {
      setError('Please enter a valid number');
      return;
    }

    if (tradeType === 'buy' && balance && totalCost > balance.cash_balance) {
      setError('Insufficient funds');
      return;
    }

    if (tradeType === 'sell' && shareCount > ownedShares) {
      setError('You don\'t own enough shares');
      return;
    }

    setError('');
  }, [shares, tradeType, balance, totalCost, ownedShares]);

  // Determine unit label based on asset type
  const getUnitLabel = () => {
    if (assetType === 'digital_gold') return 'grams';
    return 'shares';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeTradeModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {getAssetName()}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Price:</span>
            <span className="font-semibold">
              ${getCurrentPrice().toLocaleString()}
              {assetType === 'digital_gold' ? '/gram' : ''}
            </span>
          </div>
          
          {tradeType === 'buy' && balance && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Available Cash:</span>
              <span className="font-semibold">${balance.cash_balance.toLocaleString()}</span>
            </div>
          )}
          
          {tradeType === 'sell' && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{getUnitLabel()} Owned:</span>
              <span className="font-semibold">{ownedShares.toLocaleString()}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="shares">Number of {getUnitLabel()}</Label>
            <Input
              id="shares"
              type="text"
              placeholder="0"
              value={shares}
              onChange={handleSharesChange}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm font-medium">Total {tradeType === 'buy' ? 'Cost' : 'Value'}:</span>
            <span className="font-semibold">${totalCost.toLocaleString()}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeTradeModal}>Cancel</Button>
          <Button 
            onClick={executeTrade} 
            disabled={isSubmitting || !shares || error !== '' || parseFloat(shares) <= 0}
            variant={tradeType === 'buy' ? 'default' : 'destructive'}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin"></div>
                Processing...
              </div>
            ) : (
              tradeType === 'buy' ? `Buy ${getUnitLabel()}` : `Sell ${getUnitLabel()}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
