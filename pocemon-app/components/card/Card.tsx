'use client';

import styles from './card.module.css';
import type { Description } from '../../types';
import { useSelectionStore } from '../../store/useSelectionStore';

type Props = {
  name: string;
  description?: Description | null;
};

export default function Card({ name, description }: Props) {
  const selected = useSelectionStore((state) => state.selected.has(name));
  const selectItem = useSelectionStore((state) => state.selectItem);
  const unselectItem = useSelectionStore((state) => state.unselectItem);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectItem(name);
    } else {
      unselectItem(name);
    }
  };

  return (
    <div className={styles.card}>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={selected}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
      />
      <h3>{name}</h3>
      {description && (
        <>
          <p>Base experience: {description.base_experience}</p>
          <p>Height: {description.height}</p>
          <p>Is default: {description.is_default ? 'Yes' : 'No'}</p>
          <p>Weight: {description.weight}</p>
        </>
      )}
    </div>
  );
}
