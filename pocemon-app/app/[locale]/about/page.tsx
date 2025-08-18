import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import styles from './About.module.css';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className={styles.aboutPage}>
      <h1>{t('about')}</h1>
      <p>
        {t('courseInfo')}{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React Course
        </a>
        .
      </p>
      <a href="https://github.com/0404233" target="_blank" rel="noreferrer">
        {t('author')}: Makarevich Andrey
      </a>
      <Link href="/" className={styles.backHome}>
        {t('backHome')}
      </Link>
    </div>
  );
}
