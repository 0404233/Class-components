import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Search from '../../components/search/Search';
import CardList from '../../components/cardList/CardList';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useLocalStorage('searchInput', '');
  const [detailsData, setDetailsData] = useState<Item | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const limit = 10;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const offset = (page - 1) * limit;
  const selectedDetails = searchParams.get('details') || '';

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pokemon', searchInput, offset],
    queryFn: async () => {
      const results = await getApiInfo(searchInput, offset, limit);
      return results.map((item: PokemonItem) => ({
        name: item.name,
        description:
          item.base_experience !== undefined
            ? {
                base_experience: item.base_experience,
                height: item.height,
                is_default: item.is_default,
                weight: item.weight,
              }
            : null,
      }));
    },
    enabled: !selectedDetails,
  });

  useEffect(() => {
    if (selectedDetails) {
      fetchDetails(selectedDetails);
    } else {
      setDetailsData(null);
    }
  }, [selectedDetails]);

  const handleSearch = (input: string) => {
    setSearchInput(input);
    refetch();
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
        <Search onSearch={handleSearch} />
        {isLoading && <p className={styles.loader} data-testid="loader"></p>}
        {isError && (
          <p className={styles.errorMessage}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        )}
        {!isLoading && !isError && (
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
          <button onClick={() => refetch()}>Refresh</button>
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
