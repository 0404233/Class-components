import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainPage from './Main';
import '@testing-library/jest-dom';

const mockListData = [
  {
    name: 'bulbasaur',
    base_experience: 64,
    height: 7,
    is_default: true,
    weight: 69,
  },
  {
    name: 'pikachu',
    base_experience: 112,
    height: 4,
    is_default: true,
    weight: 60,
  },
];

const mockDetailsData = {
  name: 'bulbasaur',
  base_experience: 64,
  height: 7,
  is_default: true,
  weight: 69,
};

vi.mock('../../api', () => ({
  __esModule: true,
  default: vi.fn(),
}));
import getApiInfo from '../../api';
const getApiInfoMock = getApiInfo as unknown as ReturnType<typeof vi.fn>;

vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['', vi.fn()]),
}));
import { useLocalStorage } from '../../hooks/useLocalStorage';

describe('MainPage Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithProviders = (
    ui: React.ReactElement,
    initialEntries = ['/']
  ) =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </QueryClientProvider>
    );

  it('shows loader initially', async () => {
    getApiInfoMock.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<MainPage />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders fetched pokemon list', async () => {
    getApiInfoMock.mockResolvedValue(mockListData);

    renderWithProviders(<MainPage />);

    for (const pokemon of mockListData) {
      await waitFor(() => {
        expect(screen.getByText(pokemon.name)).toBeInTheDocument();
      });
    }
  });

  it('renders error message on API failure', async () => {
    getApiInfoMock.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<MainPage />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('searches and fetches filtered results', async () => {
    const setSearchInputMock = vi.fn();
    const mockedUseLocalStorage = vi.mocked(useLocalStorage);
    mockedUseLocalStorage.mockReturnValue(['', setSearchInputMock]);

    getApiInfoMock.mockImplementation((input) => {
      if (input === 'bulbasaur') {
        return Promise.resolve([
          {
            name: 'bulbasaur',
            base_experience: 64,
            height: 7,
            is_default: true,
            weight: 69,
          },
        ]);
      }
      return Promise.resolve(mockListData);
    });

    renderWithProviders(<MainPage />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'bulbasaur' } });
    fireEvent.click(searchButton);

    expect(setSearchInputMock).toHaveBeenCalledWith('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('shows details panel when a pokemon is selected via URL param', async () => {
    getApiInfoMock.mockResolvedValueOnce(mockListData);
    getApiInfoMock.mockResolvedValueOnce([mockDetailsData]);

    renderWithProviders(<MainPage />, ['/?details=bulbasaur']);

    await waitFor(() => {
      expect(screen.getByText(/loading details/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const rightPane = screen.getByTestId('right-pane');
      expect(within(rightPane).getByText('bulbasaur')).toBeInTheDocument();
      expect(within(rightPane).getByText(/64/)).toBeInTheDocument();
      expect(within(rightPane).getByText(/7/)).toBeInTheDocument();
      expect(within(rightPane).getByText(/yes/i)).toBeInTheDocument();
      expect(within(rightPane).getByText(/69/)).toBeInTheDocument();
    });
  });

  it('closes details panel when Close button clicked', async () => {
    getApiInfoMock.mockResolvedValueOnce(mockListData);
    getApiInfoMock.mockResolvedValueOnce([mockDetailsData]);

    renderWithProviders(<MainPage />, ['/?details=bulbasaur']);

    await waitFor(() => {
      expect(screen.getByText(/loading details/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('right-pane')).not.toBeInTheDocument();
    });
  });

  it('refresh button triggers refetch', async () => {
    getApiInfoMock.mockResolvedValue(mockListData);

    renderWithProviders(<MainPage />);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(getApiInfoMock).toHaveBeenCalledTimes(2);
    });
  });

  it('disables pagination buttons during search', async () => {
    const setSearchInputMock = vi.fn();
    const mockedUseLocalStorage = vi.mocked(useLocalStorage);
    mockedUseLocalStorage.mockReturnValue(['bulbasaur', setSearchInputMock]);

    getApiInfoMock.mockResolvedValue(mockListData);

    renderWithProviders(<MainPage />);

    await waitFor(() => {
      const prevBtn = screen.getByRole('button', { name: /prev/i });
      const nextBtn = screen.getByRole('button', { name: /next/i });

      expect(prevBtn).toBeDisabled();
      expect(nextBtn).toBeDisabled();
    });
  });

  it('maintains search input value after refresh', async () => {
    const setSearchInputMock = vi.fn();
    const mockedUseLocalStorage = vi.mocked(useLocalStorage);
    mockedUseLocalStorage.mockReturnValue(['bulbasaur', setSearchInputMock]);

    getApiInfoMock.mockResolvedValue(mockListData);

    renderWithProviders(<MainPage />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'bulbasaur' } });

    await waitFor(() => {
      expect(input).toHaveValue('bulbasaur');
    });

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(input).toHaveValue('bulbasaur');
    });
  });
});
