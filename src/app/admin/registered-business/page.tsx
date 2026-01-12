'use client';
import React, { useEffect } from 'react';
import RegisteredBusiness from './_components/RegisteredBusiness';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';

const RegisteredBusinessPage = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Business Management');
  }, [setTitle]);
  return <RegisteredBusiness />;
};

export default RegisteredBusinessPage;
