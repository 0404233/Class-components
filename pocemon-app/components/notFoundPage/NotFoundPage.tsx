'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
import styles from './notFoundPage.module.css';

export default function NotFoundPage() {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <h1>{t('pageNotFound')}</h1>
      <p>{t('pageNotFoundMessage')}</p>
      <Link href="/" className={styles.button}>
        {t('backHome')}
      </Link>
    </div>
  );
}
