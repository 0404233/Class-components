import { Component } from 'react';
import Card from './card/Card';
import type { Description } from '../types';

type Props = {
  items: { name: string; description: Description }[];
};

export default class CardList extends Component<Props> {
  render() {
    return (
      <div>
        {this.props.items.map((item, i) => (
          <Card key={i} {...item} />
        ))}
      </div>
    );
  }
}
