'use client';

import { Link } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';
import ThemeSelector from '../themeSelector/ThemeSelector';
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher';
import Image from 'next/image';
import styles from './header.module.css';

export default function Header() {
  const t = useTranslations();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">{t('Home')}</Link>
        <Link href="/about">{t('About')}</Link>
      </nav>
      <div className={styles.controls}>
        <ThemeSelector />
        <LanguageSwitcher />
      </div>
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={40}
          className={styles.logoImage}
        />
      </div>
    </header>
  );
}
