import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Router from './AppRoutes';
import '@testing-library/jest-dom';

vi.mock('./pages/main/Main', () => ({
  default: () => <div>Main Page</div>,
}));
vi.mock('./pages/about/About', () => ({
  default: () => <div>About Page</div>,
}));
vi.mock('./pages/error/Error', () => ({
  default: () => <div>Error Page</div>,
}));

describe('Router component', () => {
  it('renders Main page on default route "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>
    );
    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it('renders About page on "/about"', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Router />
      </MemoryRouter>
    );
    expect(screen.getByText('About Page')).toBeInTheDocument();
  });

  it('renders Error page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Router />
      </MemoryRouter>
    );
    expect(screen.getByText('Error Page')).toBeInTheDocument();
  });
});
