'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { QuickReplyCategory } from '@prisma/client';
import { UpdateQuickReplyRequestSchema } from '@/lib/schemas/business/server/quickReply.schema';
import { TUpdateQuickReplyRequest } from '@/lib/hooks/business/quick-reply.hook';
import { useQuickReplyDetails } from '@/lib/hooks/business/quick-reply.hook';
import { useUpdateQuickReply } from '@/lib/hooks/business/quick-reply.hook';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { stripHtml } from '@/lib/helpers/string-manipulator.helper';
import { getErrorMessage } from '@/utils/errors';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';

/* ------------------------------------
  PROPS
------------------------------------- */
interface IEditQuickReplyDialogProps {
  open: boolean;
  onClose: () => void;
  quickReplyId: string | null;
}

const EditQuickReplyDialog: React.FC<IEditQuickReplyDialogProps> = ({ open, onClose, quickReplyId }) => {
  const { data: quickReply, isLoading } = useQuickReplyDetails(quickReplyId);
  const updateMutation = useUpdateQuickReply(quickReplyId!);

  const form = useForm<TUpdateQuickReplyRequest>({
    resolver: zodResolver(UpdateQuickReplyRequestSchema),
    defaultValues: {
      title: '',
      content: '',
      category: QuickReplyCategory.GREETING,
      is_global: false,
    },
  });

  /* ------------------------------------
    POPULATE FORM WHEN DATA ARRIVES
  ------------------------------------- */
  useEffect(() => {
    if (quickReply) {
      form.reset({
        title: quickReply.title,
        content: stripHtml(quickReply.content),
        category: quickReply.category ?? QuickReplyCategory.GREETING,
        is_global: quickReply.is_global,
      });
    }
    console.log(quickReply);
  }, [quickReply, form]);

  /* ------------------------------------
    SUBMIT HANDLER
  ------------------------------------- */
  async function onSubmit(values: TUpdateQuickReplyRequest) {
    try {
      const payload = {
        ...values,
        content: values.content ? stripHtml(values.content) : values.content,
      };
      console.log(payload);
      //await updateMutation.mutateAsync(payload);

      toast.success('Quick reply updated successfully!');
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to update quick reply');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <DialogHeader>
            <DialogTitle>Edit Quick Reply</DialogTitle>
          </DialogHeader>
          {isLoading && <UILoaderIndicator label='Fetching your quick reply list...' />}
          {!isLoading && quickReply && (
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 mt-4'>
              {/* Title */}
              <div className='space-y-2'>
                <Label>Title</Label>
                <Input {...form.register('title')} placeholder='Enter quick reply title' />
                {form.formState.errors.title && (
                  <p className='text-xs text-red-500'>{form.formState.errors.title.message}</p>
                )}
              </div>
              {/* Category */}
              <div className='space-y-2'>
                <Label>Category</Label>
                <Select
                  onValueChange={(val) => form.setValue('category', val as QuickReplyCategory)}
                  value={form.watch('category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.values(QuickReplyCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Content */}
              <div className='space-y-2'>
                <Label>Reply Content</Label>
                <Textarea
                  {...form.register('content')}
                  rows={3}
                  className='min-h-[120px]'
                  placeholder='Write the reply text...'
                />

                {form.formState.errors.content && (
                  <p className='text-xs text-red-500'>{form.formState.errors.content.message}</p>
                )}
              </div>
              {/* Toggle Active */}
              <div className='flex items-center gap-2'>
                <input type='checkbox' {...form.register('is_global')} className='h-4 w-4 rounded border-gray-400' />
                <Label>Global</Label>
              </div>
              <DialogFooter className='mt-4 flex justify-end gap-3'>
                <Button type='button' variant='outline' onClick={onClose}>
                  Cancel
                </Button>

                <Button type='submit' disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuickReplyDialog;
