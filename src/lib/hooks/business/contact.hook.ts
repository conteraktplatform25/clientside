import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchJSON } from '@/utils/response';
import {
  ContactDesktopListResponseSchema,
  ContactDesktopResponseSchema,
} from '@/lib/schemas/business/server/contacts.schema';

export type TContactDesktopResponseList = z.infer<typeof ContactDesktopListResponseSchema>;
export type TContactDesktopResponse = z.infer<typeof ContactDesktopResponseSchema>;

/* ===========================================================================
   🟠 Contacts
============================================================================== */

/* -----------------------------
   🟠 Get all the Product base
   on the Desktop Model set
----------------------------- */
export const useGetDesktopContacts = (search?: string, page = 1, limit = 10) =>
  useQuery({
    queryKey: ['desktop_contacts', search, page, limit],
    queryFn: async () => {
      const url = new URL('/api/contacts/desktop', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', limit.toString());
      if (search) url.searchParams.set('search', search);

      const response = await fetchJSON<TContactDesktopResponseList>(url.toString());
      // optional zod validation:
      return response;
      //return ContactDesktopListResponseSchema.parse(response);
    },
    // fetchJSON<{
    //   contacts: TContactDesktopResponseList;
    // }>('/api/contacts/desktop'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    gcTime: Infinity,
  });
