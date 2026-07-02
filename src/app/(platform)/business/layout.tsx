import React from 'react';
import BusinessLayout from './BusinessLayout';
import { cookies } from 'next/headers';

export default async function LoggedInBusinessLayout({ children }: { readonly children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return <BusinessLayout defaultOpen={defaultOpen}>{children}</BusinessLayout>;
}