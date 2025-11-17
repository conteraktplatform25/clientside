import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchJSON } from '@/utils/response';
import {
  ContactDesktopListResponseSchema,
  ContactDesktopResponseSchema,
  ContactTagListResponseSchema,
  CreateContactSchema,
  TagListResponseSchema,
} from '@/lib/schemas/business/server/contacts.schema';
import { toast } from 'sonner';
import { IClientTag } from '@/lib/schemas/business/client/contact.schema';
//import { IClientTag, IContactTagEntry } from '@/lib/schemas/business/client/contact.schema';

export type TContactDesktopResponseList = z.infer<typeof ContactDesktopListResponseSchema>;
export type TContactDesktopResponse = z.infer<typeof ContactDesktopResponseSchema>;
export type TCreateContact = z.infer<typeof CreateContactSchema>;
export type TTagListResponse = z.infer<typeof TagListResponseSchema>;
export type TContactTagListResponse = z.infer<typeof ContactTagListResponseSchema>;

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

      return response;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    gcTime: Infinity,
  });

/* -----------------------------
   🟠 Post Contact profile
   on the Model set
----------------------------- */
export const useCreateContact = () => {
  const queryClient = useQueryClient();
  let client_name: string = '';

  return useMutation({
    mutationFn: async (payload: TCreateContact) => {
      client_name = payload.name;
      const res = await fetchJSON('/api/contacts', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res;
    },
    onSuccess: () => {
      // Refresh contact list
      queryClient.invalidateQueries({
        queryKey: ['desktop_contacts'],
      });
      toast.success(`Contact information for "${client_name}" created successfully`);
    },
  });
};

/* -----------------------------
   🟠 GET Contact Tag Implementation
   on the Model set
----------------------------- */
export function useContactTags(contactId: string | null) {
  const queryClient = useQueryClient();

  /* ---------------------------------------
     1. Fetch all available tags
  ---------------------------------------- */
  const tagsQuery = useQuery({
    queryKey: ['tags'],
    // queryFn: async () => {
    //   const res = await fetch('/api/contacts/tags');
    //   return (await res.json()) as IClientTag[];
    // },
    queryFn: () => fetchJSON<TTagListResponse>('/api/tags'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: contactId !== null,
  });

  /* ---------------------------------------
     2. Fetch tags assigned to this contact
  ---------------------------------------- */
  const contactTagsQuery = useQuery({
    queryKey: ['contact_tags', contactId],
    // queryFn: async () => {
    //   const res = await fetch(`/api/contacts/${contactId}/tags`);
    //   return (await res.json()) as IContactTagEntry[];
    // },
    queryFn: () => fetchJSON<TContactTagListResponse>(`/api/contacts/${contactId}/tags`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: contactId !== null,
  });

  /* ---------------------------------------
     3. Save tags for this contact
  ---------------------------------------- */
  const saveTagsMutation = useMutation({
    mutationFn: async (tagIds: string[]) => {
      const res = await fetch(`/api/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagIds }),
      });

      if (!res.ok) throw new Error('Failed to save tags');
    },
    onSuccess: () => {
      toast.success('Tags saved');
      queryClient.invalidateQueries({ queryKey: ['contact_tags', contactId] });
      queryClient.invalidateQueries({ queryKey: ['desktop_contacts'] });
    },
    onError: () => toast.error('Failed to save tags'),
  });

  /* ---------------------------------------
     4. Inline create tag
  ---------------------------------------- */
  const createTagMutation = useMutation({
    mutationFn: async (payload: { name: string; color: string }) => {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create tag');
      return (await res.json()) as IClientTag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag created');
    },
  });

  return {
    tagsQuery,
    contactTagsQuery,
    saveTagsMutation,
    createTagMutation,
  };
}
