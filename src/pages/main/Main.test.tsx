import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Main from './Main';
import '@testing-library/jest-dom';
import { within } from '@testing-library/react';

const mockData = [
  {
    name: 'Bulbasaur',
    base_experience: 64,
    height: 7,
    is_default: true,
    weight: 69,
  },
];

vi.mock('../../api', () => ({
  default: vi.fn(),
}));

import getApiInfo from '../../api';

const getApiInfoMock = getApiInfo as ReturnType<typeof vi.fn>;

describe('Main Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
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

  it('shows loader while loading', async () => {
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

  it('shows error message if API fails', async () => {
    getApiInfoMock.mockRejectedValue(new Error('API ERROR'));

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('searches and displays result', async () => {
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

  it('disables Next/Prev buttons when input is filled', async () => {
    getApiInfoMock.mockResolvedValue(mockData);

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/write full pokemon name/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Charizard' } });
    fireEvent.click(searchButton);

    const next = screen.getByRole('button', { name: /next/i });
    const prev = screen.getByRole('button', { name: /prev/i });

    expect(next).toBeDisabled();
    expect(prev).toBeDisabled();
  });

  it('navigates using Next and Prev buttons', async () => {
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

  it('handles items with missing expected properties', async () => {
    getApiInfoMock.mockResolvedValue([{ name: 'Unknown' }]);

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  it('Displays details panel when "details" param is present', async () => {
    getApiInfoMock.mockResolvedValueOnce(mockData);
    getApiInfoMock.mockResolvedValueOnce(mockData);

    render(
      <MemoryRouter initialEntries={['/?page=1&details=Bulbasaur']}>
        <Main />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Loading details/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const leftPane = screen.getByTestId('left-pane');
      const rightPane = screen.getByTestId('right-pane');

      expect(within(leftPane).getByText('Bulbasaur')).toBeInTheDocument();
      expect(within(rightPane).getByText('Bulbasaur')).toBeInTheDocument();
      expect(
        within(rightPane).getByText(/Base experience/i)
      ).toBeInTheDocument();
    });
  });

  it('Closes details panel on "Close" button click', async () => {
    getApiInfoMock.mockResolvedValueOnce(mockData);
    getApiInfoMock.mockResolvedValueOnce(mockData);

    render(
      <MemoryRouter initialEntries={['/?page=1&details=Bulbasaur']}>
        <Main />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Loading details/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const leftPane = screen.getByTestId('left-pane');
      const rightPane = screen.getByTestId('right-pane');

      expect(within(leftPane).getByText('Bulbasaur')).toBeInTheDocument();
      expect(within(rightPane).getByText('Bulbasaur')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      const leftPane = screen.getByTestId('left-pane');
      expect(within(leftPane).getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.queryByTestId('right-pane')).toBeNull();
    });
  });
});
