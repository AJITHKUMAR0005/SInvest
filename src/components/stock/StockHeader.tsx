
import React, { useState } from 'react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { BookmarkPlus, BookmarkMinus, Sparkles, BarChart3, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stock } from '@/utils/mockData';
import { generateAIResponse, UserFinancialProfile } from '@/utils/genAI';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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

  // Create a default user profile for stock analysis
  const getUserProfile = (): UserFinancialProfile => {
    return {
      riskTolerance: 'medium',
      investmentHorizon: 'medium',
      financialKnowledge: 'intermediate'
    };
  };

  const getAiInsight = async () => {
    setIsGeneratingInsight(true);

    try {
      // Enhanced prompt with more specific analysis requests
      const prompt = `Give me a comprehensive investment analysis of ${stock.name} (${stock.ticker}), including:
1. Recent performance evaluation
2. Key financial metrics assessment (P/E ratio: ${stock.peRatio}, Market Cap: $${(stock.marketCap / 1000000000).toFixed(1)}B)
3. Potential growth catalysts and risk factors
4. How it might fit in a portfolio with my risk profile`;

      // Pass user profile for more personalized analysis
      const insight = await generateAIResponse(prompt, getUserProfile());
      setAiInsight(insight);
    } catch (error) {
      console.error('Error generating AI insight:', error);
      toast({
        title: "AI Analysis Error",
        description: "Could not generate stock insights. Please try again later.",
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
          <PopoverContent className="w-96 p-4">
            {isGeneratingInsight ? (
              <div className="flex items-center justify-center py-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin mr-2"></div>
                <span>Analyzing {stock.ticker} with advanced AI models...</span>
              </div>
            ) : aiInsight ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">AI Analysis of {stock.ticker}</h4>
                  <Badge variant="outline" className="text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Financial AI
                  </Badge>
                </div>
                <div className="flex items-center mb-3">
                  <Badge
                    variant={stock.change >= 0 ? "default" : "destructive"}
                    className="mr-2"
                  >
                    {stock.change >= 0 ?
                      <TrendingUp className="h-3 w-3 mr-1" /> :
                      <TrendingDown className="h-3 w-3 mr-1" />
                    }
                    {stock.changePercent.toFixed(2)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    P/E: {stock.peRatio.toFixed(1)} |
                    Market Cap: ${(stock.marketCap / 1000000000).toFixed(1)}B
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line">{aiInsight}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <p>Analysis based on available market data and financial metrics.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary/50" />
                <p className="mb-2">Click to generate AI-powered investment analysis for {stock.ticker}</p>
                <p className="text-xs text-muted-foreground">
                  Our AI will analyze performance, metrics, and potential outlook
                </p>
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
