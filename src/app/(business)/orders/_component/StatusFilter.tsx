import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusFilter } from '@/type/client/business/order.type';

interface StatusFilterProps {
  selectedStatus: OrderStatusFilter;
  onStatusChange: (status: OrderStatusFilter) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const statuses: OrderStatusFilter[] = ['All orders', 'Delivered', 'Pending', 'Ongoing', 'Cancelled'];

  return (
    <Select value={selectedStatus} onValueChange={onStatusChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select status' />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
