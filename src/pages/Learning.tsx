
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlayCircle, BookOpen, Newspaper, Clock, ThumbsUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AnimatedTransition from '@/components/AnimatedTransition';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'course';
  source: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  likes: number;
}

const learningResources: ResourceItem[] = [
  {
    id: '1',
    title: 'Stock Market Basics: Getting Started with Trading',
    description: 'Learn the fundamentals of the stock market and how to get started with trading.',
    url: 'https://www.youtube.com/watch?v=Xn7KWR9EOGQ',
    type: 'video',
    source: 'YouTube',
    duration: '15 min',
    level: 'beginner',
    likes: 2340
  },
  {
    id: '2',
    title: 'How to Read Stock Charts for Beginners',
    description: 'A comprehensive guide to understanding and interpreting stock charts.',
    url: 'https://www.youtube.com/watch?v=cQn4hIHzSzc',
    type: 'video',
    source: 'YouTube',
    duration: '22 min',
    level: 'beginner',
    likes: 1890
  },
  {
    id: '3',
    title: 'Understanding Risk Management in Trading',
    description: 'This article explains important risk management strategies every trader should know.',
    url: 'https://www.investopedia.com/articles/trading/05/011705.asp',
    type: 'article',
    source: 'Investopedia',
    duration: '10 min read',
    level: 'intermediate',
    likes: 743
  },
  {
    id: '4',
    title: 'Technical Analysis Explained',
    description: 'Learn how to use technical indicators to make informed trading decisions.',
    url: 'https://www.youtube.com/watch?v=08R_TJhAOGo',
    type: 'video',
    source: 'YouTube',
    duration: '18 min',
    level: 'intermediate',
    likes: 1456
  },
  {
    id: '5',
    title: 'Fundamental Analysis: How to Evaluate Stocks',
    description: 'A deep dive into evaluating companies based on financial statements and metrics.',
    url: 'https://www.investopedia.com/terms/f/fundamentalanalysis.asp',
    type: 'article',
    source: 'Investopedia',
    duration: '15 min read',
    level: 'intermediate',
    likes: 967
  },
  {
    id: '6',
    title: 'Day Trading Strategies for Beginners',
    description: 'Learn effective day trading strategies that are suitable for beginners.',
    url: 'https://www.youtube.com/watch?v=txWaMpSzHhM',
    type: 'video',
    source: 'YouTube',
    duration: '25 min',
    level: 'beginner',
    likes: 3210
  },
  {
    id: '7',
    title: 'The Psychology of Trading: Mastering Your Emotions',
    description: 'Understanding and managing your emotions is key to successful trading.',
    url: 'https://www.forbes.com/sites/forbesfinancecouncil/2022/03/15/the-psychology-of-trading/',
    type: 'article',
    source: 'Forbes',
    duration: '8 min read',
    level: 'advanced',
    likes: 1234
  },
  {
    id: '8',
    title: 'Long-term Investing vs. Short-term Trading',
    description: 'Compare and contrast long-term investing strategies with short-term trading approaches.',
    url: 'https://www.nerdwallet.com/article/investing/investment-strategies',
    type: 'article',
    source: 'NerdWallet',
    duration: '12 min read',
    level: 'beginner',
    likes: 890
  }
];

const Learning = () => {
  const videos = learningResources.filter(item => item.type === 'video');
  const articles = learningResources.filter(item => item.type === 'article');
  
  const ResourceCard = ({ resource }: { resource: ResourceItem }) => {
    const handleResourceClick = () => {
      window.open(resource.url, '_blank');
    };
    
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <Badge variant={
              resource.level === 'beginner' ? 'default' : 
              resource.level === 'intermediate' ? 'secondary' : 
              'outline'
            }>
              {resource.level}
            </Badge>
          </div>
          <CardDescription>{resource.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {resource.type === 'video' ? (
              <PlayCircle className="h-4 w-4" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
            <span>{resource.source}</span>
            <span>•</span>
            <Clock className="h-4 w-4" />
            <span>{resource.duration}</span>
            <span>•</span>
            <ThumbsUp className="h-4 w-4" />
            <span>{resource.likes}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={handleResourceClick}
          >
            View {resource.type === 'video' ? 'Video' : 'Article'}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Learning Center</h1>
              <p className="text-muted-foreground">
                Educational resources to help you improve your trading knowledge and skills
              </p>
            </div>
            
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="videos">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="articles">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="beginner">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningResources.filter(r => r.level === 'beginner').map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningResources.filter(r => r.level === 'advanced' || r.level === 'intermediate').map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default Learning;
