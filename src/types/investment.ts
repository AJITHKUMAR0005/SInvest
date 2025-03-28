
export interface Investment {
  id: string;
  user_id: string;
  ticker: string;
  asset_type: 'stock' | 'mutual_fund' | 'digital_gold' | 'bond';
  shares: number;
  average_price: number;
  created_at: string;
  updated_at: string;
}
