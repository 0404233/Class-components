import { create } from 'zustand';

export type SelectedItemsState = {
  selected: Set<string>;
  selectItem: (name: string) => void;
  unselectItem: (name: string) => void;
  clearAll: () => void;
  setSelected: (names: string[]) => void;
};

const LOCAL_STORAGE_KEY = 'selectedItems';

export const useSelectionStore = create<SelectedItemsState>((set) => ({
  selected: new Set(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]')
  ),

  selectItem: (name) => {
    set((state) => {
      const newSelected = new Set(state.selected);
      newSelected.add(name);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(Array.from(newSelected))
      );
      return { selected: newSelected };
    });
  },

  unselectItem: (name) => {
    set((state) => {
      const newSelected = new Set(state.selected);
      newSelected.delete(name);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(Array.from(newSelected))
      );
      return { selected: newSelected };
    });
  },

  clearAll: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({ selected: new Set() });
  },

  setSelected: (names) => {
    const newSelected = new Set(names);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(names));
    set({ selected: newSelected });
  },
}));
