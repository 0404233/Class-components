import { render, screen } from '@testing-library/react';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import '@testing-library/jest-dom';

describe('ThemeProvider', () => {
  const TestComponent = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
      <div>
        <span>Current theme: {theme}</span>
        <button onClick={() => setTheme('dark')}>Switch to dark</button>
        <button onClick={() => setTheme('light')}>Switch to light</button>
      </div>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light theme when no preference in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('Current theme: light')).toBeInTheDocument();
    expect(localStorage.getItem('app-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('uses theme from localStorage if available', () => {
    localStorage.setItem('app-theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('Current theme: dark')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('updates theme and persists it to localStorage and DOM', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByText('Switch to dark'));
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument();
    expect(localStorage.getItem('app-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await user.click(screen.getByText('Switch to light'));
    expect(screen.getByText('Current theme: light')).toBeInTheDocument();
    expect(localStorage.getItem('app-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
