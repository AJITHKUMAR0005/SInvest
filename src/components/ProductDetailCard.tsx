
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stock, MutualFund, DigitalGold } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

type ProductType = 'stock' | 'mutual_fund' | 'digital_gold';

interface ProductDetailCardProps {
  product: Stock | MutualFund | DigitalGold;
  productType: ProductType;
  onClose: () => void;
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({ product, productType, onClose }) => {
  const navigate = useNavigate();
  
  const handleAction = (action: 'buy' | 'sell') => {
    // Get the appropriate ID for the product
    let productId = '';
    if (productType === 'stock') {
      productId = (product as Stock).ticker;
    } else if (productType === 'mutual_fund') {
      productId = (product as MutualFund).ticker;
    } else {
      productId = (product as DigitalGold).id;
    }
    
    // Navigate to payment page with product details
    navigate(`/payment`, { 
      state: { 
        product, 
        productType, 
        action,
        productId
      } 
    });
  };
  
  const getProductDetails = () => {
    switch (productType) {
      case 'stock':
        const stock = product as Stock;
        return {
          title: stock.name,
          subtitle: stock.ticker,
          price: `$${stock.price.toLocaleString()}`,
          change: stock.change,
          changePercent: stock.changePercent,
          description: stock.description
        };
      case 'mutual_fund':
        const fund = product as MutualFund;
        return {
          title: fund.name,
          subtitle: fund.ticker,
          price: `$${fund.price.toLocaleString()}`,
          change: fund.change,
          changePercent: fund.changePercent,
          description: fund.description
        };
      case 'digital_gold':
        const gold = product as DigitalGold;
        return {
          title: gold.name,
          subtitle: '',
          price: `$${gold.pricePerGram.toLocaleString()}/gram`,
          change: gold.change,
          changePercent: gold.changePercent,
          description: gold.description
        };
      default:
        return {
          title: '',
          subtitle: '',
          price: '',
          change: 0,
          changePercent: 0,
          description: ''
        };
    }
  };
  
  const details = getProductDetails();
  const isPositive = details.change >= 0;
  
  return (
    <Card className="w-full max-w-lg shadow-lg border-2 border-primary/10 p-1">
      <CardHeader className="relative pb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-xl">{details.title}</CardTitle>
        {details.subtitle && (
          <CardDescription>{details.subtitle}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Price</span>
            <span className="font-semibold text-lg">{details.price}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Change</span>
            <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{details.change.toFixed(2)} ({details.changePercent.toFixed(2)}%)
            </span>
          </div>
          
          <div className="border-t pt-3 mt-3">
            <p className="text-sm text-muted-foreground">{details.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button 
          className="flex-1" 
          onClick={() => handleAction('buy')}
        >
          Buy
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => handleAction('sell')}
        >
          Sell
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductDetailCard;
