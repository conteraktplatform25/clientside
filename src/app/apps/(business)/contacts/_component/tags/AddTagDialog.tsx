'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TagMultiSelect from './TagMultiSelect';
import CreateTagInline from './CreateTagInline';
//import { IClientTag } from '@/lib/schemas/business/client/contact.schema';
import { useContactTags } from '@/lib/hooks/business/contact.hook';
import { AnimatePresence, motion } from 'framer-motion';

interface IAddTagDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contactId: string | null;
  //onSaved?: () => void;
}
// interface ContactTagEntry {
//   id: string;
//   tag: IClientTag;
// }

export default function AddTagDialog({ open, onOpenChange, contactId }: IAddTagDialogProps) {
  // const [availableTags, setAvailableTags] = useState<IClientTag[]>([]);
  // const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  // const [loading, setLoading] = useState(false);
  //const { tagsQuery, contactTagsQuery, saveTagsMutation, createTagMutation } = useContactTags(contactId);
  const { tagsQuery, contactTagsQuery, saveTagsMutation } = useContactTags(contactId);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Sync fetched tags with UI
  useEffect(() => {
    if (contactTagsQuery.data) {
      setSelectedTagIds(contactTagsQuery.data.map((d) => d.tag.id));
    }
  }, [contactTagsQuery.data]);

  const handleSave = () => {
    if (!contactId) return;
    saveTagsMutation.mutate(selectedTagIds, {
      onSuccess: () => onOpenChange(false),
    });
  };

  // const handleCreateInline = async (tag: { name: string; color: string }) => {
  //   createTagMutation.mutate(tag);
  // };

  // useEffect(() => {
  //   const fetchTags = async () => {
  //     try {
  //       const res = await fetch('/api/tags');
  //       const tags = await res.json();
  //       setAvailableTags(tags);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   const fetchContactTags = async (id: string) => {
  //     try {
  //       const res = await fetch(`/api/contacts/${id}/tags`);
  //       const data: ContactTagEntry[] = await res.json();
  //       setSelectedTagIds(data.map((d) => d.tag.id));
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   if (!open) return;
  //   fetchTags();
  //   if (contactId) fetchContactTags(contactId);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [open, contactId]);

  // const handleSave = async () => {
  //   if (!contactId) return;
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`/api/contacts/${contactId}/tags`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ tagIds: selectedTagIds }),
  //     });
  //     if (!res.ok) throw new Error('Failed to save');
  //     // optionally update store or refetch contacts
  //     onSaved?.();
  //     onOpenChange(false);
  //   } catch (err) {
  //     console.error(err);
  //     alert('Failed to save tags');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleCreateInline = (newTag: IClientTag) => {
  //   // add to available and auto-select
  //   setAvailableTags((s) => [newTag, ...s]);
  //   setSelectedTagIds((s) => [newTag.id, ...s]);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className='w-[520px] p-0 overflow-hidden bg-transparent shadow-none'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className='bg-white rounded-lg p-6'
            >
              <DialogHeader>
                <DialogTitle>Add tags</DialogTitle>
              </DialogHeader>
              <div className='py-2'>
                <TagMultiSelect
                  availableTags={tagsQuery.data ?? []}
                  selectedTagIds={selectedTagIds}
                  onChange={setSelectedTagIds}
                />
                <div className='mt-4'>
                  {/* <CreateTagInline onCreated={handleCreateInline} /> */}
                  <CreateTagInline />
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saveTagsMutation.isPending}>
                  {saveTagsMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
      {/* <DialogContent className='w-[520px]'>
        <DialogHeader>
          <DialogTitle>Add tags</DialogTitle>
        </DialogHeader>
        <div className='py-2'>
          <TagMultiSelect availableTags={availableTags} selectedTagIds={selectedTagIds} onChange={setSelectedTagIds} />
          <div className='mt-4'>
            <CreateTagInline onCreated={handleCreateInline} />
          </div>
        </div>
        <DialogFooter>
          <div className='flex gap-2 w-full justify-end'>
            <Button variant='outline' onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent> */}
    </Dialog>
  );
}
