import { GET } from './api-client';
import { GetMemberBusinessResponseDto } from '@/types/business/team-member.type';

export const MemberService = {
  getCurrentUserBusiness: () => GET<GetMemberBusinessResponseDto>('/memberships/businesses'),
};
