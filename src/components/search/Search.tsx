import { useState } from 'react';
import type { ReactElement } from 'react';
import styles from './search.module.css';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type Props = {
  onSearch: (input: string) => void;
};

export default function Search({ onSearch }: Props): ReactElement {
  const [storedInput, setStoredInput] = useLocalStorage('searchInput', '');
  const [searchInput, setSearchInput] = useState(storedInput);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setStoredInput(trimmed);
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
