import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import About from './About';
import '@testing-library/jest-dom';

describe('About component', () => {
  it('renders the About heading', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
  });

  it('renders the RS School React Course link with correct attributes', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const rsLink = screen.getByRole('link', {
      name: /rs school react course/i,
    });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(rsLink).toHaveAttribute('target', '_blank');
    expect(rsLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders the author link with correct attributes', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const authorLink = screen.getByRole('link', {
      name: /author: makarevich andrey/i,
    });
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute('href', 'https://github.com/0404233');
    expect(authorLink).toHaveAttribute('target', '_blank');
    expect(authorLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders the Back to Home link that navigates to "/"', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const backLink = screen.getByRole('link', { name: /back to home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });
});
