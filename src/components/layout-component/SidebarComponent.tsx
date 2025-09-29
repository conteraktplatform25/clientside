'use client';
import React from 'react';
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
import { ConstAdminSideMenu as admin_side_menu } from '@/lib/constants/default.constant';
import SVGIcon from '@/components/custom/SVGIcons';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const SidebarComponent = () => {
  const { open } = useSidebar();
  const pathname = usePathname();

  console.log(open);
  return (
    <Sidebar variant='inset' collapsible='icon'>
      <SidebarInset>
        <SidebarHeader>
          <div className='flex gap-2 px-1'>
            <SVGIcon className='mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
            {open && <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className='gap-4'>
                {admin_side_menu.map((item) => {
                  const hasSubmenu = !!item.submenu;

                  if (hasSubmenu) {
                    // check if any submenu item matches current path
                    const submenuActive = item.submenu && item.submenu.some((sub_item) => pathname === sub_item.url);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <Collapsible
                          className='group/collapsible'
                          defaultOpen={submenuActive} // auto expand
                        >
                          <SidebarGroup className='p-0'>
                            <SidebarGroupLabel asChild>
                              <CollapsibleTrigger>
                                <p className='flex items-start gap-1'>
                                  <item.icon className='mt-1' width={16} height={16} />
                                  <span className='font-medium text-sm text-neutral-700 leading-[150%]'>
                                    {item.title}
                                  </span>
                                </p>
                                <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                              </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent className='px-4'>
                              <SidebarGroupContent>
                                <SidebarMenu className='gap-1'>
                                  {item.submenu &&
                                    item.submenu.map((sub_item) => {
                                      const isActive = pathname === sub_item.url;
                                      return (
                                        <SidebarMenuItem key={sub_item.title}>
                                          <SidebarMenuButton asChild>
                                            <Link
                                              href={sub_item.url}
                                              className={clsx(
                                                'font-medium text-base rounded-md px-2 py-1 transition-colors block',
                                                isActive
                                                  ? 'bg-[#F7FAFF] text-primary-base'
                                                  : 'text-neutral-700 hover:bg-transparent'
                                              )}
                                            >
                                              {sub_item.title}
                                            </Link>
                                          </SidebarMenuButton>
                                        </SidebarMenuItem>
                                      );
                                    })}
                                </SidebarMenu>
                              </SidebarGroupContent>
                            </CollapsibleContent>
                          </SidebarGroup>
                        </Collapsible>
                      </SidebarMenuItem>
                    );
                  }

                  // main menu item without submenu
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url!}
                          className={clsx(
                            'font-medium text-base rounded-md px-2 py-1 flex items-center gap-2 transition-colors',
                            isActive ? 'bg-[#F7FAFF] text-primary-base' : 'text-neutral-700 hover:bg-transparent'
                          )}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
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
