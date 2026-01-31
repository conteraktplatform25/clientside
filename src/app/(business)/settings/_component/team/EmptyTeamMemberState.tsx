import { PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IEmptyTeamMemberStateProps {
  onInvite: () => void;
}

const EmptyTeamMemberState: React.FC<IEmptyTeamMemberStateProps> = ({ onInvite }) => {
  return (
    <div className='flex min-h-[80vh] items-center justify-center bg-white px-4'>
      <div className='max-w-md text-center'>
        <div
          className='
            mx-auto mb-6 flex h-16 w-16 items-center justify-center
            rounded-full
            bg-[var(--color-primary-50)]
            text-[var(--color-primary-base)]
          '
        >
          <Users className='h-8 w-8' />
        </div>

        <h3 className='text-xl font-semibold text-[var(--color-neutral-800)]'>No team members yet</h3>

        <p className='mt-2 text-sm text-neutral-500'>Invite colleagues to collaborate with your organization.</p>

        <Button
          onClick={onInvite}
          className='
            mt-6
            bg-[var(--color-primary-base)]
            text-white
            hover:bg-[var(--color-primary-700)]
          '
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Invite team member
        </Button>
      </div>
    </div>
  );
};

export default EmptyTeamMemberState;
