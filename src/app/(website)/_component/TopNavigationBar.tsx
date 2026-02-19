'use client';

import React, { FC, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import SVGIcon from '@/components/custom/SVGIcons';
import { Session, UserObject } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useMediaQuery } from '@reactuses/core';
import { useRoleRouteResolver } from '@/lib/hooks/use-roleRouteResolver.hook';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/helpers/string-manipulator.helper';
import { LogOut } from 'lucide-react';

interface INavbarProps {
  session?: Session | null;
}

const TopNavigationBar: FC = ({ session }: INavbarProps) => {
  //const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { data: clientSession, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const roleBasePath = useRoleRouteResolver();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHasScrolled(latest > 20);
  });
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const effectiveSession = status === 'loading' ? session : clientSession;

  const drawerVariants = {
    closed: { x: '100%' },
    open: { x: 0 },
  };
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          hasScrolled ? 'bg-white shadow-sm border-b border-neutral-200/80' : 'bg-primary-50  backdrop-blur-lg'
        }`}
      >
        <div className='container mx-auto px-6'>
          <div className='flex items-center justify-between h-16 md:h-20'>
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }} className='flex items-center gap-2'>
              <Link href={'/'}>
                <div className='flex gap-2'>
                  <SVGIcon
                    className=' mt-1.5'
                    fileName='icon-logo.svg'
                    alt='Concakt Logo'
                    width={isMobile ? 29.39 : 45.89}
                    height={32.58}
                  />
                  <div className='mt-1 text-neutral-800 text-3xl font-semibold tracking-tight'>contakt</div>
                </div>
              </Link>
            </motion.div>
            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-8'>
              {/* <DesktopNavItems /> */}
              <AuthActionsDesktop user={effectiveSession?.user} roleBasePath={roleBasePath} />
            </div>
            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className='p-2 rounded-lg hover:bg-neutral-100 transition-colors'
                aria-label='Toggle menu'
              >
                <svg className='w-6 h-6 text-neutral-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial='closed'
              animate='open'
              exit='closed'
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden'
              onClick={toggleMenu}
            />
            {/* Drawer Panel */}
            <motion.div
              initial='closed'
              animate='open'
              exit='closed'
              variants={drawerVariants}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className='fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-50 md:hidden shadow-2xl'
            >
              <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='p-6 border-b border-neutral-200 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Link href={'/'}>
                      <div className='flex gap-0.5'>
                        <SVGIcon
                          className=' mt-1.5'
                          fileName='icon-logo.svg'
                          alt='Concakt Logo'
                          width={isMobile ? 29.39 : 45.89}
                          height={32.58}
                        />
                        <div className='text-neutral-900 text-lg font-semibold tracking-tight'>contakt</div>
                      </div>
                    </Link>
                  </div>
                  <button onClick={toggleMenu} className='p-2 -mr-2'>
                    <svg className='w-6 h-6 text-neutral-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                {/* Nav Items */}
                {/* <div className='flex-1 px-6 py-8 flex flex-col gap-6'>
                  <DesktopNavItems />
                </div> */}
                {/* Footer CTAs */}
                <div className='p-6 border-t border-neutral-200 flex flex-col gap-4'>
                  <AuthActionsDesktop user={effectiveSession?.user} roleBasePath={roleBasePath} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Spacer to prevent content jump */}
      <div className='h-16 md:h-20' />
    </>
  );
};

function AuthActionsDesktop({
  user,
  roleBasePath,
}: {
  user: UserObject | null | undefined;
  roleBasePath: string | null;
}) {
  if (!user) {
    return (
      <>
        <motion.a
          href='/login'
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className='text-neutral-700 hover:text-neutral-900 font-medium transition-colors'
        >
          Login
        </motion.a>
        <motion.a
          href='/get-started'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className='bg-primary-base text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-primary-600 transition-colors duration-200'
        >
          Get Started
        </motion.a>
      </>
    );
  } else {
    const nameInitials = getInitials(user.first_name ?? '', user.last_name ?? '');
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className='cursor-pointer' asChild>
          <Avatar>
            <AvatarImage src={user.image!} alt='Auth_User' className=' grayscale' />
            <AvatarFallback className='font-bold text-xl'>{nameInitials}</AvatarFallback>
            <AvatarBadge className='bg-primary-700' />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[387px]' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='inline-flex space-x-3 h-auto'>
              <div className='relative h-16 w-16 border border-neutral-200 rounded-full bg-primary-900 flex items-center justify-center'>
                <h5 className='font-semibold text-white text-2xl leading-[140%] text-center'>{nameInitials}</h5>
              </div>
              <div className='flex flex-col items-start justify-center'>
                <p className='text-left text-base font-semibold leading-[150%] text-neutral-700'>Signed in as</p>
                <p className='text-left text-sm font-medium leading-[150%] text-neutral-400'>
                  {`${user.first_name} ${user.last_name}`}
                </p>
                <p className='text-left text-sm font-medium leading-[150%] text-neutral-400'>{`${user.email}`}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className='flex flex-col gap-2 p-3'>
            <p className='text-sm font-semibold leading-[130%] tracking-[120%] uppercase text-neutral-400'>
              Account Summary
            </p>
            <div className='flex flex-col gap-3'>
              <DropdownMenuItem key={'dashboard'} className='hover:bg-transparent text-black/70 hover:text-black'>
                <Link href={`${roleBasePath}/dashboard`}>{'Dashboard'}</Link>
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
    );
  }
}

export default TopNavigationBar;
