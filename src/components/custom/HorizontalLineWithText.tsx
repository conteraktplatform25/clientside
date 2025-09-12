import React from 'react';

const HorizontalLineWithText = ({ text }: { text: string }) => {
  return (
    <div className='relative flex items-center justify-center w-full'>
      <div className='flex-grow border-t border-gray-300'></div>
      <span className='flex-shrink mx-4 text-gray-500 text-sm bg-white px-2'>{text}</span>
      <div className='flex-grow border-t border-gray-300'></div>
    </div>
  );
};

export default HorizontalLineWithText;
