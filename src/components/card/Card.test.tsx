import { render, screen } from '@testing-library/react';
import Card from './Card';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('Card component', () => {
  const props = {
    name: 'Bulbasaur',
  };

  it('Renders the name', () => {
    render(<Card {...props} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('Card without description', () => {
    render(<Card {...props} />);
    expect(screen.queryByText(/Base experience:/)).toBeNull();
    expect(screen.queryByText(/Height:/)).toBeNull();
    expect(screen.queryByText(/Is default:/)).toBeNull();
    expect(screen.queryByText(/Weight:/)).toBeNull();
  });

  it('Card with description', () => {
    const description = {
      base_experience: 64,
      height: 7,
      is_default: true,
      weight: 69,
    };

    render(<Card {...props} description={description} />);

    expect(screen.getByText('Base experience: 64')).toBeInTheDocument();
    expect(screen.getByText('Height: 7')).toBeInTheDocument();
    expect(screen.getByText('Is default: Yes')).toBeInTheDocument();
    expect(screen.getByText('Weight: 69')).toBeInTheDocument();
  });

  it('Change field "Is default" depending on boolean parameter', () => {
    const description = {
      base_experience: 64,
      height: 7,
      is_default: false,
      weight: 69,
    };

    render(<Card {...props} description={description} />);
    expect(screen.getByText('Is default: No')).toBeInTheDocument();
  });
});
