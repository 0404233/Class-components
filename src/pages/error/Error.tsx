import { Link } from 'react-router-dom';
import styles from './Error.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
