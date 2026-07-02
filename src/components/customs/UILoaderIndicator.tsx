'use client';
import React from 'react';

const UILoaderIndicator = ({ label = 'Loading...' }: { label?: string }) => {
  return (
    <div className='flex flex-col items-center justify-center h-48 space-y-4 animate-fade-in'>
      <div className='flex space-x-2'>
        <span className='w-3 h-3 bg-primary-base rounded-full animate-bounce [animation-delay:-0.3s]' />
        <span className='w-3 h-3 bg-primary-base rounded-full animate-bounce [animation-delay:-0.15s]' />
        <span className='w-3 h-3 bg-primary-base rounded-full animate-bounce' />
      </div>
      <p className='text-neutral-700 text-sm font-medium'>{label}</p>
    </div>
  );
};

export default UILoaderIndicator;
