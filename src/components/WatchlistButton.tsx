import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/use-watchlist';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WatchlistButtonProps {
  ticker: string;
  className?: string;
  variant?: 'default' | 'icon' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  ticker,
  className = '',
  variant = 'ghost',
  size = 'icon',
  showText = false,
  onClick
}) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if the ticker is in the watchlist
    const inWatchlist = watchlist.some(item => item.ticker === ticker);
    setIsInWatchlist(inWatchlist);
  }, [watchlist, ticker]);

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to parent elements
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(ticker);
      } else {
        await addToWatchlist(ticker);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`${className} ${isInWatchlist ? 'text-yellow-500 hover:text-yellow-600' : 'hover:text-yellow-500'}`}
            onClick={handleToggleWatchlist}
            disabled={isProcessing}
          >
            <Star className={`h-4 w-4 transition-all duration-200 ${isInWatchlist ? 'fill-yellow-500 scale-110' : ''}`} />
            {showText && (
              <span className="ml-2">
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WatchlistButton;
