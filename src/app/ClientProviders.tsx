"use client"
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ServerIndicator } from '@/components/customs/ServerIndicator';
import FacebookSDK from '@/components/externals/facebook/FacebookSDK';

export default function ClientProviders({ children }: { readonly children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ServerIndicator />
      <FacebookSDK />
      <TooltipProvider>
        {children}
        {/* <SessionProvider sessionUser={sessionUser}></SessionProvider> */}
      </TooltipProvider>
      <Toaster position='top-right' />
    </QueryClientProvider>
  );
}
