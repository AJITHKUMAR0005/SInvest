
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, LineChart, Shield, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Modern Investing <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Simplified</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              SmartInvest combines powerful investment tools with an intuitive experience,
              helping you build wealth with confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to={user ? "/dashboard" : "/auth"}>
                  {user ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Powerful Features for Every Investor</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <BarChart3 className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
                <p className="text-muted-foreground">
                  Access live price updates, market trends, and detailed analytics to make informed decisions.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Charts</h3>
                <p className="text-muted-foreground">
                  Analyze performance with customizable charts and technical indicators for smarter investments.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <Shield className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Trading</h3>
                <p className="text-muted-foreground">
                  Invest with confidence using our secure platform with enterprise-grade encryption and protection.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Investment Types */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Diverse Investment Options</h2>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-16">
              Explore a wide range of investment opportunities tailored to your financial goals and risk tolerance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <LineChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Stocks</h3>
                <p className="text-muted-foreground">
                  Invest in shares of publicly traded companies across all major global markets.
                </p>
              </div>
              
              <div className="text-center p-6">
                <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Mutual Funds</h3>
                <p className="text-muted-foreground">
                  Access professionally managed investment portfolios with diverse asset allocations.
                </p>
              </div>
              
              <div className="text-center p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Government Bonds</h3>
                <p className="text-muted-foreground">
                  Explore low-risk investment options backed by government securities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Learning Section */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Learn as You Invest</h2>
                <p className="text-muted-foreground mb-6">
                  Our comprehensive learning hub provides expert articles, video tutorials, and interactive courses to help you build your investment knowledge.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded mt-1 mr-3">
                      <BookOpen className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Expert Articles</h4>
                      <p className="text-muted-foreground text-sm">Insights from financial professionals on market trends and strategies.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded mt-1 mr-3">
                      <BookOpen className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Video Tutorials</h4>
                      <p className="text-muted-foreground text-sm">Step-by-step guides on using platform features and trading strategies.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded mt-1 mr-3">
                      <BookOpen className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Interactive Courses</h4>
                      <p className="text-muted-foreground text-sm">Structured learning paths for investors at all experience levels.</p>
                    </div>
                  </li>
                </ul>
                <Button className="mt-8" asChild>
                  <Link to="/learn">
                    Explore Learning Hub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-4">Featured Courses</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Investing Fundamentals</h4>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Beginner</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Learn the basics of investing and build a strong foundation.</p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-3/4"></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Technical Analysis</h4>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Intermediate</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Master chart patterns and technical indicators.</p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-1/2"></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Advanced Portfolio Management</h4>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Advanced</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Optimize your portfolio for maximum returns.</p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 px-4 bg-primary/5 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Investment Journey Today</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of investors who use SmartInvest to build wealth, track performance, and make smarter investment decisions.
            </p>
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Create Your Account"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                SI
              </div>
            </div>
            <p className="text-center text-muted-foreground">
              © {new Date().getFullYear()} SmartInvest. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </AnimatedTransition>
  );
};

export default Index;
