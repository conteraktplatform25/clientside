import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface OrderSummaryCardProps {
  title: string;
  value: string | number;
  icon: 'orders' | 'revenue';
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ title, value, icon }) => {
  const IconComponent = icon === 'orders' ? ShoppingCart : Wallet;
  const iconBgColor = icon === 'orders' ? 'bg-blue-100' : 'bg-purple-100';
  const iconColor = icon === 'orders' ? 'text-blue-600' : 'text-purple-600';

  return (
    <Card className='w-full'>
      <CardContent>
        <div className='flex flex-col gap-1'>
          <div className='inline-flex space-x-2'>
            <div className={`p-2 rounded-full ${iconBgColor} ${iconColor} flex items-center justify-center`}>
              <IconComponent className='h-4 w-4' />
            </div>
            <Label className='text-base leading-[150%] font-medium text-neutral-base'>{title}</Label>
          </div>
          <div className='text-2xl text-primary-950 font-bold px-11'>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
