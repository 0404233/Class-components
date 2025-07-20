import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import getApiInfo from './api';

describe('API', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Fetch single data when searchInput not empty', async () => {
    const mockData = { name: 'Bulbasaur' };

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const result = await getApiInfo('Bulbasaur');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/bulbasaur'
    );

    expect(result).toEqual([mockData]);
  });

  it('Fetch list of data when searchInput is empty', async () => {
    const mockData = { results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }] };
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const result = await getApiInfo('', 20, 5);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=5&offset=20'
    );
    expect(result).toEqual(mockData.results);
  });

  it('Throw error with message if wrong response', async () => {
    const errorMessage = 'Not found';
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    globalThis.fetch = mockFetch as unknown as typeof fetch;

    await expect(getApiInfo('smthwrong')).rejects.toThrow(errorMessage);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/smthwrong'
    );
  });

  it('Throw default error message if API havent data by this response', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error('');
      },
    });

    globalThis.fetch = mockFetch as unknown as typeof fetch;

    await expect(getApiInfo('non-existent-name')).rejects.toThrow(
      'Nothing found for your request'
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/non-existent-name'
    );
  });
});
