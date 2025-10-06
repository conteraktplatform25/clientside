'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { z } from 'zod';
import { Label } from '@/components/ui/label';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.email().optional(),
  totalSpent: z.string().optional(),
  lastOrderId: z.string().optional(),
});

interface CreateContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContactDrawer({ open, onClose }: CreateContactDrawerProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    totalSpent: '',
    lastOrderId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }
    console.log('Submitting Contact:', formData);
    onClose();
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

            {/* Form */}
            <form onSubmit={handleSubmit} className='flex-1 overflow-y-auto p-6 space-y-4 text-neutral-700'>
              {/* Bulk upload */}
              <Label className='font-medium text-base leading-[150%]'>Create via bulk upload</Label>
              <div className='border border-dashed rounded-lg p-6 text-center'>
                <div className='space-y-0.5'>
                  <p className='font-medium text-sm leading-[155%]'>Select a CSV file to upload</p>
                  <span className='font-medium text-xs leading-[155%] text-neutral-400 text-center'>
                    or drag and drop it here
                  </span>
                </div>
                <input type='file' className='hidden' id='csv-upload' />
                <label
                  htmlFor='csv-upload'
                  className='mt-2 inline-block rounded-[6px] border border-[#EAECF2] hover:bg-gray-100 py-1 px-3 cursor-pointer text-xs font-semibold leading-[155%] text-gray-800'
                >
                  Browse
                </label>
              </div>

              <div className='flex items-center justify-center'>
                <span className='text-neutral-400 leading-[155%] text-sm'>OR</span>
              </div>

              {/* Inputs */}
              <div className='space-y-0.5'>
                <div className='inline-flex space-x-1'>
                  <label className='text-sm font-medium'>First name</label>
                  <span className='text-error-600 text-base'>*</span>
                </div>
                <Input name='firstName' value={formData.firstName} onChange={handleChange} />
              </div>

              <div className='space-y-0.5'>
                <div className='inline-flex space-x-1'>
                  <label className='text-sm font-medium'>Last name</label>
                  <span className='text-error-600 text-base'>*</span>
                </div>
                <Input name='lastName' value={formData.lastName} onChange={handleChange} />
              </div>

              <div className='space-y-0.5'>
                <div className='inline-flex space-x-1'>
                  <label className='text-sm font-medium'>Phone number</label>
                  <span className='text-error-600 text-base'>*</span>
                </div>
                <Input name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} />
              </div>

              <div className='space-y-0.5'>
                <label className='text-sm font-medium'>Email</label>
                <Input name='email' value={formData.email} onChange={handleChange} />
              </div>

              <div className='space-y-0.5'>
                <label className='text-sm font-medium'>Total spent</label>
                <Input name='totalSpent' value={formData.totalSpent} onChange={handleChange} />
              </div>

              <div className='space-y-0.5'>
                <label className='text-sm font-medium'>Last order ID</label>
                <Input name='lastOrderId' value={formData.lastOrderId} onChange={handleChange} />
              </div>

              {/* Actions */}
              <div className='flex justify-end gap-2 pt-6'>
                <Button type='button' variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button type='submit' className='bg-blue-600 text-white hover:bg-blue-700'>
                  Save
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
