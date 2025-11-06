import { BusinessSettingsResponseSchema } from '@/lib/schemas/business/server/settings.schema';
import { fetchJSON } from '@/utils/response';
import { useQuery } from '@tanstack/react-query';
import z from 'zod';

export type TBusinessSettingsReponse = z.infer<typeof BusinessSettingsResponseSchema>;

/* ===============================
   🟢 Get Business Profile
   =============================== */
export const useGetBusinessProfile = () =>
  useQuery({
    queryKey: ['business_profile'],
    queryFn: () => fetchJSON<TBusinessSettingsReponse>('/api/settings/business-profile'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

/* ===============================
   🟢 Update Business Profile
   =============================== */
//  export const useUpdateBusinessProfile = () => {
//   return useMutation ({
//     // 🟢 Send PATCH request to your backend
//     mutationFn
//   })
//  }
