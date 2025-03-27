
import { useState } from 'react';
import { useInvestments } from '@/hooks/use-investments';
import { Stock } from '@/utils/mockData';

export const useTrade = (stock: Stock) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { buyStock, sellStock, investments } = useInvestments();

  const openTradeModal = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setShares('');
    setIsOpen(true);
  };

  const closeTradeModal = () => {
    setIsOpen(false);
  };

  const executeTrade = async () => {
    if (!shares || isNaN(parseFloat(shares)) || parseFloat(shares) <= 0) {
      return { success: false, error: 'Invalid number of shares' };
    }

    setIsSubmitting(true);
    
    try {
      const shareCount = parseFloat(shares);
      let result;
      
      if (tradeType === 'buy') {
        result = await buyStock(stock, shareCount);
      } else {
        result = await sellStock(stock, shareCount);
      }
      
      if (result.success) {
        closeTradeModal();
      }
      
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate owned shares
  const ownedInvestment = investments.find(inv => inv.ticker === stock.ticker);
  const ownedShares = ownedInvestment?.shares || 0;

  // Calculate purchase power
  const shareAmount = shares ? parseFloat(shares) : 0;
  const totalCost = shareAmount * stock.price;

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
