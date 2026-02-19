'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/custom/RichTextEditorProps';
import { showSuccess, showError } from '@/utils/toast';
import { IoMdAdd } from 'react-icons/io';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Placeholder from '@tiptap/extension-placeholder';

// ✅ Validation schema
const ReplySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message cannot be empty').max(400),
});
type TReplyForm = z.infer<typeof ReplySchema>;

interface AddReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReply: (title: string, message: string) => void;
}

interface Variable {
  id: number;
  placeholder: string;
  value: string | null;
  fallback: string;
}

const AddReplyDialog: React.FC<AddReplyDialogProps> = ({ isOpen, onClose, onAddReply }) => {
  const [charCount, setCharCount] = useState(0);
  const characterLimit = 400;
  const [variables, setVariables] = useState<Variable[]>([]);

  console.log(charCount);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TReplyForm>({
    resolver: zodResolver(ReplySchema),
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1',
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount.configure({
        limit: characterLimit,
      }),
      Placeholder.configure({
        placeholder: 'Enter message...',
      }),
      Image,
      Link,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      //setMessage(editor.getHTML());
      setCharCount(editor.getText().length);
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none min-h-[150px] p-4 border border-input rounded-b-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      },
    },
    immediatelyRender: false,
  });

  const handleAddVariable = () => {
    const nextId = variables.length + 1;
    const newVar: Variable = {
      id: nextId,
      placeholder: `{{${nextId}}}`,
      value: null,
      fallback: '',
    };
    setVariables([...variables, newVar]);
    editor?.chain().focus().insertContent(newVar.placeholder).run();
  };

  const handleAddReply = (data: TReplyForm) => {
    console.log('Reply submitted:', {
      ...data,
      message: editor?.getHTML(),
    });
    if (!data.title.trim()) {
      showError('Reply title cannot be empty.');
      return;
    }
    if (!data.message.trim() || data.message === '<p></p>') {
      // Check for empty message or default empty paragraph
      showError('Reply message cannot be empty.');
      return;
    }
    if (data.message.length > characterLimit) {
      showError(`Reply message exceeds the character limit of ${characterLimit}.`);
      return;
    }

    onAddReply(data.title, data.message);
    showSuccess('Reply added successfully!');
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  // 👇 Update variable value or fallback
  const handleVariableChange = (id: number, field: 'value' | 'fallback', newValue: string) => {
    setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: newValue } : v)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add a Reply</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            {/* <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter reply title'
            /> */}
            <Input placeholder='Enter reply title' {...register('title')} />
            {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='message'>Message</Label>
            <RichTextEditor editor={editor!} characterLimit={characterLimit}>
              <Button
                variant={'ghost'}
                className='hover:bg-transparent hover:text-primary-700'
                onClick={handleAddVariable}
              >
                <div className='flex items-start gap-0.5'>
                  <IoMdAdd size={16} className='mt-0.5' />
                  <span className='font-medium leading-[155%]'>Add Variable</span>
                </div>
              </Button>
            </RichTextEditor>
          </div>
          <div className='grid gap-2'>
            {/* Variable Rows */}
            {variables.map((variable) => (
              <div key={variable.id} className='grid grid-cols-3 gap-2 items-center p-2'>
                {/* Variable */}
                <div className='text-sm font-mono text-gray-700'>{variable.placeholder}</div>

                {/* Value */}
                <Select onValueChange={(val) => handleVariableChange(variable.id, 'value', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select option' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='user_id'>User ID</SelectItem>
                    <SelectItem value='phone_number'>Phone number</SelectItem>
                    <SelectItem value='name'>Name</SelectItem>
                    <SelectItem value='tags'>Tags</SelectItem>
                    <SelectItem value='email'>Email</SelectItem>
                  </SelectContent>
                </Select>

                {/* Fallback value */}
                <Input
                  placeholder='Fallback value'
                  value={variable.fallback}
                  onChange={(e) => handleVariableChange(variable.id, 'fallback', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleAddReply)}>Add reply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReplyDialog;
