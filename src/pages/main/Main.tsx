import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Search from '../../components/search/Search';
import CardList from '../../components/CardList';
import getApiInfo from '../../api';
import { useLocalStorage } from '../../hooks/useLocalStorage';
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

export default function MainPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsData, setDetailsData] = useState<Item | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchInput, setSearchInput] = useLocalStorage('searchInput', '');
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const offset = (page - 1) * limit;
  const selectedDetails = searchParams.get('details') || '';

  useEffect(() => {
    handleSearch(searchInput, offset);
  }, [page, searchInput]);

  useEffect(() => {
    if (selectedDetails) {
      fetchDetails(selectedDetails);
    } else {
      setDetailsData(null);
    }
  }, [selectedDetails]);

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
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (name: string) => {
    setDetailsLoading(true);
    try {
      const [data] = await getApiInfo(name, 0, 1);
      setDetailsData({
        name: data.name,
        description: {
          base_experience: data.base_experience,
          height: data.height,
          is_default: data.is_default,
          weight: data.weight,
        },
      });
    } catch {
      setDetailsData(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const goToPage = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleCardClick = (name: string) => {
    setSearchParams({ page: page.toString(), details: name });
  };

  const closeDetails = () => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className={styles.masterDetailLayout}>
      <div className={styles.leftPane} data-testid="left-pane">
        <Search
          onSearch={(input) => {
            if (input.trim() !== '') {
              handleSearch(input, 0);
            }
          }}
        />
        {loading && <p className={styles.loader} data-testid="loader"></p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {!loading && !error && (
          <CardList items={items} onCardClick={handleCardClick} />
        )}
        <div className={styles.buttonsBlock}>
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
      {selectedDetails && (
        <div className={styles.rightPane} data-testid="right-pane">
          <button onClick={closeDetails}>Close</button>
          {detailsLoading ? (
            <p>Loading details...</p>
          ) : detailsData ? (
            <div>
              <h3>{detailsData.name}</h3>
              <p>Base experience: {detailsData.description?.base_experience}</p>
              <p>Height: {detailsData.description?.height}</p>
              <p>
                Is default: {detailsData.description?.is_default ? 'Yes' : 'No'}
              </p>
              <p>Weight: {detailsData.description?.weight}</p>
            </div>
          ) : (
            <p>Details not found.</p>
          )}
        </div>
      )}
    </div>
  );
}
