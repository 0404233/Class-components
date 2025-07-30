import { create } from 'zustand';

type SelectedItemsState = {
  selected: Set<string>;
  selectItem: (name: string) => void;
  unselectItem: (name: string) => void;
  clearAll: () => void;
};

export const useSelectionStore = create<SelectedItemsState>((set) => ({
  selected: new Set(),
  selectItem: (name) =>
    set((state) => {
      const newSelected = new Set(state.selected);
      newSelected.add(name);
      return { selected: newSelected };
    }),
  unselectItem: (name) =>
    set((state) => {
      const newSelected = new Set(state.selected);
      newSelected.delete(name);
      return { selected: newSelected };
    }),
  clearAll: () => set({ selected: new Set() }),
}));
