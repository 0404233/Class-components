import Router from './Router';
import Header from './components/header/Header';
import SelectedItems from './components/SelectItems';

export default function App() {
  return (
    <>
      <Header />
      <Router />
      <SelectedItems />
    </>
  );
}
