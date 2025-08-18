'use client';

import { useState } from 'react';
import { useRouter, usePathname } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './search.module.css';

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    router.replace(`${pathname}?search=${encodeURIComponent(trimmed)}&page=1`);
  };

  return (
    <form className={styles.inputForm}>
      <input
        placeholder={t('SearchPlaceholder')}
        value={searchInput}
        onChange={handleChange}
        className={styles.inputField}
      />
      <button onClick={handleClick}>Search</button>
    </form>
  );
}
