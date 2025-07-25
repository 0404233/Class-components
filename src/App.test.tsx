import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('./components/header/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Router', () => ({
  default: () => <div data-testid="router">Router</div>,
}));

describe('App component', () => {
  it('renders Header and Router', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('router')).toBeInTheDocument();
  });
});
