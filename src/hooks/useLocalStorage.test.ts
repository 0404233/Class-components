import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('useLocalStorage hook', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should initialize with value from localStorage if available', () => {
    localStorage.setItem(KEY, JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update state and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify('new-value'));
  });

  it('should return initial value if JSON.parse fails', () => {
    localStorage.setItem(KEY, 'invalid-json');

    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should throw an error if localStorage.setItem throws', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });

    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    expect(() => {
      act(() => {
        result.current[1]('value');
      });
    }).toThrowError();

    spy.mockRestore();
  });
});
