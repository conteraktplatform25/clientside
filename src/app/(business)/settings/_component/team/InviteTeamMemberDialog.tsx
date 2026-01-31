import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/custom/InputField';
import { getErrorMessage } from '@/utils/errors';
import { TInviteTeamMemberRequest } from '@/lib/hooks/business/userprofile-settings.hook';
import { InviteTeamMemberRequestSchema } from '@/lib/schemas/business/server/settings.schema';

interface IInviteTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteTeamMemberDialog: React.FC<IInviteTeamMemberDialogProps> = ({ isOpen, onClose }) => {
  const form = useForm<TInviteTeamMemberRequest>({
    resolver: zodResolver(InviteTeamMemberRequestSchema),
    defaultValues: { email: '', roleId: 0 },
  });
  const handleSaveCategory = async (data: TInviteTeamMemberRequest) => {
    if (!data.email) {
      toast.error('Category Name is required');
      return;
    }
    toast.info('Saving category...');
    try {
      //await createCategoryMutation.mutateAsync(data);
      form.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
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

        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-1/2 px-6 py-4'>
            <h2 className='text-xl font-semibold mb-2'>Invite a team member</h2>
            <form onSubmit={form.handleSubmit(handleSaveCategory)} className='space-y-6'>
              <InputField<TInviteTeamMemberRequest>
                name='email'
                control={form.control}
                placeholder='Email here...'
                label='Email Address'
                important
              />
            </form>
          </div>
          <div className='lg:w-1/2 p-3'>
            <div className='w-full bg-white border-2 border-[#EEEFF1] rounded-[12px] p-4 shadow-sm'>
              <h2 className='text-base font-semibold leading-[150%]'>Invited Team Member Collection</h2>
              {/* <p className='text-sm text-gray-600'>
                {allInvitedMembers.length} member{allInvitedMembers.length !== 1 ? 's' : ''} await response
              </p> */}
              {/* <ScrollArea className='h-84'>
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
                    <p className='text-sm text-center py-4 text-gray-500'>No team member invited yet.</p>
                  )}
                </div>
              </ScrollArea> */}
            </div>
          </div>
        </div>
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
