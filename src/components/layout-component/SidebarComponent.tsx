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

const SidebarComponent = () => {
  const { open } = useSidebar();
  const pathname = usePathname();
  const [isAutomatedMessagingOpen, setIsAutomatedMessagingOpen] = useState(false);
  const [collapsedPopoverOpen, setCollapsedPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

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
    <Sidebar variant='inset' collapsible='icon'>
      <SidebarInset>
        <SidebarHeader>
          <div className='flex gap-2 px-1'>
            <SVGIcon className='mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
            {open && <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>}
          </div>
        </SidebarHeader>
        <SidebarContent className='flex flex-col max-h-[85vh]'>
          <SidebarGroup className='flex-1'>
            <SidebarGroupContent>
              <SidebarMenu className='gap-3'>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/' ? 'bg-[#F7FAFF] text-primary-base' : 'text-neutral-700 hover:bg-transparent'
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
                      href={'/inbox'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/inbox'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent'
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
                      href={'/orders'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/orders'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent'
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
                                pathname.startsWith('/messaging') ? 'bg-[#F7FAFF] text-primary-base' : ''
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
                                  'group-data-[state=open]/collapsible:rotate-180'
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
                                    href='/messaging/quick-reply'
                                    className={clsx(
                                      'font-medium text-base rounded-md px-2 py-1 transition-colors block',
                                      pathname === '/messaging/quick-reply'
                                        ? 'bg-[#F7FAFF] text-primary-base'
                                        : 'text-neutral-700 hover:bg-transparent'
                                    )}
                                  >
                                    Quick reply
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href='/messaging/broadcast'
                                    className={clsx(
                                      'font-medium text-base rounded-md px-2 py-1 transition-colors block',
                                      pathname === '/messaging/broadcast'
                                        ? 'bg-[#F7FAFF] text-primary-base'
                                        : 'text-neutral-700 hover:bg-transparent'
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
                          pathname.startsWith('/messaging') ? 'bg-[#F7FAFF] text-primary-base' : 'text-neutral-700'
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
                              href='/messaging/quick-reply'
                              onClick={() => setCollapsedPopoverOpen(false)}
                              className={clsx(
                                'block rounded-md px-2 py-2 text-sm font-medium',
                                pathname === '/messaging/quick-reply'
                                  ? 'bg-[#F7FAFF] text-primary-base'
                                  : 'text-neutral-700 hover:bg-sidebar-accent'
                              )}
                            >
                              Quick reply
                            </Link>
                            <Link
                              href='/messaging/broadcast'
                              onClick={() => setCollapsedPopoverOpen(false)}
                              className={clsx(
                                'block rounded-md px-2 py-2 text-sm font-medium mt-1',
                                pathname === '/messaging/broadcast'
                                  ? 'bg-[#F7FAFF] text-primary-base'
                                  : 'text-neutral-700 hover:bg-sidebar-accent'
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
                      href={'/contacts'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/contacts'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent'
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
                      href={'/integration'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/Integration'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent'
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
                        href={'/catalogue-sharing'}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          pathname === '/catalogue-sharing'
                            ? 'bg-[#F7FAFF] text-primary-base'
                            : 'text-neutral-700 hover:bg-transparent'
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
                        href={'/settings'}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          pathname === '/settings'
                            ? 'bg-[#F7FAFF] text-primary-base'
                            : 'text-neutral-700 hover:bg-transparent'
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
  // return (
  //   <Sidebar variant='inset' collapsible='icon'>
  //     <SidebarInset>
  //       <SidebarHeader>
  //         <div className='flex gap-2 px-1'>
  //           <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
  //           {open && <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>}
  //         </div>
  //       </SidebarHeader>
  //       <SidebarContent>
  //         <SidebarGroup>
  //           <SidebarGroupContent>
  //             <SidebarMenu className='gap-4'>
  //               {admin_side_menu.map((item) => (
  //                 <SidebarMenuItem key={item.title}>
  //                   {item.submenu ? (
  //                     <Collapsible className='group/collapsible'>
  //                       <SidebarGroup className='p-0'>
  //                         <SidebarGroupLabel asChild>
  //                           <CollapsibleTrigger>
  //                             <p className='flex items-start gap-1'>
  //                               <item.icon className='mt-1' width={16} height={16} />
  //                               <span className='font-medium text-sm text-neutral-700 leading-[150%]'>
  //                                 {item.title}
  //                               </span>
  //                             </p>
  //                             <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
  //                           </CollapsibleTrigger>
  //                         </SidebarGroupLabel>
  //                         <CollapsibleContent className='px-4'>
  //                           <SidebarGroupContent>
  //                             <SidebarMenu className='gap-1'>
  //                               {item.submenu.map((sub_item) => {
  //                                 const isActive = pathname === sub_item.url;
  //                                 return (
  //                                   <SidebarMenuItem key={sub_item.title}>
  //                                     <SidebarMenuButton asChild>
  //                                       <Link
  //                                         href={sub_item.url}
  //                                         className={clsx(
  //                                           'font-medium text-base rounded-md px-2 py-1 transition-colors',
  //                                           isActive
  //                                             ? 'bg-[#F7FAFF] text-primary-base'
  //                                             : 'text-neutral-700 hover:bg-transparent'
  //                                         )}
  //                                       >
  //                                         <span>{sub_item.title}</span>
  //                                       </Link>
  //                                     </SidebarMenuButton>
  //                                   </SidebarMenuItem>
  //                                 );
  //                               })}
  //                             </SidebarMenu>
  //                           </SidebarGroupContent>
  //                         </CollapsibleContent>
  //                       </SidebarGroup>
  //                     </Collapsible>
  //                   ) : (
  //                     (() => {
  //                       const isActive = pathname === item.url;
  //                       return (
  //                         <SidebarMenuButton asChild>
  //                           <Link
  //                             href={item.url!}
  //                             className={clsx(
  //                               'font-medium text-base rounded-md px-2 py-1 flex items-center gap-2 transition-colors',
  //                               isActive ? 'bg-[#F7FAFF] text-primary-base' : 'text-neutral-700 hover:bg-transparent'
  //                             )}
  //                           >
  //                             <item.icon />
  //                             <span>{item.title}</span>
  //                           </Link>
  //                         </SidebarMenuButton>
  //                       );
  //                     })()
  //                   )}
  //                 </SidebarMenuItem>
  //               ))}
  //             </SidebarMenu>
  //           </SidebarGroupContent>
  //         </SidebarGroup>
  //       </SidebarContent>
  //       <SidebarFooter />
  //     </SidebarInset>
  //   </Sidebar>
  // );
};

export default SidebarComponent;
