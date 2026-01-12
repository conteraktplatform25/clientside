import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BanknoteArrowDown, Building2, Check } from 'lucide-react';

export interface IApplicationStatisticsCardProps {
  title: string;
  value: string | number;
  icon: 'total' | 'active' | 'revenue';
}

const ApplicationStatisticsCard: React.FC<IApplicationStatisticsCardProps> = ({ title, value, icon }) => {
  const IconComponent = icon === 'total' ? Building2 : icon === 'active' ? Check : BanknoteArrowDown;
  return (
    <Card className='w-full max-w-xl'>
      <CardContent>
        <div className='flex flex-col gap-1'>
          <div className='inline-flex space-x-2'>
            <div className={`p-2 rounded-full bg-[#EFF6FF] text-[#1A73E8] flex items-center justify-center`}>
              <IconComponent className='h-4 w-4' />
            </div>
            <Label className='text-base leading-[150%] font-medium text-neutral-base'>{title}</Label>
          </div>
          <div className='text-[28px] leading-[140%] text-primary-950 font-bold px-11'>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatisticsCard;
