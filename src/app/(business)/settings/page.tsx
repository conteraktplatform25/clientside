import { ITabItem } from '@/type/client/default.type';
import React from 'react';
import TabSettings from './_component/TabSettings';
import BusinessProfileForm from './_component/BusinessProfileForm';
import ManageUserProfile from './_component/ManageUserProfile';
import ManageTags from './_component/ManageTags';

const BusinessSettingsPage = () => {
  const tabs: ITabItem[] = [
    {
      value: 'business_profile',
      label: 'Whatsapp Profile',
      content: <BusinessProfileForm />,
    },
    {
      value: 'user_role',
      label: 'User roles',
      content: <ManageUserProfile />,
    },
    {
      value: 'manage_tags',
      label: 'Manage tags',
      content: <ManageTags />,
    },
    {
      value: 'roles_permissions',
      label: 'Roles & permission',
      content: <p>Roles and permission section here</p>,
    },
  ];

  return (
    <div className='flex flex-col item-start gap-4 m-0'>
      {/* <TopNotification /> */}
      <div className='mt-2 px-12 flex flex-col gap-3'>
        <TabSettings tabs={tabs} />
      </div>
    </div>
  );
};

export default BusinessSettingsPage;
