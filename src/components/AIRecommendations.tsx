
import React, { useState } from 'react';
import { ArrowRight, CircleDollarSign, Star, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AIRecommendations = () => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  
  const predefinedQuestions = [
    { id: 'beginner', text: 'What stocks are good for beginners?', icon: <BookOpen size={14} /> },
    { id: 'dividend', text: 'Show me top dividend stocks', icon: <CircleDollarSign size={14} /> },
    { id: 'tech', text: 'Best tech stocks to watch?', icon: <TrendingUp size={14} /> },
    { id: 'mutual', text: 'Index funds vs active mutual funds?', icon: <Star size={14} /> },
    { id: 'gold', text: 'Is digital gold a good investment?', icon: <AlertCircle size={14} /> },
    { id: 'risk', text: 'How to diversify for lower risk?', icon: <BookOpen size={14} /> },
    { id: 'inflation', text: 'Best investments during inflation', icon: <TrendingUp size={14} /> },
    { id: 'retire', text: 'Early retirement portfolio strategy', icon: <Star size={14} /> }
  ];
  
  const handleQuestionClick = (questionId: string) => {
    setActiveQuestion(questionId === activeQuestion ? null : questionId);
  };
  
  // Simulated AI responses to questions
  const getAnswer = (questionId: string) => {
    const answers: Record<string, string> = {
      'beginner': 'For beginners, consider stable blue-chip stocks like Apple (AAPL), Microsoft (MSFT), or index ETFs like VOO which tracks the S&P 500. Start with small positions and focus on long-term growth.',
      'dividend': 'Top dividend stocks include Johnson & Johnson (JNJ), Procter & Gamble (PG), and Coca-Cola (KO) with consistent dividend histories spanning decades.',
      'tech': 'Watch NVIDIA (NVDA) for AI growth, Amazon (AMZN) for e-commerce/cloud, and Alphabet (GOOGL) for digital advertising and AI innovations.',
      'mutual': 'Index funds offer lower fees and market returns, while active funds may outperform in certain markets but charge higher fees. For most investors, low-cost index funds provide better long-term results.',
      'gold': 'Digital gold provides liquidity and ease of investment without storage concerns. Consider allocating 5-10% of your portfolio as a hedge against market volatility.',
      'risk': 'Diversify across asset classes (stocks, bonds, real estate), industries, and geographies. Follow the rule of 100: subtract your age from 100 to determine your stock percentage.',
      'inflation': 'During inflation, consider TIPS (Treasury Inflation-Protected Securities), real estate investments, commodities, and value stocks in consumer staples and utilities sectors.',
      'retire': 'For early retirement, maximize tax-advantaged accounts, create multiple income streams, and consider a dividend growth strategy with a higher initial allocation to equities.'
    };
    
    return answers[questionId] || 'I don\'t have a specific answer for this question yet.';
  };
  
  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">AI Investment Advisor</CardTitle>
        <CardDescription>Get personalized investment advice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <div className="grid gap-2">
          {predefinedQuestions.slice(0, activeQuestion ? 3 : 6).map((question) => (
            <Button
              key={question.id}
              variant="outline"
              className="justify-between h-auto py-2 px-3 text-left"
              onClick={() => handleQuestionClick(question.id)}
            >
              <span className="flex items-center gap-2">
                {question.icon}
                <span className="text-xs font-medium">{question.text}</span>
              </span>
              <ArrowRight size={14} />
            </Button>
          ))}
        </div>
        
        {activeQuestion && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg text-xs">
            <p className="font-semibold mb-1">Answer:</p>
            <p>{getAnswer(activeQuestion)}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="link" className="text-xs h-8 p-0" size="sm">
          Ask a custom question
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIRecommendations;
