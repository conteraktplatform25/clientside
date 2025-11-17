'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Edit2, X } from 'lucide-react';
import { TCreateContact, useCreateContact } from '@/lib/hooks/business/contact.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientCreateContactSchema, TClientCreateContact } from '@/lib/schemas/business/client/contact.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import InputField from '@/components/custom/InputField';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import { ContactSource } from '@prisma/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';

interface CreateContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

export type CustomField =
  | { key: string; type: 'text'; value: string }
  | { key: string; type: 'number'; value: number }
  | { key: string; type: 'date'; value: string } // dates as ISO strings
  | { key: string; type: 'boolean'; value: boolean };
export type CustomFieldType = CustomField['type'];

const CUSTOM_FIELD_TYPES: CustomFieldType[] = ['text', 'number', 'date', 'boolean'];

// ----------- Async phone check -----------
async function checkPhoneExists(phone: string) {
  const res = await fetchWithIndicatorHook(`/api/contacts/phone-number?phone=${phone}`);
  const data = await res.json();
  return data.id;
}

export function CreateContactDrawer({ open, onClose }: CreateContactDrawerProps) {
  const [tag, setTag] = useState<string>(ContactSource.MANUAL);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newField, setNewField] = useState<CustomField>({ key: '', type: 'text', value: '' });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [newKeyError, setNewKeyError] = useState<string | null>(null);
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const form = useForm<TClientCreateContact>({
    resolver: zodResolver(ClientCreateContactSchema),
    defaultValues: {
      name: '',
      phone_number: '',
      email: '',
      whatsapp_opt_in: true,
      custom_fields: {},
      source: ContactSource.MANUAL,
    },
  });

  /* ----------------------------- Tags ----------------------------- */
  const availableTags = Object.values(ContactSource) as string[];
  const toggleTag = (selected: string) => setTag((prev) => (prev === selected ? ContactSource.MANUAL : selected));

  /* ------------------------- Custom Fields ------------------------- */
  // ----------- Custom Fields Management -----------
  const addCustomField = () => {
    if (!newKey.trim()) {
      setNewKeyError('Key is required');
      return;
    }

    if (customFields.some((f) => f.key === newKey.trim())) {
      setNewKeyError('Duplicate key');
      return;
    }

    setNewKeyError(null);

    let fieldToAdd: CustomField;

    switch (newField.type) {
      case 'text':
        fieldToAdd = { key: newKey.trim(), type: 'text', value: String(newField.value) };
        break;
      case 'number':
        fieldToAdd = { key: newKey.trim(), type: 'number', value: Number(newField.value) };
        break;
      case 'date':
        fieldToAdd = { key: newKey.trim(), type: 'date', value: String(newField.value) };
        break;
      case 'boolean':
        fieldToAdd = { key: newKey.trim(), type: 'boolean', value: Boolean(newField.value) };
        break;
    }

    setCustomFields([...customFields, fieldToAdd]);

    const current = form.getValues('custom_fields') ?? {};
    form.setValue('custom_fields', { ...current, [fieldToAdd.key]: fieldToAdd });

    setNewKey('');
    setNewField({ key: '', type: 'text', value: '' });
  };

  const startEditField = (key: string) => {
    const field = customFields.find((f) => f.key === key);
    if (!field) return;

    setEditingKey(key);
    setEditingField({ ...field });
  };

  const saveEditField = () => {
    if (!editingKey || !editingField) return;

    // Update local state
    const updated = customFields.map((f) => (f.key === editingKey ? editingField : f));
    setCustomFields(updated);

    const current = form.getValues('custom_fields') ?? {};
    form.setValue('custom_fields', { ...current, [editingKey]: editingField });

    setEditingKey(null);
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditingField(null);
  };

  const removeCustomField = (key: string) => {
    setCustomFields(customFields.filter((f) => f.key !== key));

    const current = form.getValues('custom_fields') ?? {};
    const next = { ...current };
    delete next[key];
    form.setValue('custom_fields', next);
  };

  const createContact = useCreateContact();

  const onSubmit = async (data: TClientCreateContact) => {
    // Build server payload respecting types
    const serverContact: TCreateContact = {
      name: data.name,
      phone_number: data.phone_number,
      email: data.email,
      whatsapp_opt_in: data.whatsapp_opt_in,
      source: tag,
      custom_fields: (data.custom_fields ?? {}) as Record<string, CustomField>,
    };

    createContact.mutate(serverContact);
    setAlert({
      type: 'success',
      title: 'Registration Successful',
      description: 'Contact Profile Created!',
    });
    form.reset();
    setCustomFields([]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className='fixed inset-0 bg-black/40 z-40'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className='fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 flex flex-col'
          >
            {/* Header */}
            <div className='flex items-center justify-between border-b px-6 py-4'>
              <h2 className='font-medium text-base leading-[150%] text-neutral-700'>Create contacts</h2>
              <Button variant='ghost' size='icon' onClick={onClose} className='w-8 h-8 bg-[#F3F4F6] p-1.5 rounded-full'>
                <X className='w-5 h-5' />
              </Button>
            </div>

            {/* Tag Selector */}
            <div className='flex items-start justify-between py-4 px-6'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' size='sm'>
                    Select Tags
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-48 space-y-2'>
                  {availableTags.map((t) => (
                    <div
                      key={t}
                      className='flex items-center justify-between cursor-pointer'
                      onClick={() => toggleTag(t)}
                    >
                      <span>{t}</span>
                      {tag === t && <Check size={16} />}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>

              <div className='flex gap-2 flex-wrap'>{tag && <Badge key={tag}>{tag}</Badge>}</div>
            </div>

            {alert.type && (
              <div className='px-4'>
                <AlertDisplayField
                  type={alert.type}
                  title={alert.title || ''}
                  description={alert.description}
                  onClose={() => setAlert({ type: null, description: '', title: '' })}
                />
              </div>
            )}

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex-1 overflow-y-auto px-6 space-y-4 text-neutral-700'
              >
                {/* Name */}
                <InputField<TClientCreateContact>
                  control={form.control}
                  name='name'
                  label='Contact Name'
                  placeholder='Contact full name'
                  important
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name='phone_number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry='NG'
                          value={field.value}
                          onChange={async (val) => {
                            field.onChange(val);
                            if (val) {
                              const exists = await checkPhoneExists(val);
                              if (exists) form.setError('phone_number', { message: 'Phone number already exists' });
                              else form.clearErrors('phone_number');
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <InputField<TClientCreateContact>
                  type='email'
                  control={form.control}
                  name='email'
                  label='Email (Optional)'
                  placeholder='e.g. example@mail.com'
                />

                {/* WhatsApp Opt-in */}
                <FormField
                  control={form.control}
                  name='whatsapp_opt_in'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <FormLabel>WhatsApp Opt-in</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Custom Fields */}
                <div className='space-y-4 pt-2'>
                  <h3 className='text-base leading-[155%]'>Additional Information</h3>

                  {/* Existing Fields */}
                  {customFields.map((f) => (
                    <div key={f.key} className='flex items-center justify-between border p-2 rounded-md'>
                      <div className='flex-1'>
                        <div className='font-medium'>{f.key}</div>
                        <div className='text-sm text-neutral-500'>{String(f.value)}</div>
                        <div className='text-xs text-neutral-400'>Type: {f.type}</div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button size='sm' variant='ghost' onClick={() => startEditField(f.key)}>
                          <Edit2 />
                        </Button>
                        <Button size='sm' variant='destructive' onClick={() => removeCustomField(f.key)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Edit Row */}
                  {editingKey && editingField && (
                    <div className='flex gap-2 items-center'>
                      <div className='w-36'>
                        <div className='text-xs text-neutral-500'>Editing: {editingKey}</div>
                      </div>

                      <select
                        className='border rounded-md px-2 text-sm'
                        value={editingField.type}
                        onChange={(e) => {
                          const newType = e.target.value as CustomFieldType;
                          let defaultValue: string | number | boolean = '';
                          if (newType === 'number') defaultValue = 0;
                          if (newType === 'boolean') defaultValue = false;
                          setEditingField({ key: editingKey, type: newType, value: defaultValue } as CustomField);
                        }}
                      >
                        {CUSTOM_FIELD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      {/* Value Input */}
                      {editingField.type === 'text' && (
                        <Input
                          value={editingField.value}
                          onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        />
                      )}
                      {editingField.type === 'number' && (
                        <Input
                          type='number'
                          value={editingField.value.toString()}
                          onChange={(e) => setEditingField({ ...editingField, value: Number(e.target.value) })}
                        />
                      )}
                      {editingField.type === 'date' && (
                        <Input
                          type='date'
                          value={editingField.value}
                          onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                        />
                      )}
                      {editingField.type === 'boolean' && (
                        <Switch
                          checked={editingField.value}
                          onCheckedChange={(v) => setEditingField({ ...editingField, value: v })}
                        />
                      )}

                      <Button type='button' size='sm' onClick={saveEditField}>
                        Save
                      </Button>
                      <Button type='button' size='sm' variant='outline' onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Add New Field Row */}
                  <div className='flex gap-2'>
                    <div className='w-36'>
                      <Input placeholder='Key' value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                      {newKeyError && <div className='text-xs text-red-500'>{newKeyError}</div>}
                    </div>

                    <select
                      className='border rounded-md px-2 text-sm'
                      value={newField.type}
                      onChange={(e) => {
                        const newType = e.target.value as CustomFieldType;
                        let defaultValue: string | number | boolean = '';
                        if (newType === 'number') defaultValue = 0;
                        if (newType === 'boolean') defaultValue = false;
                        setNewField({ key: '', type: newType, value: defaultValue } as CustomField);
                      }}
                    >
                      {CUSTOM_FIELD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    {/* Value Input */}
                    {newField.type === 'text' && (
                      <Input
                        placeholder='Value'
                        value={newField.value}
                        onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                      />
                    )}
                    {newField.type === 'number' && (
                      <Input
                        type='number'
                        placeholder='Value'
                        value={newField.value.toString()}
                        onChange={(e) => setNewField({ ...newField, value: Number(e.target.value) })}
                      />
                    )}
                    {newField.type === 'date' && (
                      <Input
                        type='date'
                        placeholder='Value'
                        value={newField.value}
                        onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                      />
                    )}
                    {newField.type === 'boolean' && (
                      <Switch
                        checked={newField.value as boolean}
                        onCheckedChange={(v) => setNewField({ ...newField, value: v })}
                      />
                    )}

                    <Button type='button' className='text-white bg-gray-500 hover:bg-gray-700' onClick={addCustomField}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-2 pt-5'>
                  <Button type='button' variant='outline' onClick={onClose} disabled={createContact.isPending}>
                    Cancel
                  </Button>
                  <Button
                    variant='ghost'
                    type='submit'
                    className='mb-8 text-white bg-primary-base hover:bg-primary-700'
                    disabled={createContact.isPending}
                  >
                    {createContact.isPending ? 'Saving...' : 'Create Contact'}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
