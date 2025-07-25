import { Link } from 'react-router-dom';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.aboutPage}>
      <h1>About</h1>
      <p>
        This search app was developed as part of the{' '}
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
        Author: Makarevich Andrey
      </a>
      <Link to="/" className={styles.backHome}>
        Back to Home
      </Link>
    </div>
  );
}
