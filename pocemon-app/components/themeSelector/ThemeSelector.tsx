'use client';

import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
// import sun from '../../assets/sun.svg';
// import moon from '../../assets/moon.svg';

export default function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {/* <img src={theme === 'dark' ? sun : moon} alt="theme icon" /> */}
      </div>
    </div>
  );
}
