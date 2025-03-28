
import React from 'react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { BookmarkPlus, BookmarkMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stock } from '@/utils/mockData';

interface StockHeaderProps {
  stock: Stock;
}

const StockHeader: React.FC<StockHeaderProps> = ({ stock }) => {
  const { watchlist, isLoading: watchlistLoading, refreshWatchlist } = useWatchlist();
  
  const isInWatchlist = watchlist.some(item => item.ticker === stock.id);

  const handleWatchlistToggle = async () => {
    if (isInWatchlist) {
      // Implementation would be here in a real app
      console.log('Removing from watchlist:', stock.ticker);
    } else {
      // Implementation would be here in a real app
      console.log('Adding to watchlist:', stock.ticker);
    }
    await refreshWatchlist();
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{stock.name} ({stock.ticker})</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleWatchlistToggle}
        disabled={watchlistLoading}
        title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        {isInWatchlist ? (
          <BookmarkMinus className="h-5 w-5 text-primary" />
        ) : (
          <BookmarkPlus className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default StockHeader;
