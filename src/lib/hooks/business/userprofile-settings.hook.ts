import {
  BusinessTeamListResponseSchema,
  BusinessTeamQuerySchema,
  BusinessTeamSettingResponseSchema,
  InvitedTeamMemberResponseSchema,
  InviteTeamMemberRequestSchema,
  InviteTeamMemberResponseSchema,
  MemberRegistrationFormSchema,
  RoleResponseSchema,
  UserSettingsResponseSchema,
} from '@/lib/schemas/business/server/settings.schema';
import { PaginationMeta } from '@/type/client/default.type';
import { getErrorMessage } from '@/utils/errors';
import { fetchJSON } from '@/utils/response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

export type TApplicationRoleResponse = z.infer<typeof RoleResponseSchema>;
export type TInvitedTeamMemberResponse = z.infer<typeof InvitedTeamMemberResponseSchema>;
export type TUserSettingsReponse = z.infer<typeof UserSettingsResponseSchema>;
export type TBusinessTeamQueryRequest = z.infer<typeof BusinessTeamQuerySchema>;
export type TBusinessTeamListResponse = z.infer<typeof BusinessTeamListResponseSchema>;
export type TBusinessTeamSettingResponse = z.infer<typeof BusinessTeamSettingResponseSchema>;
export type TInviteTeamMemberRequest = z.infer<typeof InviteTeamMemberRequestSchema>;
export type TInviteTeamMemberResponse = z.infer<typeof InviteTeamMemberResponseSchema>;
export type TMemberRegistrationForm = z.infer<typeof MemberRegistrationFormSchema>;
// export type TCreateBusinessSettings = z.infer<typeof CreateBusinessSettingsSchema>;
//export type TUpdateBusinessSettings = z.infer<typeof UpdateBusinessSettingsSchema>;
// export type TBusinessHourRecord = z.infer<typeof BusinessHoursSchema>;

/* --------------------------------------------------
   🧱 Types
----------------------------- *************************/
interface ITeamMemberResponse {
  businessTeam: TBusinessTeamSettingResponse[];
  pagination: PaginationMeta;
}

export interface IInvitedMemberResponse {
  invitedTeam: TInvitedTeamMemberResponse[];
  pagination: PaginationMeta;
}
/**  ********************************************** */

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

/* ===============================
   🟢 Get All Team Member Profile
   =============================== */
export const useGetTeamMember = (params: TBusinessTeamQueryRequest) => {
  return useQuery({
    queryKey: ['team_memebers', params],
    queryFn: async () => {
      const url = new URL('/api/settings/business-team', window.location.origin);
      url.searchParams.set('page', params.page.toString());
      url.searchParams.set('limit', params.limit.toString());
      if (params.search) url.searchParams.set('search', params.search);

      return await fetchJSON<ITeamMemberResponse>(url.toString());
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: 1000 * 60 * 10,
    gcTime: Infinity,
  });
};

/* ===============================
   🟢 Get Pending Invited Team Member Profile
   =============================== */
export const useGetPendingInvitedMember = (params: TBusinessTeamQueryRequest) => {
  return useQuery({
    queryKey: ['invited_team_memebers', params],
    queryFn: async () => {
      const url = new URL('/api/settings/business-team/invite', window.location.origin);
      url.searchParams.set('page', params.page.toString());
      url.searchParams.set('limit', params.limit.toString());
      if (params.search) url.searchParams.set('search', params.search);

      return await fetchJSON<IInvitedMemberResponse>(url.toString());
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: 1000 * 60 * 10,
    gcTime: Infinity,
  });
};

/* ===============================
   🟢 Invite team member (Local + API)
   =============================== */
export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();
  let member_email = '';

  return useMutation({
    mutationFn: async (payload: TInviteTeamMemberRequest) => {
      member_email = payload.email;
      const res = await fetchJSON<TInviteTeamMemberResponse>('/api/settings/business-team/invite', {
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
        queryKey: ['team_memebers'],
      });
      toast.success(`Contact information for "${member_email}" created successfully`);
    },
    onError: (error) => {
      console.error('Category creation failed:', getErrorMessage(error));
    },
  });
};
