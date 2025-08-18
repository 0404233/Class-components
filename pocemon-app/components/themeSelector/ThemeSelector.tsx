'use client';

import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Image from 'next/image';

export default function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext);

  console.log('Current theme:', theme);

  return (
    <div>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <Image
          src={theme === 'dark' ? '/sun.svg' : '/moon.svg'}
          alt="theme icon"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}
