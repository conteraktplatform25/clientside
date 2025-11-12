import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchJSON } from '@/utils/response';
import { ContactDesktopListResponseSchema } from '@/lib/schemas/business/server/contacts.schema';

export type TContactDesktopResponseList = z.infer<typeof ContactDesktopListResponseSchema>;

/* ===========================================================================
   🟠 Contacts
============================================================================== */

/* -----------------------------
   🟠 Get all the Product base
   on the Desktop Model set
----------------------------- */
export const useGetDesktopContacts = () =>
  useQuery({
    queryKey: ['desktop_products'],
    queryFn: () =>
      fetchJSON<{
        contacts: TContactDesktopResponseList;
      }>('/api/catalogue/contacts/desktop'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
