'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import { Bell, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { UserObject } from 'next-auth';

const TopNavigation = () => {
  const [profileName, setProfileName] = useState<UserObject | null>(null);
  //const router = useRouter();
  const { data: session } = useSession();
  // if (!session) {
  //   return router.push('/login');
  // }
  //session && session.user;

  useEffect(() => {
    setProfileName(() => session && session.user);
  }, [session]);
  return (
    <header className='flex items-center justify-between border-b bg-background py-2 px-10 w-full'>
      <div className='flex'>
        <h6 className='text-neutral-800'>Get Started</h6>
      </div>
      <div className='flex items-end space-x-4'>
        <Button variant='ghost' size='icon'>
          <Bell className='h-5 w-5' />
          <span className='sr-only'>Notifications</span>
        </Button>
        <Button variant='ghost' size='icon'>
          <Settings className='h-5 w-5' />
          <span className='sr-only'>Settings</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex item-center gap-2'>
              <Button variant='default' className='relative h-10 w-10 rounded-full'>
                {/* <Avatar className='h-8 w-8'>
                <AvatarFallback>SE</AvatarFallback>
              </Avatar> */}
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
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{`${
                  profileName ? `${profileName.first_name} ${profileName.last_name}` : 'Contract'
                }`}</p>
                <p className='text-xs leading-none text-muted-foreground'>{`${
                  profileName ? `${profileName.role}` : 'No Role'
                }`}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                className='p-0 text-primary-base hover:text-primary-700'
                variant={'ghost'}
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavigation;
