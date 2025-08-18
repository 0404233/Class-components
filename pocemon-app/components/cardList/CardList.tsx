'use client';

import Card from '../card/Card';
import type { Description } from '../../types';

type Item = {
  name: string;
  description: Description | null;
};

type Props = {
  items: Item[];
};

export default function CardList({ items }: Props) {
  return (
    <div>
      {items.map((item) => (
        <Card key={item.name} name={item.name} description={item.description} />
      ))}
    </div>
  );
}
