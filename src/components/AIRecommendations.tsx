
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Send, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';
import { aiRecommendationCategories, predefinedQueries } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateAIResponse, getPersonalizedRecommendations } from '@/utils/genAI';

const AIRecommendations: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [investmentHorizon, setInvestmentHorizon] = useState<'short' | 'medium' | 'long'>('medium');
  const [recommendations, setRecommendations] = useState<{ name: string; description: string; confidence: number }[]>([]);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const { toast } = useToast();

  const handleQuerySubmit = async (input: string) => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setQuery(input);
    
    try {
      const response = await generateAIResponse(input);
      setAnswer(response);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "AI Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
      setAnswer("I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    
    try {
      const results = await getPersonalizedRecommendations(riskTolerance, investmentHorizon);
      setRecommendations(results);
      toast({
        title: "Recommendations Ready",
        description: `Generated ${results.length} personalized recommendations for your profile.`,
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="flex items-center text-sm">
          <Bot className="mr-1 h-4 w-4" />
          AI Advisor
        </CardTitle>
        <CardDescription className="text-xs">
          Get personalized investment advice
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-2 w-full h-7">
            <TabsTrigger value="chat" className="flex-1 text-xs py-0.5">
              Chat
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1 text-xs py-0.5">
              Recs
            </TabsTrigger>
            <TabsTrigger value="personalized" className="flex-1 text-xs py-0.5">
              <Sparkles className="h-3 w-3 mr-1" /> Custom
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-2 mt-1">
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about investments..."
                  className="w-full p-1 pr-8 text-xs border rounded-md"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit(query)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full w-6"
                  onClick={() => handleQuerySubmit(query)}
                  disabled={isLoading || !query.trim()}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
              
              {!showMore && (
                <div className="flex flex-wrap gap-1">
                  {predefinedQueries.slice(0, 2).map((q, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-6 px-2 py-0"
                      onClick={() => handleQuerySubmit(q)}
                    >
                      {q.length > 15 ? q.substring(0, 15) + '...' : q}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2 py-0"
                    onClick={() => setShowMore(true)}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {showMore && (
                <div className="flex flex-wrap gap-1">
                  {predefinedQueries.slice(0, 4).map((q, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-6 px-2 py-0"
                      onClick={() => handleQuerySubmit(q)}
                    >
                      {q.length > 15 ? q.substring(0, 15) + '...' : q}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2 py-0"
                    onClick={() => setShowMore(false)}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {isLoading && (
                <div className="p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full border-2 border-t-transparent animate-spin"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              
              {answer && !isLoading && (
                <div className="p-2 border rounded-md bg-secondary/20">
                  <p className="text-xs">{answer}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-2 mt-1">
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {aiRecommendationCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="p-2 border rounded-md hover:bg-secondary/20 cursor-pointer transition-colors"
                  onClick={() => {
                    toast({
                      title: "Recommendation Applied",
                      description: `${category.name} recommendations applied`,
                    });
                  }}
                >
                  <h3 className="font-medium text-xs">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="personalized" className="space-y-2 mt-1">
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Risk Tolerance</label>
                  <Select value={riskTolerance} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskTolerance(value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Conservative</SelectItem>
                      <SelectItem value="medium">Balanced</SelectItem>
                      <SelectItem value="high">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium">Investment Horizon</label>
                  <Select value={investmentHorizon} onValueChange={(value: 'short' | 'medium' | 'long') => setInvestmentHorizon(value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (1-3y)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-7y)</SelectItem>
                      <SelectItem value="long">Long-term (7y+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full h-7 text-xs" 
                onClick={generateRecommendations}
                disabled={isGeneratingRecommendations}
              >
                {isGeneratingRecommendations ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Get Recommendations
                  </>
                )}
              </Button>
              
              {recommendations.length > 0 && (
                <div className="space-y-2 mt-2 max-h-[120px] overflow-y-auto pr-1">
                  <h3 className="font-medium text-xs">Your Recommendations</h3>
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-2 border rounded-md bg-secondary/10">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-xs">{rec.name}</h4>
                        <span className="text-[10px] bg-primary/20 text-primary px-1 rounded-full">
                          {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
