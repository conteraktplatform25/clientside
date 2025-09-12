import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileLevelFormSchema, TProfileLevelFormSchema } from '@/lib/schemas/dashboard/getstarted.schema';
import { useProfileLevelFormStore } from '@/lib/store/dashboard/getstarted.store';

export const useProfileLevelForm = () => {
  const { data, setFormData } = useProfileLevelFormStore();

  const profileLevelFormHook = useForm<TProfileLevelFormSchema>({
    resolver: zodResolver(profileLevelFormSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const onSubmit = (values: TProfileLevelFormSchema) => {
    setFormData(values);
    console.log('Final Submit', values);
  };

  return { profileLevelFormHook, onSubmit };
};
