import { Component } from 'react';
import Header from './components/header/Header';
import Search from './components/search/Search';
import CardList from './components/CardList';
import getApiInfo from './api';
import styles from './App.module.css';
import type { Description } from './types';

type PokemonItem = {
  name: string;
  base_experience?: number;
  height?: number;
  is_default?: boolean;
  weight?: number;
};

type State = {
  items: { name: string; description: Description }[];
  loading: boolean;
  error: string | null;
  triggerRenderError: boolean;
  offset: number;
  limit: number;
  searchInput: string;
};

export default class App extends Component<Record<string, never>, State> {
  state: State = {
    items: [],
    loading: false,
    error: null,
    triggerRenderError: false,
    offset: 0,
    limit: 10,
    searchInput: '',
  };

  componentDidMount() {
    const input = localStorage.getItem('searchInput') || '';
    this.handleSearch(input, this.state.offset);
  }

  handleSearch = async (input: string, offset = 0) => {
    this.setState({ loading: true, error: null, searchInput: input });
    try {
      const results = await getApiInfo(input, offset, this.state.limit);
      const mapped = results.map((item: PokemonItem) => {
        const hasData =
          item.base_experience !== undefined ||
          item.height !== undefined ||
          item.is_default !== undefined ||
          item.weight !== undefined;

        return {
          name: item.name,
          description: hasData
            ? {
                base_experience: item.base_experience,
                height: item.height,
                is_default: item.is_default,
                weight: item.weight,
              }
            : null,
        };
      });
      this.setState({ items: mapped, offset });
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.setState({ error: e.message });
      } else {
        this.setState({ error: 'An unknown error occurred' });
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  handlePrev = () => {
    const newOffset = Math.max(0, this.state.offset - this.state.limit);
    this.handleSearch('', newOffset);
  };

  handleNext = () => {
    const newOffset = this.state.offset + this.state.limit;
    this.handleSearch('', newOffset);
  };

  render() {
    const { loading, items, error, triggerRenderError } = this.state;

    if (triggerRenderError) {
      throw new Error();
    }

    return (
      <>
        <Header>
          <Search onSearch={(input) => this.handleSearch(input, 0)} />
        </Header>
        <div className={styles.cardListWrapper}>
          {loading && <p>Loading...</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {!loading && !error && <CardList items={items} />}
          <div className={styles.buttonsBlock}>
            <div className={styles.pagginationButtons}>
              <button
                onClick={this.handlePrev}
                disabled={
                  this.state.offset === 0 || this.state.searchInput !== ''
                }
              >
                Prev
              </button>
              <button
                onClick={this.handleNext}
                disabled={this.state.searchInput !== ''}
              >
                Next
              </button>
            </div>
            <button onClick={() => this.setState({ triggerRenderError: true })}>
              Trigger Render Error
            </button>
          </div>
        </div>
      </>
    );
  }
}
