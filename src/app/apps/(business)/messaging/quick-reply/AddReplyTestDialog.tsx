'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/custom/RichTextEditorProps';
import { showError } from '@/utils/toast';
import { IoMdAdd, IoMdTrash } from 'react-icons/io';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';

import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuickReplyCategory } from '@prisma/client';
import { Loader2, Save } from 'lucide-react';

const FormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'), // MUST match your API
  category: z.nativeEnum(QuickReplyCategory).optional(),
  is_global: z.boolean(),
});
type TReplyForm = z.infer<typeof FormSchema>;

// -------------------------------------------------------------
// Props
// -------------------------------------------------------------
interface IAddReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReply: (data: {
    title: string;
    content: string;
    category?: QuickReplyCategory;
    is_global: boolean;
    variables: IVariable[];
  }) => void;
  isLoading: boolean;
}

export interface IVariable {
  id: number;
  placeholder: string;
  value: string | null;
  fallback: string;
}

const AddReplyTestDialog: React.FC<IAddReplyDialogProps> = ({ isOpen, onClose, onAddReply, isLoading }) => {
  const [variables, setVariables] = useState<IVariable[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const characterLimit = 400;
  const dropDownCategory: QuickReplyCategory[] = Object.values(QuickReplyCategory);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TReplyForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: '', content: '', is_global: false, category: 'GREETING' },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-gray-300 pl-4 italic' } },
        bulletList: { HTMLAttributes: { class: 'list-disc pl-6' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-6' } },
        listItem: { HTMLAttributes: { class: 'mb-1' } },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount.configure({ limit: characterLimit }),
      Placeholder.configure({ placeholder: 'Enter message...' }),
      Image,
      Link,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const plain = editor.getText();
      setCharCount(plain.length);

      // Sync editor HTML to form
      setValue('content', editor.getHTML());
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
    const id = variables.length + 1;
    const newVar: IVariable = {
      id,
      placeholder: `{{${id}}}`,
      value: null,
      fallback: '',
    };

    setVariables((prev) => [...prev, newVar]);
    editor?.chain().focus().insertContent(newVar.placeholder).run();
  };

  const handleAdd = (data: TReplyForm) => {
    const contentHTML = editor?.getHTML() ?? '';

    if (charCount > characterLimit) {
      return showError(`Message exceeds ${characterLimit} characters`);
    }

    onAddReply({
      ...data,
      category: data.category,
      content: contentHTML,
      variables,
    });

    // showSuccess('Reply added successfully!');
    reset();
    // onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  // const handleVariableChange = (id: number, field: 'value' | 'fallback', value: string) => {
  //   setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  // };

  const handleDeleteVariable = (id: number) => {
    const variable = variables.find((v) => v.id === id);
    if (!variable) return;

    // Remove from editor content
    if (editor) {
      const html = editor.getHTML();

      const updatedHTML = html.replaceAll(variable.placeholder, '');
      editor.commands.setContent(updatedHTML);
      setValue('content', updatedHTML);
    }

    // Remove from UI state
    setVariables((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className='sm:max-w-[520px] max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Add a Reply</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className='grid gap-6 py-4 overflow-y-auto px-2 pr-2 flex-1'>
          {/* Title */}
          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input placeholder='Enter reply title' {...register('title')} />
            {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className='grid gap-2'>
            <Label>Category</Label>
            <Select
              value={selectedCategory ?? 'all'}
              onValueChange={(value) => {
                const newValue = value === 'all' ? undefined : (value as QuickReplyCategory);
                setSelectedCategory(newValue);
                setValue('category', newValue);
              }}
            >
              <SelectTrigger className='w-1/2'>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {dropDownCategory.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Global Toggle */}
          <div className='flex items-center justify-between'>
            <Label>Global Quick Reply?</Label>
            <Switch onCheckedChange={(value) => setValue('is_global', value)} />
          </div>

          {/* Editor */}
          <div className='grid gap-2'>
            <Label htmlFor='content'>Message Content</Label>
            {/* <RichTextEditor editor={editor!} characterLimit={characterLimit}> */}
            <RichTextEditor editor={editor!}>
              <Button
                variant='ghost'
                className='hover:bg-transparent hover:text-primary-700'
                onClick={handleAddVariable}
              >
                <div className='flex items-start gap-0.5'>
                  <IoMdAdd size={16} className='mt-0.5' />
                  <span className='font-medium leading-[155%]'>Add Variable</span>
                </div>
              </Button>
            </RichTextEditor>
            {errors.content && <p className='text-sm text-red-500'>{errors.content.message}</p>}
          </div>

          {/* Variables */}
          {variables.map((v) => (
            <div key={v.id} className='grid grid-cols-12 gap-2 items-center p-2 border rounded-md'>
              <div className='col-span-3 text-sm font-mono'>{v.placeholder}</div>
              <div className='col-span-4'>
                <Select
                  onValueChange={(val) =>
                    setVariables((prev) => prev.map((x) => (x.id === v.id ? { ...x, value: val } : x)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select field' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='name'>Name</SelectItem>
                    <SelectItem value='phone_number'>Phone</SelectItem>
                    <SelectItem value='email'>Email</SelectItem>
                    <SelectItem value='tags'>Tags</SelectItem>
                    <SelectItem value='user_id'>User ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                className='col-span-4'
                placeholder='Fallback'
                value={v.fallback}
                onChange={(e) =>
                  setVariables((prev) => prev.map((x) => (x.id === v.id ? { ...x, fallback: e.target.value } : x)))
                }
              />
              <Button variant='ghost' className='text-red-500 col-span-1' onClick={() => handleDeleteVariable(v.id)}>
                <IoMdTrash size={18} />
              </Button>
            </div>
          ))}
        </div>
        {/* Footer */}
        <DialogFooter className='px-3'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleAdd)}
            disabled={isLoading}
            className={`bg-primary-base hover:bg-primary-700 py-5 px-4 rounded-[8px] text-sm leading-5 cursor-pointer inline-flex items-center space-x-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className='w-5 h-5 animate-spin' />
                <span>Saving Reply Message...</span>
              </>
            ) : (
              <>
                <Save className='w-6 h-6' />
                <span>Save Reply Message</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReplyTestDialog;
