import { Suspense } from 'react';
import ClientMain from './ClientMain';
import styles from './Main.module.css';

export default function MainPage() {
  return (
    <Suspense fallback={<p className={styles.loader}></p>}>
      <ClientMain />
    </Suspense>
  );
}
