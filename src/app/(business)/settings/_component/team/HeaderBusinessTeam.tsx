import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';

interface IHeaderBusinessTeamProps {
  search: string;
  onSearch: (val: string) => void;
  onInvite: () => void;
}

const HeaderBusinessTeam = ({ search, onSearch, onInvite }: IHeaderBusinessTeamProps) => {
  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
      <div className='flex flex-col gap-1'>
        <h4 className='text-xl font-semibold'>Manage Team Members</h4>
        <p className='text-neutral-500'>Manage your team members and assign roles</p>
      </div>
      <div className='flex gap-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
          <input
            className='pl-9 border rounded-md px-3 py-2 text-sm'
            placeholder='Search name or email'
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button onClick={onInvite}>
          <PlusCircle size={16} />
          Invite Member
        </Button>
      </div>
    </div>
  );
};

export default HeaderBusinessTeam;
