import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/Class-components']}>
        {children}
      </MemoryRouter>
    ),
  };
});

vi.mock('./components/header/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./AppRoutes', () => ({
  default: () => <div data-testid="router">Router</div>,
}));

vi.mock('./components/selectItems/SelectItems', () => ({
  default: () => <div data-testid="selected-items">SelectedItems</div>,
}));

import App from './App';

describe('App component', () => {
  it('renders Header, AppRoutes and SelectedItems components', () => {
    render(<App />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('router')).toBeInTheDocument();
    expect(screen.getByTestId('selected-items')).toBeInTheDocument();
  });
});
