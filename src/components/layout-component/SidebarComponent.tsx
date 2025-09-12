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
} from '@/components/ui/sidebar';
import { ConstAdminSideMenu as admin_side_menu } from '@/lib/constants/default.constant';
import SVGIcon from '@/components/custom/SVGIcons';
import Link from 'next/link';

const SidebarComponent = () => {
  return (
    <Sidebar variant='inset' collapsible='icon'>
      <SidebarInset>
        <SidebarHeader>
          <div className='flex gap-2 px-1'>
            <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
            {/* <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div> */}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className='gap-4'>
                {admin_side_menu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </SidebarInset>
    </Sidebar>
  );
};

export default SidebarComponent;
