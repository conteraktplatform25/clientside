import { Badge } from '../ui/badge';

interface StockBadgeProps {
  stock: number;
}

export const StockBadgeField = ({ stock }: StockBadgeProps) => {
  if (stock === 0) {
    return <Badge className='bg-red-100 text-red-700 border-red-300'>Out of stock</Badge>;
  }

  if (stock <= 5) {
    return <Badge className='bg-yellow-100 text-yellow-800 border-yellow-300'>Low stock ({stock})</Badge>;
  }

  return <Badge className='bg-green-100 text-green-700 border-green-300'>In stock ({stock})</Badge>;
};
