'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ICustomTabPanelProps } from '@/type/client/default.type';

const TabSettings: React.FC<ICustomTabPanelProps> = ({ tabs }) => {
  const firstTabValue = tabs[0]?.value || '';
  const [activeTab, setActiveTab] = useState<string>(firstTabValue || 'business_profile');

  return (
    <Tabs
      value={activeTab}
      defaultValue={firstTabValue}
      onValueChange={setActiveTab}
      className='relative w-full rounded-none shadow-none border-none'
    >
      <TabsList className='bg-[#F3F4F6] max-w-2xl border shadow-2xl rounded-[10px] p-1 flex flex-wrap md:flex-nowrap w-full justify-start gap-2 overflow-x-auto'>
        {tabs.map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className='text-base cursor-pointer text-neutral-base hover:bg-gray-50 data-[state=active]:bg-white data-[state=active]:text-primary-base hover:data-[state=active]:cursor-default'
          >
            <div className='flex gap-2 items-center justify-center w-full'>
              <span className='text-sm leading-5 text-center'>{label}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent className='py-2' key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabSettings;
