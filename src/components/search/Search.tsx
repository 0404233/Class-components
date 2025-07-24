import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import styles from './search.module.css';

type Props = {
  onSearch: (input: string) => void;
};

export default function Search({ onSearch }: Props): ReactElement {
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('searchInput') || '';
    setSearchInput(stored);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    localStorage.setItem('searchInput', trimmed);
    onSearch(trimmed);
  };

  return (
    <form className={styles.inputForm}>
      <input
        placeholder="Write full pokemon name"
        value={searchInput}
        onChange={handleChange}
        className={styles.inputField}
      />
      <button onClick={handleClick}>Search</button>
    </form>
  );
}
