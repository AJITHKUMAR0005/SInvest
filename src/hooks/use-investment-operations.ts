
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from '@/hooks/use-account';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';
import { Investment } from '@/types/investment';

export const useInvestmentOperations = (
  investments: Investment[],
  refreshBalance: () => void,
  refreshInvestments: () => void
) => {
  const { user } = useAuth();
  const { balance } = useAccount();

  const buyAsset = async (
    asset: Stock | MutualFund | DigitalGold, 
    quantity: number, 
    assetType: 'stock' | 'mutual_fund' | 'digital_gold'
  ) => {
    if (!user || !balance) return { success: false };
    
    // Get price based on asset type
    let price = 0;
    let ticker = '';
    let assetName = '';
    
    if (assetType === 'stock') {
      const stock = asset as Stock;
      price = stock.price;
      ticker = stock.ticker;
      assetName = stock.name;
    } else if (assetType === 'mutual_fund') {
      const fund = asset as MutualFund;
      price = fund.price;
      ticker = fund.ticker;
      assetName = fund.name;
    } else if (assetType === 'digital_gold') {
      const gold = asset as DigitalGold;
      price = gold.pricePerGram;
      ticker = gold.id;
      assetName = gold.name;
    }
    
    const totalCost = price * quantity;
    
    // Check if user has enough funds
    if (balance.cash_balance < totalCost) {
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description: "Insufficient funds",
      });
      return { success: false, error: "Insufficient funds" };
    }

    try {
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'buy',
          amount: totalCost,
          description: `Bought ${quantity} ${assetType === 'digital_gold' ? 'grams' : 'shares'} of ${assetName}`,
        });

      if (transactionError) {
        toast({
          variant: "destructive",
          title: "Purchase failed",
          description: transactionError.message,
        });
        return { success: false };
      }

      // Check if the user already owns this asset
      const existingInvestment = investments.find(inv => 
        inv.ticker === ticker && inv.asset_type === assetType
      );
      
      if (existingInvestment) {
        // Update existing investment
        const newTotalShares = existingInvestment.shares + quantity;
        const newTotalCost = (existingInvestment.shares * existingInvestment.average_price) + totalCost;
        const newAveragePrice = newTotalCost / newTotalShares;

        const { error: updateError } = await supabase
          .from('investments')
          .update({
            shares: newTotalShares,
            average_price: newAveragePrice,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingInvestment.id);

        if (updateError) {
          toast({
            variant: "destructive",
            title: "Failed to update investment",
            description: updateError.message,
          });
          return { success: false };
        }
      } else {
        // Create new investment record
        const { error: investmentError } = await supabase
          .from('investments')
          .insert({
            user_id: user.id,
            ticker: ticker,
            asset_type: assetType,
            shares: quantity,
            average_price: price,
          });

        if (investmentError) {
          toast({
            variant: "destructive",
            title: "Failed to record investment",
            description: investmentError.message,
          });
          return { success: false };
        }
      }

      // Update account balance
      const newBalance = balance.cash_balance - totalCost;
      const { error: balanceError } = await supabase
        .from('account_balances')
        .update({
          cash_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (balanceError) {
        toast({
          variant: "destructive",
          title: "Failed to update balance",
          description: balanceError.message,
        });
        return { success: false };
      }

      // Refresh data
      refreshBalance();
      refreshInvestments();

      toast({
        title: "Purchase successful",
        description: `You bought ${quantity} ${assetType === 'digital_gold' ? 'grams' : 'shares'} of ${assetName}`,
      });

      return { success: true };
    } catch (error) {
      console.error('Buy asset error:', error);
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description: "An unexpected error occurred",
      });
      return { success: false };
    }
  };

  const sellAsset = async (
    asset: Stock | MutualFund | DigitalGold, 
    quantity: number, 
    assetType: 'stock' | 'mutual_fund' | 'digital_gold'
  ) => {
    if (!user || !balance) return { success: false };
    
    // Get price and details based on asset type
    let price = 0;
    let ticker = '';
    let assetName = '';
    
    if (assetType === 'stock') {
      const stock = asset as Stock;
      price = stock.price;
      ticker = stock.ticker;
      assetName = stock.name;
    } else if (assetType === 'mutual_fund') {
      const fund = asset as MutualFund;
      price = fund.price;
      ticker = fund.ticker;
      assetName = fund.name;
    } else if (assetType === 'digital_gold') {
      const gold = asset as DigitalGold;
      price = gold.pricePerGram;
      ticker = gold.id;
      assetName = gold.name;
    }
    
    // Find the investment
    const investment = investments.find(inv => 
      inv.ticker === ticker && inv.asset_type === assetType
    );
    
    if (!investment) {
      toast({
        variant: "destructive",
        title: "Sale failed",
        description: `You don't own this ${assetType.replace('_', ' ')}`,
      });
      return { success: false, error: "Investment not found" };
    }

    if (investment.shares < quantity) {
      toast({
        variant: "destructive",
        title: "Sale failed",
        description: `You don't own enough ${assetType === 'digital_gold' ? 'grams' : 'shares'}`,
      });
      return { success: false, error: "Insufficient shares" };
    }

    const saleAmount = price * quantity;

    try {
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'sell',
          amount: saleAmount,
          description: `Sold ${quantity} ${assetType === 'digital_gold' ? 'grams' : 'shares'} of ${assetName}`,
        });

      if (transactionError) {
        toast({
          variant: "destructive",
          title: "Sale failed",
          description: transactionError.message,
        });
        return { success: false };
      }

      // Update or delete the investment
      if (investment.shares === quantity) {
        // Delete the investment if all shares are sold
        const { error: deleteError } = await supabase
          .from('investments')
          .delete()
          .eq('id', investment.id);

        if (deleteError) {
          toast({
            variant: "destructive",
            title: "Failed to update investment",
            description: deleteError.message,
          });
          return { success: false };
        }
      } else {
        // Update the investment
        const { error: updateError } = await supabase
          .from('investments')
          .update({
            shares: investment.shares - quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', investment.id);

        if (updateError) {
          toast({
            variant: "destructive",
            title: "Failed to update investment",
            description: updateError.message,
          });
          return { success: false };
        }
      }

      // Update account balance
      const newBalance = balance.cash_balance + saleAmount;
      const { error: balanceError } = await supabase
        .from('account_balances')
        .update({
          cash_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (balanceError) {
        toast({
          variant: "destructive",
          title: "Failed to update balance",
          description: balanceError.message,
        });
        return { success: false };
      }

      // Refresh data
      refreshBalance();
      refreshInvestments();

      toast({
        title: "Sale successful",
        description: `You sold ${quantity} ${assetType === 'digital_gold' ? 'grams' : 'shares'} of ${assetName}`,
      });

      return { success: true };
    } catch (error) {
      console.error('Sell asset error:', error);
      toast({
        variant: "destructive",
        title: "Sale failed",
        description: "An unexpected error occurred",
      });
      return { success: false };
    }
  };

  return {
    buyAsset,
    sellAsset
  };
};
