import { useState, useEffect } from 'react';
import Header from './components/header/Header';
import Search from './components/search/Search';
import CardList from './components/CardList';
import getApiInfo from './api';
import styles from './App.module.css';
import type { Description } from './types';

type PokemonItem = {
  name: string;
  base_experience?: number;
  height?: number;
  is_default?: boolean;
  weight?: number;
};

export default function App() {
  const [items, setItems] = useState<
    { name: string; description: Description | null }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerRenderError, setTriggerRenderError] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const input = localStorage.getItem('searchInput') || '';
    handleSearch(input, offset);
  }, []);

  const handleSearch = async (input: string, newOffset = 0) => {
    setLoading(true);
    setError(null);
    setSearchInput(input);
    try {
      const results = await getApiInfo(input, newOffset, limit);
      const mapped = results.map((item: PokemonItem) => {
        const hasData =
          item.base_experience !== undefined ||
          item.height !== undefined ||
          item.is_default !== undefined ||
          item.weight !== undefined;

        return {
          name: item.name,
          description: hasData
            ? {
                base_experience: item.base_experience,
                height: item.height,
                is_default: item.is_default,
                weight: item.weight,
              }
            : null,
        };
      });
      setItems(mapped);
      setOffset(newOffset);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    const newOffset = Math.max(0, offset - limit);
    handleSearch('', newOffset);
  };

  const handleNext = () => {
    const newOffset = offset + limit;
    handleSearch('', newOffset);
  };

  if (triggerRenderError) {
    throw new Error();
  }

  return (
    <>
      <Header>
        <Search onSearch={(input) => handleSearch(input, 0)} />
      </Header>
      <div className={styles.cardListWrapper}>
        {loading && <p className={styles.loader} data-testid="loader"></p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {!loading && !error && <CardList items={items} />}
        <div className={styles.buttonsBlock}>
          <div className={styles.pagginationButtons}>
            <button
              onClick={handlePrev}
              disabled={offset === 0 || searchInput !== ''}
            >
              Prev
            </button>
            <button onClick={handleNext} disabled={searchInput !== ''}>
              Next
            </button>
          </div>
          <button onClick={() => setTriggerRenderError(true)}>
            Trigger Render Error
          </button>
        </div>
      </div>
    </>
  );
}
