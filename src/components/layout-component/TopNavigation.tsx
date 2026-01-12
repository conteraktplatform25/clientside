'use client';
import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import { LogOut, Phone, Settings, UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Session, UserObject } from 'next-auth';
import NotificationBell from '../notification/NotificationBell';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import { getInitials } from '@/lib/helpers/string-manipulator.helper';

const TopNavigation = ({ session }: { session: Session | null }) => {
  const [profileName, setProfileName] = useState<UserObject | null>(session?.user ?? null);
  const { title } = usePageTitleStore();

  useEffect(() => {
    setProfileName(session?.user ?? null);
  }, [session]);

  const nameInitials = getInitials(profileName?.first_name ?? '', profileName?.last_name ?? '');
  return (
    <header className='flex items-center justify-between border-b bg-background py-3 px-10 w-full'>
      <div className='flex'>
        <h6 className='font-semibold text-2xl leading-[140%] text-neutral-800'>{title}</h6>
      </div>
      <div className='flex items-end space-x-4'>
        <NotificationBell userId={session?.user?.id} />
        <Button variant='ghost' size='lg'>
          <Settings width={28} height={28} />
          <span className='sr-only'>Settings</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex item-center gap-2'>
              <Button
                variant='default'
                className='relative h-12 w-12 border border-neutral-200 rounded-full bg-primary-900'
              >
                <h5 className=' text-white text-lg leading-[150%]'>{nameInitials}</h5>
              </Button>
              <div className='mt-1 flex flex-col gap-0'>
                <h6 className='text-base font-semibold leading-[150%] text-neutral-800'>{`${
                  profileName ? `${profileName.first_name} ${profileName.last_name}` : 'No Contakt Profile'
                }`}</h6>
                <span className='text-neutral-500 text-sm leading-[155%]'>{`${profileName ? `${profileName.role}` : 'No Role'}`}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[387px]' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='inline-flex space-x-3 h-auto'>
                <div className='relative h-16 w-16 border border-neutral-200 rounded-full bg-primary-900 flex items-center justify-center'>
                  <h5 className='font-semibold text-white text-2xl leading-[140%] text-center'>{nameInitials}</h5>
                </div>
                <div className='flex flex-col items-start justify-center'>
                  <p className='text-left text-lg font-semibold leading-[150%] text-neutral-700'>{`${
                    profileName ? `${profileName.first_name} ${profileName.last_name}` : 'Contract'
                  }`}</p>
                  <p className='text-sm leading-[155%] text-neutral-500'>{`${
                    profileName ? `${profileName.role}` : 'No Role'
                  }`}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className='flex flex-col gap-2 p-3'>
              <p className='text-xs font-semibold leading-[130%] tracking-[120%] uppercase text-neutral-400'>
                Account Summary
              </p>
              <div className='flex flex-col gap-3'>
                <DropdownMenuItem className='hover:bg-transparent'>
                  <div className='inline-flex space-x-1'>
                    <Phone className='mt-0.5 text-primary-base' />
                    <p className='text-sm text-neutral-base leading-[150%]'>{`Whatsapp Number: ${profileName?.registered_number}`}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='p-0 cursor-pointer'>
                  <Button
                    className='p-0 w-fit text-primary-base hover:text-primary-700'
                    variant={'ghost'}
                    size={'sm'}
                    asChild
                  >
                    <div className='inline-flex space-x-1'>
                      <UserRound className='text-primary-base' />
                      <p className='text-sm text-neutral-base leading-[150%]'>{`${profileName?.role} profile`}</p>
                    </div>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer p-0'>
                  <Button
                    className='p-0 w-fit text-primary-base hover:text-primary-700'
                    variant={'ghost'}
                    size={'sm'}
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    asChild
                  >
                    <div className='inline-flex space-x-1'>
                      <LogOut className='mt-0.5 text-error-base' />
                      <p className='text-sm text-neutral-base leading-[150%]'>Log out</p>
                    </div>
                  </Button>
                </DropdownMenuItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavigation;
