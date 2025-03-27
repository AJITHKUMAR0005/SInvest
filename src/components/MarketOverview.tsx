
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketIndex, mockIndices, marketNews } from '@/utils/mockData';

interface MarketOverviewProps {
  className?: string;
}

const MarketIndexCard: React.FC<{ index: MarketIndex }> = ({ index }) => {
  const isPositive = index.change >= 0;
  
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <h3 className="text-sm font-medium text-muted-foreground">{index.name}</h3>
      <p className="text-xl font-semibold mt-1">{index.value.toLocaleString()}</p>
      <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
        {isPositive ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>
          {isPositive ? '+' : ''}{index.change.toFixed(2)} ({Math.abs(index.changePercent).toFixed(2)}%)
        </span>
      </div>
    </div>
  );
};

const NewsCard: React.FC<{ news: typeof marketNews[0] }> = ({ news }) => {
  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors">
      <a href={news.url} className="block">
        <h3 className="font-medium text-base line-clamp-2">{news.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{news.source}</span>
          <span>{news.time}</span>
        </div>
      </a>
    </div>
  );
};

const MarketOverview: React.FC<MarketOverviewProps> = ({ className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-xl font-semibold mb-4">Market Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockIndices.map(index => (
            <MarketIndexCard key={index.id} index={index} />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Market News</h2>
        <div className="grid grid-cols-1 gap-4">
          {marketNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
