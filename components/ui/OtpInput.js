'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export function OtpInput({ length = 4, value = '', onChange, onComplete }) {
  const [digits, setDigits] = useState(() => {
    const arr = value.split('').slice(0, length);
    while (arr.length < length) arr.push('');
    return arr;
  });

  const inputRefs = useRef([]);

  useEffect(() => {
    const arr = value.split('').slice(0, length);
    while (arr.length < length) arr.push('');
    setDigits(arr);
  }, [value, length]);

  const handleChange = (index, val) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);

    const fullOtp = newDigits.join('');
    onChange?.(fullOtp);

    if (clean && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (fullOtp.length === length && !newDigits.includes('')) {
      onComplete?.(fullOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const newDigits = pasted.split('');
    while (newDigits.length < length) newDigits.push('');
    setDigits(newDigits);

    const fullOtp = newDigits.join('');
    onChange?.(fullOtp);
    if (fullOtp.length === length) {
      onComplete?.(fullOtp);
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={clsx(
            'w-14 h-16 text-center text-2xl font-bold text-primary rounded-2xl border-2 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white shadow-sm',
            digits[i] ? 'border-primary/40 bg-amber-50/20' : 'border-slate-200'
          )}
        />
      ))}
    </div>
  );
}
