'use client';
import { useState, useEffect } from 'react';

export default function FadeInWrapper({ children, trigger }: { children: React.ReactNode; trigger: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!trigger) {
      // When loader finishes hiding → show content with fade-in
      const timer = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShow(false); // hide content when loader is active
    }
  }, [trigger]);

  return <div className={`transition-opacity duration-700 ${show ? 'opacity-100' : 'opacity-0'}`}>{children}</div>;
}
