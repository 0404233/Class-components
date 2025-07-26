import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './Error';
import '@testing-library/jest-dom';

describe('NotFound component', () => {
  it('renders the 404 heading', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: /404 - page not found/i })
    ).toBeInTheDocument();
  });

  it('renders the not found message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/oops! the page you’re looking for doesn’t exist./i)
    ).toBeInTheDocument();
  });

  it('renders the "Go back to Home" link with correct href', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    const backLink = screen.getByRole('link', { name: /go back to home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });
});
