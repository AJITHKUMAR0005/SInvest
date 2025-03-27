
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

      // Cast the data to Transaction[] type to ensure type safety
      setTransactions(data?.map(item => ({
        ...item,
        type: item.type as 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'dividend',
        status: item.status as 'pending' | 'completed' | 'failed'
      })) || []);
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
