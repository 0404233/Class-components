'use client';

import Card from '../card/Card';
import type { Description } from '../../types';

type Item = {
  name: string;
  description: Description | null;
};

type Props = {
  items: Item[];
  onCardClick?: (name: string) => void;
};

export default function CardList({ items, onCardClick }: Props) {
  return (
    <div>
      {items.map((item) => (
        <Card
          key={item.name}
          name={item.name}
          onClick={() => onCardClick?.(item.name)}
        />
      ))}
    </div>
  );
}
