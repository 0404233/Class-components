import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import '@testing-library/jest-dom';

const ErrorComponent = () => {
  throw new Error('Test render error');
};

describe('ErrorBoundary', () => {
  it('Renders application if havent error', () => {
    render(
      <ErrorBoundary>
        <div>Some data</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Some data')).toBeInTheDocument();
  });

  it('Catch errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
