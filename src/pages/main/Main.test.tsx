import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Main from './Main';
import '@testing-library/jest-dom';

const mockData = [
  {
    name: 'Bulbasaur',
    base_experience: 64,
    height: 7,
    is_default: true,
    weight: 69,
  },
];

vi.mock('../api', () => ({
  default: vi.fn(),
}));

import getApiInfo from '../../api';

const getApiInfoMock = getApiInfo as ReturnType<typeof vi.fn>;

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Render without crashing', async () => {
    getApiInfoMock.mockResolvedValue(mockData);
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
    expect(
      screen.getByPlaceholderText(/write full pokemon name/i)
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('Loader while loading', async () => {
    let resolveFn: (value: typeof mockData) => void = () => {};

    const mockPromise = new Promise<typeof mockData>((resolve) => {
      resolveFn = resolve;
    });

    getApiInfoMock.mockReturnValueOnce(mockPromise);

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    resolveFn(mockData);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  it('Show error message if API rejected', async () => {
    getApiInfoMock.mockRejectedValue(new Error('ERROR'));
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('Search and displays result', async () => {
    getApiInfoMock.mockResolvedValue(mockData);
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/write full pokemon name/i);
    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.change(input, { target: { value: 'Bulbasaur' } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(getApiInfoMock).toHaveBeenCalledWith('Bulbasaur', 0, 10);
    });
  });

  it('Disable Next/Prev if search input is not empty', async () => {
    getApiInfoMock.mockResolvedValue(mockData);
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/write full pokemon name/i);
    const searchBtn = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Charizard' } });
    fireEvent.click(searchBtn);

    const next = screen.getByRole('button', { name: /next/i });
    const prev = screen.getByRole('button', { name: /prev/i });
    expect(next).toBeDisabled();
    expect(prev).toBeDisabled();
  });

  it('Navigation of Next and Prev buttons', async () => {
    getApiInfoMock.mockResolvedValue(mockData);
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
    const next = screen.getByRole('button', { name: /next/i });
    fireEvent.click(next);
    await waitFor(() => {
      expect(getApiInfoMock).toHaveBeenCalledWith('', 10, 10);
    });

    const prev = screen.getByRole('button', { name: /prev/i });
    fireEvent.click(prev);
    await waitFor(() => {
      expect(getApiInfoMock).toHaveBeenCalledWith('', 0, 10);
    });
  });
});

it('Handle items with wrong name', async () => {
  getApiInfoMock.mockResolvedValue([{ name: 'Wrong Name' }]);

  render(
    <MemoryRouter>
      <Main />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Wrong Name')).toBeInTheDocument();
  });
});
