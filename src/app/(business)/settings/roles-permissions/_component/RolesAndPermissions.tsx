'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckboxIndeterminate } from '@/components/custom/CheckboxIndeterminate';

// Define the Zod schema, letting Zod infer its full type
const rolesAndPermissionsSchema = z.object({
  role: z.string(),
  contactHub: z.object({
    allowAccessContactHub: z.boolean(),
    allowExportContacts: z.boolean(),
    allowAddDeleteContacts: z.boolean(),
    allowBulkTagContacts: z.boolean(),
  }),
  inbox: z.object({
    allowAccessAllSections: z.boolean(),
    allowAccessUnassignedSection: z.boolean(),
  }),
  settings: z.object({
    allowAccessAgentSettings: z.boolean(),
    allowAccessApiKey: z.boolean(),
    allowAccessWhatsappBusinessSetup: z.boolean(),
  }),
});

export type TRolesAndPermissionsFormValues = z.infer<typeof rolesAndPermissionsSchema>;

const RolesAndPermissions: React.FC = () => {
  const { control, handleSubmit, watch, setValue } = useForm<TRolesAndPermissionsFormValues>({
    resolver: zodResolver(rolesAndPermissionsSchema),
    defaultValues: {
      role: 'owner',
      contactHub: {
        allowAccessContactHub: false,
        allowExportContacts: false,
        allowAddDeleteContacts: false,
        allowBulkTagContacts: false,
      },
      inbox: {
        allowAccessAllSections: false,
        allowAccessUnassignedSection: false,
      },
      settings: {
        allowAccessAgentSettings: false,
        allowAccessApiKey: false,
        allowAccessWhatsappBusinessSetup: false,
      },
    },
  });

  const onSubmit: SubmitHandler<TRolesAndPermissionsFormValues> = (data) => {
    console.log('Form Data:', data);
    toast.success('Permissions updated successfully!');
  };

  // Watch permission groups
  const contactHubPermissions = watch('contactHub');
  const allContactHubSelected = Object.values(contactHubPermissions).every(Boolean);
  const isContactHubIndeterminate = !allContactHubSelected && Object.values(contactHubPermissions).some(Boolean);

  const inboxPermissions = watch('inbox');
  const allInboxSelected = Object.values(inboxPermissions).every(Boolean);
  const isInboxIndeterminate = !allInboxSelected && Object.values(inboxPermissions).some(Boolean);

  const settingsPermissions = watch('settings');
  const allSettingsSelected = Object.values(settingsPermissions).every(Boolean);
  const isSettingsIndeterminate = !allSettingsSelected && Object.values(settingsPermissions).some(Boolean);

  // "Select all" handlers
  const handleSelectAllContactHub = (checked: boolean) => {
    setValue('contactHub.allowAccessContactHub', checked);
    setValue('contactHub.allowExportContacts', checked);
    setValue('contactHub.allowAddDeleteContacts', checked);
    setValue('contactHub.allowBulkTagContacts', checked);
  };

  const handleSelectAllInbox = (checked: boolean) => {
    setValue('inbox.allowAccessAllSections', checked);
    setValue('inbox.allowAccessUnassignedSection', checked);
  };

  const handleSelectAllSettings = (checked: boolean) => {
    setValue('settings.allowAccessAgentSettings', checked);
    setValue('settings.allowAccessApiKey', checked);
    setValue('settings.allowAccessWhatsappBusinessSetup', checked);
  };

  return (
    <div className='container p-4 max-w-2xl'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='font-medium text-xl leading-[150%] text-neutral-800'>Roles & permissions</h2>
        <div className='flex justify-end'>
          <Controller
            control={control}
            name='role'
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='owner'>Owner</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                  <SelectItem value='agent'>Agent</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* Contact Hub Section */}
        <div className='border-b pb-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>Contact Hub</h3>
            <div className='flex items-center space-x-2'>
              <CheckboxIndeterminate
                id='contactHub-select-all'
                checked={allContactHubSelected}
                onCheckedChange={handleSelectAllContactHub}
                indeterminate={isContactHubIndeterminate}
              />
              <Label htmlFor='contactHub-select-all'>Select all</Label>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pl-4'>
            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='contactHub.allowAccessContactHub'
                render={({ field }) => (
                  <Checkbox id='allowAccessContactHub' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowAccessContactHub'>Allow to access contact hub</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='contactHub.allowExportContacts'
                render={({ field }) => (
                  <Checkbox id='allowExportContacts' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowExportContacts'>Allow to export contacts</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='contactHub.allowAddDeleteContacts'
                render={({ field }) => (
                  <Checkbox id='allowAddDeleteContacts' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowAddDeleteContacts'>Allow to Add/Delete contacts</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='contactHub.allowBulkTagContacts'
                render={({ field }) => (
                  <Checkbox id='allowBulkTagContacts' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowBulkTagContacts'>Allow to bulk tag contacts</Label>
            </div>
          </div>
        </div>

        {/* Inbox Section */}
        <div className='border-b pb-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>Inbox</h3>
            <div className='flex items-center space-x-2'>
              <CheckboxIndeterminate
                id='inbox-select-all'
                checked={allInboxSelected}
                onCheckedChange={handleSelectAllInbox}
                indeterminate={isInboxIndeterminate}
              />
              <Label htmlFor='inbox-select-all'>Select all</Label>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pl-4'>
            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='inbox.allowAccessAllSections'
                render={({ field }) => (
                  <Checkbox id='allowAccessAllSections' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowAccessAllSections'>Allow access to all sections</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='inbox.allowAccessUnassignedSection'
                render={({ field }) => (
                  <Checkbox id='allowAccessUnassignedSection' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowAccessUnassignedSection'>Allow access to unassigned section</Label>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className='pb-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>Settings</h3>
            <div className='flex items-center space-x-2'>
              <CheckboxIndeterminate
                id='settings-select-all'
                checked={allSettingsSelected}
                onCheckedChange={handleSelectAllSettings}
                indeterminate={isSettingsIndeterminate}
              />
              <Label htmlFor='settings-select-all'>Select all</Label>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pl-4'>
            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='settings.allowAccessAgentSettings'
                render={({ field }) => (
                  <Checkbox id='allowAccessAgentSettings' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowAccessAgentSettings'>Allow access to agent settings</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='settings.allowAccessApiKey'
                render={({ field }) => (
                  <Checkbox id='allowAccessApiKey' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor='allowAccessApiKey'>Allow access to API key</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='settings.allowAccessWhatsappBusinessSetup'
                render={({ field }) => (
                  <Checkbox
                    id='allowAccessWhatsappBusinessSetup'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor='allowAccessWhatsappBusinessSetup'>Allow access to Whatsapp business setup</Label>
            </div>
          </div>
        </div>

        <Button type='submit' className='w-full md:w-auto'>
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default RolesAndPermissions;
