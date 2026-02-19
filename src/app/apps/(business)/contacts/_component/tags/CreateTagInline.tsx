'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
//import { IClientTag } from '@/lib/schemas/business/client/contact.schema';
import { HexColorPicker } from 'react-colorful';

// export default function CreateTagInline({ onCreated }: { onCreated: (tag: IClientTag) => void }) {
export default function CreateTagInline() {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#F59E0B');
  const [loading, setLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), color }),
      });

      if (!res.ok) throw new Error('Failed');
      await res.json();
      //onCreated?.(tag);
      setName('');
      setColor('#F59E0B');
    } catch (err) {
      console.error(err);
      alert('Failed to create tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex gap-2 items-center'>
      <Input
        placeholder='New tag name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='max-w-[220px]'
      />
      <div className='flex items-center gap-3'>
        <div
          className='w-6 h-6 rounded cursor-pointer border'
          style={{ backgroundColor: color }}
          onClick={() => setOpenPicker((prev) => !prev)}
        />
        <span className='text-sm text-gray-600'>Pick color</span>
      </div>
      {openPicker && <HexColorPicker color={color} onChange={setColor} className='mt-2' />}
      <Button onClick={handleCreate} disabled={loading || !name.trim()}>
        {loading ? 'Creating...' : 'Create tag'}
      </Button>
    </div>
  );
}
