import { render, screen, fireEvent } from '@testing-library/react';
import SelectedItemsFlyout from './SelectItems';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as selectionStore from '../../store/useSelectionStore';
import type { SelectedItemsState } from '../../store/useSelectionStore';
import '@testing-library/jest-dom';

describe('SelectedItemsFlyout', () => {
  const mockClearAll = vi.fn();

  const createMockStore = (partialState: Partial<SelectedItemsState>) =>
    vi
      .spyOn(selectionStore, 'useSelectionStore')
      .mockImplementation((selector) =>
        selector({
          selected: new Set(),
          selectItem: () => {},
          unselectItem: () => {},
          clearAll: mockClearAll,
          setSelected: () => {},
          ...partialState,
        })
      );

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('does not render if selected is empty', () => {
    createMockStore({ selected: new Set() });
    render(<SelectedItemsFlyout />);
    expect(screen.queryByText(/selected/)).toBeNull();
  });

  it('renders selected count if items are selected', () => {
    createMockStore({ selected: new Set(['Pikachu', 'Charmander']) });
    render(<SelectedItemsFlyout />);
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('calls clearAll on "Unselect all" button click', () => {
    createMockStore({ selected: new Set(['Squirtle']) });
    render(<SelectedItemsFlyout />);
    fireEvent.click(screen.getByText('Unselect all'));
    expect(mockClearAll).toHaveBeenCalled();
  });
});
