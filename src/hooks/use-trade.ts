
import { useState } from 'react';
import { useInvestments } from '@/hooks/use-investments';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';

export const useTrade = (assetType: 'stock' | 'mutual_fund' | 'digital_gold', asset: Stock | MutualFund | DigitalGold | null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { buyAsset, sellAsset, investments } = useInvestments();

  const openTradeModal = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setShares('');
    setIsOpen(true);
  };

  const closeTradeModal = () => {
    setIsOpen(false);
  };

  const executeTrade = async () => {
    if (!asset) {
      return { success: false, error: 'No asset selected' };
    }
    
    if (!shares || isNaN(parseFloat(shares)) || parseFloat(shares) <= 0) {
      return { success: false, error: 'Invalid number of shares' };
    }

    setIsSubmitting(true);
    
    try {
      const shareCount = parseFloat(shares);
      let result;
      
      if (tradeType === 'buy') {
        result = await buyAsset(asset, shareCount, assetType);
      } else {
        result = await sellAsset(asset, shareCount, assetType);
      }
      
      if (result.success) {
        closeTradeModal();
      }
      
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get ticker or identifier based on asset type
  const getAssetIdentifier = () => {
    if (!asset) return '';
    if (assetType === 'stock') return (asset as Stock).ticker;
    if (assetType === 'mutual_fund') return (asset as MutualFund).ticker;
    if (assetType === 'digital_gold') return (asset as DigitalGold).id;
    return '';
  };

  // Get price based on asset type
  const getAssetPrice = () => {
    if (!asset) return 0;
    if (assetType === 'stock') return (asset as Stock).price;
    if (assetType === 'mutual_fund') return (asset as MutualFund).price;
    if (assetType === 'digital_gold') return (asset as DigitalGold).pricePerGram;
    return 0;
  };

  // Calculate owned shares/units
  const ownedInvestment = investments.find(inv => 
    inv.ticker === getAssetIdentifier() && 
    inv.asset_type === assetType
  );
  const ownedShares = ownedInvestment?.shares || 0;

  // Calculate purchase power
  const shareAmount = shares ? parseFloat(shares) : 0;
  const totalCost = shareAmount * getAssetPrice();

  return {
    isOpen,
    tradeType,
    shares,
    setShares,
    isSubmitting,
    ownedShares,
    totalCost,
    openTradeModal,
    closeTradeModal,
    executeTrade,
  };
};
