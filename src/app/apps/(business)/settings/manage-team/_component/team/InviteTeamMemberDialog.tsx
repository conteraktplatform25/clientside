import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/custom/InputField';
import {
  TInvitedTeamMemberResponse,
  TInviteTeamMemberRequest,
  useInviteTeamMember,
} from '@/lib/hooks/business/userprofile-settings.hook';
import { InviteTeamMemberRequestSchema } from '@/lib/schemas/business/server/settings.schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useGetSelectAppRoles } from '@/lib/hooks/default.hook';
import { ROLE_LABEL_MAP } from '@/lib/constants/default.constant';
import SelectField from '@/components/custom/SelectField';
import { Button } from '@/components/ui/button';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import { Loader2 } from 'lucide-react';

interface IInviteTeamMemberDialogProps {
  allInvitedMembers: TInvitedTeamMemberResponse[];
  isOpen: boolean;
  onClose: () => void;
}

const InviteTeamMemberDialog: React.FC<IInviteTeamMemberDialogProps> = ({ allInvitedMembers, isOpen, onClose }) => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const { data: roleResponse, isLoading } = useGetSelectAppRoles();
  const inviteTeamMemberHook = useInviteTeamMember();
  const roleOptions =
    roleResponse?.map((role) => ({
      value: role.id.toString(),
      label: ROLE_LABEL_MAP[role.name] ?? role.name,
    })) ?? [];
  const form = useForm<TInviteTeamMemberRequest>({
    resolver: zodResolver(InviteTeamMemberRequestSchema),
    defaultValues: { email: '', roleId: 0 },
  });

  const handleCloseDialog = () => {
    form.reset();
    onClose();
  };
  const handleSaveCategory = async (data: TInviteTeamMemberRequest) => {
    await inviteTeamMemberHook.mutate(data);
    setAlert({
      type: 'success',
      title: 'Invitation sent successfully',
      description: 'Email has been successfully sent to a team member',
    });
    form.reset();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side='right' className='w-full sm:max-w-3xl'>
        <SheetHeader>
          <SheetTitle>
            <Label className='font-medium text-base text-neutral-700'>Team Member Invitaion Modal</Label>
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {isLoading ? (
          <div className='w-full flex items-center justify-center font-bold text-neutral-700 leading-[155%]'>
            Loading Dialog dependencies...
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='lg:w-1/2 px-6 py-4'>
              <h2 className='text-xl font-semibold mb-2'>Invite a team member</h2>
              {alert.type && (
                <div className='px-4 mt-4'>
                  <AlertDisplayField
                    type={alert.type}
                    title={alert.title || ''}
                    description={alert.description}
                    onClose={() => setAlert({ type: null, description: '', title: '' })}
                  />
                </div>
              )}
              <form onSubmit={form.handleSubmit(handleSaveCategory)} className='space-y-6'>
                <InputField<TInviteTeamMemberRequest>
                  name='email'
                  control={form.control}
                  placeholder='Email here...'
                  label='Email Address'
                  important
                />
                <SelectField<TInviteTeamMemberRequest>
                  control={form.control}
                  name='roleId'
                  options={roleOptions}
                  label='Assign Role'
                  important
                  valueType='number'
                  placeholder='Select role'
                />
                {/* Actions */}
                <div className='flex gap-2 mt-12 w-full'>
                  <Button
                    variant='ghost'
                    type='submit'
                    className='mb-8 bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100'
                    disabled={inviteTeamMemberHook.isPending}
                  >
                    {/* {inviteTeamMemberHook.isPending ? 'Sending invite message...' : 'Invite Team Member'} */}
                    {inviteTeamMemberHook.isPending ? (
                      <>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        <span className='text-sm leading-[150%]'>Sending invite message...</span>
                      </>
                    ) : (
                      <>
                        <span className='text-base leading-[150%]'>Invite Team Member</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCloseDialog}
                    disabled={inviteTeamMemberHook.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
            <div className='lg:w-1/2 p-3'>
              <div className='w-full bg-white border-2 border-[#EEEFF1] rounded-[12px] p-4 shadow-sm'>
                <h2 className='text-sm font-semibold leading-[150%] text-neutral-500'>
                  Invited Team Member Collection
                </h2>
                {allInvitedMembers.length > 0 && (
                  <p className='text-sm text-gray-600'>
                    {allInvitedMembers.length} member{allInvitedMembers.length !== 1 ? 's' : ''} await response
                  </p>
                )}

                <ScrollArea className='h-84'>
                  <div className='space-y-1'>
                    {allInvitedMembers.length > 0 ? (
                      allInvitedMembers.map((invitee, _idx) => {
                        const key = invitee.id ?? `temp-${_idx}`;
                        return (
                          <Card key={key} className='border-none shadow-none p-0'>
                            <CardContent className='px-4 py-2'>
                              <h3 className='font-medium text-base leading-[150%]'>{`${invitee.email}`}</h3>
                              <p className='text-sm line-clamp-2 leading-[155%]'>{'No info yet.'}</p>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <div className='w-full h-full flex justify-center items-center'>
                        <p className='text-sm text-center py-4 text-gray-500'>No team member invited yet.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export const ErrorInvitedMemberProfile = () => {
  return (
    <div className='flex flex-col text-center bg-white relative'>
      <div className='flex flex-col items-center justify-center py-16 text-center space-y-4'>
        <div className='text-6xl text-gray-300'>{'📭'}</div>
        <h3 className='text-lg font-semibold text-red-800'>
          {'Problem loading previous invites. Go ahead inviting a team member.'}
        </h3>
      </div>
    </div>
  );
};

export default InviteTeamMemberDialog;
