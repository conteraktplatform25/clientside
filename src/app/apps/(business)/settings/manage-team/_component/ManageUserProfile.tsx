import { DataTableField } from '@/components/custom/DataTableField';
import React from 'react';
import { ManageUserTableHeader } from './table/ManageUserTableHeader';
import { ConstUserProfile as profile } from '@/lib/constants/settings.constant';
import AddUserProfile from './table/AddUserProfile';

const ManageUserProfile = () => {
  return (
    <DataTableField columns={ManageUserTableHeader} data={profile} title='Manage User Roles'>
      <AddUserProfile />
    </DataTableField>
  );
};

export default ManageUserProfile;
