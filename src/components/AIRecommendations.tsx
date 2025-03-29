
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          SmartInvest AI Advisor
        </CardTitle>
        <CardDescription>
          Get personalized investment recommendations powered by GenAI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="chat" className="flex-1">
              Chat Advisor
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1">
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="personalized" className="flex-1">
              <Sparkles className="h-4 w-4 mr-1" /> Personalized
            </TabsTrigger>
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
          
          <TabsContent value="personalized" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Tolerance</label>
                  <Select value={riskTolerance} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskTolerance(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Conservative (Low Risk)</SelectItem>
                      <SelectItem value="medium">Balanced (Medium Risk)</SelectItem>
                      <SelectItem value="high">Aggressive (High Risk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Investment Horizon</label>
                  <Select value={investmentHorizon} onValueChange={(value: 'short' | 'medium' | 'long') => setInvestmentHorizon(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (1-3 years)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-7 years)</SelectItem>
                      <SelectItem value="long">Long-term (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={generateRecommendations}
                disabled={isGeneratingRecommendations}
              >
                {isGeneratingRecommendations ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Personalized Recommendations
                  </>
                )}
              </Button>
              
              {recommendations.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="font-medium">Your Personalized Recommendations</h3>
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-md bg-secondary/10">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{rec.name}</h4>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          {Math.round(rec.confidence * 100)}% match
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
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
