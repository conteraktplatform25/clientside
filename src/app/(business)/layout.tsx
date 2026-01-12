import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOption';
import ClientDashboardLayout from './ClientDashboardLayout';

interface BusinessLayoutProps {
  children: ReactNode;
}

const BusinessLayout = async ({ children }: BusinessLayoutProps) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const session = await getServerSession(authOptions);

  return (
    <ClientDashboardLayout defaultOpen={defaultOpen} session={session}>
      {children}
    </ClientDashboardLayout>
  );
};

export default BusinessLayout;
