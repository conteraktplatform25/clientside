// src/app/admin/system/user/_component/AdminUserStatusBadge.tsx

import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { AdminOnboardingStatus } from '@/lib/enums/admin/admin-onboarding-status.enum';
import { Badge } from '@/components/ui/badge';
import { formatEnumLabel } from '@/lib/helpers/string-manipulator.helper';

interface StatusBadgeProps {
  status: AdminOnboardingStatus | null;
}

const STATUS_CONFIG: Record<
  AdminOnboardingStatus,
  {
    className: string;
    icon: React.ReactNode;
  }
> = {
  INVITED: {
    className: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className='h-3 w-3' />,
  },
  ACCOUNT_CREATED: {
    className: 'bg-fuchsia-100 text-fuchsia-700',
    icon: <XCircle className='h-3 w-3' />,
  },
  PROFILE_COMPLETED: {
    className: 'bg-primary-100 text-primary-700',
    icon: <XCircle className='h-3 w-3' />,
  },
  ACTIVE: {
    className: 'bg-green-100 text-green-700',
    icon: <CheckCircle2 className='h-3 w-3' />,
  },
  SUSPENDED: {
    className: 'bg-red-100 text-red-700',
    icon: <XCircle className='h-3 w-3' />,
  },
};

const AdminUserStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) {
    return (
      <Badge variant='secondary' className='gap-1 text-xs'>
        <Clock className='h-3 w-3' />
        Unknown
      </Badge>
    );
  }

  const { className, icon } = STATUS_CONFIG[status];

  return (
    <Badge className={`gap-1 text-xs font-medium ${className}`}>
      {icon}
      {formatEnumLabel(status)}
    </Badge>
  );
};

export default AdminUserStatusBadge;
