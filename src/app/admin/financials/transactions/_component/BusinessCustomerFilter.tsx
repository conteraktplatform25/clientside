import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

export type BusinessNamesFilter = 'All business customer' | string;

interface StatusFilterProps {
  selectedStatus: BusinessNamesFilter;
  onStatusChange: (status: BusinessNamesFilter) => void;
}

const BusinessCustomerFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const statuses: BusinessNamesFilter[] = ['All business customer'];
  const formatLabel = (value: BusinessNamesFilter) => {
    if (value === 'All business customer') return value;
    return value.charAt(0) + value.slice(1).toLowerCase(); // PENDING → Pending
  };
  return (
    <Select value={selectedStatus} onValueChange={(value: BusinessNamesFilter) => onStatusChange(value)}>
      <SelectTrigger className='w-[220px]'>
        <SelectValue placeholder='Select Business Profile...' />
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

export default BusinessCustomerFilter;
