'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { IoMdAdd } from 'react-icons/io';
import { FaListUl } from 'react-icons/fa';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ✅ Validation schema
const ReplySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message cannot be empty').max(400),
});

type ReplyForm = z.infer<typeof ReplySchema>;

interface Variable {
  id: number;
  placeholder: string;
  value: string | null;
  fallback: string;
}

export default function ReplyEditor() {
  const [charCount, setCharCount] = useState(0);
  const [variables, setVariables] = useState<Variable[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Placeholder.configure({
        placeholder: 'Enter message...',
      }),
    ],
    content: '',
    immediatelyRender: false, // ✅ Next.js hydration fix
    onUpdate: ({ editor }) => {
      setCharCount(editor.getText().length);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReplyForm>({
    resolver: zodResolver(ReplySchema),
  });

  const onSubmit = (data: ReplyForm) => {
    console.log('Reply submitted:', {
      ...data,
      message: editor?.getHTML(),
    });
  };

  // 👇 Add a new variable row
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

  // 👇 Update variable value or fallback
  const handleVariableChange = (id: number, field: 'value' | 'fallback', newValue: string) => {
    setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: newValue } : v)));
  };

  return (
    <div className='block space-y-2'>
      {/* Title */}
      <Input placeholder='Title' {...register('title')} className='mb-2' />
      {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}

      {/* Message Editor */}
      <div className='border rounded-lg p-2'>
        {/* Toolbar */}
        <div className='flex flex-wrap items-center gap-2 border-b pb-2 mb-2'>
          <Button variant='ghost' size='sm' onClick={() => editor?.chain().focus().toggleBold().run()}>
            <b>B</b>
          </Button>
          <Button variant='ghost' size='sm' onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <i>I</i>
          </Button>
          <Button variant='ghost' size='sm' onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            • List
          </Button>
          <Button variant='ghost' size='sm' onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
            H2
          </Button>
          <Button variant='ghost' size='sm' onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <FaListUl size={12} />
          </Button>
        </div>

        {/* Editor area */}
        <EditorContent editor={editor} className='prose min-h-[150px] max-h-[300px] overflow-y-auto' />
      </div>
      <div className='w-full flex items-start justify-between text-primary-base text-xs'>
        <Button variant={'ghost'} className='hover:bg-transparent hover:text-primary-700' onClick={handleAddVariable}>
          <div className='flex items-start gap-0.5'>
            <IoMdAdd size={16} className='mt-0.5' />
            <span className='font-medium leading-[155%]'>Add Variable</span>
          </div>
        </Button>

        {/* Character Counter */}
        <div className='text-right text-xs text-gray-500 mt-1'>{charCount}/400</div>
      </div>
      <div>
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

      {/* Footer */}
      <div className='flex justify-end gap-2 text-sm'>
        <Button variant='outline' className='border-neutral-700 text-neutral-700 '>
          Cancel
        </Button>
        <Button className='bg-primary-base' onClick={handleSubmit(onSubmit)}>
          Add reply
        </Button>
      </div>
    </div>
  );
}
