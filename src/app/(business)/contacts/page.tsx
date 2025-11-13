'use client';
import React, { useEffect } from 'react';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import ContactManagementPage from './ContactManagementPage';

const ContactPage = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Contacts');
  }, [setTitle]);
  return <ContactManagementPage />;
};

export default ContactPage;
