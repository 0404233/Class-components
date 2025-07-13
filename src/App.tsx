import { Component } from 'react';
import Header from './components/header/Header';
import Search from './components/search/Search';
import getApiInfo from './api';
import './App.css';

type State = {
  triggerRenderError: boolean;
};

export default class App extends Component<State> {
  state: State = {
    triggerRenderError: false,
  };

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
    const { triggerRenderError } = this.state;

    if (triggerRenderError) {
      throw new Error();
    }

    return (
      <>
        <Header>
          <Search onSearch={this.handleSearch} />
        </Header>
        <button onClick={() => this.setState({ triggerRenderError: true })}>
          Trigger Render Error
        </button>
      </>
    );
  }
}
