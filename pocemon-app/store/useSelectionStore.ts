import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'selectedItems';

interface SelectedItemsState {
  selected: Set<string>;
  selectItem: (name: string) => void;
  unselectItem: (name: string) => void;
  clearAll: () => void;
}

export const useSelectionStore = create<SelectedItemsState>((set) => {
  let initialSelected: Set<string> = new Set();

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        initialSelected = new Set(JSON.parse(stored));
      } catch {
        initialSelected = new Set();
      }
    }
  }

  return {
    selected: initialSelected,

    selectItem: (name) =>
      set((state) => {
        const updated = new Set(state.selected).add(name);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...updated]));
        }
        return { selected: updated };
      }),

    unselectItem: (name) =>
      set((state) => {
        const updated = new Set(state.selected);
        updated.delete(name);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...updated]));
        }
        return { selected: updated };
      }),

    clearAll: () =>
      set(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
        }
        return { selected: new Set() };
      }),
  };
});
