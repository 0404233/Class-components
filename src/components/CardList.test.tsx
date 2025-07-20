import CardList from './CardList';
import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

const items = [
  {
    name: 'Bulbasaur',
    description: {
      base_experience: 64,
      height: 7,
      is_default: true,
      weight: 69,
    },
  },
  {
    name: 'Ivysaur',
    description: {
      base_experience: 142,
      height: 10,
      is_default: true,
      weight: 130,
    },
  },
];

describe('Card List component', () => {
  it('Correct render all content', () => {
    render(<CardList items={items} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByText(/Base experience: 142/i)).toBeInTheDocument();
    const twoSumularElements = screen.getAllByText(/Is default: Yes/i);
    expect(twoSumularElements).toHaveLength(2);
  });
});
