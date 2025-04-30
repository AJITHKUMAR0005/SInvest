import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAccountReset = () => {
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);

  const resetAccount = async () => {
    if (!user) return { success: false };
    
    try {
      setIsResetting(true);
      
      // 1. Reset account balance to zero
      const { error: balanceError } = await supabase
        .from('account_balances')
        .update({
          cash_balance: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (balanceError) {
        console.error('Error resetting balance:', balanceError);
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: "Failed to reset account balance",
        });
        return { success: false };
      }

      // 2. Delete all investments
      const { error: investmentsError } = await supabase
        .from('investments')
        .delete()
        .eq('user_id', user.id);

      if (investmentsError) {
        console.error('Error deleting investments:', investmentsError);
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: "Failed to reset investments",
        });
        return { success: false };
      }

      // 3. Delete watchlist items
      const { error: watchlistError } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id);

      if (watchlistError) {
        console.error('Error deleting watchlist:', watchlistError);
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: "Failed to reset watchlist",
        });
        return { success: false };
      }

      // 4. Add a transaction record for the reset
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'reset',
          amount: 0,
          description: 'Account reset',
          status: 'completed',
        });

      if (transactionError) {
        console.error('Error creating reset transaction:', transactionError);
        // Non-critical error, continue with reset
      }

      toast({
        title: "Account reset successful",
        description: "Your account has been reset to its initial state",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during reset:', error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "An unexpected error occurred",
      });
      return { success: false };
    } finally {
      setIsResetting(false);
    }
  };

  return {
    resetAccount,
    isResetting,
  };
};
