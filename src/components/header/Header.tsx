import type { ReactNode, ReactElement } from 'react';
import logo from './../../assets/logo.png';
import styles from './header.module.css';

type Props = {
  children?: ReactNode;
};

export default function Header({ children }: Props): ReactElement {
  return (
    <header className={styles.header}>
      {children}
      <div className={styles.logo}>
        <img src={logo} alt="Logo" className={styles.logoImage} />
      </div>
    </header>
  );
}
