
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, BarChart3, Shield, AreaChart, BookOpen } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const Index = () => {
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <header className="relative bg-background py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                  SI
                </div>
                <span className="ml-2 text-xl font-semibold">SmartInvest</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#faqs" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </a>
              </nav>
              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-[1000px] h-[1000px] rounded-full bg-primary/10 blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full bg-success/10 blur-[100px]" />
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight animate-slide-up">
                  Invest Smarter, <span className="text-primary">Not Harder</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
                  SmartInvest combines advanced analytics with a simple interface to help you make better investment decisions and build wealth for the future.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  <Link to="/auth?tab=register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Investing Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </div>
              </div>
              
              <div className="mt-16 relative max-w-5xl mx-auto animate-scale-in" style={{ animationDelay: "0.3s" }}>
                <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-2xl glass-panel">
                  <div className="bg-card/80 backdrop-blur-sm w-full h-full flex items-center justify-center p-8">
                    <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg overflow-hidden">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-destructive"></div>
                          <div className="w-3 h-3 rounded-full bg-warning"></div>
                          <div className="w-3 h-3 rounded-full bg-success"></div>
                        </div>
                        <div className="text-sm text-muted-foreground">SmartInvest Dashboard</div>
                        <div className="w-16"></div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-secondary p-4 rounded-lg">
                            <h3 className="text-sm text-muted-foreground">Portfolio Value</h3>
                            <p className="text-2xl font-semibold">$152,743.86</p>
                            <span className="text-sm text-success">+$3,241.52 (2.17%)</span>
                          </div>
                          <div className="bg-secondary p-4 rounded-lg">
                            <h3 className="text-sm text-muted-foreground">Cash Balance</h3>
                            <p className="text-2xl font-semibold">$12,567.34</p>
                            <span className="text-sm text-muted-foreground">Available to invest</span>
                          </div>
                          <div className="bg-secondary p-4 rounded-lg">
                            <h3 className="text-sm text-muted-foreground">Top Performer</h3>
                            <p className="text-2xl font-semibold">NVDA</p>
                            <span className="text-sm text-success">+$15.44 (1.8%)</span>
                          </div>
                        </div>
                        <div className="h-48 w-full bg-secondary rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-30px)] h-[30px] bg-black/20 blur-xl rounded-full"></div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Everything You Need to Invest</h2>
                <p className="text-muted-foreground">
                  SmartInvest provides comprehensive tools and resources to help you make informed investment decisions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
                  <p className="text-muted-foreground">
                    Track your investments in real-time with advanced analytics and performance metrics.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                  <p className="text-muted-foreground">
                    Bank-level security ensures your investments and personal information are always protected.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <AreaChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Diverse Portfolio</h3>
                  <p className="text-muted-foreground">
                    Access a wide range of investment options including stocks, mutual funds, and government bonds.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
                  <p className="text-muted-foreground">
                    Expand your knowledge with educational resources, market insights, and expert advice.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
                  <p className="text-muted-foreground">
                    Receive personalized investment recommendations based on your goals and risk tolerance.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Automated Investing</h3>
                  <p className="text-muted-foreground">
                    Set up recurring investments and automatic portfolio rebalancing to stay on track.
                  </p>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                <Link to="/auth?tab=register">
                  <Button size="lg">
                    Start Your Investment Journey
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Simple, Transparent Pricing</h2>
                <p className="text-muted-foreground">
                  Choose the plan that suits your investment needs with no hidden fees.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
                  <div className="text-center pb-4">
                    <h3 className="text-xl font-semibold mb-2">Starter</h3>
                    <div className="flex items-end justify-center">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">For new investors</p>
                  </div>
                  
                  <div className="pt-4 pb-6 border-t border-border">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Up to 10 stock trades per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Basic market data and analytics</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Investment learning resources</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Mobile app access</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">Get Started</Button>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-lg border-2 border-primary relative transform scale-105">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <div className="text-center pb-4">
                    <h3 className="text-xl font-semibold mb-2">Growth</h3>
                    <div className="flex items-end justify-center">
                      <span className="text-4xl font-bold">$19</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">For active investors</p>
                  </div>
                  
                  <div className="pt-4 pb-6 border-t border-border">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Unlimited stock trades</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Advanced charting tools</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Portfolio analysis and insights</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Priority customer support</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Real-time market data</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button className="w-full">Subscribe Now</Button>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
                  <div className="text-center pb-4">
                    <h3 className="text-xl font-semibold mb-2">Professional</h3>
                    <div className="flex items-end justify-center">
                      <span className="text-4xl font-bold">$49</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">For serious investors</p>
                  </div>
                  
                  <div className="pt-4 pb-6 border-t border-border">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>All Growth features</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Advanced AI recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Tax optimization strategies</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Dedicated financial advisor</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>Exclusive market reports</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of investors who trust SmartInvest to grow their wealth.
                </p>
                <Link to="/auth?tab=register">
                  <Button size="lg" variant="secondary" className="text-primary">
                    Create Your Free Account
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-card py-12 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold text-sm">
                    SI
                  </div>
                  <span className="ml-2 text-lg font-semibold">SmartInvest</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Making investing accessible, intelligent, and efficient for everyone.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Features</a></li>
                  <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground">Security</a></li>
                  <li><a href="#" className="hover:text-foreground">Roadmap</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground">Guides</a></li>
                  <li><a href="#" className="hover:text-foreground">API Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">About</a></li>
                  <li><a href="#" className="hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} SmartInvest. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedTransition>
  );
};

export default Index;
