import { ITabItem } from '@/type/client/default.type';
import React from 'react';
import TabSettings from './_component/TabSettings';
import BusinessProfileForm from './_component/BusinessProfileForm';
import ManageUserProfile from './_component/ManageUserProfile';
import ManageTags from './_component/ManageTags';
import RolesAndPermissions from './_component/RolesAndPermissions';

const BusinessSettingsPage = () => {
  const tabs: ITabItem[] = [
    {
      value: 'business_profile',
      label: 'Business Profile',
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
      content: <RolesAndPermissions />,
    },
  ];

  return (
    <div className='flex flex-col item-start gap-4 m-0'>
      <div className='mt-4 px-12 flex flex-col gap-3'>
        <TabSettings tabs={tabs} />
      </div>
    </div>
  );
};

export default BusinessSettingsPage;
