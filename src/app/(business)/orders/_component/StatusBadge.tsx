import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Hourglass, XCircle, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/type/client/business/order.type';

interface StatusBadgeProps {
  status: OrderStatus;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onStatusChange }) => {
  let badgeClass = '';
  let icon: React.ReactNode;

  switch (status) {
    case 'Delivered':
      badgeClass = 'bg-green-100 text-green-700 hover:bg-green-200';
      icon = <CheckCircle2 className='h-3 w-3 mr-1' />;
      break;
    case 'Pending':
      badgeClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      icon = <Clock className='h-3 w-3 mr-1' />;
      break;
    case 'Ongoing':
      badgeClass = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      icon = <Hourglass className='h-3 w-3 mr-1' />;
      break;
    case 'Cancelled':
      badgeClass = 'bg-red-100 text-red-700 hover:bg-red-200';
      icon = <XCircle className='h-3 w-3 mr-1' />;
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      icon = <Clock className='h-3 w-3 mr-1' />;
  }

  const statuses: OrderStatus[] = ['Delivered', 'Pending', 'Ongoing', 'Cancelled'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className={`h-auto px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
          {icon}
          {status}
          <ChevronDown className='ml-1 h-3 w-3' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {statuses.map((s) => (
          <DropdownMenuItem key={s} onClick={() => onStatusChange?.(s)}>
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusBadge;
