'use client';
import { useState, useEffect } from 'react';
import CustomLoader from './CustomLoader';
import FadeInWrapper from './FadeInWrapper';

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // hide only when page is ready & minTimePassed
  useEffect(() => {
    if (minTimePassed) {
      setVisible(false);
    }
  }, [minTimePassed]);

  return (
    <>
      <CustomLoader visible={visible} />
      <FadeInWrapper trigger={visible}>{children}</FadeInWrapper>
    </>
  );
}
