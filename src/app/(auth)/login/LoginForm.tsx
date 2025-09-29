import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signInWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import { loginFormSchema, TLoginFormSchema } from '@/lib/schemas/auth/login.schema';
import { useLoginFormStore } from '@/lib/store/auth/login.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getSession } from 'next-auth/react';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const { profile } = useLoginFormStore();
  const loginForm = useForm<TLoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: profile.email,
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = loginForm;

  const loginSubmit = async (data: TLoginFormSchema) => {
    const response = await signInWithIndicatorHook(data.email, data.password, callbackUrl);
    //console.log(response);
    // if (response?.ok) router.push(callbackUrl);
    if (response?.ok) {
      const session = await getSession();
      const user = session?.user;
      if (callbackUrl) router.push(`${callbackUrl}`);
      else if (user?.role === 'Admin') router.push('/admin');
      else if (user?.role === 'Agent') router.push('/agent');
      else router.push(`/`);
    } else
      toast('Invalid Username and Password', {
        description: 'Failed Login',
        action: {
          label: 'Ok',
          onClick: () => console.log(data),
        },
      });
  };
  return (
    <Form {...loginForm}>
      <form onSubmit={handleSubmit(loginSubmit)} className='w-full'>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='block space-y-4 w-full'>
          <InputField<TLoginFormSchema> name={'email'} control={control} type='email' label='Email' />
          <InputField<TLoginFormSchema> name={'password'} control={control} type='password' label='Password' />
        </div>
        <Button
          type='button'
          variant={'ghost'}
          className='font-semibold text-primary-base hover:bg-transparent hover:text-primary-700 mb-6'
          onClick={() => router.push('/forgot-password')}
        >
          Forgot password?
        </Button>
        <Button
          variant={'default'}
          className='mt-2 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={isSubmitting}
          type='submit'
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
