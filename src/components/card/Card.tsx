import { Component } from 'react';
import type { Description } from '../../types';
import styles from './card.module.css';

type Props = {
  name: string;
  description?: Description;
};

export default class Card extends Component<Props> {
  render() {
    const { name, description } = this.props;
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
}
