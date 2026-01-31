'use client';

import React, { useState } from 'react';
import { useTeamMemberStore } from '@/lib/store/business/settings.store';
import { useBusinessTeamManager } from '../../_hooks/useBusinessTeamManager';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import PaginationControls from '@/components/custom/PaginationControls';
import InviteTeamMemberDialog from './InviteTeamMemberDialog';
import HeaderBusinessTeam from './HeaderBusinessTeam';
import ErrorServerField from '@/components/custom/ErrorServerField';
import EmptyTeamMemberState from './EmptyTeamMemberState';

const BusinessTeamManager = () => {
  const [isInviteOpen, setInviteOpen] = useState(false);

  const { search, setSearch, page, setPage, limit, setLimit, teamMember_queryHook, invitedMember_queryHook } =
    useBusinessTeamManager();

  const teamMembers = useTeamMemberStore((s) => s.allMembers);
  //const invitedMembers = useTeamMemberStore((s) => s.allInvitedMembers);

  const openInviteDialog = () => setInviteOpen(true);
  const closeInviteDialog = () => setInviteOpen(false);

  if (teamMember_queryHook.isLoading || invitedMember_queryHook.isLoading) {
    return <UILoaderIndicator label='Fetching your team members...' />;
  }

  if (teamMember_queryHook.isError || invitedMember_queryHook.isError) {
    return (
      <ErrorServerField
        title='Failed to load team members profile'
        description='We couldn’t retrieve your team data. Please try again.'
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!teamMembers.length) {
    return <EmptyTeamMemberState onInvite={openInviteDialog} />;
  }
  return (
    <div className='w-full px-4 flex flex-col gap-6'>
      <HeaderBusinessTeam search={search} onSearch={setSearch} onInvite={openInviteDialog} />

      <PaginationControls
        currentPage={page}
        totalPages={teamMember_queryHook.data?.pagination.totalPages ?? 1}
        rowsPerPage={limit}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
      />

      <InviteTeamMemberDialog
        // allInvitedMembers={invitedMembers}
        // invitePagination={invitedMember_queryHook.data?.pagination}
        isOpen={isInviteOpen}
        onClose={closeInviteDialog}
      />
    </div>
  );
};

export default BusinessTeamManager;
