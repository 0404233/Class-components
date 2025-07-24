import type { ReactElement } from 'react';
import type { Description } from '../../types';
import styles from './card.module.css';

type Props = {
  name: string;
  description?: Description | null;
};

export default function Card({ name, description }: Props): ReactElement {
  return (
    <div className={styles.card}>
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
