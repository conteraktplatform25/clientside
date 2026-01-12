import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentStatus } from '@prisma/client';
import React from 'react';

export type TPaymentSatusFilter = 'All' | PaymentStatus;

interface PaymentTransactionFilterProps {
  selectedStatus: TPaymentSatusFilter;
  onStatusChange: (status: TPaymentSatusFilter) => void;
}

const PaymentTransactionFilter: React.FC<PaymentTransactionFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const statuses: TPaymentSatusFilter[] = [
    'All',
    PaymentStatus.FAILED,
    PaymentStatus.PENDING,
    PaymentStatus.REFUNDED,
    PaymentStatus.SUCCESS,
  ];

  const formatLabel = (value: TPaymentSatusFilter) => {
    if (value === 'All') return value;
    return value.charAt(0) + value.slice(1).toLowerCase(); // PENDING → Pending
  };
  return (
    <Select value={selectedStatus} onValueChange={(value: TPaymentSatusFilter) => onStatusChange(value)}>
      <SelectTrigger className='w-[120px]'>
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

export default PaymentTransactionFilter;
