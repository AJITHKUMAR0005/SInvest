
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { aiRecommendationCategories, predefinedQueries } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

const AIRecommendations: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { toast } = useToast();

  const handleQuerySubmit = async (input: string) => {
    setIsLoading(true);
    setQuery(input);
    
    // Simulating AI response delay
    setTimeout(() => {
      let response;
      
      if (input.toLowerCase().includes('beginner') || input.toLowerCase().includes('start')) {
        response = "For beginners, I recommend starting with index funds like VFIAX or FXAIX. These provide broad market exposure with low fees. As you get more comfortable, you can add individual blue-chip stocks like AAPL or MSFT.";
      } else if (input.toLowerCase().includes('diversify') || input.toLowerCase().includes('portfolio')) {
        response = "A well-diversified portfolio typically includes a mix of stocks (60-70%), bonds (20-30%), and alternative investments like gold (5-10%). Consider both domestic and international markets to spread risk.";
      } else if (input.toLowerCase().includes('mutual fund') || input.toLowerCase().includes('long-term')) {
        response = "For long-term growth, look at low-cost index funds like Vanguard 500 Index Fund (VFIAX) or Fidelity 500 Index Fund (FXAIX). If you want active management, consider growth-oriented funds with strong 5-10 year track records.";
      } else if (input.toLowerCase().includes('gold')) {
        response = "Digital gold can be a good hedge against inflation and market volatility. It's recommended to allocate 5-10% of your portfolio to gold investments. Look for options with low storage fees and good liquidity.";
      } else if (input.toLowerCase().includes('$1000') || input.toLowerCase().includes('small')) {
        response = "With $1000, consider starting with a low-cost index fund or ETF. Fractional shares also allow you to buy portions of expensive stocks. Another approach is to put $800 in index funds and experiment with $200 in individual stocks to learn the market.";
      } else if (input.toLowerCase().includes('difference') || input.toLowerCase().includes('stocks') && input.toLowerCase().includes('mutual')) {
        response = "Stocks represent ownership in individual companies, while mutual funds pool money from many investors to buy a portfolio of stocks, bonds, or other securities. Mutual funds offer instant diversification but charge management fees, while individual stocks offer more control but require more research.";
      } else if (input.toLowerCase().includes('retirement')) {
        response = "For retirement, focus on tax-advantaged accounts first. A balanced approach might include 70% in broad market index funds, 20% in bond funds, and 10% in REITs or other income-generating investments. Adjust to be more conservative as you approach retirement.";
      } else if (input.toLowerCase().includes('tax')) {
        response = "When selling stocks, profits are subject to capital gains tax. If held for less than a year, they're taxed as ordinary income; if longer, they qualify for lower long-term capital gains rates. Tax-loss harvesting can offset gains with losses to reduce tax burden.";
      } else {
        response = "I'd be happy to help with your investment questions! I can provide insights on stocks, mutual funds, digital gold, retirement planning, and general investment strategies. Please feel free to ask anything specific about investing.";
      }
      
      setAnswer(response);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          SmartInvest AI Advisor
        </CardTitle>
        <CardDescription>
          Get personalized investment recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about investments..."
                  className="w-full p-2 pr-10 border rounded-md"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit(query)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1"
                  onClick={() => handleQuerySubmit(query)}
                  disabled={isLoading || !query.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {!showMore && (
                <div className="flex flex-wrap gap-2">
                  {predefinedQueries.slice(0, 3).map((q, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleQuerySubmit(q)}
                    >
                      {q}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setShowMore(true)}
                  >
                    <ChevronDown className="h-3 w-3 mr-1" /> More
                  </Button>
                </div>
              )}
              
              {showMore && (
                <div className="flex flex-wrap gap-2">
                  {predefinedQueries.map((q, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleQuerySubmit(q)}
                    >
                      {q}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setShowMore(false)}
                  >
                    <ChevronUp className="h-3 w-3 mr-1" /> Less
                  </Button>
                </div>
              )}
              
              {isLoading && (
                <div className="p-4 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              
              {answer && !isLoading && (
                <div className="p-4 border rounded-md bg-secondary/20">
                  <p className="text-sm">{answer}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-3">
              {aiRecommendationCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="p-3 border rounded-md hover:bg-secondary/20 cursor-pointer transition-colors"
                  onClick={() => {
                    toast({
                      title: "Recommendation Applied",
                      description: `${category.name} recommendations have been applied to your dashboard`,
                    });
                  }}
                >
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
