'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import {
  TBusinessTeamQueryRequest,
  useGetPendingInvitedMember,
  useGetTeamMember,
} from '@/lib/hooks/business/userprofile-settings.hook';
import { useTeamMemberStore } from '@/lib/store/business/settings.store';

export function useBusinessTeamManager() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  //const [isInviteOpen, setInviteOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const query: TBusinessTeamQueryRequest = {
    page,
    limit,
    search: debouncedSearch || undefined,
  };

  const teamMember_queryHook = useGetTeamMember(query);
  const invitedMember_queryHook = useGetPendingInvitedMember(query);

  const setTeamMembers_store = useTeamMemberStore((s) => s.setAllMembers);
  const setInvitedMembers_store = useTeamMemberStore((s) => s.setAllInvitedMembers);

  useEffect(() => {
    if (teamMember_queryHook.data?.businessTeam) {
      setTeamMembers_store(teamMember_queryHook.data.businessTeam);
    }
  }, [teamMember_queryHook.data, setTeamMembers_store]);

  useEffect(() => {
    if (invitedMember_queryHook.data?.invitedTeam) {
      setInvitedMembers_store(invitedMember_queryHook.data.invitedTeam);
    }
  }, [invitedMember_queryHook.data, setInvitedMembers_store]);

  return {
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    teamMember_queryHook,
    invitedMember_queryHook,
  };
}
