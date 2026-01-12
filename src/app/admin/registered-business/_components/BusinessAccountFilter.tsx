import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessAccountStatus } from '@prisma/client';

export type TAccountSatusFilter = 'All status' | BusinessAccountStatus;

interface BusinessAccountFilterProps {
  selectedStatus: TAccountSatusFilter;
  onStatusChange: (status: TAccountSatusFilter) => void;
}

const BusinessAccountFilter: React.FC<BusinessAccountFilterProps> = ({ selectedStatus, onStatusChange }) => {
  // const statuses: OrderStatusFilter[] = ['All orders', 'Delivered', 'Pending', 'Ongoing', 'Cancelled'];
  const statuses: TAccountSatusFilter[] = [
    'All status',
    BusinessAccountStatus.INACTIVE,
    BusinessAccountStatus.ACTIVE,
    BusinessAccountStatus.SUPENDED,
  ];

  const formatLabel = (value: TAccountSatusFilter) => {
    if (value === 'All status') return value;
    return value.charAt(0) + value.slice(1).toLowerCase(); // PENDING → Pending
  };

  return (
    <Select value={selectedStatus} onValueChange={(value: TAccountSatusFilter) => onStatusChange(value)}>
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

export default BusinessAccountFilter;
