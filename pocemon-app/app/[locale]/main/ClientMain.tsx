'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import getApiInfo from '../../../lib/getApiInfo';
import { getMessages } from '../../../lib/getMessages';
import CardList from '../../../components/cardList/CardList';
import Search from '../../../components/search/Search';
import SelectedItemsFlyout from '../../../components/selectItems/SelectItems';
import styles from './Main.module.css';
import type { Description } from '../../../types';

type Item = {
  name: string;
  description: Description | null;
};

type Props = {
  items: Item[];
};

export default function ClientMain() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchInput = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const lang = searchParams.get('lang') || 'en';
  const offset = (page - 1) * 10;

  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    getMessages(lang).then((msg) => {
      if (msg) setMessages(msg);
    });
  }, [lang]);

  const { data, isLoading, isError, error } = useQuery<Props>({
    queryKey: ['pokemon', searchInput, offset, lang],
    queryFn: () => getApiInfo(searchInput, offset, 10),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={styles.masterDetailLayout}>
      <div className={styles.leftPane}>
        <Search />
        {isLoading && (
          <p>{messages.loading || <div className={styles.loader}></div>}</p>
        )}
        {isError && (
          <p>
            {error instanceof Error
              ? error.message
              : messages.error || 'An error occurred'}
          </p>
        )}
        {!isLoading && !isError && data && <CardList items={data.items} />}
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            {messages.back || 'Back'}
          </button>
          <span>
            {messages.page || 'Page'} {page}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!data || data.items.length < 10}
          >
            {messages.next || 'Next'}
          </button>
        </div>
        <SelectedItemsFlyout />
      </div>
    </div>
  );
}
