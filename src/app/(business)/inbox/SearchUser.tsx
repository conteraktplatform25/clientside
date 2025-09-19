import InputField from '@/components/custom/InputField';
import { Form } from '@/components/ui/form';
import { searchInputFilterSchema, TSearchInputFilterSchema } from '@/lib/schemas/dashboard/inbox.schema';
import { useSearchUserStore } from '@/lib/store/business/inbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const SearchUser = () => {
  const { user_search, setUserSearch } = useSearchUserStore();
  const searchUserForm = useForm<TSearchInputFilterSchema>({
    resolver: zodResolver(searchInputFilterSchema),
    defaultValues: {
      search_user: '',
    },
  });
  const { handleSubmit, control, watch } = searchUserForm;
  console.log(user_search);

  // Use useWatch to avoid infinite loop
  const searchUserValue = watch('search_user');

  useEffect(() => {
    setUserSearch(searchUserValue);
  }, [searchUserValue, setUserSearch]);

  const handleUserSearch = async (data: TSearchInputFilterSchema) => {
    console.log(data);
  };
  return (
    <Form {...searchUserForm}>
      <form onSubmit={handleSubmit(handleUserSearch)} className='w-full'>
        <div className='relative'>
          <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
          <InputField<TSearchInputFilterSchema>
            name='search_user'
            control={control}
            placeholder='Search for your message or users'
            className='pl-8 pr-2 py-2 w-full rounded-md border text-sm'
          />
        </div>
      </form>
    </Form>
  );
};

export default SearchUser;
