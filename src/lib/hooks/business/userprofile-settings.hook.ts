import { UserSettingsResponseSchema } from '@/lib/schemas/business/server/settings.schema';
import { fetchJSON } from '@/utils/response';
import { useQuery } from '@tanstack/react-query';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
import z from 'zod';

export type TUserSettingsReponse = z.infer<typeof UserSettingsResponseSchema>;
// export type TCreateBusinessSettings = z.infer<typeof CreateBusinessSettingsSchema>;
//export type TUpdateBusinessSettings = z.infer<typeof UpdateBusinessSettingsSchema>;
// export type TBusinessHourRecord = z.infer<typeof BusinessHoursSchema>;

/* ===============================
   🟢 Get Business Profile
   =============================== */
export const useGetUserProfile = () =>
  useQuery({
    queryKey: ['user_profile'],
    queryFn: () => fetchJSON<TUserSettingsReponse>('/api/settings/user'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

/* ===============================
   🟢 Update Business Profile
   =============================== */
// export const useUpdateBusinessProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation<TBusinessSettingsReponse, Error, TUpdateBusinessSettings>({
//     mutationFn: async (payload) =>
//       fetchJSON<TBusinessSettingsReponse>('/api/settings/business-profile', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       }),
//     onSuccess: (data) => {
//       // ✅ Invalidate to refresh business profile data
//       queryClient.invalidateQueries({ queryKey: ['business-profile'] });

//       // ✅ Optional: show a toast or success message
//       toast.success('Business profile updated successfully!');
//       console.log('Update success:', data);
//     },
//     onError: (error) => {
//       console.error('Update failed:', error);
//       toast.error('Failed to update business profile. Please try again.');
//     },
//   });
// };
