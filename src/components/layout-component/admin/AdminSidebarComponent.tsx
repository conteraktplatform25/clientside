'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
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
import { usePathname } from 'next/navigation';
import SVGIcon from '@/components/custom/SVGIcons';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BanknoteArrowDown, Building2, ChevronDown, Cog, SquareKanban, UserRound } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import clsx from 'clsx';

const AdminSidebarComponent = () => {
  const { open } = useSidebar();
  const pathname = usePathname();

  const [isPaymentFinancingOpen, setIsPaymentFinancingOpen] = useState(false);
  const [isSystemAdminOpen, setIsSystemAdminOpen] = useState(false);
  const [collapsedFinancePopoverOpen, setCollapsedFinancePopoverOpen] = useState(false);
  const [collapsedSysAdminPopoverOpen, setCollapsedSysAdminPopoverOpen] = useState(false);
  const financePopoverRef = useRef<HTMLDivElement | null>(null);
  const sysAdminPopoverRef = useRef<HTMLDivElement | null>(null);

  // close the collapsed popover when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (financePopoverRef.current && !financePopoverRef.current.contains(e.target as Node)) {
        setCollapsedFinancePopoverOpen(false);
      }
      if (sysAdminPopoverRef.current && !sysAdminPopoverRef.current.contains(e.target as Node)) {
        setCollapsedSysAdminPopoverOpen(false);
      }
    }
    if (collapsedFinancePopoverOpen) document.addEventListener('mousedown', onDocClick);
    if (collapsedSysAdminPopoverOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [collapsedFinancePopoverOpen, collapsedSysAdminPopoverOpen]);

  return (
    <Sidebar variant='inset' collapsible='icon' className='border-r border-[#EAECF2]'>
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
                      href={'/admin'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-base text-neutral-700 leading-[150%] transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/admin'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent'
                      )}
                    >
                      <SquareKanban />
                      <span>{'Dashboard'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/admin/registered-business'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-base text-neutral-700 leading-[150%] transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/admin/registered-business'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent'
                      )}
                    >
                      <Building2 />
                      <span>{'Business management'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={'/admin/customer-management'}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-base text-neutral-700 leading-[150%] transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === '/inbox'
                          ? 'bg-[#F7FAFF] text-primary-base'
                          : 'text-neutral-700 hover:bg-transparent'
                      )}
                    >
                      <UserRound />
                      <span>{'Customer management'}</span>
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
                    {open ? (
                      <Collapsible
                        open={isPaymentFinancingOpen}
                        onOpenChange={setIsPaymentFinancingOpen}
                        className='space-y-1 group/collapsible'
                      >
                        <SidebarGroup className='p-0'>
                          {/* Use asChild but ensure the trigger is a real button so it always receives clicks */}
                          <SidebarGroupLabel asChild>
                            <CollapsibleTrigger asChild>
                              <button
                                type='button'
                                className={clsx(
                                  'w-full flex items-center justify-between rounded-md px-3 py-2 font-semibold text-neutral-700 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                  pathname.startsWith('/admin/financials') ? 'bg-[#F7FAFF] text-primary-base' : ''
                                )}
                                aria-expanded={isPaymentFinancingOpen}
                              >
                                <div className='flex items-center gap-2 text-[14px] leading-[150%]'>
                                  <BanknoteArrowDown className='mt-0.5' width={16} height={16} />
                                  <span className='text-neutral-700'>Payments & financials</span>
                                </div>
                                <ChevronDown
                                  className={clsx(
                                    'ml-2 transition-transform',
                                    // Radix-like state class (if your Collapsible sets data-state)
                                    'group-data-[state=open]/collapsible:rotate-180'
                                  )}
                                  style={{ transform: isPaymentFinancingOpen ? 'rotate(180deg)' : 'none' }}
                                />
                              </button>
                            </CollapsibleTrigger>
                          </SidebarGroupLabel>

                          <CollapsibleContent className='px-8'>
                            <SidebarGroupContent>
                              <SidebarMenu className='gap-1'>
                                <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link
                                      href='/admin/financials/revenue'
                                      className={clsx(
                                        'font-medium text-sm rounded-md px-2 py-1 transition-colors block',
                                        pathname === '/admin/financials/revenue'
                                          ? 'bg-[#F7FAFF] text-primary-base'
                                          : 'text-neutral-700 hover:bg-transparent'
                                      )}
                                    >
                                      Revenue Dashboard
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link
                                      href='/admin/financials/transactions'
                                      className={clsx(
                                        'font-medium text-sm rounded-md px-2 py-1 transition-colors block',
                                        pathname === '/admin/financials/transactions'
                                          ? 'bg-[#F7FAFF] text-primary-base'
                                          : 'text-neutral-700 hover:bg-transparent'
                                      )}
                                    >
                                      Transactions
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
                      <div className='relative' ref={financePopoverRef}>
                        <button
                          type='button'
                          className={clsx(
                            'flex items-center justify-center w-10 h-10 rounded-md hover:bg-sidebar-accent focus:outline-none',
                            pathname.startsWith('/financials') ? 'bg-[#F7FAFF] text-primary-base' : 'text-neutral-700'
                          )}
                          onClick={() => setCollapsedFinancePopoverOpen((s) => !s)}
                          aria-expanded={collapsedFinancePopoverOpen}
                          aria-label='Payment Financials'
                        >
                          <BanknoteArrowDown width={16} height={16} />
                        </button>

                        {/* Popover that appears below the icon — adjust position/styling as needed */}
                        {collapsedFinancePopoverOpen && (
                          <div
                            className='absolute left-full top-0 ml-2 w-52 rounded-md shadow-lg z-50 bg-white ring-1 ring-black/5'
                            role='menu'
                          >
                            <div className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                              Payments & financials
                            </div>
                            <div className='px-2 pb-2'>
                              <Link
                                href='/financials/revenue-profile'
                                onClick={() => setCollapsedFinancePopoverOpen(false)}
                                className={clsx(
                                  'block rounded-md px-2 py-2 text-sm font-medium',
                                  pathname === '/financials/revenue-profile'
                                    ? 'bg-[#F7FAFF] text-primary-base'
                                    : 'text-neutral-700 hover:bg-sidebar-accent'
                                )}
                              >
                                Revenue Dashboard
                              </Link>
                              <Link
                                href='/messaging/broadcast'
                                onClick={() => setCollapsedFinancePopoverOpen(false)}
                                className={clsx(
                                  'block rounded-md px-2 py-2 text-sm font-medium mt-1',
                                  pathname === '/financials/transactions'
                                    ? 'bg-[#F7FAFF] text-primary-base'
                                    : 'text-neutral-700 hover:bg-sidebar-accent'
                                )}
                              >
                                Transactions
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    {open ? (
                      <Collapsible
                        open={isSystemAdminOpen}
                        onOpenChange={setIsSystemAdminOpen}
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
                                  pathname.startsWith('/admin/system') ? 'bg-[#F7FAFF] text-primary-base' : ''
                                )}
                                aria-expanded={isSystemAdminOpen}
                              >
                                <div className='flex items-center gap-3'>
                                  <Cog className='mt-0.5' width={16} height={16} />
                                  <span className='font-semibold text-sm leading-[150%] text-neutral-700'>
                                    System administration
                                  </span>
                                </div>
                                <ChevronDown
                                  className={clsx(
                                    'ml-2 transition-transform',
                                    'group-data-[state=open]/collapsible:rotate-180'
                                  )}
                                  style={{ transform: isSystemAdminOpen ? 'rotate(180deg)' : 'none' }}
                                />
                              </button>
                            </CollapsibleTrigger>
                          </SidebarGroupLabel>

                          <CollapsibleContent className='px-8'>
                            <SidebarGroupContent>
                              <SidebarMenu className='gap-1'>
                                <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link
                                      href='/admin/system/user'
                                      className={clsx(
                                        'font-medium text-base rounded-md px-2 py-1 transition-colors block',
                                        pathname === '/sysadmin/users'
                                          ? 'text-primary-base'
                                          : 'text-neutral-700 hover:bg-transparent'
                                      )}
                                    >
                                      Admin users
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link
                                      href='/sysadmin/settings'
                                      className={clsx(
                                        'font-medium text-base rounded-md px-2 py-1 transition-colors block',
                                        pathname === '/sysadmin/settings'
                                          ? 'bg-[#F7FAFF] text-primary-base'
                                          : 'text-neutral-700 hover:bg-transparent'
                                      )}
                                    >
                                      System settings
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
                      <div className='relative' ref={financePopoverRef}>
                        <button
                          type='button'
                          className={clsx(
                            'flex items-center justify-center w-10 h-10 rounded-md hover:bg-sidebar-accent focus:outline-none',
                            pathname.startsWith('/financials') ? 'bg-[#F7FAFF] text-primary-base' : 'text-neutral-700'
                          )}
                          onClick={() => setCollapsedFinancePopoverOpen((s) => !s)}
                          aria-expanded={collapsedFinancePopoverOpen}
                          aria-label='Automated Messaging'
                        >
                          <BanknoteArrowDown width={16} height={16} />
                        </button>

                        {/* Popover that appears below the icon — adjust position/styling as needed */}
                        {collapsedFinancePopoverOpen && (
                          <div
                            className='absolute left-full top-0 ml-2 w-52 rounded-md shadow-lg z-50 bg-white ring-1 ring-black/5'
                            role='menu'
                          >
                            <div className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                              Payments & financials
                            </div>
                            <div className='px-2 pb-2'>
                              <Link
                                href='/financials/revenue-profile'
                                onClick={() => setCollapsedFinancePopoverOpen(false)}
                                className={clsx(
                                  'block rounded-md px-2 py-2 text-sm font-medium',
                                  pathname === '/financials/revenue-profile'
                                    ? 'bg-[#F7FAFF] text-primary-base'
                                    : 'text-neutral-700 hover:bg-sidebar-accent'
                                )}
                              >
                                Revenue Dashboard
                              </Link>
                              <Link
                                href='/messaging/broadcast'
                                onClick={() => setCollapsedFinancePopoverOpen(false)}
                                className={clsx(
                                  'block rounded-md px-2 py-2 text-sm font-medium mt-1',
                                  pathname === '/financials/transactions'
                                    ? 'bg-[#F7FAFF] text-primary-base'
                                    : 'text-neutral-700 hover:bg-sidebar-accent'
                                )}
                              >
                                Transactions
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarInset>
    </Sidebar>
  );
};

export default AdminSidebarComponent;
