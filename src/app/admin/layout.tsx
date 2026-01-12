import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOption';
import ClientAdminLayout from './ClientAdminLayout';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const session = await getServerSession(authOptions);

  return (
    <ClientAdminLayout defaultOpen={defaultOpen} session={session}>
      {children}
    </ClientAdminLayout>
  );
};

export default AdminLayout;
