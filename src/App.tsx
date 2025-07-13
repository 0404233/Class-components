import { Component } from 'react';
import Header from './components/header/Header';
import Search from './components/search/Search';
import getApiInfo from './api';

export default class App extends Component {
  componentDidMount() {
    const input = localStorage.getItem('searchInput') || '';
    this.handleSearch(input);
  }

  handleSearch = async (input: string) => {
    try {
      const results = await getApiInfo(input);
      console.log(results);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  };

  render() {
    return (
      <Header>
        <Search onSearch={this.handleSearch} />
      </Header>
    );
  }
}
