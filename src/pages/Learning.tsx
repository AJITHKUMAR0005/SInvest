
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, CircleDollarSign, Wallet, BookText } from 'lucide-react';

const Learning = () => {
  const articles = [
    {
      id: 1,
      title: "Basics of Stock Investing",
      description: "Learn the fundamental concepts of stock investing for beginners",
      category: "stocks",
      readTime: "5 min",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Understanding Market Trends",
      description: "How to identify and analyze market trends for better investment decisions",
      category: "stocks",
      readTime: "8 min",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Mutual Funds Explained",
      description: "A comprehensive guide to mutual funds and how they work",
      category: "mutual-funds",
      readTime: "6 min",
      icon: <CircleDollarSign className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Active vs. Passive Fund Management",
      description: "Understand the differences between active and passive fund management",
      category: "mutual-funds",
      readTime: "7 min",
      icon: <BookText className="h-5 w-5" />
    },
    {
      id: 5,
      title: "Is Digital Gold Worth Investing In?",
      description: "Pros and cons of investing in digital gold",
      category: "digital-gold",
      readTime: "4 min",
      icon: <Wallet className="h-5 w-5" />
    },
    {
      id: 6,
      title: "How to Buy and Store Digital Gold",
      description: "A step-by-step guide to buying and storing digital gold",
      category: "digital-gold",
      readTime: "5 min",
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Learning Center</h1>
          <Button variant="outline" size="sm">
            Track Progress
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Topics</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
              <TabsTrigger value="digital-gold">Digital Gold</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map(article => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center space-y-0 gap-2">
                    <div className="p-2 rounded-md bg-muted">
                      {article.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription className="text-xs">{article.readTime} read</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm pb-2">
                    <p>{article.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="text-xs h-8">Read Article</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stocks" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.filter(a => a.category === "stocks").map(article => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center space-y-0 gap-2">
                    <div className="p-2 rounded-md bg-muted">
                      {article.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription className="text-xs">{article.readTime} read</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm pb-2">
                    <p>{article.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="text-xs h-8">Read Article</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mutual-funds" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.filter(a => a.category === "mutual-funds").map(article => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center space-y-0 gap-2">
                    <div className="p-2 rounded-md bg-muted">
                      {article.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription className="text-xs">{article.readTime} read</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm pb-2">
                    <p>{article.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="text-xs h-8">Read Article</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="digital-gold" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.filter(a => a.category === "digital-gold").map(article => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center space-y-0 gap-2">
                    <div className="p-2 rounded-md bg-muted">
                      {article.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription className="text-xs">{article.readTime} read</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm pb-2">
                    <p>{article.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="text-xs h-8">Read Article</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Learning;
