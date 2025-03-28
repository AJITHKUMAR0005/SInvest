
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from '@/hooks/use-account';
import { toast } from '@/hooks/use-toast';
import { 
  useInvestmentOperations 
} from '@/hooks/use-investment-operations';
import { Investment } from '@/types/investment';

export const useInvestments = () => {
  const { user } = useAuth();
  const { refreshBalance } = useAccount();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { buyAsset, sellAsset } = useInvestmentOperations(
    investments, 
    refreshBalance, 
    fetchInvestments
  );

  async function fetchInvestments() {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching investments:', error);
        toast({
          variant: "destructive",
          title: "Failed to load investments",
          description: error.message,
        });
        return;
      }

      // Cast the data to Investment[] type to ensure type safety
      setInvestments(data?.map(item => ({
        ...item,
        asset_type: item.asset_type as 'stock' | 'mutual_fund' | 'digital_gold' | 'bond'
      })) || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchInvestments();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('investment_changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'investments',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchInvestments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setInvestments([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    investments,
    isLoading,
    buyAsset,
    sellAsset,
    refreshInvestments: fetchInvestments,
  };
};
