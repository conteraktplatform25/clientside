'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// components/CustomLoader.tsx
export default function CustomLoader({ visible }: { visible: boolean }) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (!visible) {
      // wait for fade-out before unmount
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [visible]);

  if (!show) return null;
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className='flex flex-col items-center space-y-6'>
        {/* Logo */}
        <div className='relative w-20 h-20 animate-bounce'>
          <Image src='/images/icons/icon-logo.svg' alt='App Logo' fill priority />
        </div>

        {/* Loading bar */}
        <div className='w-40 h-2 bg-gray-200 rounded-full overflow-hidden'>
          <div className='h-full bg-gradient-to-r from-blue-600 to-yellow-400 animate-[progress_1.5s_linear_infinite]' />
        </div>

        {/* Text */}
        <span className='text-gray-700 font-semibold animate-pulse'>Loading your concakt experience...</span>
      </div>

      {/* Tailwind keyframes */}
      <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
