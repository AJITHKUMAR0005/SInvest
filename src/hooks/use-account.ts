
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface AccountBalance {
  id: string;
  user_id: string;
  cash_balance: number;
  created_at: string;
  updated_at: string;
}

export const useAccount = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('account_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
        toast({
          variant: "destructive",
          title: "Failed to load account data",
          description: error.message,
        });
        return;
      }

      setBalance(data);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const depositFunds = async (amount: number) => {
    if (!user || !balance) return { success: false };

    try {
      // First create a transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: amount,
          description: 'Deposit',
        });

      if (transactionError) {
        toast({
          variant: "destructive",
          title: "Deposit failed",
          description: transactionError.message,
        });
        return { success: false };
      }

      // Then update the account balance
      const newBalance = balance.cash_balance + amount;
      const { error: updateError } = await supabase
        .from('account_balances')
        .update({ 
          cash_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Balance update failed",
          description: updateError.message,
        });
        return { success: false };
      }

      // Update local state
      setBalance({
        ...balance,
        cash_balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Deposit successful",
        description: `$${amount.toLocaleString()} has been added to your account`,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        variant: "destructive",
        title: "Deposit failed",
        description: "An unexpected error occurred",
      });
      return { success: false };
    }
  };

  const withdrawFunds = async (amount: number) => {
    if (!user || !balance) return { success: false };

    try {
      // Check if user has enough funds
      if (balance.cash_balance < amount) {
        toast({
          variant: "destructive",
          title: "Withdrawal failed",
          description: "Insufficient funds",
        });
        return { success: false, error: "Insufficient funds" };
      }

      // First create a transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: amount,
          description: 'Withdrawal',
        });

      if (transactionError) {
        toast({
          variant: "destructive",
          title: "Withdrawal failed",
          description: transactionError.message,
        });
        return { success: false };
      }

      // Then update the account balance
      const newBalance = balance.cash_balance - amount;
      const { error: updateError } = await supabase
        .from('account_balances')
        .update({ 
          cash_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Balance update failed",
          description: updateError.message,
        });
        return { success: false };
      }

      // Update local state
      setBalance({
        ...balance,
        cash_balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Withdrawal successful",
        description: `$${amount.toLocaleString()} has been withdrawn from your account`,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: "An unexpected error occurred",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('account_balance_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'account_balances',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setBalance(payload.new as AccountBalance);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setBalance(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    balance,
    isLoading,
    depositFunds,
    withdrawFunds,
    refreshBalance: fetchBalance,
  };
};
