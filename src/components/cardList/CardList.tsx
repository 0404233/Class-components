import type { ReactElement } from 'react';
import Card from '../card/Card';
import type { Description } from '../../types';

type Props = {
  items: { name: string; description: Description | null }[];
  onCardClick?: (name: string) => void;
};

export default function CardList({ items, onCardClick }: Props): ReactElement {
  return (
    <div>
      {items.map((item, i) => (
        <Card key={i} {...item} onClick={() => onCardClick?.(item.name)} />
      ))}
    </div>
  );
}
