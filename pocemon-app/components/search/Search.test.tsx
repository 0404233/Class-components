import Search from './Search';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Search component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Render input using value from localStorage', () => {
    localStorage.setItem('searchInput', 'Bulbasaur');
    render(<Search onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(
      /write full pokemon name/i
    ) as HTMLInputElement;
    expect(input.value).toBe('Bulbasaur');
  });

  it('Updates input value', () => {
    render(<Search onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(
      /write full pokemon name/i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Ivysaur' } });
    expect(input.value).toBe('Ivysaur');
  });

  it('Button click call onSearch', () => {
    const onSearchMock = vi.fn();
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByPlaceholderText(
      /write full pokemon name/i
    ) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Ivysaur  ' } });
    fireEvent.click(button);

    expect(onSearchMock).toHaveBeenCalledWith('Ivysaur');
    expect(localStorage.getItem('searchInput')).toBe('Ivysaur');
  });
});
