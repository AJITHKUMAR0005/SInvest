import React from 'react';
import { Stock } from '@/utils/mockData';

export interface TradeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  stock: Stock;
}
