
import React, { useState } from 'react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { BookmarkPlus, BookmarkMinus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stock } from '@/utils/mockData';
import { generateAIResponse } from '@/utils/genAI';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

interface StockHeaderProps {
  stock: Stock;
}

const StockHeader: React.FC<StockHeaderProps> = ({ stock }) => {
  const { watchlist, isLoading: watchlistLoading, refreshWatchlist } = useWatchlist();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const { toast } = useToast();
  
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

  const getAiInsight = async () => {
    setIsGeneratingInsight(true);
    
    try {
      const prompt = `Give me a brief investment analysis of ${stock.name} (${stock.ticker}), considering recent performance and market trends.`;
      const insight = await generateAIResponse(prompt);
      setAiInsight(insight);
    } catch (error) {
      console.error('Error generating AI insight:', error);
      toast({
        title: "AI Error",
        description: "Could not generate stock insights. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{stock.name} ({stock.ticker})</h1>
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => !aiInsight && getAiInsight()}
              disabled={isGeneratingInsight}
              className="flex items-center"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            {isGeneratingInsight ? (
              <div className="flex items-center justify-center py-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin mr-2"></div>
                <span>Analyzing {stock.ticker}...</span>
              </div>
            ) : aiInsight ? (
              <div>
                <h4 className="font-medium mb-2">AI Analysis of {stock.ticker}</h4>
                <p className="text-sm">{aiInsight}</p>
              </div>
            ) : (
              <div className="text-center py-2">
                <p>Click to generate AI insights for {stock.ticker}</p>
              </div>
            )}
          </PopoverContent>
        </Popover>
        
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
    </div>
  );
};

export default StockHeader;
