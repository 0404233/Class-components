import React, { Component } from 'react';
import styles from './search.module.css';

type Props = {
  onSearch: (input: string) => void;
};

type State = {
  searcInput: string;
};

export default class Search extends Component<Props, State> {
  state: State = {
    searcInput: localStorage.getItem('searchInput') || '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searcInput: e.target.value });
  };

  handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmed = this.state.searcInput.trim();
    localStorage.setItem('searchInput', trimmed);
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <form className={styles.inputForm}>
        <input
          placeholder="Write full pokemon name"
          value={this.state.searcInput}
          onChange={this.handleChange}
          className={styles.inputField}
        />
        <button onClick={this.handleClick}>Search</button>
      </form>
    );
  }
}
