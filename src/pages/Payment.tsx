import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Landmark, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';

type PaymentMethod = 'card' | 'bank' | 'other';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, productType, action, productId } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [quantity, setQuantity] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  if (!product || !productType || !action) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-2xl font-bold mb-4">Invalid Payment Request</h1>
            <p className="text-muted-foreground mb-6">
              Product information is missing. Please return to the market.
            </p>
            <Button onClick={() => navigate('/market')}>
              Return to Market
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const getProductName = () => {
    if (productType === 'stock' || productType === 'mutual_fund') {
      return product.name;
    } else {
      return product.name;
    }
  };
  
  const getProductPrice = () => {
    if (productType === 'stock' || productType === 'mutual_fund') {
      return product.price;
    } else {
      return product.pricePerGram;
    }
  };
  
  const getUnitLabel = () => {
    if (productType === 'stock') return 'shares';
    if (productType === 'mutual_fund') return 'units';
    return 'grams';
  };
  
  const totalAmount = parseFloat(quantity) * getProductPrice();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    if (paymentMethod === 'card') {
      if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc ||
          !cardDetails.address || !cardDetails.city || !cardDetails.state || !cardDetails.zipCode) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields",
        });
        setIsSubmitting(false);
        return;
      }
    }
    
    // Process payment
    setTimeout(() => {
      toast({
        title: `${action === 'buy' ? 'Purchase' : 'Sale'} Successful`,
        description: `You have ${action === 'buy' ? 'purchased' : 'sold'} ${quantity} ${getUnitLabel()} of ${getProductName()}.`,
      });
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            {action === 'buy' ? 'Purchase' : 'Sell'} {getProductName()}
          </h1>
          
          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">{getProductName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{productType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span className="font-medium">${getProductPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span>Quantity ({getUnitLabel()}):</span>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-24 text-right"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            
            {action === 'buy' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select how you would like to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                      className="mb-4"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center">
                          <Landmark className="h-4 w-4 mr-2" />
                          Bank Transfer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name on Card *</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={cardDetails.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="number">Card Number *</Label>
                          <Input
                            id="number"
                            name="number"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="expiry">Expiry Date *</Label>
                            <Input
                              id="expiry"
                              name="expiry"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cvc">CVC *</Label>
                            <Input
                              id="cvc"
                              name="cvc"
                              placeholder="123"
                              value={cardDetails.cvc}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Billing Address</h3>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="address">Street Address *</Label>
                            <Input
                              id="address"
                              name="address"
                              placeholder="123 Main St"
                              value={cardDetails.address}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                name="city"
                                placeholder="New York"
                                value={cardDetails.city}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="state">State *</Label>
                              <Input
                                id="state"
                                name="state"
                                placeholder="NY"
                                value={cardDetails.state}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="zipCode">ZIP Code *</Label>
                              <Input
                                id="zipCode"
                                name="zipCode"
                                placeholder="10001"
                                value={cardDetails.zipCode}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                name="country"
                                placeholder="United States"
                                value={cardDetails.country}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'bank' && (
                      <div className="p-4 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Please transfer {totalAmount.toLocaleString()} to the following account:
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm"><span className="font-medium">Bank: </span>SmartInvest National Bank</p>
                          <p className="text-sm"><span className="font-medium">Account: </span>1234567890</p>
                          <p className="text-sm"><span className="font-medium">Routing: </span>987654321</p>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      type="submit"
                      className="w-full mt-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting 
                        ? 'Processing...' 
                        : `${action === 'buy' ? 'Complete Purchase' : 'Complete Sale'}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {action === 'sell' && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Sale</CardTitle>
                  <CardDescription>Review your sale information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-muted-foreground">
                    You are about to sell {quantity} {getUnitLabel()} of {getProductName()} for a total of ${totalAmount.toLocaleString()}.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Sale'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Payment;
