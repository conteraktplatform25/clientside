import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BarChart3, ShieldCheck, UserCog2 } from 'lucide-react';
import React from 'react';

export interface IAdminUserSummaryCardProps {
  title: string;
  value: string | number;
  icon: 'total' | 'super_admin' | 'admin';
}

const AdminUserSummaryCard: React.FC<IAdminUserSummaryCardProps> = ({ title, value, icon }) => {
  const IconComponent = icon === 'total' ? BarChart3 : icon === 'admin' ? UserCog2 : ShieldCheck;

  return (
    <Card className='w-full max-w-xl'>
      <CardContent>
        <div className='flex flex-col gap-1'>
          <div className='inline-flex space-x-2'>
            <div className={`p-2 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center`}>
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

export default AdminUserSummaryCard;
