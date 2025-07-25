import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Search from '../../components/search/Search';
import CardList from '../../components/CardList';
import getApiInfo from '../../api';
import styles from './Main.module.css';
import type { Description } from '../../types';

type Item = {
  name: string;
  description: Description | null;
};

type PokemonItem = {
  name: string;
  base_experience?: number;
  height?: number;
  is_default?: boolean;
  weight?: number;
};

const MainPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const offset = (page - 1) * limit;

  useEffect(() => {
    const savedInput = localStorage.getItem('searchInput') || '';
    setSearchInput(savedInput);
    handleSearch(savedInput, offset);
  }, [page]);

  const handleSearch = async (input: string, customOffset = 0) => {
    setLoading(true);
    setError(null);
    setSearchInput(input);

    try {
      const results = await getApiInfo(input, customOffset, limit);
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
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <div className={styles.wrapper}>
      <Search onSearch={(input) => handleSearch(input, 0)} />
      {loading && <p className={styles.loader} data-testid="loader"></p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && <CardList items={items} />}
      <div className={styles.buttonsBlock}>
        <div className={styles.pagginationButtons}>
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1 || searchInput !== ''}
          >
            Prev
          </button>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={searchInput !== ''}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
