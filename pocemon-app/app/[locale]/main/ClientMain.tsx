'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import getApiInfo from '../../../lib/getApiInfo';
import { getMessages } from '../../../lib/getMessages';
import CardList from '../../../components/cardList/CardList';
import Search from '../../../components/search/Search';
import SelectedItemsFlyout from '../../../components/selectItems/SelectItems';
import styles from './Main.module.css';
import type { Description } from '../../../types';
type Item = { name: string; description: Description | null };
type Props = { items: Item[] };
export default function ClientMain() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchInput = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const lang = searchParams.get('lang') || 'en';
  const detailsName = searchParams.get('details') || '';
  const offset = (page - 1) * 10;
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [detailsData, setDetailsData] = useState<Item | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  useEffect(() => {
    getMessages(lang).then((msg) => {
      if (msg) setMessages(msg);
    });
  }, [lang]);
  const { data, isLoading, isError, error, refetch } = useQuery<Props>({
    queryKey: ['pokemon', searchInput, offset, lang],
    queryFn: () => getApiInfo(searchInput, offset, 10),
    enabled: !detailsName,
  });
  useEffect(() => {
    if (detailsName) {
      fetchDetails(detailsName);
    } else {
      setDetailsData(null);
    }
  }, [detailsName]);
  const fetchDetails = async (name: string) => {
    setDetailsLoading(true);
    try {
      const result = await getApiInfo(name, 0, 1);
      setDetailsData(result.items[0]);
    } catch {
      setDetailsData(null);
    } finally {
      setDetailsLoading(false);
    }
  };
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };
  const handleCardClick = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('details', name);
    router.push(`?${params.toString()}`);
  };
  const closeDetails = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`?${params.toString()}`);
  };
  const clearAllCache = () => {
    queryClient.clear();
    refetch();
  };
  return (
    <div className={styles.masterDetailLayout}>
      {' '}
      <div className={styles.leftPane}>
        {' '}
        <Search /> {isLoading && <div className={styles.loader}></div>}{' '}
        {isError && (
          <p>
            {' '}
            {error instanceof Error
              ? error.message
              : messages.error || 'An error occurred'}{' '}
          </p>
        )}{' '}
        {!isLoading && !isError && data && (
          <CardList items={data.items} onCardClick={handleCardClick} />
        )}{' '}
        <div className={styles.pagination}>
          {' '}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || searchInput !== ''}
          >
            {' '}
            {messages.back || 'Back'}{' '}
          </button>{' '}
          <span>
            {' '}
            {messages.page || 'Page'} {page}{' '}
          </span>{' '}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={searchInput !== '' || !data || data.items.length < 10}
          >
            {' '}
            {messages.next || 'Next'}{' '}
          </button>{' '}
        </div>{' '}
        <div className={styles.cacheButtons}>
          {' '}
          <button onClick={() => refetch()}>
            {' '}
            {messages.refresh || 'Refresh'}{' '}
          </button>{' '}
          <button onClick={clearAllCache}>
            {' '}
            {messages.clearCache || 'Clear Cache'}{' '}
          </button>{' '}
        </div>{' '}
        <SelectedItemsFlyout />{' '}
      </div>{' '}
      {detailsName && (
        <div className={styles.rightPane}>
          {' '}
          <button onClick={closeDetails}>
            {' '}
            {messages.close || 'Close'}{' '}
          </button>{' '}
          {detailsLoading ? (
            <p>{messages.loadingDetails || 'Loading details...'}</p>
          ) : detailsData ? (
            <div>
              {' '}
              <h3>{detailsData.name}</h3>{' '}
              <p>
                {' '}
                {messages.baseExperience || 'Base experience'}:{' '}
                {detailsData.description?.base_experience}{' '}
              </p>{' '}
              <p>
                {' '}
                {messages.height || 'Height'}:{' '}
                {detailsData.description?.height}{' '}
              </p>{' '}
              <p>
                {' '}
                {messages.isDefault || 'Is default'}:{' '}
                {detailsData.description?.is_default ? 'Yes' : 'No'}{' '}
              </p>{' '}
              <p>
                {' '}
                {messages.weight || 'Weight'}:{' '}
                {detailsData.description?.weight}{' '}
              </p>{' '}
            </div>
          ) : (
            <p>{messages.detailsNotFound || 'Details not found.'}</p>
          )}{' '}
        </div>
      )}{' '}
    </div>
  );
}
