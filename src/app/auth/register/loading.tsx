'use client';
import CustomLoader from '@/components/custom/CustomLoader';
import React, { useEffect, useState } from 'react';

const Loading = () => {
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
  return <CustomLoader visible={visible} />;
};

export default Loading;
