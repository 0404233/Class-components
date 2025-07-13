import { Component } from 'react';
import type { ReactNode } from 'react';
import logo from './../../assets/logo.png';
import styles from './header.module.css';

type Props = {
  children?: ReactNode;
};

export default class Header extends Component<Props> {
  render() {
    return (
      <header className={styles.header}>
        {this.props.children}
        <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </div>
      </header>
    );
  }
}
