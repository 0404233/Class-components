import React, { Component } from 'react';
import type { ErrorInfo } from 'react';
import styles from './errorBoundary.module.css';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError)
      return <div className={styles.errorMessage}>Something went wrong.</div>;

    return this.props.children;
  }
}
