'use client';

import styles from './card.module.css';
import { useSelectionStore } from '../../store/useSelectionStore';

type Props = {
  name: string;
  onClick?: () => void;
};

export default function Card({ name, onClick }: Props) {
  const selected = useSelectionStore((state) => state.selected.has(name));
  const selectItem = useSelectionStore((state) => state.selectItem);
  const unselectItem = useSelectionStore((state) => state.unselectItem);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.checked) {
      selectItem(name);
    } else {
      unselectItem(name);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={selected}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
        aria-label={'selectItem'}
      />
      <h3>{name}</h3>
    </div>
  );
}
