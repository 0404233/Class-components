'use client';

import styles from './card.module.css';

type Props = {
  name: string;
  onClick?: () => void;
};

export default function Card({ name, onClick }: Props) {
  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <h3>{name}</h3>
    </div>
  );
}
