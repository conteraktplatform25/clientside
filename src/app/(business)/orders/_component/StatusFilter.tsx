import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatus } from '@prisma/client';
//import { OrderStatusFilter } from '@/type/client/business/order.type';

export type OrderStatusFilter = 'All orders' | OrderStatus;

interface StatusFilterProps {
  selectedStatus: OrderStatusFilter;
  onStatusChange: (status: OrderStatusFilter) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  // const statuses: OrderStatusFilter[] = ['All orders', 'Delivered', 'Pending', 'Ongoing', 'Cancelled'];
  const statuses: OrderStatusFilter[] = [
    'All orders',
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  const formatLabel = (value: OrderStatusFilter) => {
    if (value === 'All orders') return value;
    return value.charAt(0) + value.slice(1).toLowerCase(); // PENDING → Pending
  };

  return (
    <Select value={selectedStatus} onValueChange={(value: OrderStatusFilter) => onStatusChange(value)}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select status' />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {formatLabel(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
