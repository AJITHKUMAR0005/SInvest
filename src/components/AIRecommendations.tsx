
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Send, ChevronDown, ChevronUp, Sparkles, RefreshCw, BookOpen, BarChart3, Lightbulb, ExternalLink } from 'lucide-react';
import { aiRecommendationCategories, predefinedQueries } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  generateAIResponse,
  getPersonalizedRecommendations,
  getEducationalContent,
  getMarketAnalysis,
  UserFinancialProfile,
  InvestmentRecommendation,
  EducationalContent,
  MarketAnalysis
} from '@/utils/genAI';
import { Badge } from '@/components/ui/badge';

const AIRecommendations: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // User profile state
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [investmentHorizon, setInvestmentHorizon] = useState<'short' | 'medium' | 'long'>('medium');
  const [financialKnowledge, setFinancialKnowledge] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Recommendations state
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<InvestmentRecommendation | null>(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  // Educational content state
  const [educationalContent, setEducationalContent] = useState<EducationalContent | null>(null);
  const [isLoadingEducation, setIsLoadingEducation] = useState(false);
  const [educationTopic, setEducationTopic] = useState('');

  // Market analysis state
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [isLoadingMarketAnalysis, setIsLoadingMarketAnalysis] = useState(false);

  const { toast } = useToast();

  // Create a user profile object from current state
  const getUserProfile = (): UserFinancialProfile => {
    return {
      riskTolerance,
      investmentHorizon,
      financialKnowledge
    };
  };

  // Handle AI chat queries
  const handleQuerySubmit = async (input: string) => {
    if (!input.trim()) return;

    setIsLoading(true);
    setQuery(input);

    try {
      // Pass the user profile to get more personalized responses
      const response = await generateAIResponse(input, getUserProfile());
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

  // Generate personalized investment recommendations
  const generateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    setSelectedRecommendation(null);

    try {
      const results = await getPersonalizedRecommendations(
        riskTolerance,
        investmentHorizon,
        undefined,
        getUserProfile()
      );
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

  // Fetch educational content on a specific topic
  const fetchEducationalContent = async (topic: string) => {
    if (!topic.trim()) return;

    setIsLoadingEducation(true);
    setEducationTopic(topic);

    try {
      const content = await getEducationalContent(topic, financialKnowledge);
      setEducationalContent(content);
    } catch (error) {
      console.error('Error fetching educational content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch educational content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEducation(false);
    }
  };

  // Fetch current market analysis
  const fetchMarketAnalysis = async () => {
    setIsLoadingMarketAnalysis(true);

    try {
      const analysis = await getMarketAnalysis();
      setMarketAnalysis(analysis);
    } catch (error) {
      console.error('Error fetching market analysis:', error);
      toast({
        title: "Error",
        description: "Failed to fetch market analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMarketAnalysis(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="flex items-center text-sm">
          <Bot className="mr-1 h-4 w-4" />
          AI Financial Advisor
        </CardTitle>
        <CardDescription className="text-xs">
          Personalized guidance for your financial journey
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-2 w-full h-7">
            <TabsTrigger value="chat" className="flex-1 text-xs py-0.5">
              <Bot className="h-3 w-3 mr-1" /> Chat
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1 text-xs py-0.5">
              <Sparkles className="h-3 w-3 mr-1" /> Invest
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex-1 text-xs py-0.5">
              <BookOpen className="h-3 w-3 mr-1" /> Learn
            </TabsTrigger>
            <TabsTrigger value="market" className="flex-1 text-xs py-0.5">
              <BarChart3 className="h-3 w-3 mr-1" /> Market
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
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
                  {predefinedQueries.slice(0, 3).map((q, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2 py-0"
                      onClick={() => handleQuerySubmit(q)}
                    >
                      {q.length > 20 ? q.substring(0, 20) + '...' : q}
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
                  {predefinedQueries.slice(0, 6).map((q, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2 py-0"
                      onClick={() => handleQuerySubmit(q)}
                    >
                      {q.length > 20 ? q.substring(0, 20) + '...' : q}
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
                    <span>Analyzing your question...</span>
                  </div>
                </div>
              )}

              {answer && !isLoading && (
                <div className="p-2 border rounded-md bg-secondary/20">
                  <p className="text-xs whitespace-pre-line">{answer}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-2 mt-1">
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

                <div className="space-y-1">
                  <label className="text-xs font-medium">Financial Knowledge</label>
                  <Select value={financialKnowledge} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setFinancialKnowledge(value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select knowledge level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
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
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Get Personalized Recommendations
                  </>
                )}
              </Button>

              {selectedRecommendation ? (
                <div className="space-y-2 mt-2 max-h-[180px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-xs">{selectedRecommendation.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1 py-0"
                      onClick={() => setSelectedRecommendation(null)}
                    >
                      Back to list
                    </Button>
                  </div>

                  <div className="p-2 border rounded-md bg-secondary/10">
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        {selectedRecommendation.riskLevel}
                      </Badge>
                      <span className="text-[10px] bg-primary/20 text-primary px-1 rounded-full">
                        {Math.round(selectedRecommendation.confidence * 100)}% match
                      </span>
                    </div>

                    <p className="text-xs mb-2">{selectedRecommendation.description}</p>

                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div className="text-[10px]">
                        <span className="font-medium">Expected Return:</span><br/>
                        {selectedRecommendation.expectedReturn}
                      </div>
                      <div className="text-[10px]">
                        <span className="font-medium">Time Horizon:</span><br/>
                        {selectedRecommendation.timeHorizon}
                      </div>
                    </div>

                    <div className="mb-2">
                      <h4 className="text-[10px] font-medium mb-1">Why this recommendation:</h4>
                      <p className="text-[10px] text-muted-foreground">{selectedRecommendation.reasoning}</p>
                    </div>

                    {selectedRecommendation.learnMoreUrl && (
                      <Button
                        variant="link"
                        className="text-[10px] h-5 p-0"
                        onClick={() => window.open(selectedRecommendation.learnMoreUrl, '_blank')}
                      >
                        Learn more <ExternalLink className="h-2 w-2 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : recommendations.length > 0 && (
                <div className="space-y-2 mt-2 max-h-[180px] overflow-y-auto pr-1">
                  <h3 className="font-medium text-xs">Your Personalized Recommendations</h3>
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded-md bg-secondary/10 cursor-pointer hover:bg-secondary/20"
                      onClick={() => setSelectedRecommendation(rec)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-xs">{rec.name}</h4>
                        <span className="text-[10px] bg-primary/20 text-primary px-1 rounded-full">
                          {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground mt-0.5 truncate pr-2">{rec.description}</p>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0">
                          {rec.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!recommendations.length && !isGeneratingRecommendations && (
                <div className="p-2 border rounded-md bg-secondary/5 mt-2">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Set your preferences and click "Get Personalized Recommendations" to receive tailored investment suggestions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-2 mt-1">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for investment topics..."
                  className="w-full p-1 pr-8 text-xs border rounded-md"
                  value={educationTopic}
                  onChange={(e) => setEducationTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchEducationalContent(educationTopic)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-6"
                  onClick={() => fetchEducationalContent(educationTopic)}
                  disabled={isLoadingEducation || !educationTopic.trim()}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {['diversification', 'index funds', 'compound interest', 'risk and return', 'retirement planning'].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 py-0"
                    onClick={() => fetchEducationalContent(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>

              {isLoadingEducation && (
                <div className="p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full border-2 border-t-transparent animate-spin"></div>
                    <span>Finding educational content...</span>
                  </div>
                </div>
              )}

              {educationalContent && !isLoadingEducation && (
                <div className="p-2 border rounded-md bg-secondary/10 max-h-[180px] overflow-y-auto">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-xs">{educationalContent.title}</h3>
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      {educationalContent.difficulty}
                    </Badge>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs whitespace-pre-line">{educationalContent.content}</p>
                  </div>

                  {educationalContent.relatedTopics && educationalContent.relatedTopics.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-[10px] font-medium mb-1">Related Topics:</h4>
                      <div className="flex flex-wrap gap-1">
                        {educationalContent.relatedTopics.map((topic) => (
                          <Button
                            key={topic}
                            variant="outline"
                            size="sm"
                            className="text-[9px] h-5 px-1 py-0"
                            onClick={() => fetchEducationalContent(topic)}
                          >
                            {topic}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {educationalContent.learnMoreUrl && (
                    <Button
                      variant="link"
                      className="text-[10px] h-5 p-0"
                      onClick={() => window.open(educationalContent.learnMoreUrl, '_blank')}
                    >
                      Learn more <ExternalLink className="h-2 w-2 ml-1" />
                    </Button>
                  )}
                </div>
              )}

              {!educationalContent && !isLoadingEducation && (
                <div className="p-2 border rounded-md bg-secondary/5">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Search for investment topics or click on one of the suggested topics above to learn more.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="market" className="space-y-2 mt-1">
            <div className="space-y-2">
              <Button
                className="w-full h-7 text-xs"
                onClick={fetchMarketAnalysis}
                disabled={isLoadingMarketAnalysis}
              >
                {isLoadingMarketAnalysis ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Analyzing market conditions...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Get Market Analysis
                  </>
                )}
              </Button>

              {marketAnalysis && !isLoadingMarketAnalysis && (
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  <div className="p-2 border rounded-md bg-secondary/10">
                    <h3 className="font-medium text-xs mb-1">Market Overview</h3>
                    <p className="text-xs mb-2">{marketAnalysis.summary}</p>

                    <h4 className="text-[10px] font-medium mb-1">Key Trends</h4>
                    <div className="space-y-1 mb-2">
                      {marketAnalysis.trends.map((trend, index) => (
                        <div key={index} className="flex items-start space-x-1">
                          <Badge
                            variant={
                              trend.impact === 'positive' ? 'default' :
                              trend.impact === 'negative' ? 'destructive' :
                              trend.impact === 'mixed' ? 'outline' : 'secondary'
                            }
                            className="text-[9px] px-1 py-0 mt-0.5"
                          >
                            {trend.impact}
                          </Badge>
                          <div>
                            <h5 className="text-[10px] font-medium">{trend.name}</h5>
                            <p className="text-[9px] text-muted-foreground">{trend.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-1">
                      <div>
                        <h4 className="text-[10px] font-medium mb-1">Opportunities</h4>
                        <ul className="text-[9px] space-y-1 list-disc pl-3">
                          {marketAnalysis.opportunities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-medium mb-1">Risks</h4>
                        <ul className="text-[9px] space-y-1 list-disc pl-3">
                          {marketAnalysis.risks.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <p className="text-[9px] text-muted-foreground mt-2">
                      Last updated: {new Date(marketAnalysis.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {!marketAnalysis && !isLoadingMarketAnalysis && (
                <div className="p-2 border rounded-md bg-secondary/5">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Click "Get Market Analysis" to receive insights on current market conditions and trends.
                    </p>
                  </div>
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
