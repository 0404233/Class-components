import CardList from './CardList';
import { screen, render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

describe('CardList component', () => {
  it('Renders all cards correctly', () => {
    render(<CardList items={items} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByText(/Base experience: 142/i)).toBeInTheDocument();

    const defaults = screen.getAllByText(/Is default: Yes/i);
    expect(defaults).toHaveLength(2);
  });

  it('Calls onCardClick when a card is clicked', () => {
    const mockClick = vi.fn();
    render(<CardList items={items} onCardClick={mockClick} />);

    fireEvent.click(screen.getByText('Bulbasaur'));
    expect(mockClick).toHaveBeenCalledWith('Bulbasaur');

    fireEvent.click(screen.getByText('Ivysaur'));
    expect(mockClick).toHaveBeenCalledWith('Ivysaur');

    expect(mockClick).toHaveBeenCalledTimes(2);
  });

  it('Handles null descriptions gracefully', () => {
    const itemsWithNull = [
      ...items,
      {
        name: 'Charmander',
        description: null,
      },
    ];

    render(<CardList items={itemsWithNull} />);

    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<CardList items={items} />);
    expect(container).toMatchSnapshot();
  });
});
