import {
  TApplicationRoleResponse,
  TBusinessTeamSettingResponse,
  TInvitedTeamMemberResponse,
  TMemberRegistrationForm,
} from '@/lib/hooks/business/userprofile-settings.hook';
import { MemberRegistrationFormSchema } from '@/lib/schemas/business/server/settings.schema';
import { getErrorMessage } from '@/utils/errors';
import { create } from 'zustand';

// ----------------- Zustand store -----------------
export interface IUserProfileDialogStore {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export const useUserProfileDialogStore = create<IUserProfileDialogStore>((set) => ({
  open: false,
  setOpen: (val) => set({ open: val }),
}));

/**********************************************
 * Team Member Implementation
 * ******************************************/
const defaultMemberFormData: TMemberRegistrationForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  password: '',
  confirm_password: '',
  roleId: 0,
  invitedby: '',
};
interface ITeamMemberState {
  allApplicationRoles: TApplicationRoleResponse[];
  allMembers: TBusinessTeamSettingResponse[];
  allInvitedMembers: TInvitedTeamMemberResponse[];
  memberCreation: TMemberRegistrationForm;

  setAllApplicationRoles: (roles: TApplicationRoleResponse[]) => void;
  setAllMembers: (members: TBusinessTeamSettingResponse[]) => void;
  setAllInvitedMembers: (members: TInvitedTeamMemberResponse[]) => void;
  setMemberCreation: (profile: TMemberRegistrationForm) => void;
  clearProfile: () => void;
}

export const useTeamMemberStore = create<ITeamMemberState>((set) => ({
  allApplicationRoles: [],
  allInvitedMembers: [],
  allMembers: [],
  memberCreation: defaultMemberFormData,

  setAllApplicationRoles: (roles) => set({ allApplicationRoles: roles }),
  setAllMembers: (members) => set({ allMembers: members }),
  setAllInvitedMembers: (invitees) => set({ allInvitedMembers: invitees }),
  setMemberCreation: (memberCreation) => {
    try {
      MemberRegistrationFormSchema.parse(memberCreation);
      set({ memberCreation });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Validation error in the settings store:', message);
    }
  },
  clearProfile: () =>
    set({
      memberCreation: defaultMemberFormData,
    }),
}));
