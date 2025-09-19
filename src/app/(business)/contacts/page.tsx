'use client';
import React, { useState } from 'react';
import DataTableProfile from './custom/table/DataTableProfile';
import Image from 'next/image';

const ContactPage = () => {
  const [showingLoader] = useState(false);
  return (
    <div className='container mx-auto py-10'>
      {showingLoader ? (
        <div className='flex justify-center items-center'>
          <Image src='./spinner_loader.svg' sizes='20' alt='Spinner' />
        </div>
      ) : (
        <DataTableProfile />
      )}
    </div>
  );
};

export default ContactPage;
