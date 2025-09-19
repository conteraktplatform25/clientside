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

const TopNavigation = ({ session }: { session: Session | null }) => {
  const [profileName, setProfileName] = useState<UserObject | null>(session?.user ?? null);

  console.log('Top Navigation:', session?.user);
  useEffect(() => {
    setProfileName(session?.user ?? null);
  }, [session]);
  return (
    <header className='flex items-center justify-between border-b bg-background py-2 px-10 w-full'>
      <div className='flex'>
        <h6 className='text-neutral-800'>Get Started</h6>
      </div>
      <div className='flex items-end space-x-4'>
        <NotificationBell userId={session?.user?.id} />
        <Button variant='ghost' size='icon'>
          <Settings className='h-5 w-5' />
          <span className='sr-only'>Settings</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex item-center gap-2'>
              <Button variant='default' className='relative h-10 w-10 rounded-full'>
                <h6 className=' text-white'>SE</h6>
              </Button>
              <div className='flex flex-col gap-0'>
                <h6 className='text-sm font-semibold leading-normal'>{`${
                  profileName ? `${profileName.first_name} ${profileName.last_name}` : 'Contract'
                }`}</h6>
                <span className='text-gray-500 text-xs'>{`${profileName ? `${profileName.role}` : 'No Role'}`}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[387px]' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='inline-flex space-x-3 h-auto'>
                <Button variant='default' className='relative h-16 w-16 rounded-full cursor-default'>
                  <h6 className=' text-white'>SE</h6>
                </Button>
                <div className='flex flex-col items-start justify-center'>
                  <p className='text-left text-[18px] font-semibold leading-[150%] text-neutral-700'>{`${
                    profileName ? `${profileName.first_name} ${profileName.last_name}` : 'Contract'
                  }`}</p>
                  <p className='text-sm leading-[155%] text-neutral-500'>{`${
                    profileName ? `${profileName.role}` : 'No Role'
                  }`}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className='flex flex-col gap-2 px-2'>
              <p className='text-xs font-semibold leading-[130%] tracking-[120%] uppercase text-neutral-400'>
                Account Summary
              </p>
              <div className='px-1 flex flex-col gap-3'>
                <DropdownMenuItem className='hover:bg-transparent'>
                  <div className='inline-flex space-x-1'>
                    <Phone className='mt-0.5 text-primary-base' />
                    <p className='text-sm text-neutral-base leading-[150%]'>{`Whatsapp Number: ${session?.user?.registered_number}`}</p>
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
                      <p className='text-sm text-neutral-base leading-[150%]'>{`${session?.user?.role} profile`}</p>
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
