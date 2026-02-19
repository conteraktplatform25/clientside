'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import SVGIcon from '@/components/custom/SVGIcons';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Bolt,
  ChevronDown,
  House,
  Mail,
  Megaphone,
  NotepadText,
  Settings,
  ShoppingCart,
  UserRound,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@reactuses/core';

const SidebarComponent = () => {
  const { open } = useSidebar();
  const pathname = usePathname();
  const [isAutomatedMessagingOpen, setIsAutomatedMessagingOpen] = useState(false);
  const [collapsedPopoverOpen, setCollapsedPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)', false);

  // close the collapsed popover when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setCollapsedPopoverOpen(false);
      }
    }
    if (collapsedPopoverOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [collapsedPopoverOpen]);
  return (
    <Sidebar variant='inset' collapsible='icon' className='border-r border-[#EAECF2]'>
      <SidebarInset>
        <SidebarHeader>
          <div className='flex gap-2 px-1'>
            <Link href={'/'}>
              <div className='flex gap-2'>
                <SVGIcon
                  className=' mt-1.5'
                  fileName='icon-logo.svg'
                  alt='Concakt Logo'
                  width={isMobile ? 29.39 : 45.89}
                  height={32.58}
                />
                {open && <div className='mt-1 text-neutral-800 text-3xl font-semibold tracking-tight'>contakt</div>}
              </div>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className='flex flex-col max-h-[85vh]'>
          <SidebarGroup className='flex-1'>
            <SidebarGroupContent>
              <SidebarMenu className='gap-3'>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/apps/dashboard'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname.includes('/dashboard')
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent',
                      )}
                    >
                      <House />
                      <span>{'Home'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/apps/inbox'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname.includes('/inbox')
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent',
                      )}
                    >
                      <Mail />
                      <span>{'Inbox'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/apps/orders'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname.includes('/orders')
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent',
                      )}
                    >
                      <ShoppingCart />
                      <span>{'Orders'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  {/* EXPANDED SIDEBAR: use your Collapsible normally */}
                  {open ? (
                    <Collapsible
                      open={isAutomatedMessagingOpen}
                      onOpenChange={setIsAutomatedMessagingOpen}
                      className='space-y-1 group/collapsible'
                    >
                      <SidebarGroup className='p-0'>
                        {/* Use asChild but ensure the trigger is a real button so it always receives clicks */}
                        <SidebarGroupLabel asChild>
                          <CollapsibleTrigger asChild>
                            <button
                              type='button'
                              className={clsx(
                                'w-full flex items-center justify-between rounded-md px-3 py-2 font-medium text-sm text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                pathname.startsWith('/apps/messaging') ? 'bg-[#F7FAFF] text-primary-base' : '',
                              )}
                              aria-expanded={isAutomatedMessagingOpen}
                            >
                              <div className='flex items-center gap-3'>
                                <Megaphone className='mt-0.5' width={16} height={16} />
                                <span className='font-medium text-sm text-neutral-700 leading-[150%]'>
                                  Automated Messaging
                                </span>
                              </div>
                              <ChevronDown
                                className={clsx(
                                  'ml-2 transition-transform',
                                  // Radix-like state class (if your Collapsible sets data-state)
                                  'group-data-[state=open]/collapsible:rotate-180',
                                )}
                                style={{ transform: isAutomatedMessagingOpen ? 'rotate(180deg)' : 'none' }}
                              />
                            </button>
                          </CollapsibleTrigger>
                        </SidebarGroupLabel>

                        <CollapsibleContent className='px-4'>
                          <SidebarGroupContent>
                            <SidebarMenu className='gap-1'>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href='/apps/messaging/quick-reply'
                                    className={clsx(
                                      'font-medium text-base rounded-md px-2 py-1 transition-colors block',
                                      pathname.includes('/quick-reply')
                                        ? 'bg-[#F7FAFF] text-primary-base'
                                        : 'text-neutral-700 hover:bg-transparent',
                                    )}
                                  >
                                    Quick reply
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href='/apps/messaging/broadcast'
                                    className={clsx(
                                      'font-medium text-base rounded-md px-2 py-1 transition-colors block',
                                      pathname.includes('/broadcast')
                                        ? 'bg-[#F7FAFF] text-primary-base'
                                        : 'text-neutral-700 hover:bg-transparent',
                                    )}
                                  >
                                    Broadcast messages
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </SidebarMenu>
                          </SidebarGroupContent>
                        </CollapsibleContent>
                      </SidebarGroup>
                    </Collapsible>
                  ) : (
                    /* COLLAPSED SIDEBAR: show icon-only button that toggles a small popover */
                    <div className='relative' ref={popoverRef}>
                      <button
                        type='button'
                        className={clsx(
                          'flex items-center justify-center w-10 h-10 rounded-md hover:bg-sidebar-accent focus:outline-none',
                          pathname.startsWith('/apps/messaging')
                            ? 'bg-[#F7FAFF] text-primary-base'
                            : 'text-neutral-700',
                        )}
                        onClick={() => setCollapsedPopoverOpen((s) => !s)}
                        aria-expanded={collapsedPopoverOpen}
                        aria-label='Automated Messaging'
                      >
                        <Megaphone width={16} height={16} />
                      </button>

                      {/* Popover that appears below the icon — adjust position/styling as needed */}
                      {collapsedPopoverOpen && (
                        <div
                          className='absolute left-full top-0 ml-2 w-52 rounded-md shadow-lg z-50 bg-white ring-1 ring-black/5'
                          role='menu'
                        >
                          <div className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                            Automated Messaging
                          </div>
                          <div className='px-2 pb-2'>
                            <Link
                              href='/apps/messaging/quick-reply'
                              onClick={() => setCollapsedPopoverOpen(false)}
                              className={clsx(
                                'block rounded-md px-2 py-2 text-sm font-medium',
                                pathname.includes('/messaging/quick-reply')
                                  ? 'bg-[#F7FAFF] text-primary-base'
                                  : 'text-neutral-700 hover:bg-sidebar-accent',
                              )}
                            >
                              Quick reply
                            </Link>
                            <Link
                              href='/apps/messaging/broadcast'
                              onClick={() => setCollapsedPopoverOpen(false)}
                              className={clsx(
                                'block rounded-md px-2 py-2 text-sm font-medium mt-1',
                                pathname.includes('/messaging/broadcast')
                                  ? 'bg-[#F7FAFF] text-primary-base'
                                  : 'text-neutral-700 hover:bg-sidebar-accent',
                              )}
                            >
                              Broadcast messages
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/apps/contacts'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname.includes('/contacts')
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent',
                      )}
                    >
                      <UserRound />
                      <span>{'Contacts'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/apps/integration'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/Integration'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent',
                      )}
                    >
                      <Bolt />
                      <span>{'Integrations'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupContent className='mt-auto'>
              <div className='space-y-1'>
                {open && <h3 className='px-2 py-2 text-xs font-semibold uppercase text-gray-500'>OTHERS</h3>}

                <SidebarMenu className='gap-3'>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href={'/apps/catalogue-sharing'}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          pathname.includes('/catalogue-sharing')
                            ? 'bg-[#F7FAFF] text-primary-base'
                            : 'text-neutral-700 hover:bg-transparent',
                        )}
                      >
                        <NotepadText />
                        <span>{'Catalogue Sharing'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href={'/apps/settings/user-profile'}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          pathname.includes('/settings')
                            ? 'bg-[#F7FAFF] text-primary-base'
                            : 'text-neutral-700 hover:bg-transparent',
                        )}
                      >
                        <Settings />
                        <span>{'Settings'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </SidebarInset>
    </Sidebar>
  );
};

export default SidebarComponent;
