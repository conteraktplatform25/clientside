import { Button } from '@/components/ui/button';
import { TTagListResponse } from '@/lib/hooks/business/contact.hook';
import { Check } from 'lucide-react';

interface ITagMultiSelectProps {
  availableTags: TTagListResponse;
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
}

export default function TagMultiSelect({ availableTags, selectedTagIds, onChange }: ITagMultiSelectProps) {
  const toggle = (id: string) => {
    if (selectedTagIds.includes(id)) {
      onChange(selectedTagIds.filter((s) => s !== id));
    } else {
      onChange([...selectedTagIds, id]);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='text-sm leading-[155%]'>Select tags</div>
      <div className='grid grid-cols-2 gap-2 max-h-64 overflow-auto py-1'>
        {availableTags.map((tag) => (
          <Button
            key={tag.id}
            onClick={() => toggle(tag.id)}
            className={`flex items-center gap-2 p-2 rounded-md border text-sm leading-[155%] text-gray-700 text-left ${selectedTagIds.includes(tag.id) ? 'bg-[#EEF2FF] hover:bg-[#abb5d6] border-primary-base' : 'bg-white hover:bg-gray-100'}`}
          >
            <span className='w-3 h-3 rounded-full' style={{ background: tag.color ?? '#0d142f' }} />
            <div className='flex-1 flex justify-between'>
              {tag.name}
              {selectedTagIds.includes(tag.id) && (
                <div className='text-xs font-semibold'>
                  <Check />
                </div>
              )}
            </div>
          </Button>
        ))}
        {availableTags.length === 0 && <div className='text-sm text-neutral-500 p-2'>No tags yet</div>}
      </div>
    </div>
  );
}
