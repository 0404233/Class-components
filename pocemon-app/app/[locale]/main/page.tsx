import { Suspense } from 'react';
import ClientMain from './ClientMain';
import styles from './Main.module.css';

export default function MainPage() {
  return (
    <Suspense fallback={<div className={styles.loader}></div>}>
      <ClientMain />
    </Suspense>
  );
}
