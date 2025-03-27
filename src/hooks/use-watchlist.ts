
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { mockStocks, Stock } from '@/utils/mockData';

interface WatchlistItem {
  id: string;
  user_id: string;
  ticker: string;
  created_at: string;
}

export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchlistStocks, setWatchlistStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWatchlist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching watchlist:', error);
        toast({
          variant: "destructive",
          title: "Failed to load watchlist",
          description: error.message,
        });
        return;
      }

      setWatchlist(data || []);
      
      // For now, map to mock data - in a real app, you'd fetch actual stock data
      const stocks = data.map(item => {
        const stock = mockStocks.find(s => s.ticker === item.ticker);
        return stock || null;
      }).filter(Boolean) as Stock[];
      
      setWatchlistStocks(stocks);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = async (ticker: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('watchlist')
        .insert([
          { user_id: user.id, ticker }
        ]);
        
      if (error) {
        console.error('Error adding to watchlist:', error);
        toast({
          variant: "destructive",
          title: "Failed to add to watchlist",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: "Added to Watchlist",
        description: `${ticker} has been added to your watchlist.`,
      });
      
      await fetchWatchlist();
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeFromWatchlist = async (ticker: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('ticker', ticker);
        
      if (error) {
        console.error('Error removing from watchlist:', error);
        toast({
          variant: "destructive",
          title: "Failed to remove from watchlist",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: "Removed from Watchlist",
        description: `${ticker} has been removed from your watchlist.`,
      });
      
      await fetchWatchlist();
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWatchlist();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('watchlist_changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all changes
            schema: 'public',
            table: 'watchlist',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchWatchlist();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setWatchlist([]);
      setWatchlistStocks([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    watchlist,
    watchlistStocks,
    isLoading,
    refreshWatchlist: fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist
  };
};
