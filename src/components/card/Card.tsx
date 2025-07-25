import type { ReactElement } from 'react';
import styles from './card.module.css';
import type { Description } from '../../types';

type Props = {
  name: string;
  description?: Description | null;
  onClick?: () => void;
};

export default function Card({
  name,
  description,
  onClick,
}: Props): ReactElement {
  return (
    <div className={styles.card} onClick={onClick}>
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
