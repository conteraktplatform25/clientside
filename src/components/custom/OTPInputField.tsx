'use client';

import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  shake?: boolean;
  autoFocus?: boolean;
}

const OTPInputField = ({ value, onChange, length = 6, shake = false, autoFocus = true }: OTPInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // 👇 Automatically focus first input on mount
  useEffect(() => {
    if (autoFocus) {
      const firstInput = inputsRef.current[0];
      firstInput?.focus();
    }
  }, [autoFocus]);

  const handleChange = (val: string, index: number) => {
    const digit = val.replace(/\D/g, '').slice(-1); // only last numeric char
    const newOtp = value.split('');
    newOtp[index] = digit;
    const joined = newOtp.join('');
    onChange(joined);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const chars = pasted.split('');
    const newValue = Array.from({ length }, (_, i) => chars[i] || '').join('');
    onChange(newValue);

    // Focus last filled input
    const lastFilled = Math.min(pasted.length, length) - 1;
    inputsRef.current[lastFilled]?.focus();
  };
  return (
    <motion.div
      className='flex justify-center gap-2'
      animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={value[i] || ''}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode='numeric'
          className='w-10 h-12 text-center text-lg font-medium tracking-widest'
        />
      ))}
    </motion.div>
  );
};

export default OTPInputField;
