import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, Ban, CircleCheck, CircleX } from 'lucide-react';
import React from 'react';

export interface ITransactionSummaryCardProps {
  title: string;
  value: string | number;
  icon: 'transaction' | 'success' | 'pending' | 'failed';
}

const TransactionSummaryCard: React.FC<ITransactionSummaryCardProps> = ({ title, value, icon }) => {
  const IconComponent =
    icon === 'transaction' ? ArrowUpDown : icon === 'success' ? CircleCheck : icon === 'pending' ? Ban : CircleX;
  const iconBgColor =
    icon === 'transaction'
      ? 'bg-primary-100'
      : icon === 'success'
        ? 'bg-green-100'
        : icon === 'pending'
          ? 'bg-yellow-100'
          : 'bg-red-100';
  const iconColor =
    icon === 'transaction'
      ? 'text-primary-600'
      : icon === 'success'
        ? 'text-green-600'
        : icon === 'pending'
          ? 'text-yellow-600'
          : 'text-red-600';
  return (
    <Card className='w-full max-w-xl'>
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

export default TransactionSummaryCard;
