'use client';

import { ReactNode, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoaderWrapper from '@/components/custom/LoaderWrapper';
import { Toaster } from 'sonner';
import { ServerIndicator } from '@/components/custom/ServerIndicator';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LoaderWrapper>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <ServerIndicator />
          {children}
          <Toaster position='top-right' />
        </QueryClientProvider>
      </SessionProvider>
    </LoaderWrapper>
  );
}
