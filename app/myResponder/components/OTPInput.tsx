'use client';

import { ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
}: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(() => value.padEnd(length).slice(0, length).split(''));

  useEffect(() => {
    setDigits(value.padEnd(length).slice(0, length).split(''));
  }, [length, value]);

  useEffect(() => {
    if (autoFocus) {
      refs.current[0]?.focus();
    }
  }, [autoFocus]);

  const updateDigit = (index: number, nextValue: string) => {
    const nextDigit = nextValue.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextDigit;
    setDigits(nextDigits);
    onChange(nextDigits.join('').trim());

    if (nextDigit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const nextDigits = pasted.padEnd(length).split('');
    setDigits(nextDigits);
    onChange(nextDigits.join('').trim());
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="mr-otp-container" role="group" aria-label={`${length}-digit verification code`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          className="mr-otp-box"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
