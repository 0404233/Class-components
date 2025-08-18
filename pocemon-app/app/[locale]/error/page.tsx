import { useTranslations } from 'next-intl';
import styles from './Error.module.css';

export default function ErrorPage() {
  const t = useTranslations();

  return (
    <div className={styles.notFound}>
      <h1>{t('ErrorTitle')}</h1>
      <p>{t('ErrorMessage')}</p>
    </div>
  );
}
