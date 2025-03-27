
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WatchlistManagerProps {
  ticker: string;
  className?: string;
}

const WatchlistManager: React.FC<WatchlistManagerProps> = ({ ticker, className }) => {
  const { user } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkWatchlist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .eq('ticker', ticker)
        .maybeSingle();

      if (error) {
        console.error('Error checking watchlist:', error);
        return;
      }

      setIsInWatchlist(!!data);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          ticker: ticker,
        });

      if (error) {
        console.error('Error adding to watchlist:', error);
        toast({
          variant: "destructive",
          title: "Failed to add to watchlist",
          description: error.message,
        });
        return;
      }

      setIsInWatchlist(true);
      toast({
        title: "Added to watchlist",
        description: `${ticker} has been added to your watchlist`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const removeFromWatchlist = async () => {
    if (!user) return;
    
    try {
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

      setIsInWatchlist(false);
      toast({
        title: "Removed from watchlist",
        description: `${ticker} has been removed from your watchlist`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  useEffect(() => {
    checkWatchlist();
    
    if (user) {
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
            checkWatchlist();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, ticker]);

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        <Star className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (isInWatchlist) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={removeFromWatchlist} 
        className={className}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Remove from Watchlist
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={addToWatchlist} 
      className={className}
    >
      <Star className="h-4 w-4 mr-2" />
      Add to Watchlist
    </Button>
  );
};

export default WatchlistManager;
