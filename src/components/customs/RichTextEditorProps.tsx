'use client';

import React from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import EditorToolbar from '@/components/custom/EditorToolbarField';

interface RichTextEditorProps {
  editor: Editor;
  characterLimit?: number;
  children?: React.ReactNode;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ editor, characterLimit = 400, children }) => {
  const characters = editor?.storage.characterCount.characters() || 0;

  return (
    <div className='space-y-1'>
      <div className='rounded-[4px] border p-0'>
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <div className='w-full flex items-start justify-between text-primary-base text-xs'>
        {children && <div className='space-y-2'>{children}</div>}
        {/* Character Counter */}
        {characterLimit && (
          <div className='flex justify-end text-sm text-muted-foreground p-2'>
            {characters}/{characterLimit}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
