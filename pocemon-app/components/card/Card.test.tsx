import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { useSelectionStore } from '../../store/useSelectionStore';

beforeEach(() => {
  useSelectionStore.getState().clearAll();
});

describe('Card component interactions', () => {
  const name = 'Charmander';

  it('Renders an unchecked checkbox by default', () => {
    render(<Card name={name} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('Toggles selection on checkbox click', () => {
    render(<Card name={name} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(useSelectionStore.getState().selected.has(name)).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(useSelectionStore.getState().selected.has(name)).toBe(false);
  });

  it('Stops checkbox click from triggering card onClick', () => {
    const onClick = vi.fn();
    render(<Card name={name} onClick={onClick} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Calls onClick when card itself is clicked (excluding checkbox)', () => {
    const onClick = vi.fn();
    render(<Card name={name} onClick={onClick} />);

    const card = screen.getByText(name).closest('div');
    if (!card) {
      throw new Error('Card element not found');
    }
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });

  it('Renders a checked checkbox when item is pre-selected in store', () => {
    useSelectionStore.getState().selectItem(name);
    render(<Card name={name} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
