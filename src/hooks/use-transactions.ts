
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'dividend';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          variant: "destructive",
          title: "Failed to load transactions",
          description: error.message,
        });
        return;
      }

      // Properly cast the type and status to ensure type safety
      setTransactions(data?.map(item => {
        // Ensure the type is one of the valid enum values
        let transactionType: Transaction['type'] = 'deposit';
        if (['deposit', 'withdrawal', 'buy', 'sell', 'dividend'].includes(item.type)) {
          transactionType = item.type as Transaction['type'];
        }
        
        // Ensure the status is one of the valid enum values
        let transactionStatus: Transaction['status'] = 'completed';
        if (['pending', 'completed', 'failed'].includes(item.status)) {
          transactionStatus = item.status as Transaction['status'];
        }
        
        return {
          ...item,
          type: transactionType,
          status: transactionStatus
        };
      }) || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('transaction_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchTransactions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    transactions,
    isLoading,
    refreshTransactions: fetchTransactions,
  };
};
