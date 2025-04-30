import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  CreditCard,
  Building,
  Wallet,
  Landmark,
  Banknote,
  ShieldCheck,
  Smartphone,
  Globe,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type PaymentMethod = 'card' | 'bank' | 'wallet' | 'cash' | 'upi' | 'netbanking';

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  description?: string;
  recommended?: boolean;
  securityInfo?: string;
  processingTime?: string;
  fees?: string;
  brandLogos?: string[];
}

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  options?: PaymentOption[];
  className?: string;
  title?: string;
  description?: string;
  direction?: 'vertical' | 'horizontal';
  showIcons?: boolean;
  showRecommended?: boolean;
  showSecurityInfo?: boolean;
  amount?: number;
}

const defaultPaymentOptions: PaymentOption[] = [
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: <CreditCard className="w-5 h-5 text-primary" />,
    description: 'Fast processing, secure payment',
    recommended: true,
    securityInfo: 'Encrypted and secure',
    processingTime: 'Instant',
    fees: 'No fees',
    brandLogos: ['visa', 'mastercard', 'amex']
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: <Building className="w-5 h-5 text-blue-600" />,
    description: 'Direct from your bank account',
    securityInfo: 'Bank-level security',
    processingTime: '1-3 business days',
    fees: 'No fees'
  },
  {
    id: 'wallet',
    label: 'Digital Wallet',
    icon: <Wallet className="w-5 h-5 text-green-600" />,
    description: 'Quick and convenient payment',
    securityInfo: 'Tokenized transactions',
    processingTime: 'Instant',
    fees: 'No fees',
    brandLogos: ['gpay', 'paytm', 'phonepe']
  },
  {
    id: 'upi',
    label: 'UPI',
    icon: <Smartphone className="w-5 h-5 text-purple-600" />,
    description: 'Pay directly using UPI',
    securityInfo: 'PIN protected',
    processingTime: 'Instant',
    fees: 'No fees',
    brandLogos: ['upi', 'bhim', 'gpay']
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    icon: <Globe className="w-5 h-5 text-blue-500" />,
    description: 'Use your bank\'s online portal',
    securityInfo: 'Bank authentication',
    processingTime: 'Instant to 24 hours',
    fees: 'May vary by bank'
  }
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  options = defaultPaymentOptions,
  className,
  title = 'Payment Method',
  description,
  direction = 'vertical',
  showIcons = true,
  showRecommended = true,
  showSecurityInfo = true,
  amount
}) => {
  // Filter options to only include those that are in the defaultPaymentOptions array
  const filteredOptions = options.filter(option =>
    defaultPaymentOptions.some(defaultOption => defaultOption.id === option.id)
  );

  // Function to render payment method logos
  const renderBrandLogos = (logos?: string[]) => {
    if (!logos || logos.length === 0) return null;

    return (
      <div className="flex gap-1 mt-1">
        {logos.map(logo => (
          <div
            key={logo}
            className="w-6 h-4 bg-muted rounded-sm flex items-center justify-center text-[8px] text-muted-foreground"
            title={logo.charAt(0).toUpperCase() + logo.slice(1)}
          >
            {logo.substring(0, 4)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center">
        {title && <Label className="text-base font-medium">{title}</Label>}
        {showSecurityInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
                  <span>Secure Payment</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">All payment information is encrypted and secure</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      {amount && (
        <div className="bg-muted/50 p-3 rounded-md mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="text-lg font-bold">${amount.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="max-h-[300px] overflow-y-auto pr-1 -mr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        <RadioGroup
          value={value}
          onValueChange={(val) => onChange(val as PaymentMethod)}
          className={cn(
            "grid gap-3",
            direction === 'vertical' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
          )}
        >
          {filteredOptions.map((option) => (
          <div
            key={option.id}
            className={cn(
              "relative rounded-md border p-3 transition-colors",
              "hover:bg-muted/50 cursor-pointer",
              value === option.id && "border-primary bg-primary/5"
            )}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-start mb-2">
              <RadioGroupItem value={option.id} id={option.id} className="mt-1 mr-2" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {showIcons && (
                      <div className="mr-2 p-1.5 bg-background rounded-md">
                        {option.icon}
                      </div>
                    )}
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                  {showRecommended && option.recommended && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Recommended
                    </Badge>
                  )}
                </div>

                {option.description && (
                  <p className="text-xs text-muted-foreground mt-1 ml-0.5">
                    {option.description}
                  </p>
                )}
              </div>
            </div>

            <div className="pl-7">
              {/* Payment method details */}
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mt-1">
                {option.processingTime && (
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 inline" />
                    <span>{option.processingTime}</span>
                  </div>
                )}
                {option.fees && (
                  <div>
                    <span>{option.fees}</span>
                  </div>
                )}
                {option.securityInfo && (
                  <div className="flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1 inline text-green-600" />
                    <span>{option.securityInfo}</span>
                  </div>
                )}
              </div>

              {/* Brand logos */}
              {renderBrandLogos(option.brandLogos)}
            </div>
          </div>
        ))}
        </RadioGroup>
      </div>

      <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
        <ShieldCheck className="w-3 h-3 mr-1 text-green-600" />
        <span>Your payment information is processed securely</span>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
